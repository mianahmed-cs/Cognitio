# Cognitio — Smart Academic & Study Planner

> **Faculty of Information & Technology**  
> **Course:** Web Technologies (BS CS F24 – Morning & Self Support)  
> **Author:** Mian Ahmed  
> **Assignment:** 01 — Multi-Page Static Website  
> **GitHub Repository:** [https://github.com/mianahmed-cs/Cognitio](https://github.com/mianahmed-cs/Cognitio)

---

## 1. Project Overview

**Cognitio** is a multi-page, static academic productivity and study suite designed for Computer Science students. Built entirely with **semantic HTML5, modern CSS3, and vanilla JavaScript**, the project draws visual inspiration from the clean **Apple.com design language** (white light background, dark frosted-glass navigation bar, clean typography, pill-shaped buttons, and rounded cards).

The code is intentionally written to be **clean, modular, and easy to reverse engineer**, making every function and style self-explanatory and straightforward to defend during a Viva Voce examination.

---

## 2. Assignment 01 Compliance Checklist

| Requirement | Implementation in Cognitio |
|---|---|
| **Static Website (HTML, CSS, JS only)** | Pure client-side static application. No backend, Node server, database, or external frameworks. |
| **Multi-Page Website (4–5 pages)** | 5 fully interlinked semantic pages: `index.html`, `about.html`, `planner.html`, `timer.html`, `contact.html`. |
| **Semantic HTML5** | Comprehensive use of `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<form>`, `<ul>`, and `<li>`. |
| **Organized CSS** | `css/style.css` (clean tokens, typography, layout, components) and `css/responsive.css` (adaptive media queries). |
| **Flexbox & CSS Grid** | Flexbox for header, navbar, controls, and task rows; CSS Grid for cards (`.grid-2`, `.grid-3`). |
| **Responsive Design** | Custom media queries adapting seamlessly to desktop (>768px), tablet (768px), and mobile (<480px) viewports. |
| **JavaScript Interactivity** | Dynamic course manager, task sprint checklist, Pomodoro countdown engine, client-side regex form validation, interactive study technique switcher, and mobile navigation drawer. |
| **Git & Version Control** | Disciplined feature-branch workflow merged into `main` with professional, descriptive commit messages. |

---

## 3. Project Directory Structure

```
Cognitio/
├── index.html               # Home portal (Hero section, core features overview, quick actions)
├── about.html               # Cognitive Science & Interactive Technique Tab Switcher
├── planner.html             # Dynamic Course Manager (starts empty) & Task Sprint Checklist
├── timer.html               # Pomodoro Focus Hub (25m / 5m / 15m digital countdown)
├── contact.html             # Helpdesk with Client-Side Form Validation & Accordion FAQ
├── css/
│   ├── style.css            # Master stylesheet (~370 lines of clean, well-commented CSS)
│   └── responsive.css       # Mobile & tablet adaptive breakpoint definitions (~60 lines)
├── js/
│   ├── main.js              # Global navigation, mobile drawer toggle, and tab switcher (~70 lines)
│   ├── planner.js           # Dynamic Course & Task DOM manipulation (~110 lines)
│   ├── timer.js             # Pomodoro countdown engine with Start/Pause/Reset (~75 lines)
│   └── validation.js        # Contact form validation and interactive accordion FAQ (~85 lines)
├── .gitignore               # Clean repository tracking exclusions
├── README.md                # Project documentation & assignment overview
└── VIVA_GUIDE.md            # Comprehensive Viva Voce preparation & code defense guide
```

---

## 4. Website Pages & Key Features

### 1. Home (`index.html`)
- **Apple-Style Hero:** Clean headline typography, subtitle, and primary call-to-action buttons.
- **Feature Overview Grid:** 3 clear cards highlighting the Course Planner, Focus Timer, and Learning Methodology.

### 2. About Methodology (`about.html`)
- **Science of Learning:** Explanations of Active Recall, the Ebbinghaus forgetting curve, spaced repetition, and deep work.
- **Interactive Technique Switcher:** Tabbed interface letting students click between the Feynman Technique, Active Recall, and Spaced Repetition.

### 3. Academic Planner (`planner.html`)
- **Custom Course Enroller (Starts 100% Empty):** No dummy placeholder data. Displays an empty state message until the student adds a course.
- **Course Management:** Students enter Course Code, Course Name, and Instructor. Courses appear instantly with a "Delete" button that removes them from the DOM.
- **Dynamic Study Sprint Checklist:** Add tasks linked to active courses. Checking a task applies a strikethrough completion effect, and tasks can be deleted dynamically.

### 4. Focus Hub (`timer.html`)
- **Digital Countdown Display:** Clean MM:SS format clock (`25:00`).
- **Pomodoro Engine:** `setInterval` countdown loop with mode switching between Pomodoro (25m), Short Break (5m), and Long Break (15m).
- **Controls:** Intuitive Start, Pause, and Reset buttons.

### 5. Contact & Support (`contact.html`)
- **Client-Side Form Validation:** Checks for required name and message fields, plus regex email pattern validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Shows inline error messages and an alert on valid submission.
- **Interactive FAQ Accordion:** Collapsible Q&A items that expand and collapse on click.

---

## 5. How to Run Locally

Because Cognitio is built strictly with static web technologies, no build steps or server configurations are required:

1. Clone the repository:
   ```bash
   git clone https://github.com/mianahmed-cs/Cognitio.git
   cd Cognitio
   ```
2. Open `index.html` directly in any modern web browser (Google Chrome, Apple Safari, Mozilla Firefox, or Microsoft Edge).
3. Alternatively, serve via VS Code's **Live Server** extension or Python's built-in HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`.
