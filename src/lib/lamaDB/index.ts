import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User, fetchSignInMethodsForEmail, linkWithCredential, OAuthProvider, linkWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

/**
 * Enterprise-Grade Error Logging & Categorization
 */
interface ErrorContext {
    method: string;
    userId?: string;
    email?: string;
    provider?: string;
    timestamp: string;
}

class ErrorLogger {
    private static errors: any[] = [];

    static log(error: any, context: ErrorContext) {
        const errorEntry = {
            ...context,
            errorCode: error.code || 'UNKNOWN',
            errorMessage: error.message || 'Unknown error',
            stack: error.stack,
            timestamp: new Date().toISOString()
        };

        this.errors.push(errorEntry);

        // Detailed console logging
        console.group(`🔴 LamaDB Error: ${context.method}`);
        console.error('Error Code:', errorEntry.errorCode);
        console.error('Message:', errorEntry.errorMessage);
        console.error('Context:', context);
        if (error.customData) console.error('Custom Data:', error.customData);
        console.error('Full Error:', error);
        console.groupEnd();

        // Send to analytics if available
        if (analytics) {
            logEvent(analytics, 'auth_error', {
                error_code: errorEntry.errorCode,
                method: context.method
            });
        }

        return errorEntry;
    }

    static getUserFriendlyMessage(errorCode: string): string {
        const messages: { [key: string]: string } = {
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

    static getErrors() {
        return this.errors;
    }
}

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

        try {
            return await signInWithPopup(auth, provider);
        } catch (error: any) {
            console.error("Nexus Registry: Google Auth Error:", error.code, error.message);

            if (error.code === 'auth/account-exists-with-different-credential') {
                console.log("Nexus Intelligence: Detected existing account collision with Google login.");

                const pendingCred = GoogleAuthProvider.credentialFromError(error);
                const email = error.customData?.email;

                if (!email) {
                    throw new Error("Account collision detected, but email is hidden. Please log in with your primary provider first.");
                }

                if (!pendingCred) {
                    console.error("No pending Google credential available");
                    throw error;
                }

                // Get existing providers
                try {
                    const methods = await fetchSignInMethodsForEmail(auth, email);
                    console.log("Existing Identity Methods:", methods);

                    if (methods.includes('github.com')) {
                        // User needs to sign in with GitHub first, then we link Google
                        console.log("Nexus Intelligence: Initiating GitHub verification for automatic linking...");

                        const githubProvider = new GithubAuthProvider();
                        githubProvider.addScope('repo');
                        githubProvider.addScope('user');

                        let githubResult: any;
                        try {
                            githubResult = await signInWithPopup(auth, githubProvider);
                            console.log("Nexus Intelligence: GitHub verification successful. Linking Google...");

                            // Link the pending Google credential
                            const linkedResult = await linkWithCredential(githubResult.user, pendingCred);
                            console.log("Nexus Intelligence: Protocol linked successfully! Identity converged.");

                            // Return the linked result as a successful login
                            return linkedResult;
                        } catch (linkError: any) {
                            console.error("Nexus Registry: Google linking failed:", linkError);
                            if (linkError.code === 'auth/popup-closed-by-user') {
                                throw new Error("Verification popup was closed. Please try again and approve both sign-in prompts.");
                            }
                            if (linkError.code === 'auth/credential-already-in-use') {
                                // The Google account is already linked to this GitHub account
                                console.log("Nexus Intelligence: Accounts already linked. Returning GitHub session.");
                                return linkError.customData?.githubResult || githubResult;
                            }
                            throw new Error(`Account linking failed: ${linkError.message}. Please contact support.`);
                        }
                    } else if (methods.length > 0) {
                        throw new Error(`This email is already associated with [${methods.join(', ')}]. Please log in with that provider first.`);
                    } else {
                        console.error("Unexpected state: account-exists error but no sign-in methods found");
                        throw error;
                    }
                } catch (fetchError: any) {
                    console.error("Nexus Registry: Failed to fetch sign-in methods:", fetchError);
                    throw new Error("Unable to verify account. Please ensure you have internet connectivity and try again.");
                }
            }

            // For other errors, throw them as-is
            throw error;
        }
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

                const pendingCred = GithubAuthProvider.credentialFromError(error);
                const email = error.customData?.email;

                console.log("Collision Email:", email);

                if (!email) {
                    throw new Error("Account collision detected, but email is hidden. Please log in with your primary provider (Google) first.");
                }

                if (!pendingCred) {
                    console.error("No pending credential available");
                    throw error;
                }

                // Get existing providers
                try {
                    const methods = await fetchSignInMethodsForEmail(auth, email);
                    console.log("Existing Identity Methods:", methods);

                    if (methods.includes('google.com')) {
                        // User needs to sign in with Google to prove ownership, then link
                        console.log("Nexus Intelligence: Initiating Google verification for automatic linking...");

                        const googleProvider = new GoogleAuthProvider();
                        googleProvider.setCustomParameters({ login_hint: email });

                        let googleResult: any;
                        try {
                            googleResult = await signInWithPopup(auth, googleProvider);
                            console.log("Nexus Intelligence: Google verification successful. Linking GitHub...");

                            // Link the pending GitHub credential
                            const linkedResult = await linkWithCredential(googleResult.user, pendingCred);
                            console.log("Nexus Intelligence: Protocol linked successfully! Identity converged.");

                            // Return the linked result as a successful login
                            return linkedResult;
                        } catch (linkError: any) {
                            console.error("Nexus Registry: Linking failed:", linkError);
                            if (linkError.code === 'auth/popup-closed-by-user') {
                                throw new Error("Verification popup was closed. Please try again and approve both sign-in prompts.");
                            }
                            if (linkError.code === 'auth/credential-already-in-use') {
                                // The GitHub account is already linked to this Google account
                                // Just return the Google result since they're already linked
                                console.log("Nexus Intelligence: Accounts already linked. Returning Google session.");
                                return linkError.customData?.googleResult || googleResult;
                            }
                            throw new Error(`Account linking failed: ${linkError.message}. Please contact support.`);
                        }
                    } else if (methods.length > 0) {
                        throw new Error(`This email is already associated with [${methods.join(', ')}]. Please log in with that provider first.`);
                    } else {
                        // No existing methods? This shouldn't happen with this error
                        console.error("Unexpected state: account-exists error but no sign-in methods found");
                        throw error;
                    }
                } catch (fetchError: any) {
                    console.error("Nexus Registry: Failed to fetch sign-in methods:", fetchError);
                    // If we can't fetch methods, provide helpful error
                    throw new Error("Unable to verify account. Please ensure you have internet connectivity and try again.");
                }
            }

