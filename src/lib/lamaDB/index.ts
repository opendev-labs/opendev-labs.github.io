import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

// Configuration from existing Void project
const firebaseConfig = {
    apiKey: "AIzaSyDvSmMDFZFHRwNrf1hMwfeQrOS-wvtc_hk",
    authDomain: "void-v1.firebaseapp.com",
    projectId: "void-v1",
    storageBucket: "void-v1.firebasestorage.app",
    messagingSenderId: "603444929770",
    appId: "1:603444929770:web:2ceef309f6550b1d522393",
    measurementId: "G-PWZ79LFXRX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export class LamaAuth {
    static async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    static async loginWithGithub() {
        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        return signInWithPopup(auth, provider);
    }

    static async logout() {
        return signOut(auth);
    }

    static onAuthStateChanged(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);
    }

    static getCurrentUser() {
        return auth.currentUser;
    }
}

export class LamaStore {
    private db = firestore;

    collection(name: string) {
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
