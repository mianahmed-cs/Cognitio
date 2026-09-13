/**
 * ==========================================================================
 * Cognitio - Academic Planner & Course Management Script
 * Course: Web Technologies (BS CS F24) - Assignment 01
 * Instructor: Dr. Noman Shafi
 * Description: Fully dynamic DOM manipulation for custom courses and study tasks.
 *              Begins 100% empty (no generic courses) with full Add & Delete capability.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initPlanner();
});

// In-memory state synchronized with localStorage
let courses = [];
let tasks = [];
let activeTaskFilter = 'all';
let activeCourseFilter = 'all';
let selectedCourseColor = 'blue';

// Color map for course badges
const COLOR_MAP = {
  blue: { bg: 'rgba(0, 113, 227, 0.1)', text: '#0071e3', border: 'rgba(0, 113, 227, 0.25)' },
  green: { bg: 'rgba(52, 199, 89, 0.12)', text: '#1b873a', border: 'rgba(52, 199, 89, 0.25)' },
  purple: { bg: 'rgba(175, 82, 222, 0.12)', text: '#892ebb', border: 'rgba(175, 82, 222, 0.25)' },
  orange: { bg: 'rgba(255, 149, 0, 0.12)', text: '#c25e00', border: 'rgba(255, 149, 0, 0.25)' },
  red: { bg: 'rgba(255, 59, 48, 0.1)', text: '#d7261b', border: 'rgba(255, 59, 48, 0.25)' },
  teal: { bg: 'rgba(48, 176, 199, 0.12)', text: '#0e7490', border: 'rgba(48, 176, 199, 0.25)' }
};

/**
 * Main initialization entry point.
 */
function initPlanner() {
  loadStoredData();
  setupCourseModal();
  setupCourseColorPicker();
  setupAddCourseForm();
  setupAddTaskForm();
  setupTaskFilters();
  
  // Initial render
  renderCourses();
  renderTasks();
  updateStatistics();
  populateCourseDropdowns();
}

/**
 * Load state from localStorage.
 * Guaranteed to start empty if no data is stored.
 */
function loadStoredData() {
  try {
    const storedCourses = localStorage.getItem('cognitio_courses');
    const storedTasks = localStorage.getItem('cognitio_tasks');
    
    courses = storedCourses ? JSON.parse(storedCourses) : [];
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
    courses = [];
    tasks = [];
  }
}

/**
 * Persist current state to localStorage.
 */
function saveData() {
  try {
    localStorage.setItem('cognitio_courses', JSON.stringify(courses));
    localStorage.setItem('cognitio_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

/* ==========================================================================
   Course Management (Modal, Add Course, Delete Course, Empty State)
   ========================================================================== */

function setupCourseModal() {
  const modal = document.getElementById('addCourseModal');
  const openBtns = [
    document.getElementById('openCourseModalBtn'),
    document.getElementById('openCourseModalMobileBtn'),
    document.getElementById('triggerAddCourseBtn'),
    document.getElementById('emptyStateAddCourseBtn')
  ];
  const closeBtn = document.getElementById('closeCourseModalBtn');
  const cancelBtn = document.getElementById('cancelCourseBtn');

  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        openModal(modal);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
  if (cancelBtn) cancelBtn.addEventListener('click', () => closeModal(modal));

  // Dismiss on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }

  // Dismiss on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal(modal);
    }
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  const firstInput = modal.querySelector('input');
  if (firstInput) firstInput.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

function setupCourseColorPicker() {
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      colorOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedCourseColor = opt.getAttribute('data-color') || 'blue';
    });
  });
}

