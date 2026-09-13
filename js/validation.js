/**
 * Cognitio - Form Validation Script
 * Simple client-side form validation with regex email checking.
 */

document.addEventListener('DOMContentLoaded', () => {
  setupFormValidation();
});

/**
 * Contact Form Client-Side Validation
 */
function setupFormValidation() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('contactSuccessMsg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Get input elements and error containers
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('userMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // 1. Validate Name (must not be empty)
    if (nameInput.value.trim() === '') {
      nameError.classList.add('show');
      isValid = false;
    } else {
      nameError.classList.remove('show');
    }

    // 2. Validate Email (simple regex pattern)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.classList.add('show');
      isValid = false;
    } else {
      emailError.classList.remove('show');
    }

    // 3. Validate Message (must not be empty)
    if (messageInput.value.trim() === '') {
      messageError.classList.add('show');
      isValid = false;
    } else {
      messageError.classList.remove('show');
    }

    // If all inputs are valid, show success message
    if (isValid) {
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      form.reset();

      // Automatically hide success message after 5 seconds
      setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
      }, 5000);
    }
  });
}
