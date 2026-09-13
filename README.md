# Cognitio — Smart Academic & Study Planner

> **Faculty of Information & Technology**  
> **Course:** Web Technologies (BS CS F24 – Morning & Self Support)  
> **Instructor:** Dr. Noman Shafi  
> **Author:** Mian Ahmed  
> **Assignment:** 01 — Multi-Page Static Website  
> **GitHub Repository:** [https://github.com/mianahmed-cs/Cognitio](https://github.com/mianahmed-cs/Cognitio)

---

## 1. Project Overview

**Cognitio** is a multi-page, static academic productivity and study suite designed for Computer Science students. Built entirely with **semantic HTML5, modern CSS3, and vanilla JavaScript**, the project draws visual inspiration from the **Apple.com design language** (Bento grid layouts, frosted glassmorphic navigation bars, sleek typography, pill-shaped action controls, and an Apple Watch-inspired focus dial).

Unlike generic templates, Cognitio is an original static web application featuring:
- **Zero generic or pre-seeded courses:** The course manager starts 100% clean and allows students to dynamically add, customize, and delete their exact semester syllabus.
- **Client-Side Privacy:** All data persists locally via the HTML5 `localStorage` API with zero external servers or databases.
- **Synthesized Audio:** Focus timer chimes generated algorithmically via the Web Audio API without requiring third-party MP3 files.

---

## 2. Assignment 01 Compliance Checklist

| Requirement | Implementation in Cognitio |
|---|---|
| **Static Website (HTML, CSS, JS only)** | Pure client-side static application. No backend, Node server, database, or frameworks. |
| **Multi-Page Website (4–5 pages)** | 5 fully interlinked semantic pages: `index.html`, `about.html`, `planner.html`, `timer.html`, `contact.html`. |
| **Semantic HTML5** | Comprehensive use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, forms, lists, and tables. |
| **Organized CSS** | `css/style.css` (tokens, typography, layout, components) and `css/responsive.css` (adaptive breakpoints). |
| **Flexbox & CSS Grid** | Flexbox for headers, navigation, cards, and pill controls; CSS Grid for dashboard Bento layouts, statistics, and course cards. |
| **Responsive Design** | Custom media queries adapting seamlessly to desktop (>1024px), tablet (768px), and mobile (<480px) viewports. |
| **JavaScript Interactivity** | Dynamic course manager, task sprint checklist, Pomodoro countdown engine, client-side regex form validation, interactive study technique switcher, and accordion FAQ. |
| **Git & Version Control** | Disciplined feature-branch workflow merged into `main` with professional, descriptive commit messages. |

---

## 3. Project Directory Structure

```
Cognitio/
├── index.html               # Home portal (Apple Hero, Feature Overview, Quick Actions)
├── about.html               # Cognitive Science & Interactive Technique Switcher
├── planner.html             # Dynamic Course Manager (starts empty) & Task Sprint Checklist
├── timer.html               # Apple Watch-style Pomodoro Focus Hub & Web Audio chime
├── contact.html             # Helpdesk, Real-time Regex Validation & Cupertino Accordion FAQ
├── css/
│   ├── style.css            # Master stylesheet with CSS Custom Properties and Cupertino styling
│   └── responsive.css       # Mobile & tablet adaptive breakpoint definitions
├── js/
│   ├── main.js              # Global navigation, mobile drawer toggle, and toast alerts
│   ├── planner.js           # Dynamic Course & Task DOM manipulation, modal controller, state persistence
│   ├── timer.js             # Circular SVG Pomodoro engine, Web Audio synthesis, session logger
│   └── validation.js        # Real-time contact form regex validation and interactive accordion FAQ
├── .gitignore               # Clean repository tracking exclusions
├── README.md                # Project documentation & assignment overview
└── VIVA_GUIDE.md            # Comprehensive Viva Voce preparation & code defense guide
```

---

## 4. Website Pages & Key Features

### 1. Home (`index.html`)
- **Cupertino Hero Section:** High-contrast headline typography with subtle gradient clip, quick-action pill buttons, and academic statistics counters.
- **Direct Focus Call to Action:** Streamlined pathway directly leading students into their active study workflows without clutter.

### 2. About Methodology (`about.html`)
- **Science of Learning:** Comprehensive exploration of active recall, the Ebbinghaus forgetting curve, spaced repetition, and deep work.
- **Interactive Study Technique Switcher:** Tabbed interface allowing users to dynamically switch between the Feynman Technique, Spaced Repetition, the Blurting Method, and Interleaving Practice.

### 3. Academic Planner (`planner.html`)
- **Custom Course Enroller (Starts 100% Empty):** No dummy data. Displays a clean empty state until the student enrolls courses via an accessible modal dialog.
- **Course Management:** Students can add courses with customized color themes (Apple Blue, Green, Purple, Orange, Red, Teal), credit hours, instructors, and weekly schedules, or delete courses dynamically.
- **Dynamic Study Sprint Checklist:** Add tasks linked directly to active enrolled courses with priorities and estimated focus minutes. Supports task completion toggling with strikethrough animations and task deletion.

### 4. Focus Hub (`timer.html`)
- **Apple Watch-Inspired Dial:** Circular SVG progress ring dynamically calculated via `stroke-dashoffset` (`2 * π * r`).
- **Pomodoro Engine:** Accurate `setInterval` countdown loop with mode switching between Pomodoro (25m), Short Break (5m), and Long Break (15m), plus quick sprint presets (15m, 25m, 45m, 60m).
- **Synthesized Audio Chimes:** Uses the browser's native **Web Audio API** (`AudioContext`, `OscillatorNode`, and `GainNode`) to synthesize two-tone harmonic notification chimes (C5 523Hz & E5 659Hz) without downloading audio assets.
- **Streak & Session Tracker:** Visual 4-cycle completion dots and persistent session activity feed.

### 5. Contact & Support (`contact.html`)
- **Real-Time Client-Side Form Validation:** Instant feedback on `input` and `blur` events using strict regex for email formatting, name length checks, and message length requirements.
- **Interactive Cupertino Accordion FAQ:** Collapsible Q&A cards with animated chevron rotations, dynamic height transitions, and `aria-expanded` attributes.
- **Academic Office Hours:** Faculty information and laboratory timings card.

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

---

## 6. Git Branching & Version Control Workflow

The project followed a disciplined Git workflow where every major subsystem was implemented on a dedicated feature branch, tested, committed with descriptive messages, pushed to GitHub, and merged into `main` using `--no-ff` merge commits:

1. `feature/design-system-and-navigation`: Core CSS custom properties, Apple design system, responsive breakpoints, header, footer, and mobile drawer menu.
2. `feature/home-and-about-pages`: Apple keynote hero, Bento grid layout, interactive carousel slider, and about page with technique switcher.
3. `feature/course-and-task-planner`: Clean empty course canvas, Add Course modal, Delete Course functionality, dynamic task sprint checklist, and weekly timetable table.
4. `feature/focus-pomodoro-timer`: Circular SVG countdown timer, Pomodoro/break modes, Web Audio API chime synthesis, and streak tracker.
5. `feature/contact-form-validation-and-faq`: Client-side regex form validation with visual cues, confirmation alert, and interactive accordion FAQ.
6. `docs/readme-and-viva-preparation`: Comprehensive project documentation and dedicated Viva Voce defense guide.
