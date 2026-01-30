import { openDB, DBSchema, IDBPDatabase } from 'idb';

/**
 * ============================================================================
 * SYNCSTACK - Real-Time Sync Layer
 * ============================================================================
 * 
 * IndexedDB-based offline storage with WebSocket sync to backend
 * Supports: Offline-first, Real-time updates, Conflict resolution
 */

// ============================================================================
// TYPES & SCHEMA
// ============================================================================

/**
 * Database Schema Definition
 */
// export interface SyncStackSchema extends DBSchema {
export interface SyncStackSchema {
    // User data
    users: {
        key: string; // uid
        value: {
            uid: string;
            email: string;
            displayName?: string;
            photoURL?: string;
            createdAt: number;
            updatedAt: number;
            syncedAt?: number;
        };
    };

    // Projects/Repositories
    projects: {
        key: string; // project id
        value: {
            id: string;
            userId: string;
            name: string;
            description?: string;
            provider: 'github' | 'gitlab' | 'local';
            url?: string;
            metadata?: Record<string, any>;
            createdAt: number;
            updatedAt: number;
            syncedAt?: number;
            // Sync metadata
            _dirty?: boolean; // Needs sync to server
            _deleted?: boolean; // Soft delete
            _version?: number; // For conflict resolution
        };
        indexes: {
            'by-user': string; // userId
            'by-updated': number; // updatedAt
            'dirty': boolean; // _dirty
        };
    };

    // Deployments
    deployments: {
        key: string; // deployment id
        value: {
            id: string;
            userId: string;
            projectId: string;
            status: 'pending' | 'building' | 'success' | 'failed';
            url?: string;
            logs?: string[];
            createdAt: number;
            updatedAt: number;
            syncedAt?: number;
            _dirty?: boolean;
            _deleted?: boolean;
            _version?: number;
        };
        indexes: {
            'by-user': string;
            'by-project': string;
            'by-status': string;
        };
    };

    // Sync queue - operations waiting to sync
    sync_queue: {
        key: number; // auto-increment
        value: {
            id?: number;
            operation: 'create' | 'update' | 'delete';
            collection: string;
            documentId: string;
            data: any;
            userId: string;
            timestamp: number;
            retries: number;
            lastError?: string;
        };
        indexes: {
            'by-timestamp': number;
            'by-user': string;
        };
    };

    // Sync metadata
    sync_meta: {
        key: string; // collection name
        value: {
            collection: string;
            lastSyncTime: number;
            syncStatus: 'idle' | 'syncing' | 'error';
            errorMessage?: string;
        };
    };
}

// ============================================================================
// SYNCSTACK CLIENT
// ============================================================================

export class SyncStackClient {
    private db: IDBPDatabase<SyncStackSchema> | null = null;
    private ws: WebSocket | null = null;
    private syncInterval: number | null = null;
    private listeners: Map<string, Set<Function>> = new Map();

    constructor(
        private config: {
            dbName: string;
            wsUrl?: string; // WebSocket URL for real-time sync
            syncIntervalMs?: number; // Auto-sync interval (default 30s)
        }
    ) { }

