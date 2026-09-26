#!/bin/bash
# Glitch Matrix - Real-Time Excel Auto-Sync
cd "$(dirname "$0")"
python3 auto_sync_excel.py --watch
