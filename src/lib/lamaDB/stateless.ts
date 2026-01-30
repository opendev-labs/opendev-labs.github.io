import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, logEvent, Analytics } from "firebase/analytics";
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    linkWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    Auth
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    Firestore,
    serverTimestamp,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";

/**
 * ============================================================================
 * STATELESS LAMADB - Production-Ready Refactor
 * ============================================================================
 * 
 * Key Principles:
 * 1. No hidden state - all dependencies passed explicitly
 * 2. Pure functions where possible
 * 3. Explicit user context (no implicit getCurrentUser)
 * 4. Testable (all dependencies can be mocked)
 * 5. Type-safe with proper interfaces
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LamaDBConfig {
    firebase: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
        measurementId?: string;
    };
    simulationMode?: boolean;
}

export interface UserContext {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    providers?: string[];
}

export interface AuthResult {
    user: UserContext;
    credential?: any;
}

export interface CollectionOperations<T = any> {
    add: (data: T) => Promise<{ id: string }>;
    get: () => Promise<Array<T & { id: string }>>;
    getById: (id: string) => Promise<(T & { id: string }) | null>;
    update: (id: string, data: Partial<T>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    subscribe: (callback: (data: Array<T & { id: string }>) => void) => Unsubscribe;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class LamaDBError extends Error {
    constructor(
        message: string,
        public code: string,
        public context?: Record<string, any>
    ) {
        super(message);
        this.name = 'LamaDBError';
    }
}

function getUserFriendlyMessage(errorCode: string): string {
    const messages: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your internet connection.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
        'auth/unauthorized-domain': 'This domain is not authorized. Please contact support.',
        'auth/invalid-api-key': 'Firebase configuration error. Please contact support.',
    };
    return messages[errorCode] || `Authentication error: ${errorCode}`;
}

// ============================================================================
// STATELESS AUTH SERVICE
// ============================================================================

export class LamaAuthService {
    private auth: Auth | null = null;
    private analytics: Analytics | null = null;

    constructor(
        private app: FirebaseApp | null,
        private simulationMode: boolean = false
    ) {
        if (app && !simulationMode) {
            this.auth = getAuth(app);
            if (typeof window !== 'undefined') {
                this.analytics = getAnalytics(app);
                logEvent(this.analytics, 'lamadb_init');
            }
        }
    }

    /**
     * Google Sign-In - Pure function, no hidden state
     */
    async loginWithGoogle(): Promise<AuthResult> {
        if (this.simulationMode) {
            return this.simulateMockUser('google');
        }

        if (!this.auth) {
            throw new LamaDBError('Auth not initialized', 'auth/not-initialized');
        }

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(this.auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);

            this.logAuthEvent('google_login', result.user.uid);

            return {
                user: this.mapFirebaseUser(result.user),
                credential
            };
        } catch (error: any) {
            throw this.handleAuthError(error, 'loginWithGoogle');
        }
    }

    /**
     * GitHub Sign-In - Pure function, no hidden state
     */
    async loginWithGithub(): Promise<AuthResult> {
        if (this.simulationMode) {
            return this.simulateMockUser('github');
        }

        if (!this.auth) {
            throw new LamaDBError('Auth not initialized', 'auth/not-initialized');
        }

        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        provider.addScope('user');

        try {
            const result = await signInWithPopup(this.auth, provider);
            const credential = GithubAuthProvider.credentialFromResult(result);

            this.logAuthEvent('github_login', result.user.uid);

            return {
                user: this.mapFirebaseUser(result.user),
                credential
            };
        } catch (error: any) {
            throw this.handleAuthError(error, 'loginWithGithub');
        }
    }

    /**
     * Link GitHub Account
     */
    async linkGithub(): Promise<AuthResult> {
        if (this.simulationMode) {
            return this.simulateMockUser('github');
        }

        if (!this.auth?.currentUser) {
            throw new LamaDBError('Must be logged in to link account', 'auth/unauthorized');
        }

        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        provider.addScope('user');

        try {
            const result = await linkWithPopup(this.auth.currentUser, provider);
            const credential = GithubAuthProvider.credentialFromResult(result);

            this.logAuthEvent('github_link', result.user.uid);

            return {
                user: this.mapFirebaseUser(result.user),
                credential
            };
        } catch (error: any) {
            throw this.handleAuthError(error, 'linkGithub');
        }
    }

    /**
     * Email/Password Sign-Up
     */
    async signUpWithEmail(
        email: string,
        password: string,
        displayName?: string
    ): Promise<AuthResult> {
        if (this.simulationMode) {
            return this.simulateMockUser('email', email);
        }

        if (!this.auth) {
            throw new LamaDBError('Auth not initialized', 'auth/not-initialized');
        }

        try {
            const result = await createUserWithEmailAndPassword(this.auth, email, password);

            // Send verification email
            await sendEmailVerification(result.user);

            this.logAuthEvent('email_signup', result.user.uid);

            return {
                user: {
                    ...this.mapFirebaseUser(result.user),
                    displayName: displayName || email.split('@')[0]
                }
            };
        } catch (error: any) {
            throw new LamaDBError(
                getUserFriendlyMessage(error.code),
                error.code,
                { email }
            );
        }
    }

    /**
     * Email/Password Sign-In
     */
    async signInWithEmail(email: string, password: string): Promise<AuthResult> {
        if (this.simulationMode) {
            return this.simulateMockUser('email', email);
        }

        if (!this.auth) {
            throw new LamaDBError('Auth not initialized', 'auth/not-initialized');
        }

        try {
            const result = await signInWithEmailAndPassword(this.auth, email, password);
            this.logAuthEvent('email_login', result.user.uid);

            return {
                user: this.mapFirebaseUser(result.user)
            };
        } catch (error: any) {
            throw new LamaDBError(
                getUserFriendlyMessage(error.code),
                error.code,
                { email }
            );
        }
    }

    /**
     * Password Reset
     */
    async resetPassword(email: string): Promise<void> {
        if (this.simulationMode) {
            console.log(`SIMULATION: Password reset email sent to ${email}`);
            return;
        }

        if (!this.auth) {
            throw new LamaDBError('Auth not initialized', 'auth/not-initialized');
        }

        try {
            await sendPasswordResetEmail(this.auth, email);
        } catch (error: any) {
            throw new LamaDBError(
                getUserFriendlyMessage(error.code),
                error.code,
                { email }
            );
        }
    }

    /**
     * Logout - Stateless, no side effects on instance
     */
    async logout(): Promise<void> {
        if (this.simulationMode) {
            console.log('SIMULATION: User logged out');
            return;
        }

        if (!this.auth) return;

        await signOut(this.auth);
        this.logAuthEvent('logout');
    }

    /**
     * Subscribe to auth state changes - Returns unsubscribe function
     */
    onAuthStateChanged(callback: (user: UserContext | null) => void): Unsubscribe {
        if (this.simulationMode) {
            // Return no-op unsubscribe
            callback(null);
            return () => { };
        }

        if (!this.auth) {
            callback(null);
            return () => { };
        }

        return onAuthStateChanged(this.auth, (firebaseUser) => {
            callback(firebaseUser ? this.mapFirebaseUser(firebaseUser) : null);
        });
    }

    /**
     * Get current user - Explicit, no hidden state
     */
    getCurrentUser(): UserContext | null {
        if (this.simulationMode) return null;
        if (!this.auth?.currentUser) return null;
        return this.mapFirebaseUser(this.auth.currentUser);
    }

    // ============================================================================
    // PRIVATE HELPERS
    // ============================================================================

    private mapFirebaseUser(firebaseUser: User): UserContext {
        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            providers: firebaseUser.providerData.map(p => p.providerId)
        };
    }

    private simulateMockUser(provider: string, email?: string): AuthResult {
        const mockUser: UserContext = {
            uid: `sim_${Date.now()}`,
            email: email || `user@${provider}.com`,
            displayName: `Mock ${provider} User`,
            photoURL: `https://ui-avatars.com/api/?name=${provider}`
        };

        console.log(`SIMULATION: ${provider} login successful`, mockUser);
        return { user: mockUser };
    }

    private handleAuthError(error: any, method: string): LamaDBError {
        console.error(`LamaDB Auth Error [${method}]:`, error);

        return new LamaDBError(
            getUserFriendlyMessage(error.code),
            error.code,
            { method, originalError: error.message }
        );
    }

    private logAuthEvent(eventName: string, userId?: string) {
        if (this.analytics) {
            logEvent(this.analytics, eventName, { user_id: userId });
        }
    }
}

