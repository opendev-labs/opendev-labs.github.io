#!/bin/bash

# ============================================================================
# LAMADB CLI → WEB DASHBOARD SYNC TRIGGER
# ============================================================================
#
# Usage: ./trigger-dashboard-sync.sh projects ./data/projects.json
#
# This script triggers a GitHub Action that syncs your local CLI data
# to the live web dashboard at opendev-labs.github.io
# ============================================================================

set -e

# Configuration
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
GITHUB_REPO="opendev-labs/opendev-labs.github.io"
DATA_TYPE="${1:-projects}"
DATA_FILE="${2:-}"
SYNC_MODE="${3:-incremental}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# VALIDATION
# ============================================================================

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}🔄 SYNCSTACK: CLI → Web Dashboard Sync${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Check for GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${RED}❌ ERROR: GITHUB_TOKEN not set${NC}"
  echo ""
  echo "To use this feature, you need a GitHub Personal Access Token."
  echo ""
  echo "Steps:"
  echo "1. Go to: https://github.com/settings/tokens"
  echo "2. Generate new token (classic)"
  echo "3. Select scopes: 'repo' and 'workflow'"
  echo "4. Copy the token"
  echo "5. Export it: export GITHUB_TOKEN=your_token_here"
  echo "6. Add to ~/.bashrc for persistence"
  echo ""
  exit 1
fi

# Check data file
if [ -n "$DATA_FILE" ] && [ ! -f "$DATA_FILE" ]; then
  echo -e "${RED}❌ ERROR: Data file not found: $DATA_FILE${NC}"
  exit 1
fi

# ============================================================================
# PREPARE PAYLOAD
# ============================================================================

echo -e "${YELLOW}📦 Preparing sync payload...${NC}"
echo "   Data Type: $DATA_TYPE"
echo "   Sync Mode: $SYNC_MODE"
if [ -n "$DATA_FILE" ]; then
  echo "   Data File: $DATA_FILE"
fi
echo ""

# Read data file if provided
DATA_PAYLOAD="{}"
if [ -n "$DATA_FILE" ]; then
  DATA_PAYLOAD=$(cat "$DATA_FILE")
fi

# ============================================================================
# TRIGGER GITHUB ACTION
# ============================================================================

echo -e "${YELLOW}🚀 Triggering GitHub Action...${NC}"

PAYLOAD=$(cat <<EOF
{
  "event_type": "lamadb_cli_sync",
  "client_payload": {
    "data_type": "$DATA_TYPE",
    "sync_mode": "$SYNC_MODE",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "data": $DATA_PAYLOAD
  }
}
EOF
)

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/$GITHUB_REPO/dispatches" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

# ============================================================================
# CHECK RESULT
# ============================================================================

echo ""

if [ "$HTTP_CODE" -eq 204 ]; then
  echo -e "${GREEN}✅ SUCCESS: GitHub Action triggered!${NC}"
  echo ""
  echo "The web dashboard will update in ~2-3 minutes."
  echo ""
  echo "Monitor progress:"
  echo "   https://github.com/$GITHUB_REPO/actions"
  echo ""
  echo "Live dashboard:"
  echo "   https://opendev-labs.github.io"
  echo ""
  
elif [ "$HTTP_CODE" -eq 401 ]; then
  echo -e "${RED}❌ ERROR: Authentication failed${NC}"
  echo "Your GitHub token is invalid or expired."
  echo "Generate a new token at: https://github.com/settings/tokens"
  exit 1
  
elif [ "$HTTP_CODE" -eq 404 ]; then
  echo -e "${RED}❌ ERROR: Repository not found${NC}"
  echo "Check that the repository exists and your token has access."
  exit 1
  
else
  echo -e "${RED}❌ ERROR: GitHub API returned HTTP $HTTP_CODE${NC}"
  echo "Response: $RESPONSE_BODY"
  exit 1
fi

# ============================================================================
# EXAMPLE USAGE
# ============================================================================

cat << 'EOF'
============================================================================
📖 EXAMPLES
============================================================================

# Sync projects
./trigger-dashboard-sync.sh projects ./data/projects.json

# Sync deployments
./trigger-dashboard-sync.sh deployments ./data/deployments.json

# Full sync (delete all and re-add)
./trigger-dashboard-sync.sh projects ./data/projects.json full

# Sync from LamaDB CLI
lamadb export projects > /tmp/projects.json
./trigger-dashboard-sync.sh projects /tmp/projects.json

============================================================================
EOF
