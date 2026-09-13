/**
 * ==========================================================================
 * Cognitio - Contact Form Validation & Interactive Accordion Script
 * Course: Web Technologies (BS CS F24) - Assignment 01
 * Instructor: Dr. Noman Shafi
 * Description: Client-side real-time form validation with regex checks, visual
 *              error/success feedback, and accessible Cupertino-style accordion FAQ.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactFormValidation();
  initFaqAccordion();
});

/**
 * 1. Client-Side Form Validation
 * Real-time event listeners on input and blur events.
 */
function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const categorySelect = document.getElementById('contactCategory');
  const messageTextarea = document.getElementById('contactMessage');
  const charCounter = document.getElementById('messageCharCount');
  const successBanner = document.getElementById('contactSuccessBanner');
  const sendAnotherBtn = document.getElementById('sendAnotherBtn');
  const successUserName = document.getElementById('successUserName');

  // Real-time character count on textarea
  if (messageTextarea && charCounter) {
    messageTextarea.addEventListener('input', () => {
      const len = messageTextarea.value.trim().length;
      charCounter.textContent = `${len} / 15 min`;
      if (len >= 15) {
        charCounter.style.color = 'var(--apple-green)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Real-time field blur listeners
  nameInput.addEventListener('blur', () => validateName(nameInput));
  nameInput.addEventListener('input', () => {
    if (nameInput.closest('.form-group').classList.contains('has-error')) {
      validateName(nameInput);
    }
  });

  emailInput.addEventListener('blur', () => validateEmail(emailInput));
  emailInput.addEventListener('input', () => {
    if (emailInput.closest('.form-group').classList.contains('has-error')) {
      validateEmail(emailInput);
    }
  });

  categorySelect.addEventListener('change', () => validateCategory(categorySelect));

  messageTextarea.addEventListener('blur', () => validateMessage(messageTextarea));
  messageTextarea.addEventListener('input', () => {
    if (messageTextarea.closest('.form-group').classList.contains('has-error')) {
      validateMessage(messageTextarea);
    }
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName(nameInput);
    const isEmailValid = validateEmail(emailInput);
    const isCategoryValid = validateCategory(categorySelect);
    const isMessageValid = validateMessage(messageTextarea);

    if (isNameValid && isEmailValid && isCategoryValid && isMessageValid) {
      // Valid Submission
      const studentName = nameInput.value.trim();

      // Show inline success banner
      if (successUserName) successUserName.textContent = studentName;
      if (successBanner) {
        successBanner.style.display = 'block';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Hide the form
      form.style.display = 'none';

      // Trigger global toast notification
      if (window.showToast) {
        window.showToast(`Thank you, ${studentName}! Inquiry received.`, 'success');
      }
    } else {
      // Trigger error toast
      if (window.showToast) {
        window.showToast('Please correct the highlighted fields before submitting.', 'error');
      }
    }
  });

  // Send Another Inquiry Reset
  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', () => {
      form.reset();
      clearValidationStyles(nameInput);
      clearValidationStyles(emailInput);
      clearValidationStyles(categorySelect);
      clearValidationStyles(messageTextarea);
      if (charCounter) charCounter.textContent = '0 / 15 min';
      if (successBanner) successBanner.style.display = 'none';
      form.style.display = 'block';
      nameInput.focus();
    });
  }
}

/**
 * Validation Logic: Full Name
 * Must be at least 3 characters and contain valid letters.
 */
function validateName(input) {
  const val = input.value.trim();
  const nameRegex = /^[a-zA-Z\s'.]{3,}$/;
  const isValid = nameRegex.test(val);

  if (!isValid) {
    setFieldState(input, false, 'Please enter a valid name (at least 3 alphabetic characters).');
    return false;
  } else {
    setFieldState(input, true);
    return true;
  }
}

/**
 * Validation Logic: Email Address
 * Strict regex conforming to standard RFC email patterns.
 */
function validateEmail(input) {
  const val = input.value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(val);

  if (!isValid) {
    setFieldState(input, false, 'Please enter a valid email address (e.g. name@domain.com).');
    return false;
  } else {
    setFieldState(input, true);
    return true;
  }
}

/**
 * Validation Logic: Category Selection
 */
function validateCategory(select) {
  const val = select.value;
  const isValid = val !== '';

  if (!isValid) {
    setFieldState(select, false, 'Please select an inquiry category.');
    return false;
  } else {
    setFieldState(select, true);
    return true;
  }
}

/**
 * Validation Logic: Message
 * Minimum 15 characters.
 */
function validateMessage(textarea) {
  const val = textarea.value.trim();
  const isValid = val.length >= 15;

  if (!isValid) {
    setFieldState(textarea, false, `Message is too brief (${val.length}/15 characters minimum).`);
    return false;
  } else {
    setFieldState(textarea, true);
    return true;
  }
}

function setFieldState(element, isValid, errorMessage = '') {
  const formGroup = element.closest('.form-group');
  if (!formGroup) return;

  const errorMsgEl = formGroup.querySelector('.input-error-msg');

  if (isValid) {
    formGroup.classList.remove('has-error');
    formGroup.classList.add('has-success');
    if (errorMsgEl) errorMsgEl.style.display = 'none';
  } else {
    formGroup.classList.remove('has-success');
    formGroup.classList.add('has-error');
    if (errorMsgEl) {
      errorMsgEl.textContent = errorMessage;
      errorMsgEl.style.display = 'block';
    }
  }
}

function clearValidationStyles(element) {
  const formGroup = element.closest('.form-group');
  if (!formGroup) return;
  formGroup.classList.remove('has-error', 'has-success');
  const errorMsgEl = formGroup.querySelector('.input-error-msg');
  if (errorMsgEl) errorMsgEl.style.display = 'none';
}

/**
 * 2. Interactive Cupertino Accordion FAQ
 * Features smooth animated height transitions, accessible aria-expanded attributes,
 * and auto-collapsing of inactive accordion items.
 */
function initFaqAccordion() {
  const accordionContainer = document.getElementById('faqAccordion');
  if (!accordionContainer) return;

  const triggers = accordionContainer.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parentItem = trigger.closest('.accordion-item');
      const body = parentItem.querySelector('.accordion-body');
      const isOpen = parentItem.classList.contains('is-open');

      // Close all other open items first (Accordion behavior)
      const allItems = accordionContainer.querySelectorAll('.accordion-item');
      allItems.forEach(item => {
        if (item !== parentItem && item.classList.contains('is-open')) {
          item.classList.remove('is-open');
          item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          const otherBody = item.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = '0px';
        }
      });

      // Toggle clicked item
      if (isOpen) {
        parentItem.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0px';
      } else {
        parentItem.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        // Set dynamic height based on scrollHeight for seamless animation
        body.style.maxHeight = `${body.scrollHeight + 20}px`;
      }
    });
  });
}
