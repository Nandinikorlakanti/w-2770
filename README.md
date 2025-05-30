# 🧠 Natural Language Task Manager (AI Task Craftsman)

An enterprise-grade web app that allows users to enter natural language tasks like:

> "Finish landing page Aman by 11pm 20th June"  
> "Call client Rajeev tomorrow 5pm"

The app intelligently parses and displays task details — and with the power of **Gemini 2.0 Flashlight AI**, it enhances interpretation and formatting when the **"Use AI"** checkbox is selected.

---

## 🚀 Features

- ✅ Natural Language Task Parsing
- 🎯 Extracts:
  - Task Name
  - Assignee
  - Due Date & Time
  - Priority (Defaults to P3 unless specified as P1/P2/P4)
- 🧠 Gemini AI Integration (v2.0 Flashlight) for intelligent task breakdown
- ✏️ Inline editing of parsed tasks
- 🎨 Clean and modern UI with task board/list view
- 🧪 Use AI toggle to compare standard vs AI-generated parsing

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/srujana-namburu/ai-task-craftsman.git
cd ai-task-craftsman
npm install
touch .env
GEMINI_API_KEY=your-gemini-api-key-here
npm start
```
