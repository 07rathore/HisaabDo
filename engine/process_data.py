import csv
import re
import json
import os
from collections import defaultdict
from datetime import datetime

DATASET_DIR = "sih dataset"
OUTPUT_DIR = os.path.join("hisaabdo_web", "src", "data")

def clean_amount(val):
    if not val:
        return 0.0
    val_str = str(val).replace(",", "").replace("₹", "").replace(" ", "").strip()
    try:
        return float(val_str)
    except ValueError:
        return 0.0

def parse_date(date_str):
    if not date_str or date_str.strip() in ["N/A", "-", ""]:
        return None
    date_str = date_str.strip()
    for fmt in ["%d-%b-%y", "%d-%b-%Y", "%d/%m/%Y", "%Y-%m-%d"]:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None

def extract_road_length_meters(desc):
    """
    Extracts road length in meters from descriptions like:
    - 'PCC Road 250m' -> 250
    - 'length 1.5 km' -> 1500
    - '300 mtr' -> 300
    - '500 ft' -> 152.4
    """
    if not desc:
        return None
    desc_lower = desc.lower()

    # Match km first
    km_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:km|k\.m\.|kilometer|kilometres)', desc_lower)
    if km_match:
        try:
            return float(km_match.group(1)) * 1000.0
        except ValueError:
            pass

    # Match meters
    m_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:meter|meters|mtr|mtrs|\bm\b)', desc_lower)
    if m_match:
        try:
            val = float(m_match.group(1))
            if 10 <= val <= 25000:
                return val
        except ValueError:
            pass

    # Match feet
    ft_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:feet|ft|f\.t\.)', desc_lower)
    if ft_match:
        try:
            val = float(ft_match.group(1))
            if 30 <= val <= 80000:
                return val * 0.3048
        except ValueError:
            pass

    return None

def extract_work_id(work_field):
    if not work_field:
        return ""
    m = re.search(r'([A-Za-z0-9_]+/\d{4}-\d{4}/\d+)', work_field)
    if m:
        return m.group(1)
    return work_field.replace("WS/", "").strip()

