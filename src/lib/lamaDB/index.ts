import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, fetchSignInMethodsForEmail, linkWithCredential, OAuthProvider, linkWithPopup } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * Nexus Registry Strategy:
 * Uses environment variables for production and falls back to simulation mode
 * for development when keys are missing.
 */

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "opendev-office.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "opendev-office",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "opendev-office.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "357128961442",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:357128961442:web:808eed82b411b0ce0646fb",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-R0ENNGV1CL"
};

let app: any;
let auth: any;
let firestore: any;
let analytics: any;
let isSimulationMode = false;

try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey.length > 20) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        firestore = getFirestore(app);

        // Initialize Analytics if supported
        if (typeof window !== 'undefined') {
            analytics = getAnalytics(app);
            logEvent(analytics, 'nexus_init');
        }

        console.log("Nexus Registry: Protocol initialized.");
    } else {
        isSimulationMode = true;
        console.warn("Nexus Registry: Missing valid VITE_FIREBASE_API_KEY. Operational simulation active.");
    }
} catch (error) {
    console.error("Nexus Registry: Critical failure. Engaging emergency simulation.", error);
    isSimulationMode = true;
}

export class LamaAuth {
    static async loginWithGoogle() {
        if (isSimulationMode) {
            console.log("SIMULATION: Authenticating mock user via Google protocol.");
            return { user: { displayName: 'opendev-labs', email: 'admin@opendev-labs.io', uid: 'odl_master_1', avatar: 'https://github.com/opendev-labs.png' } } as any;
        }
        if (!auth) throw new Error("Firebase Auth not initialized");
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    static async loginWithGithub() {
        if (isSimulationMode) {
            console.log("SIMULATION: Authenticating mock user via GitHub protocol.");
            return { user: { displayName: 'opendev-labs', email: 'admin@opendev-labs.io', uid: 'odl_master_1', avatar: 'https://github.com/opendev-labs.png' } } as any;
        }
        if (!auth) throw new Error("LamaDB Auth not initialized.");

        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        provider.addScope('user');

        try {
            const result = await signInWithPopup(auth, provider);
            return result;
        } catch (error: any) {
            console.error("Nexus Registry: Auth Protocol Error:", error.code, error.message);

            if (error.code === 'auth/account-exists-with-different-credential') {
                console.log("Nexus Intelligence: Detected existing account collision. Initiating Smart Link protocol...");

                const pendingCred = OAuthProvider.credentialFromError(error);
                const email = error.customData?.email;

                console.log("Collision Email:", email);

                if (!email) {
                    console.error("Nexus Registry: Cannot resolve collision without email.");
                    throw new Error("This email is already associated with another account, but we couldn't verify which provider. Please sign in with your original method (e.g. Google).");
                }

                if (!pendingCred) throw error;

                // Get existing providers
                try {
                    const methods = await fetchSignInMethodsForEmail(auth, email);
                    console.log("Existing Identity Methods:", methods);

                    if (methods.includes('google.com')) {
                        console.log("Nexus Registry: Linking to Google Identity...");
                        // Authenticate with Google to verify identity
                        const googleProvider = new GoogleAuthProvider();
                        googleProvider.setCustomParameters({ login_hint: email });

                        const googleResult = await signInWithPopup(auth, googleProvider);

                        // Link the pending GitHub credential
                        await linkWithCredential(googleResult.user, pendingCred);
                        console.log("Nexus Intelligence: Protocol linked. Identity converged.");

                        return googleResult;
                    }
                } catch (linkError) {
                    console.error("Nexus Registry: Smart Link Failed:", linkError);
                    throw new Error("Failed to link accounts automatically. Please sign in with Google first, then link GitHub from Settings.");
                }
            }
            throw error;
        }
    }

    static async linkGithub() {
        if (isSimulationMode) {
            console.log("SIMULATION: Linking GitHub credentials.");
            return;
        }
        if (!auth || !auth.currentUser) throw new Error("Firebase Auth not initialized or user not logged in");

        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        provider.addScope('user');

        try {
            const result = await linkWithPopup(auth.currentUser, provider);
            console.log("Nexus Registry: Account linked successfully.");
            return result;
        } catch (error: any) {
            if (error.code === 'auth/credential-already-in-use') {
                throw new Error("This GitHub account is already connected to another user.");
            }
            throw error;
        }
    }

    static async logout() {
        if (isSimulationMode) {
            console.log("SIMULATION: Protocol terminated.");
            return;
        }
        if (!auth) return;
        return signOut(auth);
    }

    static onAuthStateChanged(callback: (user: User | null) => void) {
        if (isSimulationMode) {
            // Check if we have a simulated user in localStorage to persist "logged in" state for dev
            const stored = localStorage.getItem('nexus_sim_user');
            if (stored) {
                callback(JSON.parse(stored));
            } else {
                callback(null);
            }
            return () => { };
        }
        if (!auth) {
            callback(null);
            return () => { };
        }
        return onAuthStateChanged(auth, callback);
    }

    static getCurrentUser() {
        if (isSimulationMode) {
            const stored = localStorage.getItem('nexus_sim_user');
            return stored ? JSON.parse(stored) : null;
        }
        return auth?.currentUser || null;
    }

    static getSimulationMode() {
        return isSimulationMode;
    }

    // Dev only helper to trigger simulation login
    static simulateLogin() {
        const mockUser = { displayName: 'SOLO_FOUNDER', email: 'founder@opendev-labs.io', uid: 'sim_123' };
        localStorage.setItem('nexus_sim_user', JSON.stringify(mockUser));
        window.location.reload();
    }
}

export class LamaStore {
    private db = firestore;

