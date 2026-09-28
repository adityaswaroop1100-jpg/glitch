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

def load_existing_marks():
    round2 = {}
    round3 = {}
    csv_path = os.path.join(DESKTOP_DIR, "glitch_matrix_registrations.csv")
    if os.path.exists(csv_path):
        try:
            old_df = pd.read_csv(csv_path)
            for _, row in old_df.iterrows():
                reg = str(row.get("Registration Number", "")).strip().upper()
                email = str(row.get("Email Address", "")).strip().lower()

                if "Round 2 Marks" in old_df.columns:
                    val2 = row["Round 2 Marks"]
                    if pd.notna(val2) and str(val2).strip() != "":
                        round2[reg] = str(val2).strip()
                        if email: round2[email] = str(val2).strip()

                if "Round 3 Marks" in old_df.columns:
                    val3 = row["Round 3 Marks"]
                    if pd.notna(val3) and str(val3).strip() != "":
                        round3[reg] = str(val3).strip()
                        if email: round3[email] = str(val3).strip()
                elif "Round 3" in old_df.columns:
                    val3 = row["Round 3"]
                    if pd.notna(val3) and str(val3).strip() != "":
                        round3[reg] = str(val3).strip()
                        if email: round3[email] = str(val3).strip()
        except Exception:
            pass
    return round2, round3

def generate_sheets(docs):
    global last_data_hash
    current_hash = hashlib.md5(json.dumps(docs, sort_keys=True).encode()).hexdigest()
    if current_hash == last_data_hash:
        return False  # No change

    # Load any previously saved Round 2 and Round 3 marks so manual input is never lost on sync
    existing_round2, existing_round3 = load_existing_marks()

    records = []
    for d in docs:
        fields = d.get("fields", {})
        row = {k: extract_val(v) for k, v in fields.items()}
        name_clean = str(row.get("name", "")).strip().lower()
        email_clean = str(row.get("email", "")).strip().lower()
        # Filter out admin test accounts
        if name_clean == "aditya swaroop" or email_clean == "adityaswaroop1100@gmail.com":
            continue
        records.append(row)

    # Sort: Score DESC, Time Taken ASC
    records.sort(key=lambda r: (-int(r.get("score", 0)), int(r.get("time_taken", 300))))

    rows = []
    for idx, r in enumerate(records, 1):
        clean_reg = str(r.get("reg_number", "")).strip().upper()
        clean_email = str(r.get("email", "")).strip().lower()
        aaruush = r.get("aaruush_id", "")
        if not aaruush or str(aaruush).strip().upper() in ["N/A", "NA", ""]:
            aaruush_display = "N/A"
        else:
            aaruush_display = str(aaruush).strip()

        # Clean competitive scoring layout: Rank, Name, Reg, Aaruush, Email, Phone, Round 1, Round 2, Round 3
        rows.append({
            "Rank": idx,
            "Name": str(r.get("name", "")).strip(),
            "Registration Number": clean_reg,
            "Aaruush ID": aaruush_display,
            "Email Address": clean_email,
            "Phone Number": str(r.get("phone", "")).strip(),
            "Round 1 Score (Max 25)": int(r.get("score", 0)),
            "Round 2 Marks": existing_round2.get(clean_email, existing_round2.get(clean_reg, "")),
            "Round 3 Marks": existing_round3.get(clean_email, existing_round3.get(clean_reg, ""))
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

        # Special highlighted styling for Round 2 and Round 3 Marks (clean editable cells)
        round_manual_header_format = workbook.add_format({
            "bold": True,
            "text_wrap": False,
            "valign": "vcenter",
            "align": "center",
            "fg_color": "#f59e0b",
            "font_color": "#000000",
            "border": 1,
            "border_color": "#d97706",
            "font_name": "Arial",
            "font_size": 11
        })

        round_manual_cell_format = workbook.add_format({
            "font_name": "Arial",
            "font_size": 10,
            "valign": "vcenter",
            "align": "center",
            "border": 1,
            "border_color": "#fcd34d",
            "fg_color": "#fffbeb",
            "bold": True,
            "font_color": "#92400e"
        })

        for col_num, col_name in enumerate(df.columns):
            if col_name in ["Round 2 Marks", "Round 3 Marks"]:
                worksheet.write(0, col_num, col_name, round_manual_header_format)
            else:
                worksheet.write(0, col_num, col_name, header_format)

            max_len = max(df[col_name].astype(str).map(len).max(), len(col_name)) + 4

            if col_name == "Rank":
                worksheet.set_column(col_num, col_num, max_len, rank_format)
            elif col_name in ["Round 2 Marks", "Round 3 Marks"]:
                worksheet.set_column(col_num, col_num, max_len + 3, round_manual_cell_format)
            elif "Score" in col_name:
                worksheet.set_column(col_num, col_num, max_len, score_format)
            elif col_name in ["Registration Number", "Aaruush ID", "Phone Number"]:
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
    print(f"[{now_str}] ✓ UPDATED Desktop Excel & CSV with {len(records)} participants (Round 1, Round 2 & Round 3 layout ready)!")
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
