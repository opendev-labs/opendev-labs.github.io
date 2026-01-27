import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Configuration from existing Void project
const firebaseConfig = {
    apiKey: import.meta.env.VITE_LAMA_KEY || import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: "void-v1.firebaseapp.com",
    projectId: "void-v1",
    storageBucket: "void-v1.firebasestorage.app",
    messagingSenderId: "603444929770",
    appId: "1:603444929770:web:2ceef309f6550b1d522393",
    measurementId: "G-PWZ79LFXRX"
};

// Graceful initialization check
let app: any;
let auth: any;
let firestore: any;
let isSimulationMode = false;

if (firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        firestore = getFirestore(app);
        console.log("Nexus Registry: Protocol initialized with valid credentials.");
    } catch (error) {
        console.warn("Nexus Registry: Initialization failure. Engaging simulation mode.", error);
        isSimulationMode = true;
    }
} else {
    isSimulationMode = true;
    console.warn("Nexus Registry: Missing valid API key. Operational simulation active.");
}

export class LamaAuth {
    static async loginWithGoogle() {
        if (isSimulationMode) throw new Error("Simulation Active: Production credentials required for Google Auth.");
        if (!auth) throw new Error("Firebase Auth not initialized");
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    static async loginWithGithub() {
        if (isSimulationMode) {
            // Let's make simulation a bit more friendly for developers
            console.log("SIMULATION: Authenticating mock user via GitHub protocol.");
            return { user: { displayName: 'SOLO_FOUNDER', email: 'founder@opendev-labs.io' } } as any;
        }
        if (!auth) throw new Error("LamaDB Auth not initialized. Protocol requires valid credentials.");
        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        provider.addScope('user');
        return signInWithPopup(auth, provider);
    }

    static async logout() {
        if (isSimulationMode) return;
        if (!auth) return;
        return signOut(auth);
    }

    static onAuthStateChanged(callback: (user: User | null) => void) {
        if (isSimulationMode) {
            callback(null);
            return () => { };
        }
        if (!auth) {
            callback(null);
            return () => { };
        }
        return onAuthStateChanged(auth, callback);
    }

    static getCurrentUser() {
        return auth?.currentUser || null;
    }

    static getSimulationMode() {
        return isSimulationMode;
    }
}

export class LamaStore {
    private db = firestore;

    collection(name: string) {
        if (isSimulationMode || !this.db) {
            return {
                add: async () => { throw new Error("Simulation Mode: Write operations restricted.") },
                get: async () => [],
                doc: () => ({
                    set: async () => { throw new Error("Simulation Mode: Write operations restricted.") },
                    update: async () => { throw new Error("Simulation Mode: Write operations restricted.") },
                    delete: async () => { throw new Error("Simulation Mode: Write operations restricted.") },
                    get: async () => null
                }),
                whereUser: () => { throw new Error("Simulation Mode: Query operations restricted.") }
            };
        }
        return {
            add: async (data: any) => addDoc(collection(this.db, name), data),
            get: async () => {
                const q = query(collection(this.db, name));
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            },
            doc: (id: string) => {
                return {
                    set: async (data: any) => setDoc(doc(this.db, name, id), data),
                    update: async (data: any) => updateDoc(doc(this.db, name, id), data),
                    delete: async () => deleteDoc(doc(this.db, name, id)),
                    get: async () => { // Simplified
                        // In a real implementation you'd get the doc
                    }
                }
            },
            whereUser: (userId: string) => {
                return query(collection(this.db, name), where("userId", "==", userId));
            }
        };
    }
}

export const LamaDB = {
    auth: LamaAuth,
    store: new LamaStore()
};
