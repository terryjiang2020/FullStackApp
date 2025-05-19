/**
 * Email validation using regular expression
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Password strength checker with multiple levels of validation
 * 
 * Level 1: Basic validation (length)
 * Level 2: Character type requirements (uppercase, lowercase, numbers)
 * Level 3: Additional security features (special characters, length >= 10)
 * 
 * @param {string} password - Password to check
 * @returns {Object} Object containing score, level and message
 */
export const checkPasswordStrength = (password) => {
  let score = 0;
  let level = 'weak';
  let message = '';

  // Check if password is empty
  if (!password || password.length === 0) {
    message = 'Password is required';
    return { score, level, message };
  }

  // Level 1: Basic Length check
  if (password.length < 8) {
    message = 'Password must be at least 8 characters long';
    return { score, level, message };
  }

  score++;

  // Level 2: Character type diversity
  
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    message = 'Password should contain at least one uppercase letter';
    return { score, level, message };
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    message = 'Password should contain at least one lowercase letter';
    return { score, level, message };
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    score++;
  } else {
    message = 'Password should contain at least one number';
    return { score, level, message };
  }

  // Level 3: Additional security features
  
  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }
  
  // Check for longer length (extra points for 10+ characters)
  if (password.length >= 10) {
    score++;
  }

  // Determine strength level based on comprehensive score
  if (score < 3) {
    level = 'weak';
    message = 'Weak - Use a mix of different character types';
  } else if (score < 5) {
    level = 'medium';
    message = 'Medium - Add special characters and increase length for a stronger password';
  } else {
    level = 'strong';
    message = 'Strong - Your password is secure';
  }

  return { score, level, message };
};

/**
 * Mobile number validation
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} True if mobile number is valid, false otherwise
 */
export const validateMobile = (mobile) => {
  // Basic validation - can be extended based on country requirements
  const re = /^\d{10}$/; // Simple 10-digit number validation
  return re.test(String(mobile).replace(/\s+/g, ''));
};
