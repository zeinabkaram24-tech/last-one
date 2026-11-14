import json
import os

pdf_path = "/assets/aistudio/Weekly_Plan_Science_-_B2_-_W6-_Minia____077636a0.pdf"

project_note_title = "🧪 مشروع العلوم (Science Project: Unit 3 - Rocks)"
project_note_arabic = "تذكير مشروع الساينس: مطلوب إعداد مشروع مادة العلوم عن الوحدة الثالثة (Unit 3: Rocks). موعد تسليم المشروع يوم الخميس القادم 19 نوفمبر. يرجى اختيار مشروع واحد فقط من ملف الأفكار المقترحة المرفق."
project_bagItem = "مشروع الساينس (Unit 3: Rocks project)"

# Classwork Entries for Science Block 2 Week 6
new_classwork = [
    # Sunday 15/11/2026: G2A (P6), G2B (P5), G2C (P3)
    {
        "id": "cw-b2-w6-g2a-sun-science",
        "classId": "G2A",
        "day": "Sunday",
        "period": 6,
        "subject": "Science",
        "lessonTitle": "A-C: The Magnets",
        "unit": "Unit 4: Exploring and using materials",
        "description": "A-C: page : 50",
        "pages": "page : 50",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-sun-science",
        "classId": "G2B",
        "day": "Sunday",
        "period": 5,
        "subject": "Science",
        "lessonTitle": "B : What is a mixture",
        "unit": "Unit 4: Exploring and using materials",
        "description": "A-C: page : 50",
        "pages": "page : 50",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-sun-science",
        "classId": "G2C",
        "day": "Sunday",
        "period": 3,
        "subject": "Science",
        "lessonTitle": "A-C: The Magnets",
        "unit": "Unit 4: Exploring and using materials",
        "description": "A-C: page : 50",
        "pages": "page : 50",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },

    # Monday 16/11/2026: G2C (P4)
    {
        "id": "cw-b2-w6-g2c-mon-science",
        "classId": "G2C",
        "day": "Monday",
        "period": 4,
        "subject": "Science",
        "lessonTitle": "What is a mixture",
        "unit": "Unit 4: Exploring and using materials",
        "description": "Classwork session",
        "pages": "Unit 4",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },

    # Tuesday 17/11/2026: G2A (P5)
    {
        "id": "cw-b2-w6-g2a-tue-science",
        "classId": "G2A",
        "day": "Tuesday",
        "period": 5,
        "subject": "Science",
        "lessonTitle": "What is a mixture",
        "unit": "Unit 4: Exploring and using materials",
        "description": "Classwork session",
        "pages": "Unit 4",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },

    # Wednesday 18/11/2026: G2B (P7)
    {
        "id": "cw-b2-w6-g2b-wed-science",
        "classId": "G2B",
        "day": "Wednesday",
        "period": 7,
        "subject": "Science",
        "lessonTitle": "Sieving",
        "unit": "Unit 4: Exploring and using materials",
        "description": "Page : 54. An Extra sheet uploaded on Edumaster",
        "pages": "Page : 54",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },

    # Thursday 19/11/2026: G2A (P8), G2B (P7), G2C (P1)
    {
        "id": "cw-b2-w6-g2a-thu-science",
        "classId": "G2A",
        "day": "Thursday",
        "period": 8,
        "subject": "Science",
        "lessonTitle": "A-C: Sieving",
        "unit": "Unit 4: Exploring and using materials",
        "description": "A-C: page : 54",
        "pages": "page : 54",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-thu-science",
        "classId": "G2B",
        "day": "Thursday",
        "period": 7,
        "subject": "Science",
        "lessonTitle": "B: Heat changes Materials",
        "unit": "Unit 4: Exploring and using materials",
        "description": "B: page: 55",
        "pages": "page: 55",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-thu-science",
        "classId": "G2C",
        "day": "Thursday",
        "period": 1,
        "subject": "Science",
        "lessonTitle": "A-C: Sieving",
        "unit": "Unit 4: Exploring and using materials",
        "description": "A-C: page : 54",
        "pages": "page : 54",
        "teacher": "Mrs. Salma Ahmed",
        "block": 2,
        "week": 6
    }
]

# Homework for Science Block 2 Week 6 (Wednesday G2B extra sheet)
new_homework = [
    {
        "id": "hw-b2-w6-g2b-wed-science",
        "classId": "G2B",
        "assignedDay": "Wednesday",
        "dueDay": "Thursday",
        "subject": "Science",
        "task": "Science Homework: Extra sheet on Edumaster (Sieving) 📝",
        "pages": "Extra sheet",
        "details": "Solve exercises on the extra sheet uploaded on Edumaster regarding Sieving.",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    }
]

# Special Teacher Notes for Tomorrow View (Science Notes / Project reminder before each Science class for all classes)
# G2A Science: Sunday P6, Tuesday P5, Thursday P8
# G2B Science: Sunday P5, Wednesday P7, Thursday P7
# G2C Science: Sunday P3, Monday P4, Thursday P1
new_special_notes = [
    # G2A
    {
        "id": "tn-b2-w6-science-G2A-Sat",
        "classId": "G2A",
        "targetDay": "Sunday",
        "subject": "Science",
        "period": 6,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-science-G2A-Mon",
        "classId": "G2A",
        "targetDay": "Tuesday",
        "subject": "Science",
        "period": 5,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-science-G2A-Wed",
        "classId": "G2A",
        "targetDay": "Thursday",
        "subject": "Science",
        "period": 8,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },

    # G2B
    {
        "id": "tn-b2-w6-science-G2B-Sat",
        "classId": "G2B",
        "targetDay": "Sunday",
        "subject": "Science",
        "period": 5,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-science-G2B-Tue",
        "classId": "G2B",
        "targetDay": "Wednesday",
        "subject": "Science",
        "period": 7,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-science-G2B-Wed",
        "classId": "G2B",
        "targetDay": "Thursday",
        "subject": "Science",
        "period": 7,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },

    # G2C
    {
        "id": "tn-b2-w6-science-G2C-Sat",
        "classId": "G2C",
        "targetDay": "Sunday",
        "subject": "Science",
        "period": 3,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-science-G2C-Sun",
        "classId": "G2C",
        "targetDay": "Monday",
        "subject": "Science",
        "period": 4,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-science-G2C-Wed",
        "classId": "G2C",
        "targetDay": "Thursday",
        "subject": "Science",
        "period": 1,
        "title": project_note_title,
        "note": "Science Project about Unit 3: Rocks. Deadline Thursday Nov 19th.",
        "arabicNote": project_note_arabic,
        "bagItem": project_bagItem,
        "isQuiz": False,
        "categoryType": "note",
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

    # 2. Update Homework
    hw_map = {h["id"]: h for h in data.get("homework", [])}
    for item in new_homework:
        hw_map[item["id"]] = item
    data["homework"] = list(hw_map.values())

    # 3. Update Special Teacher Notes / Tomorrow Notes
    stn_map = {n["id"]: n for n in data.get("specialTeacherNotes", []) if not (n.get("subject") == "Science" and n.get("block") == 2 and n.get("week") == 6)}
    for item in new_special_notes:
        stn_map[item["id"]] = item
    data["specialTeacherNotes"] = list(stn_map.values())

    tn_map = {n["id"]: n for n in data.get("tomorrowNotes", []) if not (n.get("subject") == "Science" and n.get("block") == 2 and n.get("week") == 6)}
    for item in new_special_notes:
        tn_map[item["id"]] = item
    data["tomorrowNotes"] = list(tn_map.values())

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully updated Science Block 2 Week 6 in {filepath}")
