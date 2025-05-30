# 🧠 AI-Powered Task Management Web App

A smart, enterprise-grade web application that helps teams manage tasks using **natural language inputs** and **AI-powered transcript parsing**. Designed for usability, clarity, and performance.

---

## 🚀 Project Modules

### 1. ✍️ Natural Language Task Manager

Allows users to enter tasks using natural phrases like:
- “Finish landing page Aman by 11pm 20th June”
- “Call client Rajeev tomorrow 5pm”

🔍 **Automatically extracts:**
- **Task Name**: e.g., `Finish landing page`
- **Assignee**: e.g., `Aman`
- **Due Date & Time**: e.g., `11:00 PM, 20 June`
- **Priority**: Defaults to `P3` unless `P1`, `P2`, or `P4` is specified

---

### 2. 🎙️ AI Meeting Minutes to Task Converter

Paste full meeting transcripts like:
> “Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight.”

🔍 **AI Parser extracts all actionable tasks:**
- **Task Description**
- **Assignee**
- **Deadline**
- **Priority** (defaults to `P3`)

---

## ✅ Unified Output Format

All tasks—whether entered manually or extracted from transcripts—are shown in the same task board UI.

| Task                    | Assigned To | Due Date/Time      | Priority |
|-------------------------|-------------|--------------------|----------|
| Finish landing page     | Aman        | 11:00 PM, 20 June  | P3       |
| Client follow-up        | Rajeev      | Wednesday          | P3       |
| Review marketing deck   | Shreya      | Tonight            | P3       |

---

## 🎨 UI Design

- Clean, modern, and responsive UI
- 📋 Task list or board view
- 🎨 Color-coded priority tags (e.g., red for P1, yellow for P2, green for P3)
- 🖥️ Fully responsive: works on mobile, tablet, and desktop
- ✏️ Inline task editing (bonus feature)

---

## 🛠️ Tech Stack

- **Backend**: Python (e.g., Django or Flask)
- **Frontend**: HTML/CSS/JS or React (depending on your setup)
- **AI/NLP**: Custom logic or LLM API for parsing text
- **Database**: SQLite / PostgreSQL / MySQL

---

## 📦 Folder Structure (Example)


---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
2. Create a virtual environment (optional)
python -m venv venv
source venv/bin/activate     # macOS/Linux
venv\Scripts\activate        # Windows
3. Install dependencies
pip install -r requirements.txt
4. Run the app
python manage.py runserver


![image](https://github.com/user-attachments/assets/86525420-a160-4b71-96e0-7feaeca7dbe3)

![image](https://github.com/user-attachments/assets/6d4c57a1-4adf-46cc-ad12-04cd6c77525f)

![image](https://github.com/user-attachments/assets/2727ded6-603b-4059-b178-2ea12e96241c)

![image](https://github.com/user-attachments/assets/6746eba0-9ec2-4d5b-9924-d3ea5fe2a9d1)

![image](https://github.com/user-attachments/assets/8b3e4038-73b9-4682-9ff3-0323cae94947)

![image](https://github.com/user-attachments/assets/b448603f-9522-4100-9442-2e798fa73866)

![image](https://github.com/user-attachments/assets/150b753a-da31-4297-b3e7-894209233dae)

![image](https://github.com/user-attachments/assets/77d98fd1-7e8d-4b12-bdb8-0f1aad855c6c)

![image](https://github.com/user-attachments/assets/1cf638b7-2b5f-486b-bd32-df4408b985c0)


![image](https://github.com/user-attachments/assets/77bda645-a25a-4860-989e-6c01101bf302)
![image](https://github.com/user-attachments/assets/aa5fc423-fc88-41bd-95f2-d4433650f31f)

![image](https://github.com/user-attachments/assets/9eb0d159-9dc1-445f-95f9-1d7dcda1fac3)








