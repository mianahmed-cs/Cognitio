# Viva Voce Preparation & Code Defense Guide — Cognitio

> **Course:** Web Technologies (BS CS F24)  
> **Author:** Mian Ahmed  
> **Project:** Cognitio Academic Suite  

---

## 1. Core Semantic HTML Elements Used

During your viva defense, you may be asked why you used specific HTML elements:

- `<header>`: Contains the sticky top branding and navigation bar.
- `<nav>`: Wraps navigation link lists (`<ul class="nav-links">`).
- `<main>`: Contains the unique primary content of each page.
- `<section>`: Thematically divides sections on a page (e.g., hero, feature grids).
- `<footer>`: The bottom footer with copyright and course details.
- `<form>`: Captures user input semantically with associated `<label>` and `<input>` tags.
- `<ul>`, `<li>`: Unordered list for navigation links, drawer links, and task checklist items.

---

## 2. CSS Concepts Explained

### The CSS Box Model
Every element on the page is structured as:
1. **Content**: Text, image, or child element.
2. **Padding**: Space between content and border (e.g. `padding: 10px 20px;`).
3. **Border**: The line surrounding padding (e.g. `border: 1px solid var(--border-color);`).
4. **Margin**: Outer space separating the element from neighbors (e.g. `margin-bottom: 18px;`).
*Note:* We set `box-sizing: border-box;` in the `*` reset so padding and border are included within the declared width/height.

### Flexbox vs. CSS Grid
- **Flexbox (`display: flex`)**: 1-dimensional layout tool. Used for the top navbar (`justify-content: space-between`), buttons, task list items, and timer controls.
- **CSS Grid (`display: grid`)**: 2-dimensional layout tool. Used for column arrangements like `.grid-2` (`grid-template-columns: 1fr 1fr;`) and `.grid-3` (`grid-template-columns: repeat(3, 1fr);`).

### Media Queries (`responsive.css`)
- `@media (max-width: 768px)`: Switches multi-column grids to 1 column (`grid-template-columns: 1fr;`), hides desktop `.nav-links`, and shows the `.hamburger` button for mobile devices.

---

## 3. JavaScript Features Explained Line-by-Line

### Feature 1: Course Manager (`js/planner.js`)
- **How it works:**
  1. Captures `courseForm.addEventListener('submit', (e) => { e.preventDefault(); ... })`.
  2. Reads input values (`code`, `name`, `instructor`).
  3. Uses `document.createElement('div')` to create a `.course-item` card.
  4. Appends a "Delete" button. The button has a click listener that calls `courseCard.remove()`.
  5. Appends the new course as an `<option>` into `#taskCourseSelect` so tasks can be assigned to it.

### Feature 2: Task Sprint Checklist (`js/planner.js`)
- **How it works:**
  1. Captures `taskForm.addEventListener('submit', ...)`.
  2. Creates an `<li>` containing an `<input type="checkbox">` and the task text.
  3. Listens to `checkbox.addEventListener('change', () => { taskItem.classList.toggle('completed', checkbox.checked); })`.
  4. In CSS, `.task-item.completed .task-text { text-decoration: line-through; }` creates the strikethrough effect.

### Feature 3: Pomodoro Focus Timer (`js/timer.js`)
- **How it works:**
  1. Stores remaining seconds in `let timeLeft = 25 * 60;`.
  2. Uses `setInterval(() => { timeLeft--; updateDisplay(); }, 1000)` to count down every second.
  3. Formats minutes (`Math.floor(timeLeft / 60)`) and seconds (`timeLeft % 60`) with leading zeros.
  4. `pauseTimer()` calls `clearInterval(timerInterval)`.
  5. Mode buttons change `currentModeTime` (e.g. 5 min for short break, 15 min for long break) and call `resetTimer()`.

### Feature 4: Form Validation (`js/validation.js`)
- **How it works:**
  1. Listens to `contactForm.addEventListener('submit', (e) => { e.preventDefault(); ... })`.
  2. Validates name and message for non-empty input (`input.value.trim() !== ''`).
  3. Validates email with standard regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
  4. If any field fails, displays the corresponding error text (`errorElement.classList.add('show')`).
  5. If valid, shows `#contactSuccessMsg` and calls `form.reset()`.

### Feature 5: FAQ Accordion (`js/validation.js`)
- **How it works:**
  1. Queries all `.faq-question` buttons.
  2. When clicked, toggles the `.active` class on the parent `.faq-item`.
  3. In CSS: `.faq-item.active .faq-answer { display: block; }`.

---

## 4. Live Modifications the Instructor May Request

### 1. "Change the primary theme color from blue to purple"
- Open `css/style.css`.
- Go to `:root` at line 9:
  ```css
  --primary-color: #0071e3;
  ```
- Change `#0071e3` to `#af52de` (Apple Purple) or `#34c759` (Apple Green). Save and refresh the browser.

### 2. "Change the default Pomodoro timer duration from 25 to 30 minutes"
- Open `js/timer.js`.
- In line 12: change `let timeLeft = 25 * 60;` to `let timeLeft = 30 * 60;`.
- In line 13: change `let currentModeTime = 25 * 60;` to `let currentModeTime = 30 * 60;`.
- Open `timer.html` and change `<div id="timerDisplay" class="timer-clock">25:00</div>` to `30:00`.

### 3. "Add another FAQ item"
- Open `contact.html`.
- Inside `.faq-list`, copy and paste one `.faq-item` block and update the question and answer text.

### 4. "Add a Phone Number field to the contact form"
- Open `contact.html` and add:
  ```html
  <div class="form-group">
    <label for="userPhone" class="form-label">Phone Number</label>
    <input type="tel" id="userPhone" class="form-input" placeholder="0300-1234567">
  </div>
  ```
- In `js/validation.js`, check if `userPhone.value.trim()` matches your desired format.
