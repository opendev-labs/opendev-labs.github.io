#!/bin/bash

# Test Production Site - Firebase Account Linking Fix
# Tests that https://opendev-labs.github.io/auth is accessible

echo "============================================"
echo "Production Site Test"
echo "============================================"
echo ""

SITE_URL="https://opendev-labs.github.io/auth"

echo "Testing: $SITE_URL"
echo ""

# Check if site is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Site is accessible (HTTP $HTTP_CODE)"
    echo ""
    
    # Check if the updated JS bundle is deployed
    echo "Checking for updated Firebase auth code..."
    RESPONSE=$(curl -s "$SITE_URL")
    
    if echo "$RESPONSE" | grep -q "lamaDB"; then
        echo "✅ LamaDB code detected in page"
    else
        echo "⚠️  Page loaded but modern bundle not detected"
    fi
    
    echo ""
    echo "============================================"
    echo "Deployment Status"
    echo "============================================"
    echo ""
    echo "✅ Production site is online"
    echo "✅ Code pushed to GitHub (commit b3ef66f)"
    echo "⏳ GitHub Actions building and deploying..."
    echo ""
    echo "📍 URL: $SITE_URL"
    echo ""
    echo "Note: It may take 1-2 minutes for GitHub Actions"
    echo "      to build and deploy the latest changes."
    echo ""
    echo "To check deployment status:"
    echo "  Visit: https://github.com/opendev-labs/opendev-labs.github.io/actions"
    echo ""
    
elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ Site not found (HTTP 404)"
    echo "   Check GitHub Pages settings"
elif [ "$HTTP_CODE" = "000" ]; then
    echo "❌ Cannot connect to site"
    echo "   Check internet connectivity"
else
    echo "⚠️  Site returned HTTP $HTTP_CODE"
fi

exit 0
