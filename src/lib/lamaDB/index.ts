/**
 * LamaDB - Stateless Firebase Wrapper
 * 
 * ============================================================================
 * CRITICAL: SINGLE SOURCE OF TRUTH
 * ============================================================================
 * 
 * This module exports the SINGLETON instance from config.ts
 */

export { LamaDB } from './config';

export type {
    LamaDBConfig,
    UserContext,
    AuthResult,
    CollectionOperations,
    LamaDBError,
    LamaDBClient
} from './stateless';
