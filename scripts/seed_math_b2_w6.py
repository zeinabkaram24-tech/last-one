import json
import os

pdf_path = "/assets/aistudio/Weekly_Plan_Maths_-_B2_-_W6-_Minia____7223ae39.pdf"

# Classwork Entries for Math Block 2 Week 6
new_classwork = [
    # Sunday 15/11/2026
    {
        "id": "cw-b2-w6-g2a-sun-math",
        "classId": "G2A",
        "day": "Sunday",
        "period": 3,
        "subject": "Mathematics",
        "lessonTitle": "Lesson 2: Check the results of adding two numbers by using subtraction and adding them in a different order",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-sun-math",
        "classId": "G2B",
        "day": "Sunday",
        "period": 2,
        "subject": "Mathematics",
        "lessonTitle": "Lesson 2: Check the results of adding two numbers by using subtraction and adding them in a different order",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-sun-math",
        "classId": "G2C",
        "day": "Sunday",
        "period": 1,
        "subject": "Mathematics",
        "lessonTitle": "Lesson 2: Check the results of adding two numbers by using subtraction and adding them in a different order",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },

    # Monday 16/11/2026
    {
        "id": "cw-b2-w6-g2a-mon-math",
        "classId": "G2A",
        "day": "Monday",
        "period": 8,
        "subject": "Mathematics",
        "lessonTitle": "Lesson 3: Check multiplication facts by reversing the order • Check the result of a division using multiplication",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-mon-math",
        "classId": "G2B",
        "day": "Monday",
        "period": 3,
        "subject": "Mathematics",
        "lessonTitle": "Lesson 3: Check multiplication facts by reversing the order • Check the result of a division using multiplication",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-mon-math",
        "classId": "G2C",
        "day": "Monday",
        "period": 8,
        "subject": "Mathematics",
        "lessonTitle": "Lesson 3: Check multiplication facts by reversing the order • Check the result of a division using multiplication",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },

    # Tuesday 17/11/2026 (Test your self)
    {
        "id": "cw-b2-w6-g2a-tue-math",
        "classId": "G2A",
        "day": "Tuesday",
        "period": 3,
        "subject": "Mathematics",
        "lessonTitle": "Test your self (Math Assessment / Test)",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-tue-math",
        "classId": "G2B",
        "day": "Tuesday",
        "period": 1,
        "subject": "Mathematics",
        "lessonTitle": "Test your self (Math Assessment / Test)",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-tue-math",
        "classId": "G2C",
        "day": "Tuesday",
        "period": 3,
        "subject": "Mathematics",
        "lessonTitle": "Test your self (Math Assessment / Test)",
        "unit": "Unit 9: solving problems",
        "description": "Maths-Grade2-B2-All-Sheet2 – Main",
        "pages": "Maths-Grade2-B2-All-Sheet2 – Main",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },

    # Wednesday 18/11/2026
    {
        "id": "cw-b2-w6-g2a-wed-math",
        "classId": "G2A",
        "day": "Wednesday",
        "period": 1,
        "subject": "Mathematics",
        "lessonTitle": "Revision",
        "unit": "Unit 9: solving problems",
        "description": "Revision sheet",
        "pages": "Revision sheet",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-wed-math",
        "classId": "G2B",
        "day": "Wednesday",
        "period": 5,
        "subject": "Mathematics",
        "lessonTitle": "Revision",
        "unit": "Unit 9: solving problems",
        "description": "Revision sheet",
        "pages": "Revision sheet",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-wed-math",
        "classId": "G2C",
        "day": "Wednesday",
        "period": 7,
        "subject": "Mathematics",
        "lessonTitle": "Revision",
        "unit": "Unit 9: solving problems",
        "description": "Revision sheet",
        "pages": "Revision sheet",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },

    # Thursday 19/11/2026
    {
        "id": "cw-b2-w6-g2a-thu-math",
        "classId": "G2A",
        "day": "Thursday",
        "period": 2,
        "subject": "Mathematics",
        "lessonTitle": "Revision",
        "unit": "Unit 9: solving problems",
        "description": "Revision sheet",
        "pages": "Revision sheet",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-thu-math",
        "classId": "G2B",
        "day": "Thursday",
        "period": 6,
        "subject": "Mathematics",
        "lessonTitle": "Revision",
        "unit": "Unit 9: solving problems",
        "description": "Revision sheet",
        "pages": "Revision sheet",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-thu-math",
        "classId": "G2C",
        "day": "Thursday",
        "period": 6,
        "subject": "Mathematics",
        "lessonTitle": "Revision",
        "unit": "Unit 9: solving problems",
        "description": "Revision sheet",
        "pages": "Revision sheet",
        "teacher": "Mrs. Mariam Samir / Mrs. Sandy Samir",
        "block": 2,
        "week": 6
    }
]