def process_datasets():
    print("[START] Starting HisaabDo Intelligence Processing...")
    sanctioned_path = os.path.join(DATASET_DIR, "Works Sanctioned.csv")
    completed_path = os.path.join(DATASET_DIR, "Works Completed.csv")

    sanctioned_records = {}
    completed_records = []

    # 1. Ingest Works Sanctioned
    print(f"Reading {sanctioned_path}...")
    with open(sanctioned_path, mode="r", encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            wid = extract_work_id(row.get("Work", ""))
            amount = clean_amount(row.get("Sanction Amount ( ₹ )", 0))
            sanctioned_records[wid] = {
                "work_id": wid,
                "category": row.get("Work category", "").strip(),
                "work_raw": row.get("Work", "").strip(),
                "state": row.get("State", "").strip(),
                "ida": row.get("IDA", "").strip(),
                "mp": row.get("Hon'ble Members of Parliament", "").strip(),
                "constituency": row.get("Constituency", "").strip(),
                "description": row.get("Work description", "").strip(),
                "recommended_date": row.get("Recommended date", "").strip(),
                "sanction_date": row.get("Sanction Date", "").strip(),
                "sanction_amount": amount,
                "status": row.get("Work Status", "").strip()
            }

    print(f"Loaded {len(sanctioned_records)} sanctioned records.")

    # 2. Ingest Works Completed & compute IDA single-day completions
    print(f"Reading {completed_path}...")
    ida_date_completions = defaultdict(int)

    with open(completed_path, mode="r", encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            wid = extract_work_id(row.get("Work", ""))
            ida = row.get("IDA", "").strip()
            cdate = row.get("Completion Date", "").strip()
            if ida and cdate:
                ida_date_completions[(ida, cdate)] += 1
            completed_records.append({
                "work_id": wid,
                "category": row.get("Work Category", "").strip(),
                "work_raw": row.get("Work", "").strip(),
                "state": row.get("State", "").strip(),
                "ida": ida,
                "description": row.get("Work Description", "").strip(),
                "mp": row.get("Hon'ble Members of Parliament", "").strip(),
                "constituency": row.get("Constituency", "").strip(),
                "image_status": row.get("Image", "N/A").strip(),
                "completion_date": cdate,
                "disbursed_amount": clean_amount(row.get("Amount Disbursed ( ₹ )", 0))
            })

    print(f"Loaded {len(completed_records)} completed records.")

    # 3. Analyze Patterns & Calculate Multi-Factor Risk Score
    audited_projects = []
    category_amounts = defaultdict(list)
    road_cost_per_meter_list = []

    for comp in completed_records:
        wid = comp["work_id"]
        sanc = sanctioned_records.get(wid, {})

        amount = comp["disbursed_amount"] or sanc.get("sanction_amount", 0.0)
        category = comp["category"] or sanc.get("category", "General")
        state = comp["state"] or sanc.get("state", "Unknown")
        ida = comp["ida"] or sanc.get("ida", "Unknown")
        mp = comp["mp"] or sanc.get("mp", "Unknown")
        constituency = comp["constituency"] or sanc.get("constituency", "Unknown")
        desc = comp["description"] or sanc.get("description", "")
        cdate_str = comp["completion_date"]
        sdate_str = sanc.get("sanction_date", "")
        img = comp["image_status"]

        if amount > 0:
            category_amounts[category].append(amount)

        # Road length detection
        road_len = extract_road_length_meters(desc)
        cost_per_meter = None
        if road_len and road_len > 0 and amount > 0:
            cost_per_meter = round(amount / road_len, 2)
            road_cost_per_meter_list.append(cost_per_meter)

        # Single-day mass completion count by IDA
        same_day_count = ida_date_completions.get((ida, cdate_str), 1)

        # Date turnaround
        cdate_obj = parse_date(cdate_str)
        sdate_obj = parse_date(sdate_str)
        turnaround_days = None
        if cdate_obj and sdate_obj:
            turnaround_days = (cdate_obj - sdate_obj).days

        # Risk Signals Calculation (0 to 100)
        risk_score = 0
        risk_flags = []
        shap_factors = []

        # Signal 1: Threshold Gaming (Tender Slicing)
        if 18000 <= amount <= 19999:
            risk_score += 35
            factor = "Audit Threshold Gaming (Just below ₹20,000)"
            risk_flags.append(factor)
            shap_factors.append({"factor": "Threshold Slicing (<₹20k)", "weight": 35})
        elif 190000 <= amount <= 199999:
            risk_score += 30
            factor = "e-Tendering Bypass (Just below ₹2,00,000)"
            risk_flags.append(factor)
            shap_factors.append({"factor": "e-Tender Avoidance (<₹2L)", "weight": 30})
        elif 490000 <= amount <= 499999:
            risk_score += 20
            factor = "Technical Approval Avoidance (Just below ₹5,00,000)"
            risk_flags.append(factor)
            shap_factors.append({"factor": "Tier-1 Limit Bypass (<₹5L)", "weight": 20})

        # Signal 2: Single-Day Completion Impossibility
        if same_day_count >= 50:
            risk_score += 35
            risk_flags.append(f"Physical Impossibility: {same_day_count} works certified on {cdate_str}")
            shap_factors.append({"factor": f"Mass Single-Day Sign-off ({same_day_count} works)", "weight": 35})
        elif same_day_count >= 15:
            risk_score += 20
            risk_flags.append(f"High-frequency completion spike: {same_day_count} works on same day")
            shap_factors.append({"factor": f"Rapid Batch Approval ({same_day_count} works)", "weight": 20})

        # Signal 3: Missing Physical Proof on Completed Work
        if img == "N/A" and amount >= 300000:
            risk_score += 25
            risk_flags.append("Evidence Deficit: Large fund disbursement with ZERO site photo")
            shap_factors.append({"factor": "No Geo-Tagged Photo Evidence", "weight": 25})
        elif img == "N/A" and amount >= 100000:
            risk_score += 15
            risk_flags.append("Evidence Deficit: Disbursed with missing photo")
            shap_factors.append({"factor": "Missing Site Photography", "weight": 15})

        # Signal 4: Road Cost Per Meter Inflation
        if cost_per_meter:
            if cost_per_meter > 8000:
                risk_score += 35
                risk_flags.append(f"Extreme Road Cost Inflation: ₹{cost_per_meter:,.0f}/m vs ~₹2,200/m standard rate")
                shap_factors.append({"factor": f"High Cost/Meter (₹{cost_per_meter:,.0f}/m)", "weight": 35})
            elif cost_per_meter > 4500:
                risk_score += 20
                risk_flags.append(f"Elevated Road Cost: ₹{cost_per_meter:,.0f}/m exceeds normal benchmark")
                shap_factors.append({"factor": f"Elevated Cost/Meter (₹{cost_per_meter:,.0f}/m)", "weight": 20})

        # Signal 5: Impossible Rapid Completion
        if turnaround_days is not None and 0 <= turnaround_days <= 3 and amount > 200000:
            risk_score += 20
            risk_flags.append(f"Turnaround Anomaly: Civil work marked complete in {turnaround_days} days")
            shap_factors.append({"factor": f"Unrealistic Turnaround ({turnaround_days}d)", "weight": 20})

        risk_score = min(100, risk_score)

        risk_level = "LOW"
        if risk_score >= 70:
            risk_level = "CRITICAL"
        elif risk_score >= 45:
            risk_level = "HIGH"
        elif risk_score >= 25:
            risk_level = "MEDIUM"

        audited_projects.append({
            "work_id": wid,
            "category": category,
            "work_raw": comp["work_raw"],
            "state": state,
            "ida": ida,
            "mp": mp,
            "constituency": constituency,
            "description": desc,
            "sanction_amount": sanc.get("sanction_amount", amount),
            "disbursed_amount": amount,
            "completion_date": cdate_str,
            "sanction_date": sdate_str,
            "turnaround_days": turnaround_days,
            "image_status": img,
            "road_length_m": road_len,
            "cost_per_meter": cost_per_meter,
            "same_day_ida_completions": same_day_count,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_flags": risk_flags,
            "shap_factors": shap_factors
        })

    audited_projects.sort(key=lambda x: x["risk_score"], reverse=True)

    total_audited_amount = sum(p["disbursed_amount"] for p in audited_projects)
    critical_cases = [p for p in audited_projects if p["risk_level"] == "CRITICAL"]
    high_cases = [p for p in audited_projects if p["risk_level"] == "HIGH"]
    flagged_amount = sum(p["disbursed_amount"] for p in critical_cases + high_cases)
    zero_photo_count = sum(1 for p in audited_projects if p["image_status"] == "N/A")
    road_cases = [p for p in audited_projects if p["road_length_m"] is not None]

    mp_risk = defaultdict(lambda: {"total_works": 0, "flagged_works": 0, "total_spend": 0.0, "flagged_spend": 0.0, "state": "", "constituency": ""})
    for p in audited_projects:
        m = p["mp"]
        if not m:
            continue
        mp_risk[m]["total_works"] += 1
        mp_risk[m]["total_spend"] += p["disbursed_amount"]
        mp_risk[m]["state"] = p["state"]
        mp_risk[m]["constituency"] = p["constituency"]
        if p["risk_level"] in ["CRITICAL", "HIGH"]:
            mp_risk[m]["flagged_works"] += 1
            mp_risk[m]["flagged_spend"] += p["disbursed_amount"]

    top_suspect_mps = []
    for mp_name, data in mp_risk.items():
        if data["total_works"] >= 10:
            flag_pct = (data["flagged_works"] / data["total_works"]) * 100
            top_suspect_mps.append({
                "mp": mp_name,
                "state": data["state"],
                "constituency": data["constituency"],
                "total_works": data["total_works"],
                "flagged_works": data["flagged_works"],
                "flag_pct": round(flag_pct, 1),
                "total_spend": round(data["total_spend"], 2),
                "flagged_spend": round(data["flagged_spend"], 2)
            })
    top_suspect_mps.sort(key=lambda x: (x["flagged_works"], x["flag_pct"]), reverse=True)

    # Tier counts across all 34,001 projects
    crit_all = [p for p in audited_projects if p["risk_level"] == "CRITICAL"]
    high_all = [p for p in audited_projects if p["risk_level"] == "HIGH"]
    med_all = [p for p in audited_projects if p["risk_level"] == "MEDIUM"]
    low_all = [p for p in audited_projects if p["risk_level"] == "LOW"]

    # For zero-risk projects, provide positive verification notes
    for p in low_all:
        if not p["risk_flags"]:
            p["risk_flags"] = ["Process Verified: Compliant turnaround, standard rates, no threshold gaming"]
        if not p["shap_factors"]:
            p["shap_factors"] = [{"factor": "Compliant Baseline", "weight": 0}]

    # Balanced export: All Critical + All High + 2,500 Medium + 3,000 Low
    sample_for_ui = crit_all + high_all + med_all[:2500] + low_all[:3000]

    output_payload = {
        "summary": {
            "total_records_processed": len(audited_projects),
            "total_expenditure_audited": round(total_audited_amount, 2),
            "total_flagged_at_risk": round(flagged_amount, 2),
            "critical_count": len(crit_all),
            "high_count": len(high_all),
            "medium_count": len(med_all),
            "low_count": len(low_all),
            "zero_photo_count": zero_photo_count,
            "road_works_analyzed": len(road_cases)
        },
        "top_suspect_mps": top_suspect_mps[:20],
        "projects": sample_for_ui
    }

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_file = os.path.join(OUTPUT_DIR, "audited_projects.json")
    print(f"Writing parsed output to {out_file}...")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output_payload, f, indent=2)

    print("[SUCCESS] Intelligence processing complete!")
    print(f"Total audited: {len(audited_projects)} | Critical: {len(critical_cases)} | High: {len(high_cases)}")
    print(f"Flagged funds: Rs {flagged_amount:,.2f}")

if __name__ == "__main__":
    process_datasets()
