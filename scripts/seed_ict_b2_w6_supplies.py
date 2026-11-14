import json
import os

# ICT Block 2 Week 6 Special Notes for Tomorrow view (Supplies reminder 1 day before each session, WITHOUT pdfUrl)
new_special_notes = [
    # G2A:
    # 1) Session 1 (Sunday P4) -> reminder on Saturday
    {
        "id": "tn-b2-w6-ict-supplies-G2A-Sat",
        "classId": "G2A",
        "targetDay": "Sunday",
        "subject": "ICT",
        "period": 4,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الأحد في الحصة الرابعة: يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    # 2) Session 2 (Tuesday P6) -> reminder on Monday
    {
        "id": "tn-b2-w6-ict-supplies-G2A-Mon",
        "classId": "G2A",
        "targetDay": "Tuesday",
        "subject": "ICT",
        "period": 6,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الثلاثاء في الحصة السادسة: يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    # 3) Session 3 (Wednesday P2) -> reminder on Tuesday
    {
        "id": "tn-b2-w6-ict-supplies-G2A-Tue",
        "classId": "G2A",
        "targetDay": "Wednesday",
        "subject": "ICT",
        "period": 2,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الأربعاء في الحصة الثانية: يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },

    # G2B:
    # 1) Session 1 (Sunday P6 - Leadership/ICT) -> reminder on Saturday
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Sat",
        "classId": "G2B",
        "targetDay": "Sunday",
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
    # 2) Session 2 (Thursday P1) -> reminder on Wednesday
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
    },
    # 3) Session 3 (Thursday P1 - multiple sessions or consecutive) -> reminder on Wednesday
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Wed-s3",
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
    },

    # G2C:
    # 1) Session 1 (Monday P7) -> reminder on Sunday
    {
        "id": "tn-b2-w6-ict-supplies-G2C-Sun",
        "classId": "G2C",
        "targetDay": "Monday",
        "subject": "ICT",
        "period": 7,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الإثنين في الحصة السابعة: يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    # 2) Session 2 (Tuesday P1) -> reminder on Monday
    {
        "id": "tn-b2-w6-ict-supplies-G2C-Mon",
        "classId": "G2C",
        "targetDay": "Tuesday",
        "subject": "ICT",
        "period": 1,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الثلاثاء في الحصة الأولى: يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    # 3) Session 3 (Thursday P2) -> reminder on Wednesday
    {
        "id": "tn-b2-w6-ict-supplies-G2C-Wed",
        "classId": "G2C",
        "targetDay": "Thursday",
        "subject": "ICT",
        "period": 2,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الخميس في الحصة الثانية: يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
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

    # Clean any pdfUrl from ICT tomorrow notes
    if "specialTeacherNotes" in data:
        for n in data["specialTeacherNotes"]:
            if n.get("subject") == "ICT" and (n.get("block") or 1) == 2 and (n.get("week") or 1) == 6:
                n.pop("pdfUrl", None)
                n.pop("pdf", None)

    if "tomorrowNotes" in data:
        for n in data["tomorrowNotes"]:
            if n.get("subject") == "ICT" and (n.get("block") or 1) == 2 and (n.get("week") or 1) == 6:
                n.pop("pdfUrl", None)
                n.pop("pdf", None)

    # Update or add new special notes
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
    print(f"Successfully updated ICT Block 2 Week 6 tomorrow notes without pdfUrl in {filepath}")