function setupAddCourseForm() {
  const form = document.getElementById('addCourseForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const codeInput = document.getElementById('courseCodeInput');
    const titleInput = document.getElementById('courseTitleInput');
    const instructorInput = document.getElementById('courseInstructorInput');
    const creditHoursInput = document.getElementById('courseCreditHoursInput');
    const scheduleInput = document.getElementById('courseScheduleInput');

    let isValid = true;

    if (!codeInput.value.trim()) {
      showInputError(codeInput, 'Please enter a course code');
      isValid = false;
    } else {
      clearInputError(codeInput);
    }

    if (!titleInput.value.trim()) {
      showInputError(titleInput, 'Course name is required');
      isValid = false;
    } else {
      clearInputError(titleInput);
    }

    if (!instructorInput.value.trim()) {
      showInputError(instructorInput, 'Instructor name is required');
      isValid = false;
    } else {
      clearInputError(instructorInput);
    }

    if (!isValid) return;

    // Create new course object
    const newCourse = {
      id: 'course_' + Date.now(),
      code: codeInput.value.trim().toUpperCase(),
      title: titleInput.value.trim(),
      instructor: instructorInput.value.trim(),
      creditHours: parseInt(creditHoursInput.value, 10) || 3,
      schedule: scheduleInput.value.trim() || 'TBA',
      color: selectedCourseColor
    };

    courses.push(newCourse);
    saveData();

    // DOM Updates
    renderCourses();
    populateCourseDropdowns();
    updateStatistics();

    // Reset Form & Close Modal
    form.reset();
    closeModal(document.getElementById('addCourseModal'));

    if (window.showToast) {
      window.showToast(`Course "${newCourse.code}" enrolled successfully!`, 'success');
    }
  });
}

/**
 * Render all courses or show empty state if zero exist.
 */
