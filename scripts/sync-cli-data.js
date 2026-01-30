#!/usr/bin/env node

/**
 * ============================================================================
 * SYNCSTACK CLI DATA SYNC SCRIPT
 * ============================================================================
 * 
 * Syncs data from LamaDB CLI to the web dashboard via GitHub Actions
 * 
 * Usage (from CLI):
 *   node sync-cli-data.js --type projects --data ./data.json
 * 
 * Usage (from GitHub Actions):
 *   Automatically triggered by repository_dispatch event
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DATA_TYPE = process.env.DATA_TYPE || 'projects';
const SYNC_MODE = process.env.SYNC_MODE || 'incremental';
const CLI_PAYLOAD = process.env.CLI_PAYLOAD ? JSON.parse(process.env.CLI_PAYLOAD) : {};

console.log('🔄 SyncStack CLI Data Sync');
console.log('==========================');
console.log(`Data Type: ${DATA_TYPE}`);
console.log(`Sync Mode: ${SYNC_MODE}`);
console.log('');

// ============================================================================
// FIREBASE ADMIN SETUP
// ============================================================================

let serviceAccount;

if (fs.existsSync('firebase-service-account.json')) {
    serviceAccount = JSON.parse(fs.readFileSync('firebase-service-account.json', 'utf8'));
} else {
    console.error('❌ Firebase service account not found');
    process.exit(1);
}

const app = initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore(app);

// ============================================================================
// SYNC FUNCTIONS
// ============================================================================

async function syncProjects(data) {
    console.log('📦 Syncing projects...');

    const projectsRef = db.collection('projects');

    if (SYNC_MODE === 'full') {
        // Full sync: delete all and re-add
        const snapshot = await projectsRef.get();
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log('   Cleared existing projects');
    }

    // Add/update projects from CLI
    const projects = data.projects || CLI_PAYLOAD.projects || [];

    for (const project of projects) {
        const docRef = projectsRef.doc(project.id || db.collection('_').doc().id);
        await docRef.set({
            ...project,
            syncedAt: new Date().toISOString(),
            syncSource: 'cli',
            updatedAt: new Date().toISOString()
        }, { merge: SYNC_MODE === 'incremental' });

        console.log(`   ✅ Synced project: ${project.name}`);
    }

    console.log(`   Total synced: ${projects.length} projects`);
}

async function syncDeployments(data) {
    console.log('🚀 Syncing deployments...');

    const deploymentsRef = db.collection('deployments');
    const deployments = data.deployments || CLI_PAYLOAD.deployments || [];

    for (const deployment of deployments) {
        const docRef = deploymentsRef.doc(deployment.id || db.collection('_').doc().id);
        await docRef.set({
            ...deployment,
            syncedAt: new Date().toISOString(),
            syncSource: 'cli',
            updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log(`   ✅ Synced deployment: ${deployment.url || deployment.id}`);
    }

    console.log(`   Total synced: ${deployments.length} deployments`);
}

async function syncUsers(data) {
    console.log('👤 Syncing users...');

    const usersRef = db.collection('users');
    const users = data.users || CLI_PAYLOAD.users || [];

    for (const user of users) {
        const docRef = usersRef.doc(user.uid);
        await docRef.set({
            ...user,
            syncedAt: new Date().toISOString(),
            syncSource: 'cli',
            updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log(`   ✅ Synced user: ${user.email}`);
    }

    console.log(`   Total synced: ${users.length} users`);
}

async function syncAll(data) {
    console.log('🔄 Syncing all data types...');
    await syncProjects(data);
    await syncDeployments(data);
    await syncUsers(data);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
    try {
        // Load data from CLI payload or file
        let data = CLI_PAYLOAD;

        if (process.argv.includes('--data')) {
            const dataFileIndex = process.argv.indexOf('--data') + 1;
            const dataFile = process.argv[dataFileIndex];

            if (fs.existsSync(dataFile)) {
                data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
                console.log(`📄 Loaded data from: ${dataFile}`);
            }
        }

        // Sync based on data type
        switch (DATA_TYPE) {
            case 'projects':
                await syncProjects(data);
                break;

            case 'deployments':
                await syncDeployments(data);
                break;

            case 'users':
                await syncUsers(data);
                break;

            case 'all':
                await syncAll(data);
                break;

            default:
                console.error(`❌ Unknown data type: ${DATA_TYPE}`);
                process.exit(1);
        }

        // Update sync metadata
        await db.collection('_syncstack_meta').doc('cli_sync').set({
            lastSyncTime: new Date().toISOString(),
            dataType: DATA_TYPE,
            syncMode: SYNC_MODE,
            status: 'success'
        });

        console.log('');
        console.log('✅ Sync completed successfully!');
        console.log('Dashboard will update in ~1-2 minutes');

    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

main();
