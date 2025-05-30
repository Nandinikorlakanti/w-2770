# 🧠 Natural Language Task Manager (Enterprise-Grade To-Do List)

A smart, enterprise-grade task manager that lets users create tasks using natural language input.

---

## 📌 Objective

Build a web app where users can input tasks like:

- “Finish landing page Aman by 11pm 20th June”
- “Call client Rajeev tomorrow 5pm”

The system parses the input and extracts:
- **Task Name** – e.g., `Finish landing page`
- **Assignee** – e.g., `Aman`
- **Due Date & Time** – e.g., `11:00 PM, 20 June`
- **Priority** – default is `P3` unless explicitly mentioned as `P1`, `P2`, or `P4`

---

## 🛠️ Features

- 📝 Add tasks using natural language
- 🧠 Automatic parsing of task components
- 🧑‍💼 Assign tasks to people
- ⏰ Extract and display due date/time
- 🎯 Priority detection
- 🖼️ Task board with clean UI
- ✏️ Edit tasks inline (Bonus)

---

## 🚀 Setup Instructions

Follow the steps below to set up the project on your local machine.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo

2. Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate     # macOS/Linux
venv\Scripts\activate        # Windows

3. Install dependencies
pip install -r requirements.txt

4. Run the application
python manage.py runserver

🧪 Example Output
| Task                | Assigned To | Due Date/Time     | Priority |
| ------------------- | ----------- | ----------------- | -------- |
| Finish landing page | Aman        | 11:00 PM, 20 June | P3       |
| Call client Rajeev  | Rajeev      | 5:00 PM, Tomorrow | P3       |


✨ Bonus Features

🔄 Edit tasks directly in the UI
🧼 Smart input suggestions
📅 Relative date recognition (e.g., "tomorrow", "next week")
