# Cognitio — Face-to-Face Viva Voce Defense Guide

> **Course:** Web Technologies (BS CS F24)  
> **Course Instructor:** Dr. Noman Shafi  
> **Student:** Mian Ahmed  
> **Assignment:** 01 — Front-End Web Technologies & UI Design

---

## 1. HTML5 Structure & Semantic Tags Justification

### Why use Semantic HTML5 instead of generic `<div>` tags?
Semantic tags clearly describe their meaning to both the browser and the developer. They improve:
1. **Accessibility (a11y):** Screen readers use landmark roles (e.g., `<main>`, `<nav>`, `<aside>`) to help visually impaired users navigate.
2. **SEO & Search Indexing:** Search engines understand the content hierarchy better.
3. **Code Maintainability:** Structured markup makes pair programming and grading cleaner.

### Key Semantic Tags Used in Cognitio:
- `<header>`: Encloses the site brand logo, desktop navigation menu, and mobile trigger. Sticky on all pages.
- `<nav>`: Designated navigation area containing internal links with `aria-label="Main Navigation"`.
- `<main>`: The primary unique content of each page (`id="mainContent"`).
- `<section>`: Thematic grouping of content (e.g., Hero Section, Course Enroller, Task Sprint Hub).
- `<article>`: Self-contained, independently distributable content blocks (e.g., Course cards, FAQ accordion items, Philosophy creed blocks).
- `<aside>`: Secondary content; used for the mobile slide-out navigation drawer (`id="mobileNav"`) and toast alerts (`id="toastContainer"`).
- `<footer>`: Closing landmark with academic credits, site map links, and copyright.
- `<form>`: Structured user input collection with semantic `<label>`, `<input>`, `<select>`, `<textarea>`, and `<button type="submit">`.
- `<ul>`, `<ol>`, `<li>`: Semantic unordered and ordered lists for tasks, steps, and links.

---

## 2. CSS Concepts: Box Model, Flexbox, Grid & Media Queries

### The CSS Box Model
Every HTML element is a rectangular box comprising:
1. **Content:** Text and images.
2. **Padding:** Transparent space inside the border (`padding: 24px`).
3. **Border:** Line surrounding the padding (`border: 1px solid var(--border-card)`).
4. **Margin:** Transparent space outside the border (`margin-bottom: 36px`).

> **Viva Tip:** Explain why `box-sizing: border-box;` is set globally on `*, *::before, *::after`.  
> *Answer:* By default, standard CSS uses `content-box` where padding and borders are added on top of `width`, causing unexpected overflow. `border-box` ensures that `width` includes content, padding, and border, making responsive sizing predictable.

### Flexbox vs. CSS Grid
- **Flexbox (1-Dimensional):** Used for single-axis alignment (rows or columns).
  - Used in: Header navigation bar (`justify-content: space-between`), button groups, task items (`align-items: center; gap: 14px`), and Pomodoro controls.
- **CSS Grid (2-Dimensional):** Used for complex multi-row and multi-column layouts.
  - Used in: Apple Bento Grid (`grid-template-columns: repeat(12, 1fr)` with column spans `bento-span-8`, `bento-span-4`), Course cards grid (`repeat(auto-fill, minmax(280px, 1fr))`), and Contact 2-column layout.

