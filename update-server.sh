#!/usr/bin/env bash
# ==============================================================================
# CFN Kurties — Automatic Server Update & Deployment Script
# Usage: ./update-server.sh [server_user_and_host]
# Default target: ubuntu@cfnkurties.in
# ==============================================================================

set -e

SERVER_TARGET="${1:-ubuntu@cfnkurties.in}"
REMOTE_PATH="~/html/cfn-kurties-storefront"

echo "======================================================================"
echo "🚀 Starting Automated Deployment for CFN Kurties Storefront"
echo "Target Server: ${SERVER_TARGET}"
echo "======================================================================"

# 1. Verify Local Build
echo "📦 1/4 Building production bundle locally to verify 0 errors..."
npm run build

# 2. Package Clean Archive
echo "📦 2/4 Creating clean cfn-kurties.tar archive..."
cd /root
rm -f cfn-kurties.tar
tar -cvf cfn-kurties.tar --exclude='node_modules' --exclude='.next' --exclude='.git' cfn-kurties

# 3. Upload Archive to Server
echo "📤 3/4 Uploading archive to ${SERVER_TARGET}:${REMOTE_PATH}/..."
scp /root/cfn-kurties.tar "${SERVER_TARGET}:${REMOTE_PATH}/"

# 4. Extract and Restart PM2 Server Remotely
echo "⚡ 4/4 Extracting and restarting live PM2 server on remote host..."
ssh "${SERVER_TARGET}" << 'EOF'
  set -e
  cd ~/html/cfn-kurties-storefront
  tar -xvf cfn-kurties.tar
  cd cfn-kurties
  npm install
  npm run build
  pm2 restart cfn-kurties || pm2 start npm --name "cfn-kurties" -- start -- -p 3000
  pm2 save
EOF

echo "======================================================================"
echo "✨ DEPLOYMENT COMPLETE! https://cfnkurties.in is live and updated!"
echo "======================================================================"
