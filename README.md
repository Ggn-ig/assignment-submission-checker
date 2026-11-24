# 📚 LPU Assignment Submission Tracker

A clean, responsive, and lightweight web application built specifically for students of **Lovely Professional University (LPU), Punjab** to track Continuous Assessments (CA1, CA2, CA3), Lab Files, and Course Projects.

Built with **plain HTML, CSS, and Vanilla JavaScript** (no frameworks, no npm, no build steps required). All data is saved automatically in `localStorage`.

---

## 🚀 How to Run

1. Clone or download this project folder.
2. Double-click **`index.html`** or right-click and choose **Open with Google Chrome / Microsoft Edge / Firefox**.
3. That's it! No local server or dependencies needed.

---

## ✨ Features

- **🎓 LPU-Themed First-Year Aesthetic**: Authentic student project design with Lovely Professional University orange (`#f58220`), clean card layout, light shadows, and emojis.
- **🌙 Dark Mode**: Seamless toggle between Light Mode and Dark Mode, remembered via `localStorage`.
- **📊 Live Dashboard Statistics**:
  - Total Assignments
  - Pending Submissions
  - Submitted Assignments
  - Overdue Assignments
- **🎯 Dynamic Submission Progress Bar**: Shows the percentage of assignments submitted (turns green upon 100% completion).
- **⏰ 24-Hour "Due Soon" Alert Banner**: Proactively warns students at the top of the screen if any pending assignment has a deadline within the next 24 hours.
- **➕ Add & Edit Assignment Form**:
  - Fields: Subject Name, Course Code (e.g. `CSE121`), Assignment Title, Type (`CA1`, `CA2`, `CA3`, `Lab File`, `Project`, `Other`), Deadline date & time, Priority (`Low`, `Medium`, `High`), and optional Notes.
  - Friendly validation alerts if any required field is omitted.
  - Smooth in-place editing with automatic scroll-to-form.
- **📋 Visual Status Color-Coding**:
  - 🟢 **Green left-border**: Submitted assignments
  - 🟠 **Orange left-border & alert**: Due within 48 hours
  - 🔴 **Red left-border & alert**: Overdue assignments
  - ⚪ **Neutral grey border**: Standard pending assignments
- **⏱️ Live Auto-Updating Countdowns**:
  - Displays readable countdowns (e.g., `⏰ 1 day 4 hrs left` or `⚠️ Overdue by 1 day 2 hrs`).
  - Auto-refreshes every 60 seconds without reloading the page.
- **🔍 Search, Filter & Sort Toolbar**:
  - Search in real-time across titles, subjects, and course codes.
  - Filter by status (`All`, `⏳ Pending`, `✅ Submitted`, `⚠️ Overdue`).
  - Dynamic subject dropdown filter populated automatically from your courses.
  - Sort by deadline (earliest/latest), priority (high to low), or title (A-Z).
- **💾 Local Storage Persistence**: All data stays intact even if you close or refresh the browser.
- **🔄 Sample Data & Reset**: Comes pre-loaded with 5 realistic LPU assignments on initial launch, with quick "Clear All" and "Load Samples" buttons.
- **📱 Responsive Design**: Fully optimized for mobile screens (phones) and desktops/laptops.

---

## 📁 File Structure

```
assignment-submission-checker/
├── index.html     # Semantic structure, layout, and components
├── style.css      # LPU color scheme, cards, badges, dark mode, responsive styles
├── script.js      # LocalStorage handling, CRUD logic, countdowns, filters
└── README.md      # Documentation and run instructions
```

---

## 👨‍💻 Author

Made with ❤️ by **Gagandeep kaur**, B.Tech CSE, Lovely Professional University (LPU).
