#!/usr/bin/env python3
import json
import os
import sys
import time
import subprocess
import urllib.request
import urllib.error
import hashlib
import pandas as pd
from datetime import datetime

CONFIG_PATH = os.path.expanduser("~/.config/configstore/firebase-tools.json")
DESKTOP_DIR = os.path.expanduser("~/Desktop")
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))

last_data_hash = ""

def get_auth_token():
    try:
        with open(CONFIG_PATH, "r") as f:
            cfg = json.load(f)
        tokens = cfg.get("tokens", {})
        expires_at = tokens.get("expires_at", 0)
        # If expires within 2 minutes, refresh via firebase CLI
        if time.time() * 1000 > (expires_at - 120000):
            print("[SYNC] Refreshing OAuth token via Firebase CLI...")
            subprocess.run(["npx", "-y", "firebase-tools", "projects:list"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
            with open(CONFIG_PATH, "r") as f:
                cfg = json.load(f)
            tokens = cfg.get("tokens", {})
        return tokens.get("access_token", "")
    except Exception as e:
        print(f"[SYNC ERROR] Could not read token: {e}")
        return ""

def fetch_participants():
    token = get_auth_token()
    if not token:
        return []

    all_docs = []
    page_token = None

    while True:
        url = "https://firestore.googleapis.com/v1/projects/glitch-49720/databases/(default)/documents/participants?pageSize=100"
        if page_token:
            url += f"&pageToken={page_token}"

        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                if "documents" in data:
                    all_docs.extend(data["documents"])
                page_token = data.get("nextPageToken")
                if not page_token:
                    break
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print("[SYNC] Token expired (401). Refreshing token...")
                subprocess.run(["npx", "-y", "firebase-tools", "projects:list"],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
                token = get_auth_token()
                continue
            else:
                print(f"[SYNC ERROR] HTTP {e.code}: {e.read().decode()}")
                break
        except Exception as e:
            print(f"[SYNC ERROR] Fetch failed: {e}")
            break

    return all_docs

def extract_val(v):
    if not v:
        return ""
    if "stringValue" in v:
        return v["stringValue"]
    if "integerValue" in v:
        return int(v["integerValue"])
    if "doubleValue" in v:
        return float(v["doubleValue"])
    if "booleanValue" in v:
        return v["booleanValue"]
    return str(v)

def generate_sheets(docs):
    global last_data_hash
    current_hash = hashlib.md5(json.dumps(docs, sort_keys=True).encode()).hexdigest()
    if current_hash == last_data_hash:
        return False  # No change

    records = []
    for d in docs:
        fields = d.get("fields", {})
        row = {k: extract_val(v) for k, v in fields.items()}
        records.append(row)

    # Sort: Score DESC, Time Taken ASC
    records.sort(key=lambda r: (-int(r.get("score", 0)), int(r.get("time_taken", 300))))

    rows = []
    for idx, r in enumerate(records, 1):
        aaruush = r.get("aaruush_id", "")
        if not aaruush or str(aaruush).strip().upper() in ["N/A", "NA", ""]:
            aaruush_display = "N/A"
        else:
            aaruush_display = str(aaruush).strip()

        rows.append({
            "Rank": idx,
            "Name": str(r.get("name", "")).strip(),
            "Registration Number": str(r.get("reg_number", "")).strip().upper(),
            "Aaruush ID": aaruush_display,
            "Email Address": str(r.get("email", "")).strip().lower(),
            "Phone Number": str(r.get("phone", "")).strip(),
            "Total Score (Max 25)": int(r.get("score", 0)),
            "Question Score (Max 21)": int(r.get("question_score", 0)),
            "Time Bonus (Max 4)": int(r.get("time_bonus", 0)),
            "Modules Cleared (Max 7)": int(r.get("modules_cleared", 0)),
            "Time Taken (sec)": int(r.get("time_taken", 0)),
            "Time Remaining (sec)": int(r.get("time_left", 0)),
            "Status": str(r.get("status", "LOGGED_IN")),
            "Registered At": str(r.get("created_at", "")),
            "Completed At": str(r.get("completed_at", ""))
        })

    df = pd.DataFrame(rows)

    targets = [DESKTOP_DIR, WORKSPACE_DIR]
    for d in targets:
        xlsx_path = os.path.join(d, "glitch_matrix_registrations.xlsx")
        csv_path = os.path.join(d, "glitch_matrix_registrations.csv")

        # Write CSV
        df.to_csv(csv_path, index=False)

        # Write Formatted Excel XLSX
        writer = pd.ExcelWriter(xlsx_path, engine="xlsxwriter")
        df.to_excel(writer, sheet_name="Registrations", index=False)

        workbook = writer.book
        worksheet = writer.sheets["Registrations"]

        header_format = workbook.add_format({
            "bold": True,
            "text_wrap": False,
            "valign": "vcenter",
            "align": "center",
            "fg_color": "#0d192e",
            "font_color": "#00f0ff",
            "border": 1,
            "border_color": "#1f3a60",
            "font_name": "Arial",
            "font_size": 11
        })

        data_format = workbook.add_format({
            "font_name": "Arial",
            "font_size": 10,
            "valign": "vcenter",
            "border": 1,
            "border_color": "#e1e4e8"
        })

        center_format = workbook.add_format({
            "font_name": "Arial",
            "font_size": 10,
            "valign": "vcenter",
            "align": "center",
            "border": 1,
            "border_color": "#e1e4e8"
        })

        rank_format = workbook.add_format({
            "bold": True,
            "font_name": "Arial",
            "font_size": 10,
            "valign": "vcenter",
            "align": "center",
            "border": 1,
            "border_color": "#e1e4e8",
            "fg_color": "#f0f9ff"
        })

        score_format = workbook.add_format({
            "bold": True,
            "font_name": "Arial",
            "font_size": 10,
            "valign": "vcenter",
            "align": "center",
            "border": 1,
            "border_color": "#e1e4e8",
            "fg_color": "#e6fffa",
            "font_color": "#007a5a"
        })

        for col_num, col_name in enumerate(df.columns):
            worksheet.write(0, col_num, col_name, header_format)
            max_len = max(df[col_name].astype(str).map(len).max(), len(col_name)) + 4

            if col_name == "Rank":
                worksheet.set_column(col_num, col_num, max_len, rank_format)
            elif "Score" in col_name:
                worksheet.set_column(col_num, col_num, max_len, score_format)
            elif col_name in ["Registration Number", "Aaruush ID", "Phone Number", "Modules Cleared (Max 7)", "Time Taken (sec)", "Time Remaining (sec)", "Status"]:
                worksheet.set_column(col_num, col_num, max_len, center_format)
            else:
                worksheet.set_column(col_num, col_num, max_len, data_format)

        worksheet.set_row(0, 26)
        for row_num in range(1, len(df) + 1):
            worksheet.set_row(row_num, 20)

        worksheet.freeze_panes(1, 0)
        worksheet.autofilter(0, 0, len(df), len(df.columns) - 1)

        writer.close()

    last_data_hash = current_hash
    now_str = datetime.now().strftime("%H:%M:%S")
    print(f"[{now_str}] ✓ UPDATED Desktop Excel & CSV with {len(records)} participants!")
    return True

def main():
    watch_mode = "--watch" in sys.argv or "-w" in sys.argv or "--daemon" in sys.argv
    interval = 30  # seconds

    print("═════════════════════════════════════════════════════════════")
    print(" GLITCH MATRIX — AUTO EXCEL SYNCHRONIZER")
    print(f" Target: {os.path.join(DESKTOP_DIR, 'glitch_matrix_registrations.xlsx')}")
    print(f" Mode:   {'CONTINUOUS WATCH (every ' + str(interval) + 's)' if watch_mode else 'ONE-SHOT SYNC'}")
    print("═════════════════════════════════════════════════════════════")

    docs = fetch_participants()
    if docs:
        generate_sheets(docs)
    else:
        print("[SYNC] No documents retrieved.")

    if not watch_mode:
        return

    while True:
        try:
            time.sleep(interval)
            docs = fetch_participants()
            if docs:
                generate_sheets(docs)
        except KeyboardInterrupt:
            print("\n[SYNC] Auto-sync stopped by user.")
            break
        except Exception as e:
            print(f"[SYNC ERROR] {e}")
            time.sleep(10)

if __name__ == "__main__":
    main()
