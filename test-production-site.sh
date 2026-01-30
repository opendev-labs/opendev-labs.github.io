#!/bin/bash

# ============================================================================
# Production Site Verification Script
# ============================================================================
# Tests the live deployment at opendev-labs.github.io

SITE_URL="https://opendev-labs.github.io"
WAIT_TIME=180  # 3 minutes for GitHub Pages to deploy

echo "============================================================================"
echo "🚀 PRODUCTION DEPLOYMENT VERIFICATION"
echo "============================================================================"
echo ""
echo "Site URL: $SITE_URL"
echo "Commit: c03c0d5 (Double Auth Kill)"
echo ""

# Wait for deployment
echo "⏰ Waiting $WAIT_TIME seconds for GitHub Pages deployment..."
for i in $(seq $WAIT_TIME -1 1); do
    printf "\r   Time remaining: %03d seconds" $i
    sleep 1
done
echo ""
echo ""

# Check if site is reachable
echo "1️⃣ Checking site availability..."
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200"; then
    echo "   ✅ Site is online (HTTP 200)"
else
    echo "   ❌ Site unreachable or error"
    exit 1
fi
echo ""

# Check for critical files
echo "2️⃣ Checking for new architecture files..."

# Check if stateless.ts is deployed
if curl -s "$SITE_URL/assets/index.js" | grep -q "LamaDBClient\|stateless"; then
    echo "   ✅ Stateless LamaDB code detected in bundle"
else
    echo "   ⚠️ Could not detect stateless code (check manually)"
fi
echo ""

# Check for singleton pattern
if curl -s "$SITE_URL/assets/index.js" | grep -q "createLamaDB"; then
    echo "   ✅ LamaDB initialization code found"
else
    echo "   ⚠️ LamaDB init not detected"
fi
echo ""

# Instructions for manual verification
echo "3️⃣ Manual verification required:"
echo ""
echo "   📋 STEPS:"
echo "   1. Open $SITE_URL in Incognito"
echo "   2. Open DevTools (F12) → Console"
echo "   3. Look for: '🔒 LamaDB Singleton Initialized'"
echo "   4. Should appear ONCE (not twice)"
echo "   5. Try logging in with GitHub"
echo "   6. Check for any errors"
echo ""

# GitHub Actions check
echo "4️⃣ Checking GitHub Actions deployment status..."
echo "   Visit: https://github.com/opendev-labs/opendev-labs.github.io/actions"
echo "   Look for: 'pages-build-deployment' workflow"
echo "   Status should be: ✅ Success (green checkmark)"
echo ""

# Summary
echo "============================================================================"
echo "✅ AUTOMATED CHECKS COMPLETE"
echo "============================================================================"
echo ""
echo "Next Steps:"
echo "1. Open site in incognito: $SITE_URL"
echo "2. Test login flow"
echo "3. Verify single Firebase instance in console"
echo "4. Test project creation/sync"
echo ""
echo "If everything works: DOUBLE AUTH is DEAD! 🎉"
echo "============================================================================"
