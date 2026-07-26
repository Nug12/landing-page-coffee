#!/usr/bin/env bash
# push-to-github.sh — sync folder ke GitHub repo via SSH deploy key (tanpa token)
# Usage:
#   ./push-to-github.sh <repo-url-ssh> <source-dir> [commit-message]
#   ./push-to-github.sh git@github.com:user/repo.git /var/www/html "update landing"
#
# Note: butuh SSH deploy key sudah terpasang di GitHub (lihat ~/.ssh/github_deploy)
set -e

REPO="${1:?Usage: $0 <repo-ssh-url> <source-dir> [commit-msg]}"
SRC="${2:?Usage: $0 <repo-ssh-url> <source-dir> [commit-msg]}"
MSG="${3:-update: $(date '+%Y-%m-%d %H:%M')}"

WORK=$(mktemp -d)
SSH_OPT="-o StrictHostKeyChecking=no"

echo "==> Clone $REPO"
git clone "$REPO" "$WORK/repo" 2>&1 | tail -3

echo "==> Sync dari $SRC"
cd "$WORK/repo"
# copy semua file (kecuali dotfile sistem), overwrite
sudo cp -r "$SRC"/. ./ 2>/dev/null || true
# pastikan file bisa dibaca git (owner ubuntu)
sudo chown -R "$(whoami):$(whoami)" .

echo "==> Status"
git status --short

echo "==> Commit + push"
git add -A
if git diff --cached --quiet; then
  echo "Tidak ada perubahan — skip push."
else
  git -c user.name="VPS Deploy" -c user.email="deploy@nug12.biz.id" commit -m "$MSG" 2>&1 | tail -3
  git push origin "$(git rev-parse --abbrev-ref HEAD)" 2>&1 | tail -5
fi

echo "==> Bersihkan tmp"
rm -rf "$WORK"
echo "SELESAI ✅"
