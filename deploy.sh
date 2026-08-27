#!/bin/bash
# ============================================================
# deploy.sh  —  ROYAL300 Portfolio Deploy Script
# Usage: bash deploy.sh
#
# What this does:
#  1. Pushes code to GitHub
#  2. Builds locally with node-server preset (for VPS)
#  3. Uploads .output/ to VPS via rsync/scp
#  4. Restarts the PM2 process on VPS
# ============================================================

set -e

VPS_HOST="93.127.206.52"
VPS_USER="root"
VPS_DIR="/var/www/royal300_portfolio"
PM2_NAME="portfolio.royal300.com"
BRANCH="main"

echo ""
echo "🚀  ROYAL300 Deploy — $(date)"
echo "================================"

# ── 1. Push to GitHub ──────────────────────────────────────
echo ""
echo "📦  Pushing to GitHub ($BRANCH)..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "Nothing new to commit."
git push origin "$BRANCH"
echo "✅  GitHub up to date."

# ── 2. Build locally with node-server preset ───────────────
echo ""
echo "🔨  Building (node-server preset)..."
NITRO_PRESET=node-server npm run build
echo "✅  Build complete (.output/ ready)."

# ── 3. Upload .output/ to VPS ──────────────────────────────
echo ""
echo "📤  Uploading .output/ to VPS..."

# Using Python paramiko (cross-platform, no sshpass needed)
python - << 'PYEOF'
import paramiko, os, sys

host = "93.127.206.52"
user = "root"
password = "Royal300@2026"
local_output = ".output"
remote_base = "/var/www/royal300_portfolio"

def upload_dir(sftp, local_dir, remote_dir):
    try: sftp.mkdir(remote_dir)
    except: pass
    for item in os.listdir(local_dir):
        lp = os.path.join(local_dir, item)
        rp = remote_dir + "/" + item
        if os.path.isdir(lp):
            upload_dir(sftp, lp, rp)
        else:
            print(f"  → {rp}")
            sftp.put(lp, rp)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=15)
sftp = client.open_sftp()
print("Clearing old build...")
client.exec_command(f"rm -rf {remote_base}/.output")[1].channel.recv_exit_status()
print("Uploading...")
upload_dir(sftp, local_output, f"{remote_base}/.output")
sftp.close()

print("\nRestarting PM2 process...")
_, out, err = client.exec_command(f"pm2 restart portfolio.royal300.com && pm2 save")
print(out.read().decode("utf-8", errors="replace"))
client.close()
print("Done!")
PYEOF

echo ""
echo "✅  Upload complete."
echo ""
echo "🎉  Site live at https://portfolio.royal300.com"
echo ""