### CSS Custom Properties (Theme Tokens)
Defined in `:root` inside `css/style.css` for consistent design:
```css
:root {
  --bg-primary: #000000;
  --apple-blue: #2997ff;
  --apple-green: #30d158;
  --border-card: rgba(255, 255, 255, 0.12);
  --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Media Queries & Responsive Breakpoints
Defined in `css/responsive.css` to adapt smoothly to all screen sizes:
- `@media (max-width: 1024px)`: Adjusts Bento grid columns from 12 to 6; scales hero typography.
- `@media (max-width: 768px)`: Replaces desktop navigation with the hamburger menu; collapses 2-column layouts to single columns.
- `@media (max-width: 480px)`: Compact padding (`18px`), scales typography, full-width modal dialogs.

---

## 3. JavaScript Logic: DOM Manipulation & Event Handling

### Event Delegation & `addEventListener`
Instead of using inline `onclick` attributes in HTML, Cognitio adheres to the separation of concerns by binding events in JavaScript using `addEventListener`:
```javascript
button.addEventListener('click', (e) => { ... });
form.addEventListener('submit', (e) => { e.preventDefault(); ... });
```

### Dynamic DOM Manipulation
1. **Adding Elements (`document.createElement`, `appendChild`):**
   - In `planner.js`, when a user enrolls a course, `createElement('article')` generates the card node, fills its `innerHTML` with escaping, and appends it to `#coursesGrid`.
2. **Removing Elements (`remove`, filter state):**
   - Clicking "Delete" on a course card removes it from the internal `courses` array, updates `localStorage`, and re-renders the DOM. If zero courses remain, the clean Empty State box is displayed automatically.
3. **Class Toggling (`classList.toggle`, `classList.add`, `classList.remove`):**
   - Used for task completion strikethrough (`is-completed`), mobile drawer menu (`is-open`), and accordion expansion.

### LocalStorage Persistence
```javascript
// Saving state to browser storage:
localStorage.setItem('cognitio_courses', JSON.stringify(courses));

// Loading state on boot:
const saved = localStorage.getItem('cognitio_courses');
courses = saved ? JSON.parse(saved) : [];
```

### Web Audio API Synthesis (No External Audio Files)
```javascript
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(523.25, ctx.currentTime); // Note C5
gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
osc.connect(gain);
gain.connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.85);
```

---

## 4. Form Validation Logic (`js/validation.js`)

### What happens on invalid input?
1. The field's parent `.form-group` receives class `has-error`.
2. The border turns Apple Red (`#ff453a`) with a soft red glow.
3. The specific `.input-error-msg` beneath the input is displayed (`display: block`).
4. Form submission is halted via `e.preventDefault()`.
5. An error toast notification alerts the student.

### What happens on valid input?
1. `.form-group` receives class `has-success`.
2. The border turns Apple Green (`#30d158`).
3. On submit, an animated Cupertino success card displays the student's name, confirming receipt, and the form resets.

### Regular Expressions Used:
- **Email Validation:** `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`  
  *Ensures non-whitespace before `@`, valid domain characters, a dot, and top-level domain.*
- **Name Validation:** `/^[a-zA-Z\s'.]{3,}$/`  
  *Ensures at least 3 alphabetic characters or standard name punctuation.*

---

## 5. Potential Live Modifications During Viva

The examiner may ask you to modify something live to test whether you wrote and understand the code. Here is how to do each quickly:

### 1. "Change the Pomodoro work time from 25 minutes to 30 minutes"
- Open `js/timer.js`.
- Go to line 18:
  ```javascript
  pomodoro: { name: 'Deep Focus', defaultMins: 25, color: '#2997ff' },
  ```
- Change `defaultMins: 25` to `defaultMins: 30`. Save and refresh.

### 2. "Change the primary accent color from Apple Blue to Purple"
- Open `css/style.css`.
- Go to line 32 (`:root` variables):
  ```css
  --apple-blue: #2997ff;
  ```
- Change `#2997ff` to `#bf5af2` (Apple Purple) or `#af52de`. Save and refresh.

### 3. "Add another question to the Contact FAQ accordion"
- Open `contact.html`.
- Duplicate one `<article class="accordion-item">...</article>` block inside `#faqAccordion`.
- Change the header text, update `id="faq5Header"`, and update the text inside `.accordion-content`.

### 4. "Add another focus duration preset button"
- Open `timer.html`.
- Inside `.preset-pill-group`, duplicate a button like `<button class="preset-pill" data-minutes="25">25m Sprint</button>`.
- Change `data-minutes="90"` and label to `90m Deep Dive`. Save and test in browser.