    /**
     * Initialize the database
     */
    async init(): Promise<void> {
        this.db = await openDB<SyncStackSchema>(this.config.dbName, 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'uid' });
                }

                // Projects store
                if (!db.objectStoreNames.contains('projects')) {
                    const projectsStore = db.createObjectStore('projects', { keyPath: 'id' });
                    projectsStore.createIndex('by-user', 'userId');
                    projectsStore.createIndex('by-updated', 'updatedAt');
                    projectsStore.createIndex('dirty', '_dirty');
                }

                // Deployments store
                if (!db.objectStoreNames.contains('deployments')) {
                    const deploymentsStore = db.createObjectStore('deployments', { keyPath: 'id' });
                    deploymentsStore.createIndex('by-user', 'userId');
                    deploymentsStore.createIndex('by-project', 'projectId');
                    deploymentsStore.createIndex('by-status', 'status');
                }

                // Sync queue
                if (!db.objectStoreNames.contains('sync_queue')) {
                    const queueStore = db.createObjectStore('sync_queue', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    queueStore.createIndex('by-timestamp', 'timestamp');
                    queueStore.createIndex('by-user', 'userId');
                }

                // Sync metadata
                if (!db.objectStoreNames.contains('sync_meta')) {
                    db.createObjectStore('sync_meta', { keyPath: 'collection' });
                }
            }
        });

        console.log('✅ SyncStack: IndexedDB initialized');

        // Start auto-sync if configured
        if (this.config.syncIntervalMs) {
            this.startAutoSync();
        }

        // Connect to WebSocket if URL provided
        if (this.config.wsUrl) {
            this.connectWebSocket();
        }
    }

    // ============================================================================
    // CRUD OPERATIONS (Offline-First)
    // ============================================================================

    /**
     * Add a document (offline-first)
     */
    async add<K extends keyof SyncStackSchema>(
        collection: K,
        data: Omit<SyncStackSchema[K]['value'], 'id' | 'createdAt' | 'updatedAt'>,
        userId: string
    ): Promise<string> {
        if (!this.db) throw new Error('Database not initialized');

        const id = `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();

        const document = {
            ...data,
            id,
            userId,
            createdAt: now,
            updatedAt: now,
            _dirty: true, // Mark for sync
            _version: 1
        } as any;

        // Write to IndexedDB immediately
        await this.db.put(collection as any, document);

        // Add to sync queue
        await this.addToSyncQueue('create', collection as string, id, document, userId);

        // Trigger sync
        this.triggerSync();

        // Notify listeners
        this.notifyListeners(collection as string, 'add', document);

        console.log(`✅ SyncStack: Added to [${collection}]`, id);
        return id;
    }

    /**
     * Get documents (from IndexedDB)
     */
    async get<K extends keyof SyncStackSchema>(
        collection: K,
        userId: string
    ): Promise<Array<SyncStackSchema[K]['value']>> {
        if (!this.db) throw new Error('Database not initialized');

        const tx = this.db.transaction(collection as any, 'readonly');
        const store = tx.objectStore(collection as any);

        // Get all items for this user
        if ((store.indexNames as any).contains('by-user')) {
            const index = (store as any).index('by-user');
            const items = await index.getAll(userId as any);
            // Filter out soft-deleted items
            return items.filter((item: any) => !item._deleted);
        }

        // Fallback: get all and filter
        const allItems = await store.getAll();
        return allItems.filter((item: any) =>
            item.userId === userId && !item._deleted
        );
    }

    /**
     * Update a document (offline-first)
     */
    async update<K extends keyof SyncStackSchema>(
        collection: K,
        id: string,
        data: Partial<SyncStackSchema[K]['value']>,
        userId: string
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        // Get existing document
        const existing = await this.db.get(collection as any, id as any);
        if (!existing) throw new Error('Document not found');

        // Security check
        if ((existing as any).userId !== userId) {
            throw new Error('Unauthorized: Cannot update another user\'s document');
        }

        // Merge and update
        const updated = {
            ...existing,
            ...data,
            updatedAt: Date.now(),
            _dirty: true,
            _version: ((existing as any)._version || 0) + 1
        };

        await this.db.put(collection as any, updated as any);

        // Add to sync queue
        await this.addToSyncQueue('update', collection as string, id, updated, userId);

        // Trigger sync
        this.triggerSync();

        // Notify listeners
        this.notifyListeners(collection as string, 'update', updated);

        console.log(`✅ SyncStack: Updated [${collection}/${id}]`);
    }

    /**
     * Delete a document (soft delete for sync)
     */
    async delete<K extends keyof SyncStackSchema>(
        collection: K,
        id: string,
        userId: string
    ): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const existing = await this.db.get(collection as any, id as any);
        if (!existing) return;

        // Security check
        if ((existing as any).userId !== userId) {
            throw new Error('Unauthorized: Cannot delete another user\'s document');
        }

        // Soft delete
        const deleted = {
            ...existing,
            _deleted: true,
            _dirty: true,
            updatedAt: Date.now()
        };

        await this.db.put(collection as any, deleted as any);

        // Add to sync queue
        await this.addToSyncQueue('delete', collection as string, id, deleted, userId);

        // Trigger sync
        this.triggerSync();

        // Notify listeners
        this.notifyListeners(collection as string, 'delete', deleted);

        console.log(`✅ SyncStack: Deleted [${collection}/${id}]`);
    }

    // ============================================================================
    // REAL-TIME SYNC
    // ============================================================================

    /**
     * Add operation to sync queue
     */
    private async addToSyncQueue(
        operation: 'create' | 'update' | 'delete',
        collection: string,
        documentId: string,
        data: any,
        userId: string
    ): Promise<void> {
        if (!this.db) return;

        await this.db.add('sync_queue', {
            operation,
            collection,
            documentId,
            data,
            userId,
            timestamp: Date.now(),
            retries: 0
        });
    }

    /**
     * Process sync queue (send to server)
     */
    async processSync(): Promise<void> {
        if (!this.db) return;

        const queue = await this.db.getAll('sync_queue');

        if (queue.length === 0) {
            console.log('✅ SyncStack: No pending changes to sync');
            return;
        }

        console.log(`🔄 SyncStack: Syncing ${queue.length} operations...`);

        for (const item of queue) {
            try {
                // Send to server via WebSocket or HTTP
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    await this.sendViaWebSocket(item);
                } else {
                    await this.sendViaHTTP(item);
                }

                // Mark document as synced
                await this.markAsSynced(item.collection, item.documentId);

                // Remove from queue
                if (item.id) {
                    await this.db.delete('sync_queue', item.id);
                }

                console.log(`✅ Synced: ${item.operation} ${item.collection}/${item.documentId}`);
            } catch (error: any) {
                console.error(`❌ Sync failed for ${item.documentId}:`, error.message);

                // Increment retry count
                if (item.id && item.retries < 5) {
                    await this.db.put('sync_queue', {
                        ...item,
                        retries: item.retries + 1,
                        lastError: error.message
                    });
                }
            }
        }

        // Update sync metadata
        await this.updateSyncMeta('projects', Date.now(), 'idle');
    }

    /**
     * Mark document as synced
     */
    private async markAsSynced(collection: string, id: string): Promise<void> {
        if (!this.db) return;

        const doc = await this.db.get(collection as any, id as any);
        if (!doc) return;

        await this.db.put(collection as any, {
            ...doc,
            _dirty: false,
            syncedAt: Date.now()
        } as any);
    }

    /**
     * Update sync metadata
     */
    private async updateSyncMeta(
        collection: string,
        lastSyncTime: number,
        status: 'idle' | 'syncing' | 'error',
        errorMessage?: string
    ): Promise<void> {
        if (!this.db) return;

        await this.db.put('sync_meta', {
            collection,
            lastSyncTime,
            syncStatus: status,
            errorMessage
        });
    }

    /**
     * Send operation via WebSocket
     */
    private async sendViaWebSocket(item: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                reject(new Error('WebSocket not connected'));
                return;
            }

            const requestId = Math.random().toString(36);

            const handler = (event: MessageEvent) => {
                const response = JSON.parse(event.data);
                if (response.requestId === requestId) {
                    this.ws!.removeEventListener('message', handler);
                    if (response.success) {
                        resolve();
                    } else {
                        reject(new Error(response.error || 'Sync failed'));
                    }
                }
            };

            this.ws.addEventListener('message', handler);

            this.ws.send(JSON.stringify({
                type: 'SYNC_OPERATION',
                requestId,
                ...item
            }));

            // Timeout after 10s
            setTimeout(() => {
                this.ws!.removeEventListener('message', handler);
                reject(new Error('Sync timeout'));
            }, 10000);
        });
    }

    /**
     * Send operation via HTTP (fallback)
     */
    private async sendViaHTTP(item: any): Promise<void> {
        const endpoint = `/api/sync/${item.collection}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.getAuthToken()}`
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    }

    /**
     * Get auth token (implement based on your auth system)
     */
    private async getAuthToken(): Promise<string> {
        // TODO: Get from LamaAuth or localStorage
        return localStorage.getItem('auth_token') || '';
    }

    // ============================================================================
    // WEBSOCKET CONNECTION
    // ============================================================================

    private connectWebSocket(): void {
        if (!this.config.wsUrl) return;

        this.ws = new WebSocket(this.config.wsUrl);

        this.ws.onopen = () => {
            console.log('✅ SyncStack: WebSocket connected');
            // Authenticate
            this.ws!.send(JSON.stringify({
                type: 'AUTH',
                token: localStorage.getItem('auth_token')
            }));
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleServerMessage(message);
        };

        this.ws.onerror = (error) => {
            console.error('❌ SyncStack: WebSocket error', error);
        };

        this.ws.onclose = () => {
            console.warn('⚠️ SyncStack: WebSocket disconnected. Reconnecting in 5s...');
            setTimeout(() => this.connectWebSocket(), 5000);
        };
    }

    /**
     * Handle incoming server messages
     */
    private async handleServerMessage(message: any): Promise<void> {
        switch (message.type) {
            case 'SYNC_UPDATE':
                // Server sent an update - merge with local data
                await this.mergeServerUpdate(message.collection, message.data);
                break;

            case 'SYNC_DELETE':
                // Server deleted a document
                await this.delete(message.collection, message.id, message.userId);
                break;

            default:
                console.warn('Unknown message type:', message.type);
        }
    }

    /**
     * Merge server update with local data (conflict resolution)
     */
    private async mergeServerUpdate(collection: string, serverData: any): Promise<void> {
        if (!this.db) return;

        const localData = await this.db.get(collection as any, serverData.id);

        if (!localData) {
            // New data from server - just insert
            await this.db.put(collection as any, { ...serverData, _dirty: false, syncedAt: Date.now() });
            this.notifyListeners(collection, 'add', serverData);
            return;
        }

        // Conflict resolution: Last-write-wins based on version
        const localVersion = (localData as any)._version || 0;
        const serverVersion = serverData._version || 0;

        if (serverVersion > localVersion) {
            // Server is newer - accept server's version
            await this.db.put(collection as any, { ...serverData, _dirty: false, syncedAt: Date.now() });
            this.notifyListeners(collection, 'update', serverData);
            console.log(`✅ SyncStack: Merged server update for ${collection}/${serverData.id}`);
        } else {
            // Local is newer or equal - keep local, mark for sync
            console.log(`ℹ️ SyncStack: Local version is newer for ${collection}/${serverData.id}`);
        }
    }

    // ============================================================================
    // AUTO-SYNC
    // ============================================================================

    private startAutoSync(): void {
        if (this.syncInterval) return;

        const interval = this.config.syncIntervalMs || 30000; // Default 30s
        this.syncInterval = window.setInterval(() => {
            this.processSync();
        }, interval);

        console.log(`✅ SyncStack: Auto-sync enabled (every ${interval}ms)`);
    }

    private stopAutoSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    /**
     * Trigger immediate sync
     */
    private triggerSync(): void {
        // Debounced sync - wait 1s for more changes
        setTimeout(() => this.processSync(), 1000);
    }

    // ============================================================================
    // REAL-TIME SUBSCRIPTIONS
    // ============================================================================

    /**
     * Subscribe to collection changes
     */
    subscribe<K extends keyof SyncStackSchema>(
        collection: K,
        userId: string,
        callback: (data: Array<SyncStackSchema[K]['value']>) => void
    ): () => void {
        const key = `${collection}_${userId}`;

        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }

        this.listeners.get(key)!.add(callback);

        // Initial data load
        this.get(collection, userId).then(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.get(key)?.delete(callback);
        };
    }

    /**
     * Notify all listeners of a change
     */
    private notifyListeners(collection: string, operation: string, data: any): void {
        const key = `${collection}_${data.userId}`;
        const listeners = this.listeners.get(key);

        if (listeners) {
            this.get(collection as any, data.userId).then((allData) => {
                listeners.forEach(callback => callback(allData));
            });
        }
    }

    // ============================================================================
    // CLEANUP
    // ============================================================================

    async close(): Promise<void> {
        this.stopAutoSync();

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        if (this.db) {
            this.db.close();
            this.db = null;
        }

        console.log('✅ SyncStack: Closed');
    }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createSyncStack(config: {
    dbName: string;
    wsUrl?: string;
    syncIntervalMs?: number;
}): SyncStackClient {
    const client = new SyncStackClient(config);
    client.init();
    return client;
}
