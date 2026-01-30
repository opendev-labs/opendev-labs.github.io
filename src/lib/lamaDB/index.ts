/**
 * LamaDB - Stateless Firebase Wrapper
 * 
 * ============================================================================
 * CRITICAL: SINGLE SOURCE OF TRUTH
 * ============================================================================
 * 
 * This module exports the SINGLETON instance from config.ts
 * 
 * DO NOT:
 * - Create new instances of LamaDBClient
 * - Call createLamaDB() anywhere except config.ts
 * - Import from ./stateless directly (use this module)
 * 
 * ALWAYS:
 * - Import LamaDB from this module or from @/lib/lamaDB
 * - Use the singleton for all auth and data operations
 */

// ============================================================================
// SINGLETON EXPORT - Only one instance across entire app
// ============================================================================

export { LamaDB } from './config';

// ============================================================================
// TYPE EXPORTS - For TypeScript support
// ============================================================================

export type {
    LamaDBConfig,
    UserContext,
    AuthResult,
    CollectionOperations,
    LamaDBError
} from './stateless';

export type { LamaDBClient } from './stateless';

// ============================================================================
// NOTES FOR DEVELOPERS
// ============================================================================

/*
 * Migration from old implementation:
 * 
 * BEFORE (Old stateful pattern):
 * 
 *   import { LamaDB } from '@/lib/lamaDB';
 *   const user = LamaDB.auth.getCurrentUser();
 * 
 * AFTER (New stateless pattern):
 * 
 *   import { LamaDB } from '@/lib/lamaDB';
 *   const user = LamaDB.auth.getCurrentUser();  // ✅ Same API!
 * 
 * The API is compatible, but now uses a singleton instance with
 * explicit dependency injection internally.
 * 
 * Key improvements:
 * - ✅ Single Firebase instance (no duplicate auth)
 * - ✅ Explicit user context in data operations
 * - ✅ Type-safe with generics
 * - ✅ Testable (all dependencies can be mocked)
 * - ✅ Production-ready error handling
 */
