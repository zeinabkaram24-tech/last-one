import json
import os

dictation_details = """Words to study:
Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday

Note: Make sure that all the weekdays should start with a capital letter even if they come at the end or in the middle of a sentence.
ملحوظة المعلمة: تأكد من كتابة جميع أيام الأسبوع بحرف كبير (Capital Letter) دائماً في بداية الكلمة حتى لو كانت في وسط أو نهاية الجملة."""

pdf_path = "/assets/aistudio/English_Dictation_Days_Of_The_Week_Page2.pdf"

# Classwork Entries
new_classwork = [
    # Sunday
    {
        "id": "cw-b2-w6-g2a-sun-english",
        "classId": "G2A",
        "day": "Sunday",
        "period": 1,
        "subject": "English",
        "lessonTitle": "Punctuation",
        "unit": "Review",
        "description": "CW. 66,67,68",
        "pages": "CW. 66,67,68",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-sun-english",
        "classId": "G2B",
        "day": "Sunday",
        "period": 1,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra sheet",
        "pages": "Extra sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-sun-english",
        "classId": "G2C",
        "day": "Sunday",
        "period": 4,
        "subject": "English",
        "lessonTitle": "Punctuation",
        "unit": "Review",
        "description": "CW. 66,67,68",
        "pages": "CW. 66,67,68",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },

    # Monday
    {
        "id": "cw-b2-w6-g2a-mon-english",
        "classId": "G2A",
        "day": "Monday",
        "period": 4,
        "subject": "English",
        "lessonTitle": "Listening & Dictation",
        "unit": "Review",
        "description": "CW. 63,64,65, Copy Book (🚨 إملاء أيام الأسبوع Days of the Week)",
        "pages": "CW. 63,64,65",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-mon-english",
        "classId": "G2B",
        "day": "Monday",
        "period": 5,
        "subject": "English",
        "lessonTitle": "Punctuation",
        "unit": "Review",
        "description": "CW. 66,67,68",
        "pages": "CW. 66,67,68",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-mon-english",
        "classId": "G2C",
        "day": "Monday",
        "period": 5,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra Sheet",
        "pages": "Extra Sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },

    # Tuesday
    {
        "id": "cw-b2-w6-g2a-tue-english",
        "classId": "G2A",
        "day": "Tuesday",
        "period": 7,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra Sheet",
        "pages": "Extra Sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-tue-english",
        "classId": "G2B",
        "day": "Tuesday",
        "period": 7,
        "subject": "English",
        "lessonTitle": "Listening & Dictation",
        "unit": "Review",
        "description": "CW. 63,64,65, Copy Book (🚨 إملاء أيام الأسبوع Days of the Week)",
        "pages": "CW. 63,64,65",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-tue-english",
        "classId": "G2C",
        "day": "Tuesday",
        "period": 4,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra Sheet",
        "pages": "Extra Sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },

    # Wednesday
    {
        "id": "cw-b2-w6-g2a-wed-english",
        "classId": "G2A",
        "day": "Wednesday",
        "period": 7,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra Sheet",
        "pages": "Extra Sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-wed-english",
        "classId": "G2B",
        "day": "Wednesday",
        "period": 1,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra sheet",
        "pages": "Extra sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-wed-english",
        "classId": "G2C",
        "day": "Wednesday",
        "period": 4,
        "subject": "English",
        "lessonTitle": "Listening & Dictation",
        "unit": "Review",
        "description": "CW. 63,64,65, Copy Book (🚨 إملاء أيام الأسبوع Days of the Week)",
        "pages": "CW. 63,64,65",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },

    # Thursday
    {
        "id": "cw-b2-w6-g2a-thu-english",
        "classId": "G2A",
        "day": "Thursday",
        "period": 6,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra Sheet",
        "pages": "Extra Sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2b-thu-english",
        "classId": "G2B",
        "day": "Thursday",
        "period": 3,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra sheet",
        "pages": "Extra sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    },
    {
        "id": "cw-b2-w6-g2c-thu-english",
        "classId": "G2C",
        "day": "Thursday",
        "period": 4,
        "subject": "English",
        "lessonTitle": "Revision",
        "unit": "Review",
        "description": "Extra Sheet",
        "pages": "Extra Sheet",
        "teacher": "Ms. Tuqa Mmdouh",
        "block": 2,
        "week": 6
    }
]

# Homework Entries
new_homework = [
    # Monday HW: Activity Book P.93, 94
    {
        "id": "hw-b2-w6-g2a-mon-english",
        "classId": "G2A",
        "assignedDay": "Monday",
        "dueDay": "Thursday",
        "subject": "English",
        "task": "English Homework: Activity Book Pages 93 & 94 📝",
        "pages": "P. 93, 94",
        "details": "Activity Book Pages 93 & 94. Unit: Review.",
        "completed": False,
        "block": 2,
        "week": 6
    },
    {
        "id": "hw-b2-w6-g2b-mon-english",
        "classId": "G2B",
        "assignedDay": "Monday",
        "dueDay": "Thursday",
        "subject": "English",
        "task": "English Homework: Activity Book Pages 93 & 94 📝",
        "pages": "P. 93, 94",
        "details": "Activity Book Pages 93 & 94. Unit: Review.",
        "completed": False,
        "block": 2,
        "week": 6
    },
    {
        "id": "hw-b2-w6-g2c-mon-english",
        "classId": "G2C",
        "assignedDay": "Monday",
        "dueDay": "Thursday",
        "subject": "English",
        "task": "English Homework: Activity Book Pages 93 & 94 📝",
        "pages": "P. 93, 94",
        "details": "Activity Book Pages 93 & 94. Unit: Review.",
        "completed": False,
        "block": 2,
        "week": 6
    },

    # Thursday HW: Activity Book P.91, 92
    {
        "id": "hw-b2-w6-g2a-thu-english",
        "classId": "G2A",
        "assignedDay": "Thursday",
        "dueDay": "Sunday",
        "subject": "English",
        "task": "English Homework: Activity Book Pages 91 & 92 📝",
        "pages": "P. 91, 92",
        "details": "Activity Book Pages 91 & 92. Unit: Review.",
        "completed": False,
        "block": 2,
        "week": 6
    },
    {
        "id": "hw-b2-w6-g2b-thu-english",
        "classId": "G2B",
        "assignedDay": "Thursday",
        "dueDay": "Sunday",
        "subject": "English",
        "task": "English Homework: Activity Book Pages 91 & 92 📝",
        "pages": "P. 91, 92",
        "details": "Activity Book Pages 91 & 92. Unit: Review.",
        "completed": False,
        "block": 2,
        "week": 6
    },
    {
        "id": "hw-b2-w6-g2c-thu-english",
        "classId": "G2C",
        "assignedDay": "Thursday",
        "dueDay": "Sunday",
        "subject": "English",
        "task": "English Homework: Activity Book Pages 91 & 92 📝",
        "pages": "P. 91, 92",
        "details": "Activity Book Pages 91 & 92. Unit: Review.",
        "completed": False,
        "block": 2,
        "week": 6
    },

    # English Dictation tasks for G2A (Dictation on Monday)
    {
        "id": "hw-b2-w6-g2a-sat-english-dictation",
        "classId": "G2A",
        "assignedDay": "Saturday",
        "dueDay": "Monday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي الإثنين)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2a-sun-english-dictation",
        "classId": "G2A",
        "assignedDay": "Sunday",
        "dueDay": "Monday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي غداً الإثنين)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2a-mon-english-dictation",
        "classId": "G2A",
        "assignedDay": "Monday",
        "dueDay": "Monday",
        "subject": "English",
        "task": "🚨 English Dictation: Days of the Week (إملاء الإنجليزي اليوم الإثنين)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },

    # English Dictation tasks for G2B (Dictation on Tuesday)
    {
        "id": "hw-b2-w6-g2b-sat-english-dictation",
        "classId": "G2B",
        "assignedDay": "Saturday",
        "dueDay": "Tuesday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي الثلاثاء)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2b-sun-english-dictation",
        "classId": "G2B",
        "assignedDay": "Sunday",
        "dueDay": "Tuesday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي الثلاثاء)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2b-mon-english-dictation",
        "classId": "G2B",
        "assignedDay": "Monday",
        "dueDay": "Tuesday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي غداً الثلاثاء)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },

    # English Dictation tasks for G2C (Dictation on Wednesday)
    {
        "id": "hw-b2-w6-g2c-sat-english-dictation",
        "classId": "G2C",
        "assignedDay": "Saturday",
        "dueDay": "Wednesday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي الأربعاء)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2c-sun-english-dictation",
        "classId": "G2C",
        "assignedDay": "Sunday",
        "dueDay": "Wednesday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي الأربعاء)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2c-mon-english-dictation",
        "classId": "G2C",
        "assignedDay": "Monday",
        "dueDay": "Wednesday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي الأربعاء)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "hw-b2-w6-g2c-tue-english-dictation",
        "classId": "G2C",
        "assignedDay": "Tuesday",
        "dueDay": "Wednesday",
        "subject": "English",
        "task": "🚨 English Dictation List: Days of the Week (إملاء الإنجليزي غداً الأربعاء)",
        "pages": "Copy Book",
        "details": dictation_details,
        "completed": False,
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },

    # Fix French Dictée for G2A on Sunday & Tuesday
    {
        "id": "hw-b2-w6-g2a-sun-french-dictee",
        "classId": "G2A",
        "assignedDay": "Sunday",
        "dueDay": "Tuesday",
        "subject": "French",
        "task": "🚨 Dictée de français: Préparation à la dictée (إملاء لغة فرنسية الثلاثاء)",
        "pages": "Cahier de classe",
        "details": "Mémoriser les mots de dictée pour mardi.\nمطلوب حفظ كلمات الإملاء للاختبار يوم الثلاثاء الحصة الأولى.",
        "completed": False,
        "block": 2,
        "week": 6
    },
    {
        "id": "hw-b2-w6-g2a-tue-french-dictee",
        "classId": "G2A",
        "assignedDay": "Tuesday",
        "dueDay": "Tuesday",
        "subject": "French",
        "task": "🚨 Dictée de français: Aujourd'hui (إملاء لغة فرنسية اليوم الثلاثاء)",
        "pages": "Cahier de classe",
        "details": "Dictée en classe P1.\nإملاء لغة فرنسية في الحصة الأولى اليوم.",
        "completed": False,
        "block": 2,
        "week": 6
    }
]

# Special Teacher Notes for Tomorrow View
new_special_notes = [
    {
        "id": "tn-b2-w6-eng-dictation-G2A-Monday",
        "classId": "G2A",
        "targetDay": "Monday",
        "subject": "English",
        "period": 4,
        "title": "🚨 إملاء لغة إنجليزية غداً (English Dictation: Days of the Week)",
        "note": "Listening & Dictation: Days of the Week (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday)",
        "arabicNote": "تذكير إملاء لغة إنجليزية غداً الإثنين في الحصة الرابعة: حفظ وكتابة أيام الأسبوع (Days of the Week) مع مراعاة البدء بحرف كبير Capital Letter دائماً.",
        "bagItem": "English Copybook (كشكول الإنجليزي)",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-eng-dictation-G2B-Tuesday",
        "classId": "G2B",
        "targetDay": "Tuesday",
        "subject": "English",
        "period": 7,
        "title": "🚨 إملاء لغة إنجليزية غداً (English Dictation: Days of the Week)",
        "note": "Listening & Dictation: Days of the Week (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday)",
        "arabicNote": "تذكير إملاء لغة إنجليزية غداً الثلاثاء في الحصة السابعة: حفظ وكتابة أيام الأسبوع (Days of the Week) مع مراعاة البدء بحرف كبير Capital Letter دائماً.",
        "bagItem": "English Copybook (كشكول الإنجليزي)",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6,
        "pdfUrl": pdf_path
    },
    {
        "id": "tn-b2-w6-eng-dictation-G2C-Wednesday",
        "classId": "G2C",
        "targetDay": "Wednesday",
        "subject": "English",
        "period": 4,
        "title": "🚨 إملاء لغة إنجليزية غداً (English Dictation: Days of the Week)",
        "note": "Listening & Dictation: Days of the Week (Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday)",
        "arabicNote": "تذكير إملاء لغة إنجليزية غداً الأربعاء في الحصة الرابعة: حفظ وكتابة أيام الأسبوع (Days of the Week) مع مراعاة البدء بحرف كبير Capital Letter دائماً.",
        "bagItem": "English Copybook (كشكول الإنجليزي)",
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

    # 3. Update Special Teacher Notes
    if "specialTeacherNotes" in data:
        stn_map = {n["id"]: n for n in data.get("specialTeacherNotes", [])}
        for item in new_special_notes:
            stn_map[item["id"]] = item
        data["specialTeacherNotes"] = list(stn_map.values())
    else:
        data["specialTeacherNotes"] = new_special_notes

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully updated {filepath}")
