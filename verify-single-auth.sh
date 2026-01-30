#!/bin/bash

# ============================================================================
# Double Auth Detection Script
# ============================================================================
# This script finds all potential duplicate Firebase initialization patterns

echo "🔍 Scanning for duplicate Firebase instances..."
echo ""

# Track findings
ISSUES_FOUND=0

# Check for multiple initializeApp calls
echo "1️⃣ Checking for multiple initializeApp() calls..."
INIT_COUNT=$(grep -r "initializeApp(" src/ --include="*.ts" --include="*.tsx" | grep -v "import" | wc -l)
if [ "$INIT_COUNT" -gt 1 ]; then
  echo "   ❌ Found $INIT_COUNT Firebase initializations (should be 1)"
  grep -rn "initializeApp(" src/ --include="*.ts" --include="*.tsx" | grep -v "import"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo "   ✅ Only 1 Firebase initialization found"
fi
echo ""

# Check for multiple getAuth calls
echo "2️⃣ Checking for multiple getAuth() calls..."
AUTH_COUNT=$(grep -r "getAuth(" src/ --include="*.ts" --include="*.tsx" | grep -v "import" | wc -l)
if [ "$AUTH_COUNT" -gt 1 ]; then
  echo "   ❌ Found $AUTH_COUNT getAuth() calls (should be 1)"
  grep -rn "getAuth(" src/ --include="*.ts" --include="*.tsx" | grep -v "import"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo "   ✅ Only 1 getAuth() call found"
fi
echo ""

# Check for createLamaDB calls (should only be in config.ts)
echo "3️⃣ Checking for createLamaDB() calls..."
CREATE_COUNT=$(grep -r "createLamaDB(" src/ --include="*.ts" --include="*.tsx" | grep -v "import" | grep -v "export function createLamaDB" | grep -v "^\s*//" | grep -v "^\s*\*" | wc -l)
if [ "$CREATE_COUNT" -gt 1 ]; then
  echo "   ❌ Found $CREATE_COUNT createLamaDB() calls (should be 1 in config.ts)"
  grep -rn "createLamaDB(" src/ --include="*.ts" --include="*.tsx" | grep -v "import" | grep -v "export function createLamaDB" | grep -v "^\s*//" | grep -v "^\s*\*"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo "   ✅ Only 1 createLamaDB() call found (in config.ts)"
fi
echo ""

# Check for multiple AuthContext files
echo "4️⃣ Checking for duplicate AuthContext files..."
AUTH_CONTEXT_COUNT=$(find src/ -name "AuthContext.tsx" | wc -l)
if [ "$AUTH_CONTEXT_COUNT" -gt 1 ]; then
  echo "   ❌ Found $AUTH_CONTEXT_COUNT AuthContext files (should be 1)"
  find src/ -name "AuthContext.tsx"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo "   ✅ Only 1 AuthContext file found"
fi
echo ""

# Check for legacy lama-db.ts file
echo "5️⃣ Checking for legacy lama-db.ts..."
if [ -f "src/lib/lama-db.ts" ]; then
  echo "   ❌ Found legacy lama-db.ts (should be deleted)"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo "   ✅ Legacy lama-db.ts not found (good)"
fi
echo ""

# Check import patterns
echo "6️⃣ Checking import patterns..."
BAD_IMPORTS=$(grep -r "from.*lamaDB/stateless" src/ --include="*.ts" --include="*.tsx" | grep -v "config.ts" | grep -v "index.ts" | wc -l)
if [ "$BAD_IMPORTS" -gt 0 ]; then
  echo "   ❌ Found $BAD_IMPORTS imports from stateless.ts (should import from config.ts)"
  grep -rn "from.*lamaDB/stateless" src/ --include="*.ts" --include="*.tsx" | grep -v "config.ts" | grep -v "index.ts"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo "   ✅ No direct imports from stateless.ts found"
fi
echo ""

# Summary
echo "============================================================================"
if [ "$ISSUES_FOUND" -eq 0 ]; then
  echo "✅ SUCCESS: No duplicate auth patterns detected!"
  echo "   Your app has a single source of truth for authentication."
else
  echo "❌ ISSUES FOUND: $ISSUES_FOUND potential duplicate auth patterns"
  echo "   Review the findings above and fix before proceeding."
  echo ""
  echo "   📖 See: double_auth_kill_plan.md for fix instructions"
fi
echo "============================================================================"

exit $ISSUES_FOUND
