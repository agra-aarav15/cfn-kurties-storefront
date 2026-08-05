#!/usr/bin/env bash
# ==============================================================================
# CFN Kurties — Automatic Server Update & Deployment Script
# Usage: ./update-server.sh [server_user_and_host]
# Default target: ubuntu@140.238.240.67
# ==============================================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

SERVER_TARGET="${1:-ubuntu@140.238.240.67}"
REMOTE_PATH="~/html/cfn-kurties-storefront"

echo "======================================================================"
echo "🚀 Starting Automated Deployment for CFN Kurties Storefront"
echo "Target Server: ${SERVER_TARGET}"
echo "Working Directory: ${SCRIPT_DIR}"
echo "======================================================================"

# 1. Verify Local Build
echo "📦 1/4 Building production bundle locally to verify 0 errors..."
npm run build

# 2. Package Clean Archive (excluding node_modules & .next)
echo "📦 2/4 Creating clean cfn-kurties.tar archive..."
cd ..
tar -cvf cfn-kurties.tar \
  --exclude='cfn-kurties/node_modules' \
  --exclude='cfn-kurties/.next' \
  --exclude='cfn-kurties/.git' \
  cfn-kurties

# 3. SCP Archive to Remote Server
echo "📤 3/4 Uploading archive to ${SERVER_TARGET}:${REMOTE_PATH}/..."
scp cfn-kurties.tar "${SERVER_TARGET}:${REMOTE_PATH}/"

# 4. Remote Extract, Install, Build, and PM2 Restart
echo "⚡ 4/4 Extracting archive, installing dependencies & restarting PM2 on remote server..."
ssh -t "${SERVER_TARGET}" "
  cd ${REMOTE_PATH} && \
  tar -xvf cfn-kurties.tar && \
  cd cfn-kurties && \
  npm install && \
  npm run build && \
  (pm2 restart cfn-kurties || pm2 start npm --name 'cfn-kurties' -- start -- -p 3000) && \
  pm2 save
"

echo "======================================================================"
echo "✅ DEPLOYMENT COMPLETE! Live site updated at https://cfnkurties.in"
echo "======================================================================"