// ============================================================================
// STATELESS STORE SERVICE
// ============================================================================

export class LamaStoreService {
    constructor(
        private firestore: Firestore | null,
        private simulationMode: boolean = false
    ) { }

    /**
     * Get collection operations - User context passed explicitly
     */
    collection<T = any>(
        collectionName: string,
        userContext: UserContext
    ): CollectionOperations<T> {
        if (this.simulationMode || !this.firestore) {
            return this.createSimulationCollection<T>(collectionName, userContext);
        }

        return this.createFirestoreCollection<T>(collectionName, userContext);
    }

    // ============================================================================
    // FIRESTORE IMPLEMENTATION (Production)
    // ============================================================================

    private createFirestoreCollection<T>(
        collectionName: string,
        userContext: UserContext
    ): CollectionOperations<T> {
        const db = this.firestore!;
        const collectionRef = collection(db, collectionName);

        return {
            add: async (data: T) => {
                const docRef = await addDoc(collectionRef, {
                    ...data,
                    userId: userContext.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return { id: docRef.id };
            },

            get: async () => {
                const q = query(collectionRef, where('userId', '==', userContext.uid));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as T
                }));
            },

            getById: async (id: string) => {
                const docRef = doc(db, collectionName, id);
                const docSnap = await getDocs(query(collectionRef, where('__name__', '==', id)));

                if (docSnap.empty) return null;

                const data = docSnap.docs[0].data();

                // Security: Verify ownership
                if (data.userId !== userContext.uid) {
                    throw new LamaDBError('Unauthorized', 'permission-denied');
                }

                return { id, ...data as T };
            },

            update: async (id: string, data: Partial<T>) => {
                const docRef = doc(db, collectionName, id);
                await updateDoc(docRef, {
                    ...data,
                    updatedAt: serverTimestamp()
                });
            },

            delete: async (id: string) => {
                const docRef = doc(db, collectionName, id);
                await deleteDoc(docRef);
            },

            subscribe: (callback: (data: Array<T & { id: string }>) => void) => {
                const q = query(collectionRef, where('userId', '==', userContext.uid));

                return onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data() as T
                    }));
                    callback(data);
                });
            }
        };
    }

    // ============================================================================
    // SIMULATION IMPLEMENTATION (Development/Testing)
    // ============================================================================

    private createSimulationCollection<T>(
        collectionName: string,
        userContext: UserContext
    ): CollectionOperations<T> {
        const getStorageKey = () => `lamadb_sim_${userContext.uid}_${collectionName}`;

        const readStorage = (): Array<T & { id: string }> => {
            try {
                const data = localStorage.getItem(getStorageKey());
                return data ? JSON.parse(data) : [];
            } catch {
                return [];
            }
        };

        const writeStorage = (data: Array<T & { id: string }>) => {
            localStorage.setItem(getStorageKey(), JSON.stringify(data));
        };

        return {
            add: async (data: T) => {
                const items = readStorage();
                const newItem = {
                    ...data,
                    id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    userId: userContext.uid,
                    createdAt: new Date().toISOString()
                };
                items.push(newItem as any);
                writeStorage(items);

                console.log(`SIMULATION: Added to [${collectionName}]`, newItem);
                return { id: (newItem as any).id };
            },

            get: async () => {
                const items = readStorage();
                console.log(`SIMULATION: Retrieved ${items.length} items from [${collectionName}]`);
                return items;
            },

            getById: async (id: string) => {
                const items = readStorage();
                return items.find(item => item.id === id) || null;
            },

            update: async (id: string, data: Partial<T>) => {
                const items = readStorage();
                const index = items.findIndex(item => item.id === id);
                if (index >= 0) {
                    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() } as any;
                    writeStorage(items);
                    console.log(`SIMULATION: Updated item [${id}] in [${collectionName}]`);
                }
            },

            delete: async (id: string) => {
                const items = readStorage();
                const filtered = items.filter(item => item.id !== id);
                writeStorage(filtered);
                console.log(`SIMULATION: Deleted item [${id}] from [${collectionName}]`);
            },

            subscribe: (callback) => {
                // Simple polling for simulation
                const interval = setInterval(() => {
                    callback(readStorage());
                }, 1000);

                return () => clearInterval(interval);
            }
        };
    }
}

