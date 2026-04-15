import { createLamaDB, LamaDBConfig } from './stateless';

// ============================================================================
// SINGLE SOURCE OF TRUTH FOR FIREBASE
// ============================================================================

const config: LamaDBConfig = {
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || import.meta.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    },
    simulationMode: !(import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY) ||
        (import.meta.env.VITE_FIREBASE_API_KEY?.length < 20 && import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY?.length < 20)
};

/**
 * CRITICAL: This is the ONLY LamaDB instance in the entire application
 * All auth and data operations MUST go through this singleton
 * 
 * DO NOT create new instances of LamaDBClient anywhere else
 * DO NOT call createLamaDB() anywhere except here
 */
export const LamaDB = createLamaDB(config);

/**
 * System Integrity Diagnostic
 * Returns the status of the required environment variables for production
 */
export const getSystemIntegrity = () => {
    const vars = {
        VITE_FIREBASE_API_KEY: !!(import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.NEXT_PUBLIC_FIREBASE_API_KEY),
        VITE_FIREBASE_AUTH_DOMAIN: !!(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
        VITE_FIREBASE_PROJECT_ID: !!(import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
        VITE_FIREBASE_STORAGE_BUCKET: !!(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
        VITE_FIREBASE_APP_ID: !!(import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    };
    
    const missing = Object.entries(vars)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);

    return {
        isProductionReady: missing.length === 0,
        missingVariables: missing,
        mode: LamaDB.isSimulation() ? 'SIMULATION' : 'PRODUCTION',
        timestamp: new Date().toISOString()
    };
};

// Prevent accidental re-initialization in dev mode
if (import.meta.hot) {
    import.meta.hot.accept();
}

// Log initialization (helps detect duplicate instances)
console.log('🔒 LamaDB Singleton Initialized:', {
    mode: LamaDB.isSimulation() ? 'SIMULATION' : 'PRODUCTION',
    projectId: config.firebase.projectId,
    timestamp: new Date().toISOString()
});