function renderCourses() {
  const emptyState = document.getElementById('emptyCoursesState');
  const coursesGrid = document.getElementById('coursesGrid');

  if (!emptyState || !coursesGrid) return;

  if (courses.length === 0) {
    emptyState.style.display = 'block';
    coursesGrid.style.display = 'none';
    coursesGrid.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';
  coursesGrid.style.display = 'grid';
  coursesGrid.innerHTML = '';

  courses.forEach(course => {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.id = `card_${course.id}`;

    const colorConfig = COLOR_MAP[course.color] || COLOR_MAP.blue;
    const linkedTasks = tasks.filter(t => t.courseId === course.id);
    const completedCount = linkedTasks.filter(t => t.isCompleted).length;

    card.innerHTML = `
      <div>
        <div class="course-top">
          <span class="course-code-badge" style="background: ${colorConfig.bg}; color: ${colorConfig.text}; border: 1px solid ${colorConfig.border};">
            ${escapeHtml(course.code)}
          </span>
          <button class="btn-danger btn-sm delete-course-btn" data-id="${course.id}" aria-label="Delete course ${escapeHtml(course.code)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete
          </button>
        </div>
        <h3 class="course-title">${escapeHtml(course.title)}</h3>
        <div class="course-meta">
          <span><strong>Instructor:</strong> ${escapeHtml(course.instructor)}</span>
          <span><strong>Credits:</strong> ${course.creditHours} CH &bull; <strong>Schedule:</strong> ${escapeHtml(course.schedule)}</span>
        </div>
      </div>
      <div class="course-footer">
        <span class="course-tasks-count">
          ${linkedTasks.length} tasks (${completedCount} completed)
        </span>
        <button class="btn btn-ghost btn-sm quick-add-task-btn" data-id="${course.id}">
          + Add Task
        </button>
      </div>
    `;

    coursesGrid.appendChild(card);
  });

  // Attach dynamic event listeners to newly created buttons
  attachCourseCardListeners();
}

function attachCourseCardListeners() {
  // Delete Course
  const deleteBtns = document.querySelectorAll('.delete-course-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const courseId = btn.getAttribute('data-id');
      deleteCourse(courseId);
    });
  });

  // Quick Add Task for specific course
  const quickAddBtns = document.querySelectorAll('.quick-add-task-btn');
  quickAddBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-id');
      const select = document.getElementById('taskCourseSelect');
      if (select) {
        select.value = courseId;
      }
      const taskInput = document.getElementById('taskTitleInput');
      if (taskInput) {
        taskInput.focus();
        taskInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/**
 * Delete Course function (DOM manipulation & cascade cleanup)
 */
function deleteCourse(courseId) {
  const targetCourse = courses.find(c => c.id === courseId);
  const courseName = targetCourse ? targetCourse.code : 'Course';

  // Remove course from state
  courses = courses.filter(c => c.id !== courseId);

  // Remove linked tasks or set them unassigned
  tasks = tasks.filter(t => t.courseId !== courseId);

  saveData();

  // Re-render
  renderCourses();
  renderTasks();
  populateCourseDropdowns();
  updateStatistics();

  if (window.showToast) {
    window.showToast(`Deleted ${courseName} and its linked tasks.`, 'info');
  }
}

/**
 * Dynamically populate course select elements in task creation and filters.
 */
function populateCourseDropdowns() {
  const taskCourseSelect = document.getElementById('taskCourseSelect');
  const filterCourseSelect = document.getElementById('filterByCourseSelect');

  if (taskCourseSelect) {
    taskCourseSelect.innerHTML = '';
    if (courses.length === 0) {
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.disabled = true;
      emptyOpt.selected = true;
      emptyOpt.textContent = 'No courses enrolled — add a course above first';
      taskCourseSelect.appendChild(emptyOpt);
    } else {
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.disabled = true;
      defaultOpt.selected = true;
      defaultOpt.textContent = 'Select enrolled course...';
      taskCourseSelect.appendChild(defaultOpt);

      courses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.code} — ${c.title}`;
        taskCourseSelect.appendChild(opt);
      });
    }
  }

  if (filterCourseSelect) {
    filterCourseSelect.innerHTML = '<option value="all">All Courses</option>';
    courses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.code;
      if (c.id === activeCourseFilter) {
        opt.selected = true;
      }
      filterCourseSelect.appendChild(opt);
    });
  }
}

/* ==========================================================================
   Task Management (Add Task, Toggle Complete, Delete Task, Filter)
   ========================================================================== */

function setupAddTaskForm() {
  const form = document.getElementById('addTaskForm');
  if (!form) return;

  // Set default due date to today + 2 days
  const dueDateInput = document.getElementById('taskDueDateInput');
  if (dueDateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    dueDateInput.value = today.toISOString().split('T')[0];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (courses.length === 0) {
      if (window.showToast) {
        window.showToast('Please add at least one course first before creating study tasks!', 'error');
      }
      openModal(document.getElementById('addCourseModal'));
      return;
    }

    const titleInput = document.getElementById('taskTitleInput');
    const courseSelect = document.getElementById('taskCourseSelect');
    const prioritySelect = document.getElementById('taskPrioritySelect');
    const estMinutesInput = document.getElementById('taskEstMinutesInput');

    let isValid = true;

    if (!titleInput.value.trim()) {
      showInputError(titleInput, 'Please enter a task description');
      isValid = false;
    } else {
      clearInputError(titleInput);
    }

    if (!courseSelect.value) {
      showInputError(courseSelect, 'Please choose an enrolled course');
      isValid = false;
    } else {
      clearInputError(courseSelect);
    }

    if (!isValid) return;

    const newTask = {
      id: 'task_' + Date.now(),
      title: titleInput.value.trim(),
      courseId: courseSelect.value,
      dueDate: dueDateInput.value || new Date().toISOString().split('T')[0],
      priority: prioritySelect.value || 'medium',
      estMinutes: parseInt(estMinutesInput.value, 10) || 25,
      isCompleted: false,
      createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveData();

    // DOM Updates
    renderTasks();
    renderCourses(); // Updates task counts on course cards
    updateStatistics();

    // Reset Form fields except course
    titleInput.value = '';
    titleInput.focus();

    if (window.showToast) {
      window.showToast('Study task added to sprint!', 'success');
    }
  });
}

function setupTaskFilters() {
  const filterPills = document.querySelectorAll('.filter-pill-btn');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTaskFilter = pill.getAttribute('data-filter') || 'all';
      renderTasks();
    });
  });

  const courseFilterSelect = document.getElementById('filterByCourseSelect');
  if (courseFilterSelect) {
    courseFilterSelect.addEventListener('change', () => {
      activeCourseFilter = courseFilterSelect.value;
      renderTasks();
    });
  }
}

/**
 * Render study tasks list using DOM manipulation.
 */
function renderTasks() {
  const taskList = document.getElementById('taskList');
  const emptyTasksState = document.getElementById('emptyTasksState');

  if (!taskList || !emptyTasksState) return;

  // Filter tasks based on active filters
  let filtered = tasks;

  if (activeTaskFilter === 'active') {
    filtered = filtered.filter(t => !t.isCompleted);
  } else if (activeTaskFilter === 'completed') {
    filtered = filtered.filter(t => t.isCompleted);
  }

  if (activeCourseFilter !== 'all') {
    filtered = filtered.filter(t => t.courseId === activeCourseFilter);
  }

  if (filtered.length === 0) {
    emptyTasksState.style.display = 'block';
    taskList.innerHTML = '';
    return;
  }

  emptyTasksState.style.display = 'none';
  taskList.innerHTML = '';

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.isCompleted ? 'is-completed' : ''}`;
    li.id = `task_${task.id}`;

    const linkedCourse = courses.find(c => c.id === task.courseId);
    const courseCode = linkedCourse ? linkedCourse.code : 'General';
    const courseColor = linkedCourse ? linkedCourse.color : 'blue';
    const colorConfig = COLOR_MAP[courseColor] || COLOR_MAP.blue;

    li.innerHTML = `
      <div class="task-left">
        <button class="task-checkbox toggle-task-btn" data-id="${task.id}" aria-label="Toggle completion for ${escapeHtml(task.title)}">
          ${task.isCompleted ? `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ` : ''}
        </button>
        <div class="task-text-group">
          <span class="task-text">${escapeHtml(task.title)}</span>
          <div class="task-submeta">
            <span class="course-code-badge" style="background: ${colorConfig.bg}; color: ${colorConfig.text}; font-size: 0.6875rem; padding: 2px 8px;">
              ${escapeHtml(courseCode)}
            </span>
            <span>&bull; Due: ${escapeHtml(task.dueDate)}</span>
            <span>&bull; ${task.estMinutes}m focus</span>
          </div>
        </div>
      </div>

      <div class="task-actions">
        <span class="priority-pill priority-${task.priority}">
          ${task.priority}
        </span>
        <button class="task-delete-btn delete-task-btn" data-id="${task.id}" aria-label="Delete task">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });

  attachTaskListListeners();
}

function attachTaskListListeners() {
  // Toggle Task Completion
  const toggleBtns = document.querySelectorAll('.toggle-task-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.getAttribute('data-id');
      toggleTaskCompletion(taskId);
    });
  });

  // Delete Task
  const deleteBtns = document.querySelectorAll('.delete-task-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.getAttribute('data-id');
      deleteTask(taskId);
    });
  });
}

function toggleTaskCompletion(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  task.isCompleted = !task.isCompleted;
  saveData();

  renderTasks();
  renderCourses();
  updateStatistics();

  if (window.showToast) {
    if (task.isCompleted) {
      window.showToast('Task completed! Great momentum.', 'success');
    } else {
      window.showToast('Task marked incomplete.', 'info');
    }
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  saveData();

  renderTasks();
  renderCourses();
  updateStatistics();

  if (window.showToast) {
    window.showToast('Task removed from sprint.', 'info');
  }
}

/* ==========================================================================
   Statistics Calculations
   ========================================================================== */

function updateStatistics() {
  const statCoursesCount = document.getElementById('statCoursesCount');
  const statActiveTasksCount = document.getElementById('statActiveTasksCount');
  const statCompletedTasksCount = document.getElementById('statCompletedTasksCount');
  const statTotalMinutes = document.getElementById('statTotalMinutes');

  const activeCount = tasks.filter(t => !t.isCompleted).length;
  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.estMinutes || 0), 0);

  if (statCoursesCount) statCoursesCount.textContent = courses.length;
  if (statActiveTasksCount) statActiveTasksCount.textContent = activeCount;
  if (statCompletedTasksCount) statCompletedTasksCount.textContent = completedCount;
  if (statTotalMinutes) statTotalMinutes.textContent = `${totalMinutes}m`;
}

/* ==========================================================================
   Validation Helpers
   ========================================================================== */

function showInputError(inputEl, message) {
  const formGroup = inputEl.closest('.form-group');
  if (formGroup) {
    formGroup.classList.add('has-error');
    const msgEl = formGroup.querySelector('.input-error-msg');
    if (msgEl) msgEl.textContent = message;
  }
}

function clearInputError(inputEl) {
  const formGroup = inputEl.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('has-error');
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