            // For other errors, throw them as-is
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

    // ==========================================
    // EMAIL/PASSWORD AUTHENTICATION (Enterprise Fallback)
    // ==========================================

    /**
     * Sign up with email and password
     * @returns UserCredential with newly created user
     */
    static async signUpWithEmail(email: string, password: string, displayName?: string) {
        const context: ErrorContext = {
            method: 'signUpWithEmail',
            email,
            timestamp: new Date().toISOString()
        };

        if (isSimulationMode) {
            console.log(`SIMULATION: Creating account for ${email}`);
            const mockUser = {
                user: {
                    displayName: displayName || email.split('@')[0],
                    email,
                    uid: `sim_${Date.now()}`,
                    emailVerified: false
                }
            };
            localStorage.setItem('nexus_sim_user', JSON.stringify(mockUser.user));
            return mockUser as any;
        }

        if (!auth) {
            const error = new Error("Firebase Auth not initialized");
            ErrorLogger.log(error, context);
            throw error;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Send email verification
            if (userCredential.user) {
                await sendEmailVerification(userCredential.user);
                console.log("✅ Verification email sent to:", email);
            }

            console.log("✅ Account created successfully:", email);
            logEvent(analytics, 'sign_up', { method: 'email' });

            return userCredential;
        } catch (error: any) {
            ErrorLogger.log(error, context);
            throw new Error(ErrorLogger.getUserFriendlyMessage(error.code));
        }
    }

    /**
     * Sign in with email and password
     * @returns UserCredential
     */
    static async signInWithEmail(email: string, password: string) {
        const context: ErrorContext = {
            method: 'signInWithEmail',
            email,
            timestamp: new Date().toISOString()
        };

        if (isSimulationMode) {
            console.log(`SIMULATION: Signing in as ${email}`);
            const stored = localStorage.getItem('nexus_sim_user');
            if (stored) {
                return { user: JSON.parse(stored) } as any;
            }
            const mockUser = {
                user: {
                    displayName: email.split('@')[0],
                    email,
                    uid: `sim_${Date.now()}`,
                    emailVerified: false
                }
            };
            localStorage.setItem('nexus_sim_user', JSON.stringify(mockUser.user));
            return mockUser as any;
        }

        if (!auth) {
            const error = new Error("Firebase Auth not initialized");
            ErrorLogger.log(error, context);
            throw error;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Signed in successfully:", email);
            logEvent(analytics, 'login', { method: 'email' });
            return userCredential;
        } catch (error: any) {
            ErrorLogger.log(error, context);
            throw new Error(ErrorLogger.getUserFriendlyMessage(error.code));
        }
    }

    /**
     * Send password reset email
     */
    static async resetPassword(email: string) {
        const context: ErrorContext = {
            method: 'resetPassword',
            email,
            timestamp: new Date().toISOString()
        };

        if (isSimulationMode) {
            console.log(`SIMULATION: Password reset email sent to ${email}`);
            return;
        }

        if (!auth) {
            const error = new Error("Firebase Auth not initialized");
            ErrorLogger.log(error, context);
            throw error;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            console.log("✅ Password reset email sent to:", email);
        } catch (error: any) {
            ErrorLogger.log(error, context);
            throw new Error(ErrorLogger.getUserFriendlyMessage(error.code));
        }
    }

    /**
     * Resend email verification
     */
    static async resendEmailVerification() {
        if (isSimulationMode) {
            console.log("SIMULATION: Email verification sent");
            return;
        }

        if (!auth || !auth.currentUser) {
            throw new Error("No user logged in");
        }

        try {
            await sendEmailVerification(auth.currentUser);
            console.log("✅ Verification email sent");
        } catch (error: any) {
            ErrorLogger.log(error, {
                method: 'resendEmailVerification',
                userId: auth.currentUser.uid,
                timestamp: new Date().toISOString()
            });
            throw new Error(ErrorLogger.getUserFriendlyMessage(error.code));
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
    store: new LamaStore(),
    errors: ErrorLogger  // Expose error logger for debugging
};