    private getCurrentUserId(): string | null {
        const user = LamaAuth.getCurrentUser();
        return user ? user.uid : null;
    }

    collection(name: string) {
        const userId = this.getCurrentUserId();

        if (isSimulationMode || !this.db) {
            return {
                add: async (data: any) => {
                    if (!userId) throw new Error("Unauthorized: No active protocol identity found.");

                    const newItem = { ...data, userId, id: `sim_${Date.now()}` };
                    const key = `nexus_sim_db_${userId}_${name}`;
                    const currentData = JSON.parse(localStorage.getItem(key) || '[]');
                    currentData.push(newItem);
                    localStorage.setItem(key, JSON.stringify(currentData));

                    console.log(`SIMULATION: Linked data to identity ${userId} in [${name}]`);
                    return { id: newItem.id };
                },
                get: async () => {
                    if (!userId) return [];
                    const key = `nexus_sim_db_${userId}_${name}`;
                    return JSON.parse(localStorage.getItem(key) || '[]');
                },
                doc: (id: string) => ({
                    set: async (data: any) => {
                        if (!userId) return;
                        const key = `nexus_sim_db_${userId}_${name}`;
                        const currentData = JSON.parse(localStorage.getItem(key) || '[]');
                        const index = currentData.findIndex((d: any) => d.id === id);
                        if (index >= 0) {
                            currentData[index] = { ...data, userId, id };
                        } else {
                            currentData.push({ ...data, userId, id });
                        }
                        localStorage.setItem(key, JSON.stringify(currentData));
                    },
                    update: async (data: any) => {
                        if (!userId) return;
                        const key = `nexus_sim_db_${userId}_${name}`;
                        const currentData = JSON.parse(localStorage.getItem(key) || '[]');
                        const index = currentData.findIndex((d: any) => d.id === id);
                        if (index >= 0) {
                            currentData[index] = { ...currentData[index], ...data };
                            localStorage.setItem(key, JSON.stringify(currentData));
                        }
                    },
                    delete: async () => {
                        if (!userId) return;
                        const key = `nexus_sim_db_${userId}_${name}`;
                        const currentData = JSON.parse(localStorage.getItem(key) || '[]');
                        const newData = currentData.filter((d: any) => d.id !== id);
                        localStorage.setItem(key, JSON.stringify(newData));
                    },
                    get: async () => {
                        if (!userId) return null;
                        const key = `nexus_sim_db_${userId}_${name}`;
                        const currentData = JSON.parse(localStorage.getItem(key) || '[]');
                        return currentData.find((d: any) => d.id === id) || null;
                    }
                }),
                whereUser: () => {
                    // Simulation naturally scopes to user via the get() method locally
                    return {
                        get: async () => {
                            if (!userId) return [];
                            const key = `nexus_sim_db_${userId}_${name}`;
                            return JSON.parse(localStorage.getItem(key) || '[]');
                        }
                    }
                }
            };
        }

        // REAL FIREBASE IMPLEMENTATION (User Scoped)
        return {
            add: async (data: any) => {
                if (!userId) throw new Error("Unauthorized: Protocol identity required for write operations.");
                return addDoc(collection(this.db, name), { ...data, userId });
            },
            get: async () => {
                if (!userId) return [];
                // Automatically filter by userId for pure isolation
                const q = query(collection(this.db, name), where("userId", "==", userId));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            },
            doc: (id: string) => {
                return {
                    set: async (data: any) => setDoc(doc(this.db, name, id), { ...data, userId }),
                    update: async (data: any) => updateDoc(doc(this.db, name, id), data),
                    delete: async () => deleteDoc(doc(this.db, name, id)),
                    get: async () => {
                        // In a real implementation you'd get the doc
                    }
                }
            },
            whereUser: (targetUserId: string) => {
                // Explicit override if needed, but default get() handles it
                return query(collection(this.db, name), where("userId", "==", targetUserId));
            }
        };
    }
}

export const LamaDB = {
    auth: LamaAuth,
    store: new LamaStore()
};
