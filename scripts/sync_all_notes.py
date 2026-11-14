import json
import os

# Clean up G2B and ensure proper targetDays for ICT (Monday for Tuesday session, Wednesday for Thursday session)
# And make sure G2B Saturday -> Sunday has only ONE French dictée note.
new_special_notes = [
    # G2A
    {
        "id": "tn-b2-w6-g2a-wed-french-quiz",
        "classId": "G2A",
        "targetDay": "Wednesday",
        "subject": "French",
        "title": "كويز لغة فرنسية غداً الأربعاء (Quiz)",
        "note": "Quiz de français demain: Révision Unité 4",
        "arabicNote": "🚨 كويز لغة فرنسية غداً الأربعاء: مراجعة Unité 4.",
        "bagItem": "Cahier de classe",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-g2a-tue-french-dictee",
        "classId": "G2A",
        "targetDay": "Tuesday",
        "subject": "French",
        "period": 1,
        "title": "🚨 إملاء لغة فرنسية غداً الثلاثاء (Dictée)",
        "note": "Demain mardi: Dictée de français",
        "arabicNote": "🚨 تنبيه هام غداً الثلاثاء: حصة إملاء (Dictée) في مادة اللغة الفرنسية في الحصة الأولى لكلاس 2A.",
        "bagItem": "Cahier de français",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-social-sheet-G2A-Sunday",
        "classId": "G2A",
        "targetDay": "Sunday",
        "subject": "Social Studies",
        "period": 2,
        "title": "🌍 تسليم شيت واجب الدراسات الاجتماعية (Home Work 5)",
        "note": "تسليم شيت واجب الدراسات الاجتماعية المرفق",
        "arabicNote": "تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق (Home Work 5) وإحضاره للتسليم في الحصة غداً الأحد.",
        "bagItem": "شيت واجب الدراسات الاجتماعية",
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": "/materials/SocialStudies-Grade2-B2-W5-U2-HomeWork5 - Extra- (Minia).pdf"
    },
    {
        "id": "tn-b2-w6-eng-dictation-G2A-Monday",
        "classId": "G2A",
        "targetDay": "Monday",
        "subject": "English",
        "period": 4,
        "title": "🚨 إملاء لغة إنجليزية غداً (Days of the Week)",
        "note": "Listening & Dictation: Days of the Week",
        "arabicNote": "تذكير إملاء لغة إنجليزية غداً الإثنين في الحصة الرابعة: حفظ وكتابة أيام الأسبوع.",
        "bagItem": "English Copybook",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6,
        "pdfUrl": "/assets/aistudio/English_Dictation_Days_Of_The_Week_Page2.pdf"
    },
    {
        "id": "tn-b2-w6-math-test-G2A-Monday",
        "classId": "G2A",
        "targetDay": "Tuesday",
        "subject": "Mathematics",
        "period": 3,
        "title": "🚨 اختبار ماث غداً (Math Test: Test your self - Unit 9)",
        "note": "Math Test (Test your self): Unit 9",
        "arabicNote": "تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء في الحصة الثالثة.",
        "bagItem": "Math Sheet",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2A-Sat",
        "classId": "G2A",
        "targetDay": "Sunday",
        "subject": "ICT",
        "period": 4,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الأحد في الحصة الرابعة: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2A-Mon",
        "classId": "G2A",
        "targetDay": "Tuesday",
        "subject": "ICT",
        "period": 6,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الثلاثاء في الحصة السادسة: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2A-Tue",
        "classId": "G2A",
        "targetDay": "Wednesday",
        "subject": "ICT",
        "period": 2,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الأربعاء في الحصة الثانية: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },

    # G2B
    {
        "id": "tn-b2-w6-g2b-mon-french-quiz",
        "classId": "G2B",
        "targetDay": "Monday",
        "subject": "French",
        "title": "كويز لغة فرنسية غداً الإثنين (Quiz)",
        "note": "Quiz de français demain",
        "arabicNote": "🚨 كويز لغة فرنسية غداً الإثنين.",
        "bagItem": "Cahier de classe",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-g2b-sat-french-dictee",
        "classId": "G2B",
        "targetDay": "Sunday",
        "subject": "French",
        "period": 5,
        "title": "🚨 إملاء لغة فرنسية غداً الأحد (Dictée)",
        "note": "Demain dimanche: Dictée de français",
        "arabicNote": "🚨 تنبيه هام غداً الأحد: حصة إملاء (Dictée) في مادة اللغة الفرنسية في الحصة الخامسة لكلاس 2B.",
        "bagItem": "Cahier de français",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-social-sheet-G2B-Monday",
        "classId": "G2B",
        "targetDay": "Monday",
        "subject": "Social Studies",
        "period": 1,
        "title": "🌍 تسليم شيت واجب الدراسات الاجتماعية (Home Work 5)",
        "note": "تسليم شيت واجب الدراسات الاجتماعية المرفق",
        "arabicNote": "تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق (Home Work 5) وإحضاره للتسليم في الحصة الأولى غداً الإثنين.",
        "bagItem": "شيت واجب الدراسات الاجتماعية",
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": "/materials/SocialStudies-Grade2-B2-W5-U2-HomeWork5 - Extra- (Minia).pdf"
    },
    {
        "id": "tn-b2-w6-eng-dictation-G2B-Tuesday",
        "classId": "G2B",
        "targetDay": "Tuesday",
        "subject": "English",
        "period": 7,
        "title": "🚨 إملاء لغة إنجليزية غداً (Days of the Week)",
        "note": "Listening & Dictation: Days of the Week",
        "arabicNote": "تذكير إملاء لغة إنجليزية غداً الثلاثاء في الحصة السابعة: حفظ وكتابة أيام الأسبوع.",
        "bagItem": "English Copybook",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6,
        "pdfUrl": "/assets/aistudio/English_Dictation_Days_Of_The_Week_Page2.pdf"
    },
    {
        "id": "tn-b2-w6-math-test-G2B-Monday",
        "classId": "G2B",
        "targetDay": "Tuesday",
        "subject": "Mathematics",
        "period": 1,
        "title": "🚨 اختبار ماث غداً (Math Test: Test your self - Unit 9)",
        "note": "Math Test (Test your self): Unit 9",
        "arabicNote": "تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء في الحصة الأولى.",
        "bagItem": "Math Sheet",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Sat",
        "classId": "G2B",
        "targetDay": "Sunday",
        "subject": "ICT",
        "period": 6,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الأحد في الحصة السادسة (حصة Leadership / ICT): يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Mon",
        "classId": "G2B",
        "targetDay": "Tuesday",
        "subject": "ICT",
        "period": 3,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الثلاثاء: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2B-Wed",
        "classId": "G2B",
        "targetDay": "Thursday",
        "subject": "ICT",
        "period": 1,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الخميس في الحصة الأولى: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },

    # G2C
    {
        "id": "tn-b2-w6-g2c-tue-french-quiz",
        "classId": "G2C",
        "targetDay": "Tuesday",
        "subject": "French",
        "title": "كويز لغة فرنسية غداً الثلاثاء (Quiz)",
        "note": "Quiz de français demain",
        "arabicNote": "🚨 كويز لغة فرنسية غداً الثلاثاء.",
        "bagItem": "Cahier de classe",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-g2c-sat-french-dictee",
        "classId": "G2C",
        "targetDay": "Sunday",
        "subject": "French",
        "period": 8,
        "title": "🚨 إملاء لغة فرنسية غداً الأحد (Dictée)",
        "note": "Demain dimanche: Dictée de français",
        "arabicNote": "🚨 تنبيه هام غداً الأحد: حصة إملاء (Dictée) في مادة اللغة الفرنسية في الحصة الثامنة لكلاس 2C.",
        "bagItem": "Cahier de français",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-social-sheet-G2C-Sunday",
        "classId": "G2C",
        "targetDay": "Sunday",
        "subject": "Social Studies",
        "period": 7,
        "title": "🌍 تسليم شيت واجب الدراسات الاجتماعية (Home Work 5)",
        "note": "تسليم شيت واجب الدراسات الاجتماعية المرفق",
        "arabicNote": "تذكير واجب الدراسات الاجتماعية: حل شيت الواجب المرفق (Home Work 5) وإحضاره للتسليم في الحصة غداً الأحد.",
        "bagItem": "شيت واجب الدراسات الاجتماعية",
        "isQuiz": False,
        "categoryType": "note",
        "block": 2,
        "week": 6,
        "pdfUrl": "/materials/SocialStudies-Grade2-B2-W5-U2-HomeWork5 - Extra- (Minia).pdf"
    },
    {
        "id": "tn-b2-w6-eng-dictation-G2C-Wednesday",
        "classId": "G2C",
        "targetDay": "Wednesday",
        "subject": "English",
        "period": 4,
        "title": "🚨 إملاء لغة إنجليزية غداً (Days of the Week)",
        "note": "Listening & Dictation: Days of the Week",
        "arabicNote": "تذكير إملاء لغة إنجليزية غداً الأربعاء في الحصة الرابعة: حفظ وكتابة أيام الأسبوع.",
        "bagItem": "English Copybook",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6,
        "pdfUrl": "/assets/aistudio/English_Dictation_Days_Of_The_Week_Page2.pdf"
    },
    {
        "id": "tn-b2-w6-math-test-G2C-Monday",
        "classId": "G2C",
        "targetDay": "Tuesday",
        "subject": "Mathematics",
        "period": 3,
        "title": "🚨 اختبار ماث غداً (Math Test: Test your self - Unit 9)",
        "note": "Math Test (Test your self): Unit 9",
        "arabicNote": "تذكير هام: اختبار ماث (Math Test - Test your self) غداً الثلاثاء في الحصة الثالثة.",
        "bagItem": "Math Sheet",
        "isQuiz": True,
        "categoryType": "quiz",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2C-Sun",
        "classId": "G2C",
        "targetDay": "Monday",
        "subject": "ICT",
        "period": 7,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الإثنين في الحصة السابعة: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2C-Mon",
        "classId": "G2C",
        "targetDay": "Tuesday",
        "subject": "ICT",
        "period": 1,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الثلاثاء في الحصة الأولى: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    },
    {
        "id": "tn-b2-w6-ict-supplies-G2C-Wed",
        "classId": "G2C",
        "targetDay": "Thursday",
        "subject": "ICT",
        "period": 2,
        "title": "🔌 إحضار أدوات الـ ICT غداً (ICT Sheet & Flash Drive)",
        "note": "Please ensure the students bring: ICT sheet, Flash drive",
        "arabicNote": "تذكير حصة الـ ICT غداً الخميس في الحصة الثانية: يرجى إحضار (ICT sheet - Flash drive).",
        "bagItem": "ICT sheet, Flash drive",
        "isQuiz": False,
        "categoryType": "supplies",
        "block": 2,
        "week": 6
    }
]

for filepath in ["src/data/initialData.json", "data/planner_data.json"]:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Keep only clean non-W6 notes or update W6 notes
    stn_map = {n["id"]: n for n in data.get("specialTeacherNotes", []) if not (n.get("block") == 2 and n.get("week") == 6)}
    for item in new_special_notes:
        stn_map[item["id"]] = item
    data["specialTeacherNotes"] = list(stn_map.values())

    tn_map = {n["id"]: n for n in data.get("tomorrowNotes", []) if not (n.get("block") == 2 and n.get("week") == 6)}
    for item in new_special_notes:
        tn_map[item["id"]] = item
    data["tomorrowNotes"] = list(tn_map.values())

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Cleaned and synchronized block 2 week 6 notes in {filepath}")
