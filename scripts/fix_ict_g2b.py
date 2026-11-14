import json
import os

# Fix G2B ICT supplies note for Sunday session -> targetDay should be Sunday (appearing on Saturday)
# And add G2B Monday ICT supplies note for Tuesday session (appearing on Monday)
new_special_notes = [
    # G2B Session 1 (Sunday P6) -> targetDay Sunday (appears on Saturday)
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Sat",
        "classId": "G2B",
        "targetDay": "Sunday",
        "subject": "ICT",
        "period": 6,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الأحد في الحصة السادسة (حصة Leadership / ICT): يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    # G2B Session 2 & 3 (Thursday P1) -> targetDay Thursday (appears on Wednesday)
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Wed",
        "classId": "G2B",
        "targetDay": "Thursday",
        "subject": "ICT",
        "period": 1,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الخميس في الحصة الأولى: يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    }
]

# Update data files
for filepath in ["src/data/initialData.json", "data/planner_data.json"]:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Ensure ICT notes have correct subject
    if "specialTeacherNotes" in data:
        for n in data["specialTeacherNotes"]:
            if "ict-supplies" in n.get("id", ""):
                n["subject"] = "ICT"

    if "tomorrowNotes" in data:
        for n in data["tomorrowNotes"]:
            if "ict-supplies" in n.get("id", ""):
                n["subject"] = "ICT"

    stn_map = {n["id"]: n for n in data.get("specialTeacherNotes", [])}
    for item in new_special_notes:
        stn_map[item["id"]] = item
    data["specialTeacherNotes"] = list(stn_map.values())

    tn_map = {n["id"]: n for n in data.get("tomorrowNotes", [])}
    for item in new_special_notes:
        tn_map[item["id"]] = item
    data["tomorrowNotes"] = list(tn_map.values())

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Fixed G2B ICT notes in {filepath}")
