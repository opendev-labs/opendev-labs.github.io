import { createLamaDB, LamaDBConfig } from './stateless';

// ============================================================================
// SINGLE SOURCE OF TRUTH FOR FIREBASE
// ============================================================================

const config: LamaDBConfig = {
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    },
    simulationMode: !import.meta.env.VITE_FIREBASE_API_KEY ||
        import.meta.env.VITE_FIREBASE_API_KEY.length < 20
};

/**
 * CRITICAL: This is the ONLY LamaDB instance in the entire application
 * All auth and data operations MUST go through this singleton
 * 
 * DO NOT create new instances of LamaDBClient anywhere else
 * DO NOT call createLamaDB() anywhere except here
 */
export const LamaDB = createLamaDB(config);

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
