import json
import os

pdf_path = "/assets/aistudio/Weekly_Plan_Arabic_-_B2_-_W6-_Minia____997f6a56.pdf"

# Classwork Entries for Arabic Block 2 Week 6
new_classwork = [
    # Sunday 15/11/2026
    {
        "id": "cw-b2-w6-g2a-sun-arabic",
        "classId": "G2A",
        "day": "Sunday",
        "period": 7,
        "subject": "Arabic",
        "lessonTitle": "أدوات النفي",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 43+44",
        "pages": "ص 43+44",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-sun-arabic",
        "classId": "G2B",
        "day": "Sunday",
        "period": 4,
        "subject": "Arabic",
        "lessonTitle": "أدوات النفي",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 43+44",
        "pages": "ص 43+44",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-sun-arabic",
        "classId": "G2C",
        "day": "Sunday",
        "period": 6,
        "subject": "Arabic",
        "lessonTitle": "أدوات النفي",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "فيديو تعليمي + أوراق عمل الوحدة الثالثة ص 43+44",
        "pages": "ص 43+44",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },

    # Monday 16/11/2026
    {
        "id": "cw-b2-w6-g2a-mon-arabic",
        "classId": "G2A",
        "day": "Monday",
        "period": 1,
        "subject": "Arabic",
        "lessonTitle": "مراجعة المثنى + حل تدريبات",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "كراسة الطالب + أوراق عمل الوحدة الثالثة ص 46-47-48-49",
        "pages": "ص 46-47-48-49",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-mon-arabic",
        "classId": "G2B",
        "day": "Monday",
        "period": 8,
        "subject": "Arabic",
        "lessonTitle": "مراجعة المثنى + حل تدريبات",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "كراسة الطالب + أوراق عمل الوحدة الثالثة ص 46-47-48-49",
        "pages": "ص 46-47-48-49",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-mon-arabic",
        "classId": "G2C",
        "day": "Monday",
        "period": 1,
        "subject": "Arabic",
        "lessonTitle": "مراجعة المثنى + حل تدريبات",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "كراسة الطالب + أوراق عمل الوحدة الثالثة ص 46-47-48-49",
        "pages": "ص 46-47-48-49",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },

    # Tuesday 17/11/2026
    {
        "id": "cw-b2-w6-g2a-tue-arabic",
        "classId": "G2A",
        "day": "Tuesday",
        "period": 8,
        "subject": "Arabic",
        "lessonTitle": "نشاط تطبيقي",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "أوراق العمل",
        "pages": "أوراق العمل",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-tue-arabic",
        "classId": "G2B",
        "day": "Tuesday",
        "period": 4,
        "subject": "Arabic",
        "lessonTitle": "نشاط تطبيقي",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "أوراق العمل",
        "pages": "أوراق العمل",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-tue-arabic",
        "classId": "G2C",
        "day": "Tuesday",
        "period": 7,
        "subject": "Arabic",
        "lessonTitle": "نشاط تطبيقي",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "أوراق العمل",
        "pages": "أوراق العمل",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },

    # Wednesday 18/11/2026
    {
        "id": "cw-b2-w6-g2a-wed-arabic",
        "classId": "G2A",
        "day": "Wednesday",
        "period": 6,
        "subject": "Arabic",
        "lessonTitle": "قراءة النشيد",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "أوراق عمل الوحدة الثالثة ص 50-51",
        "pages": "ص 50-51",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-wed-arabic",
        "classId": "G2B",
        "day": "Wednesday",
        "period": 4,
        "subject": "Arabic",
        "lessonTitle": "قراءة النشيد",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "أوراق عمل الوحدة الثالثة ص 50-51",
        "pages": "ص 50-51",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-wed-arabic",
        "classId": "G2C",
        "day": "Wednesday",
        "period": 6,
        "subject": "Arabic",
        "lessonTitle": "قراءة النشيد",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "أوراق عمل الوحدة الثالثة ص 50-51",
        "pages": "ص 50-51",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },

    # Thursday 19/11/2026
    {
        "id": "cw-b2-w6-g2a-thu-arabic",
        "classId": "G2A",
        "day": "Thursday",
        "period": 5,
        "subject": "Arabic",
        "lessonTitle": "نشاط للاحتفال بعيد الطفولة",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "نشاط خارج الصف",
        "pages": "نشاط خارج الصف",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-thu-arabic",
        "classId": "G2B",
        "day": "Thursday",
        "period": 8,
        "subject": "Arabic",
        "lessonTitle": "نشاط للاحتفال بعيد الطفولة",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "نشاط خارج الصف",
        "pages": "نشاط خارج الصف",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-thu-arabic",
        "classId": "G2C",
        "day": "Thursday",
        "period": 7,
        "subject": "Arabic",
        "lessonTitle": "نشاط للاحتفال بعيد الطفولة",
        "unit": "الوحدة الثالثة: (التسوق)",
        "description": "نشاط خارج الصف",
        "pages": "نشاط خارج الصف",
        "teacher": "أ/ مروة ممدوح",
        "block": 2,
        "week": 6
    }
]

# Homework Entries for Arabic Block 2 Week 6
new_homework = [
    # Sunday Homework: كراسة التكليفات المنزلية ص63-64
    {
        "id": "hw-b2-w6-g2a-sun-arabic",
        "classId": "G2A",
        "assignedDay": "Sunday",
        "dueDay": "Monday",
        "subject": "Arabic",
        "task": "لغة عربية: كراسة التكليفات المنزلية ص 63-64 📝",
        "pages": "ص 63-64",
        "details": "الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 63-64.",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2b-sun-arabic",
        "classId": "G2B",
        "assignedDay": "Sunday",
        "dueDay": "Monday",
        "subject": "Arabic",
        "task": "لغة عربية: كراسة التكليفات المنزلية ص 63-64 📝",
        "pages": "ص 63-64",
        "details": "الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 63-64.",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2c-sun-arabic",
        "classId": "G2C",
        "assignedDay": "Sunday",
        "dueDay": "Monday",
        "subject": "Arabic",
        "task": "لغة عربية: كراسة التكليفات المنزلية ص 63-64 📝",
        "pages": "ص 63-64",
        "details": "الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 63-64.",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },

    # Tuesday Homework: كراسة التكليفات المنزلية ص 65
    {
        "id": "hw-b2-w6-g2a-tue-arabic",
        "classId": "G2A",
        "assignedDay": "Tuesday",
        "dueDay": "Wednesday",
        "subject": "Arabic",
        "task": "لغة عربية: كراسة التكليفات المنزلية ص 65 📝",
        "pages": "ص 65",
        "details": "الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 65.",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2b-tue-arabic",
        "classId": "G2B",
        "assignedDay": "Tuesday",
        "dueDay": "Wednesday",
        "subject": "Arabic",
        "task": "لغة عربية: كراسة التكليفات المنزلية ص 65 📝",
        "pages": "ص 65",
        "details": "الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 65.",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2c-tue-arabic",
        "classId": "G2C",
        "assignedDay": "Tuesday",
        "dueDay": "Wednesday",
        "subject": "Arabic",
        "task": "لغة عربية: كراسة التكليفات المنزلية ص 65 📝",
        "pages": "ص 65",
        "details": "الوحدة الثالثة: (التسوق) - حل تدريبات كراسة التكليفات المنزلية ص 65.",
        "completed": False,
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

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully updated Arabic Block 2 Week 6 in {filepath}")
