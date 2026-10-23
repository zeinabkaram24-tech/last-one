import json

classes = ["G2A", "G2B", "G2C"]

cw_data = {
    "G2A": [
        {"day": "Sunday", "period": 5, "title": "Unit: At the farm - Farm animals / So do I / I don't", "details": "Unit: At the farm - Farm animals & So do I / I don't (أسماء حيوانات المزرعة والتعبير عن التوافق مع الآراء)", "pages": "CW. 31, 32, 33 / CW. 39"},
        {"day": "Monday", "period": 3, "title": "Unit: At the farm - Listening & Reading", "details": "Unit: At the farm - Listening & Reading (تمارين الاستماع والقراءة بالشيت)", "pages": "CW. 41, 42, 43"},
        {"day": "Tuesday", "period": 7, "title": "Unit: At the farm - Phonetics", "details": "Unit: At the farm - Phonetics (درس الصوتيات والتمارين الصوتية)", "pages": "CW. 35, 36, 37, 38"},
        {"day": "Wednesday", "period": 7, "title": "Unit: At the farm - Kid's Box / Writing", "details": "Unit: At the farm - Kid's Box & Writing (تمارين كتاب النشاط والتدريب على الكتابة)", "pages": "Activity Book 2 p. 48, 49 / CW. 34"},
        {"day": "Thursday", "period": 6, "title": "Unit: At the farm - Kid's Box", "details": "Unit: At the farm - Kid's Box Activity Book exercises", "pages": "Activity Book 2 p. 48, 49"},
    ],
    "G2B": [
        {"day": "Sunday", "period": 1, "title": "Unit: At the farm - Phonetics", "details": "Unit: At the farm - Phonetics (درس الصوتيات والتمارين الصوتية)", "pages": "CW. 35, 36, 37, 38"},
        {"day": "Monday", "period": 5, "title": "Unit: At the farm - Farm animals", "details": "Unit: At the farm - Farm animals (أسماء حيوانات المزرعة وحفظ المفردات)", "pages": "CW. 31, 32, 33"},
        {"day": "Tuesday", "period": 7, "title": "Unit: At the farm - Reading & Listening", "details": "Unit: At the farm - Reading & Listening (تمارين القراءة والاستماع بالشيت)", "pages": "CW. 41, 42, 43"},
        {"day": "Wednesday", "period": 1, "title": "Unit: At the farm - Writing", "details": "Unit: At the farm - Writing (التدريب على الكتابة وتكوين الجمل)", "pages": "CW. 34"},
        {"day": "Thursday", "period": 3, "title": "Unit: At the farm - Kid's Box / So do I / I don't", "details": "Unit: At the farm - Kid's Box & So do I / I don't", "pages": "Activity Book 2 P. 48, 49 / CW. 39"},
    ],
    "G2C": [
        {"day": "Sunday", "period": 1, "title": "Unit: At the farm - Farm animals / So do I / I don't", "details": "Unit: At the farm - Farm animals & So do I / I don't (أسماء حيوانات المزرعة والتعبير عن التوافق مع الآراء)", "pages": "CW. 31, 32, 33 / CW. 39"},
        {"day": "Monday", "period": 6, "title": "Unit: At the farm - Kid's Box", "details": "Unit: At the farm - Kid's Box Activity Book exercises", "pages": "Activity Book 2 p. 48, 49"},
        {"day": "Tuesday", "period": 4, "title": "Unit: At the farm - Phonetics", "details": "Unit: At the farm - Phonetics (درس الصوتيات والتمارين الصوتية)", "pages": "CW. 35, 36, 37, 38"},
        {"day": "Wednesday", "period": 4, "title": "Unit: At the farm - Kid's Box / Writing", "details": "Unit: At the farm - Kid's Box & Writing (تمارين كتاب النشاط والتدريب على الكتابة)", "pages": "Activity Book 2 p. 48, 49 / CW. 34"},
        {"day": "Thursday", "period": 3, "title": "Unit: At the farm - Listening & Reading", "details": "Unit: At the farm - Listening & Reading (تمارين الاستماع والقراءة بالشيت)", "pages": "CW. 41, 42, 43"},
    ]
}

new_cw = []
new_hw = []

for cls in classes:
    for cw in cw_data[cls]:
        day = cw["day"]
        new_cw.append({
            "id": f"cw-b2-w3-{cls.lower()}-{day.lower()}-eng",
            "classId": cls,
            "class_id": cls,
            "day": day,
            "period": cw["period"],
            "subject": "English",
            "title": cw["title"],
            "details": cw["details"],
            "pages": cw["pages"],
            "completed": False,
            "block": 2,
            "week": 3,
        })
        
    # Homework for Monday
    new_hw.append({
        "id": f"hw-b2-w3-{cls.lower()}-mon-eng",
        "classId": cls,
        "class_id": cls,
        "assignedDay": "Monday",
        "assigned_day": "Monday",
        "dueDay": "Tuesday",
        "due_day": "Tuesday",
        "subject": "English",
        "task": "حل تدريبات كتاب النشاط ص 83 (P.83)",
        "details": "Unit: At the farm - Activity Book 2 Page 83",
        "pages": "P.83",
        "completed": False,
        "priority": "normal",
        "block": 2,
        "week": 3,
    })
    
    # Homework for Thursday
    new_hw.append({
        "id": f"hw-b2-w3-{cls.lower()}-thu-eng",
        "classId": cls,
        "class_id": cls,
        "assignedDay": "Thursday",
        "assigned_day": "Thursday",
        "dueDay": "Sunday",
        "due_day": "Sunday",
        "subject": "English",
        "task": "حل تدريبات كتاب النشاط ص 80 (P.80)",
        "details": "Unit: At the farm - Activity Book 2 Page 80",
        "pages": "P.80",
        "completed": False,
        "priority": "normal",
        "block": 2,
        "week": 3,
    })

print(f"Generated {len(new_cw)} Classwork, {len(new_hw)} Homework for English B2W3")

def update_file(path):
    with open(path, "r") as f:
        data = json.load(f)
    
    data["classwork"] = [c for c in data.get("classwork", []) if not (c.get("subject") == "English" and c.get("block") == 2 and c.get("week") == 3)]
    data["homework"] = [h for h in data.get("homework", []) if not (h.get("subject") == "English" and h.get("block") == 2 and h.get("week") == 3)]
    data["tomorrowNotes"] = [t for t in data.get("tomorrowNotes", []) if not (t.get("subject") == "English" and t.get("block") == 2 and t.get("week") == 3)]
    
    data["classwork"].extend(new_cw)
    data["homework"].extend(new_hw)
    
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Successfully updated {path}!")

update_file("data/planner_data.json")
update_file("src/data/initialData.json")