// ============================================================================
// STATELESS LAMADB CLIENT
// ============================================================================

export class LamaDBClient {
    private app: FirebaseApp | null = null;
    private simulationMode: boolean = false;

    public auth: LamaAuthService;
    public store: LamaStoreService;

    constructor(config: LamaDBConfig) {
        this.simulationMode = config.simulationMode || false;

        // Initialize Firebase only if not in simulation mode and config is valid
        if (!this.simulationMode && config.firebase.apiKey && config.firebase.apiKey.length > 20) {
            try {
                this.app = initializeApp(config.firebase);
                console.log('✅ LamaDB: Firebase initialized');
            } catch (error) {
                console.error('❌ LamaDB: Firebase initialization failed', error);
                this.simulationMode = true;
            }
        } else {
            this.simulationMode = true;
            console.warn('⚠️ LamaDB: Running in simulation mode');
        }

        // Initialize services (stateless - no hidden dependencies)
        this.auth = new LamaAuthService(this.app, this.simulationMode);
        this.store = new LamaStoreService(
            this.app ? getFirestore(this.app) : null,
            this.simulationMode
        );
    }

    /**
     * Check if running in simulation mode
     */
    isSimulation(): boolean {
        return this.simulationMode;
    }
}

// ============================================================================
// FACTORY FUNCTION - Create singleton instance with config
// ============================================================================

export function createLamaDB(config: LamaDBConfig): LamaDBClient {
    return new LamaDBClient(config);
}
