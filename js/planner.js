/**
 * Cognitio - Academic Planner Script (With LocalStorage Persistence)
 * Saves courses and study tasks so they do not disappear when switching pages.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupCourseManager();
  setupTaskManager();
});

/* ==========================================================================
   1. Course Management (with LocalStorage)
   ========================================================================== */
function setupCourseManager() {
  const courseForm = document.getElementById('courseForm');
  const courseList = document.getElementById('courseList');
  const emptyMessage = document.getElementById('emptyCoursesMsg');
  const taskCourseSelect = document.getElementById('taskCourseSelect');

  if (!courseForm || !courseList) return;

  // Retrieve saved courses from browser storage
  let courses = JSON.parse(localStorage.getItem('cognitio_courses')) || [];

  // Function to render all courses onto the screen
  function renderCourses() {
    courseList.innerHTML = '';

    // Show/hide empty message
    if (courses.length === 0) {
      if (emptyMessage) emptyMessage.style.display = 'block';
    } else {
      if (emptyMessage) emptyMessage.style.display = 'none';
    }

    // Refresh task dropdown options
    if (taskCourseSelect) {
      taskCourseSelect.innerHTML = '<option value="General">General Study</option>';
    }

    // Draw each course card
    courses.forEach((course, index) => {
      const courseCard = document.createElement('div');
      courseCard.className = 'course-item';
      courseCard.innerHTML = `
        <div class="course-info">
          <h4>${course.code} - ${course.name}</h4>
          <p>Instructor: ${course.instructor || 'TBD'}</p>
        </div>
        <button type="button" class="btn btn-danger btn-sm delete-course-btn">Delete</button>
      `;

      // Delete course on button click
      courseCard.querySelector('.delete-course-btn').addEventListener('click', () => {
        courses.splice(index, 1);
        localStorage.setItem('cognitio_courses', JSON.stringify(courses));
        renderCourses();
      });

      courseList.appendChild(courseCard);

      // Add to task select dropdown
      if (taskCourseSelect) {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = `${course.code} (${course.name})`;
        taskCourseSelect.appendChild(option);
      }
    });
  }

  // Handle adding a new course
  courseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const code = document.getElementById('courseCode').value.trim();
    const name = document.getElementById('courseName').value.trim();
    const instructor = document.getElementById('courseInstructor').value.trim();

    if (!code || !name) {
      alert('Please enter both course code and course name.');
      return;
    }

    // Add new course to array and save
    courses.push({ code, name, instructor });
    localStorage.setItem('cognitio_courses', JSON.stringify(courses));

    renderCourses();
    courseForm.reset();
  });

  // Initial render when page loads
  renderCourses();
}

/* ==========================================================================
   2. Study Sprint Tasks (with LocalStorage)
   ========================================================================== */
function setupTaskManager() {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');

  if (!taskForm || !taskList) return;

  // Retrieve saved tasks from browser storage
  let tasks = JSON.parse(localStorage.getItem('cognitio_tasks')) || [];

  // Function to render all tasks onto the screen
  function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      taskList.innerHTML = '<li style="padding: 16px; text-align: center; color: var(--text-muted);">No study tasks scheduled yet.</li>';
      return;
    }

    tasks.forEach((task, index) => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item' + (task.completed ? ' completed' : '');
      taskItem.innerHTML = `
        <div class="task-content">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
          <span class="task-text"><strong>[${task.course || 'General'}]</strong> ${task.title}</span>
        </div>
        <button type="button" class="btn btn-danger btn-sm delete-task-btn">Delete</button>
      `;

      // Checkbox toggle event
      taskItem.querySelector('.task-checkbox').addEventListener('change', (e) => {
        tasks[index].completed = e.target.checked;
        localStorage.setItem('cognitio_tasks', JSON.stringify(tasks));
        renderTasks();
      });

      // Delete task event
      taskItem.querySelector('.delete-task-btn').addEventListener('click', () => {
        tasks.splice(index, 1);
        localStorage.setItem('cognitio_tasks', JSON.stringify(tasks));
        renderTasks();
      });

      taskList.appendChild(taskItem);
    });
  }

  // Handle adding a new task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const courseSelect = document.getElementById('taskCourseSelect');
    const course = courseSelect ? courseSelect.value : 'General';

    if (!title) {
      alert('Please enter a task title.');
      return;
    }

    tasks.push({ title, course, completed: false });
    localStorage.setItem('cognitio_tasks', JSON.stringify(tasks));

    renderTasks();
    taskForm.reset();
  });

  // Initial render when page loads
  renderTasks();
}
