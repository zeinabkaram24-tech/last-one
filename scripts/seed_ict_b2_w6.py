import json
import os

pdf_path = "/assets/aistudio/Weekly_Plan_ICT_-_B2_-_W6-_Minia____082e9157.pdf"

# Classwork Entries for ICT Block 2 Week 6
new_classwork = [
    # G2A: Session 1 (Sunday P4), Session 2 (Tuesday P6), Session 3 (Wednesday P2)
    {
        "id": "cw-b2-w6-g2a-s1-ict",
        "classId": "G2A",
        "day": "Sunday",
        "period": 4,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 1)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet. Please ensure the students bring: ICT sheet, Flash drive.",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2a-s2-ict",
        "classId": "G2A",
        "day": "Tuesday",
        "period": 6,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 2)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2a-s3-ict",
        "classId": "G2A",
        "day": "Wednesday",
        "period": 2,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 3)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },

    # G2B: Session 1 (Sunday P6 - Leadership/ICT), Session 2 (Thursday P1), Session 3 (Thursday P1 or as scheduled) -> Wait, G2B Sunday P6 notes say Leadership / ICT
    {
        "id": "cw-b2-w6-g2b-s1-ict",
        "classId": "G2B",
        "day": "Sunday",
        "period": 6,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 1)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet. Please ensure the students bring: ICT sheet, Flash drive.",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-s2-ict",
        "classId": "G2B",
        "day": "Thursday",
        "period": 1,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 2)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-s3-ict",
        "classId": "G2B",
        "day": "Thursday",
        "period": 1,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 3)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },

    # G2C: Session 1 (Monday P7), Session 2 (Tuesday P1), Session 3 (Thursday P2)
    {
        "id": "cw-b2-w6-g2c-s1-ict",
        "classId": "G2C",
        "day": "Monday",
        "period": 7,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 1)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet. Please ensure the students bring: ICT sheet, Flash drive.",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-s2-ict",
        "classId": "G2C",
        "day": "Tuesday",
        "period": 1,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 2)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-s3-ict",
        "classId": "G2C",
        "day": "Thursday",
        "period": 2,
        "subject": "ICT",
        "lessonTitle": "Communicating with Email / E-safety — Revision (Session 3)",
        "unit": "Block 2: Communicating with Email / E-safety",
        "description": "Revision Sheet",
        "pages": "Revision Sheet",
        "teacher": "Mrs. Abeer Hassan / Ms. Mariam Ahmed",
        "block": 2,
        "week": 6
    }
]

# Special Teacher Notes for Tomorrow View (Supplies reminder: ICT sheet & Flash drive, 1 day before each ICT session)
new_special_notes = [
    # G2A Session 1 is Sunday P4 -> Reminder on Saturday
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
        "week": 6,
        "pdfUrl": pdf_path
    },
    # G2B Session 1 is Sunday P6 (Leadership/ICT) -> Reminder on Saturday
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Sat",
        "classId": "G2B",
        "targetDay": "Sunday",
        "period": 6,
        "subject": "ICT",
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الأحد في الحصة السادسة (حصة Leadership / ICT): يرجى إحضار (ICT sheet - Flash drive) ومراجعة Revision Sheet.",
        "bagItem": "ICT sheet, Flash drive (شيت الـ ICT، الفلاش درايف)",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    # G2C Session 1 is Monday P7 -> Reminder on Sunday
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
        "week": 6,
        "pdfUrl": pdf_path
    }
]

# Update data files
for filepath in ["src/data/initialData.json", "data/planner_data.json"]:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 1. Update Classwork
    cw_map = {c["id"]: c for c in data.get("classwork", [])}
    for item in new_classwork:
        cw_map[item["id"]] = item
    data["classwork"] = list(cw_map.values())

    # 2. Update Special Teacher Notes / Tomorrow Notes
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
    print(f"Successfully updated ICT Block 2 Week 6 in {filepath}")
