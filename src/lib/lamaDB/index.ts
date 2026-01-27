import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Configuration from existing Void project
const firebaseConfig = {
    apiKey: "", // SECURITY: Removed leaked API key. Use environment variables.
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

if (firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        firestore = getFirestore(app);
        console.log("Nexus Registry: Firebase initialized successfully.");
    } catch (error) {
        console.warn("Nexus Registry: Firebase initialization failed. Falling back to degraded mode.", error);
    }
} else {
    console.warn("Nexus Registry: Missing valid API key. Operational services are degraded.");
}

export class LamaAuth {
    static async loginWithGoogle() {
        if (!auth) throw new Error("Firebase Auth not initialized");
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    static async loginWithGithub() {
        if (!auth) throw new Error("Firebase Auth not initialized");
        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        return signInWithPopup(auth, provider);
    }

    static async logout() {
        if (!auth) return;
        return signOut(auth);
    }

    static onAuthStateChanged(callback: (user: User | null) => void) {
        if (!auth) {
            callback(null);
            return () => { };
        }
        return onAuthStateChanged(auth, callback);
    }

    static getCurrentUser() {
        return auth?.currentUser || null;
    }
}

export class LamaStore {
    private db = firestore;

    collection(name: string) {
        if (!this.db) {
            return {
                add: async () => { throw new Error("Firestore not initialized") },
                get: async () => [],
                doc: () => ({
                    set: async () => { throw new Error("Firestore not initialized") },
                    update: async () => { throw new Error("Firestore not initialized") },
                    delete: async () => { throw new Error("Firestore not initialized") },
                    get: async () => null
                }),
                whereUser: () => { throw new Error("Firestore not initialized") }
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
            // Add user-specific query helper
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