# Homework Entries for Math Block 2 Week 6 (assigned on Tuesday for Pages 112, 113)
new_homework = [
    {
        "id": "hw-b2-w6-g2a-tue-math",
        "classId": "G2A",
        "assignedDay": "Tuesday",
        "dueDay": "Wednesday",
        "subject": "Mathematics",
        "task": "Math Homework — Pages 112 & 113 (Test your self)",
        "pages": "P. 112, 113",
        "details": "Unit 9: Solving problems. Solve exercises on Pages 112 & 113 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2b-tue-math",
        "classId": "G2B",
        "assignedDay": "Tuesday",
        "dueDay": "Wednesday",
        "subject": "Mathematics",
        "task": "Math Homework — Pages 112 & 113 (Test your self)",
        "pages": "P. 112, 113",
        "details": "Unit 9: Solving problems. Solve exercises on Pages 112 & 113 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2c-tue-math",
        "classId": "G2C",
        "assignedDay": "Tuesday",
        "dueDay": "Wednesday",
        "subject": "Mathematics",
        "task": "Math Homework — Pages 112 & 113 (Test your self)",
        "pages": "P. 112, 113",
        "details": "Unit 9: Solving problems. Solve exercises on Pages 112 & 113 in Math sheet (Maths-Grade2-B2-All-Sheet2 - Main).",
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    }
]

# Special Teacher Notes for Tomorrow View (Math Test on Tuesday)
new_special_notes = [
    {
        "id": "tn-b2-w6-math-test-G2A-Monday",
        "classId": "G2A",
        "targetDay": "Tuesday",
        "subject": "Mathematics",
        "period": 3,
        "title": "🚨 اختبار ماث غداً (Math Test: Test your self - Unit 9)",
        "note": "Math Test (Test your self): Unit 9 solving problems (Maths-Grade2-B2-All-Sheet2 - Main)",
        "arabicNote": "تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء في الحصة الثالثة على الوحدة التاسعة (Unit 9: solving problems). يرجى المراجعة والاستعداد.",
        "bagItem": "Math Sheet + Math Notebook / Pencils",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-math-test-G2B-Monday",
        "classId": "G2B",
        "targetDay": "Tuesday",
        "subject": "Mathematics",
        "period": 1,
        "title": "🚨 اختبار ماث غداً (Math Test: Test your self - Unit 9)",
        "note": "Math Test (Test your self): Unit 9 solving problems (Maths-Grade2-B2-All-Sheet2 - Main)",
        "arabicNote": "تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء في الحصة الأولى على الوحدة التاسعة (Unit 9: solving problems). يرجى المراجعة والاستعداد.",
        "bagItem": "Math Sheet + Math Notebook / Pencils",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-math-test-G2C-Monday",
        "classId": "G2C",
        "targetDay": "Tuesday",
        "subject": "Mathematics",
        "period": 3,
        "title": "🚨 اختبار ماث غداً (Math Test: Test your self - Unit 9)",
        "note": "Math Test (Test your self): Unit 9 solving problems (Maths-Grade2-B2-All-Sheet2 - Main)",
        "arabicNote": "تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء في الحصة الثالثة على الوحدة التاسعة (Unit 9: solving problems). يرجى المراجعة والاستعداد.",
        "bagItem": "Math Sheet + Math Notebook / Pencils",
        "isQuiz": True,
        "categoryType": "quiz",
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
    print(f"Successfully updated Math Block 2 Week 6 in {filepath}")
