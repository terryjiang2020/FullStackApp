import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserForm.css';
import { validateEmail, checkPasswordStrength, validateMobile } from '../utils/validation';
import { Notification } from './Notification';

export function CreateUser() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    level: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({
    submitting: false,
    message: '',
    type: ''
  });

  // validateEmail, checkPasswordStrength are now imported from validation.js

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    // Validate fields as user types
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let tempErrors = { ...errors };

    switch (fieldName) {
      case 'name':
        tempErrors.name = value.trim() === '' ? 'Name is required' : '';
        break;
      case 'email':
        if (value.trim() === '') {
          tempErrors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          tempErrors.email = 'Invalid email format';
        } else {
          tempErrors.email = '';
        }
        break;
      case 'mobile':
        if (value.trim() === '') {
          tempErrors.mobile = 'Mobile number is required';
        } else if (!validateMobile(value)) {
          tempErrors.mobile = 'Invalid mobile number format (10 digits required)';
        } else {
          tempErrors.mobile = '';
        }
        break;
      case 'password':
        const strength = checkPasswordStrength(value);
        setPasswordStrength(strength);
        tempErrors.password = value.trim() === '' ? 'Password is required' : '';
        
        // Check password confirmation match if it exists
        if (inputs.confirmPassword && value !== inputs.confirmPassword) {
          tempErrors.confirmPassword = 'Passwords do not match';
        } else {
          tempErrors.confirmPassword = '';
        }
        break;
      case 'confirmPassword':
        tempErrors.confirmPassword = value !== inputs.password ? 'Passwords do not match' : '';
        break;
      default:
        break;
    }

    setErrors(tempErrors);
  };

  const validateForm = () => {
    let isValid = true;
    let tempErrors = {};

    if (!inputs.name || inputs.name.trim() === '') {
      tempErrors.name = 'Name is required';
      isValid = false;
    }

    if (!inputs.email || inputs.email.trim() === '') {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(inputs.email)) {
      tempErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!inputs.mobile || inputs.mobile.trim() === '') {
      tempErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!validateMobile(inputs.mobile)) {
      tempErrors.mobile = 'Invalid mobile number format (10 digits required)';
      isValid = false;
    }

    if (!inputs.password || inputs.password.trim() === '') {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (passwordStrength.level === 'weak') {
      tempErrors.password = passwordStrength.message;
      isValid = false;
    }

    if (inputs.password !== inputs.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitStatus({
      submitting: true,
      message: 'Creating user...',
      type: 'info'
    });

    // Remove confirmPassword from the data sent to the server
    const userData = { ...inputs };
    delete userData.confirmPassword;

    try {
      const response = await axios.post('http://localhost:8005/api/', userData);
      
      if (response.data.status === 1) {
        setSubmitStatus({
          submitting: false,
          message: 'User created successfully!',
          type: 'success'
        });
        
        // Reset form after successful submission
        setInputs({
          name: '',
          email: '',
          mobile: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to user list after a delay
        setTimeout(() => navigate('/'), 2000);
      } else {
        // Handle specific error cases
        if (response.data.message.includes('Email already exists')) {
          setErrors({
            ...errors,
            email: 'Email already exists. Please use a different email address.'
          });
        }
        
        setSubmitStatus({
          submitting: false,
          message: response.data.message || 'Failed to create user',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle network or server errors
      setSubmitStatus({
        submitting: false,
        message: error.response?.data?.message || 'An error occurred while connecting to the server',
        type: 'error'
      });
    }
  };

  return (
    <div className="create-user-container">
      <h1>Create User</h1>
      
      {submitStatus.message && submitStatus.type === 'success' && (
        <Notification 
          message={submitStatus.message}
          type="success"
          duration={3000}
          onDismiss={() => setSubmitStatus(prev => ({ ...prev, message: '' }))}
        />
      )}
      
      {submitStatus.message && (submitStatus.type === 'error' || submitStatus.type === 'info') && (
        <div className={`alert alert-${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={inputs.name || ''}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            id="email"
            name="email"
            value={inputs.email || ''}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="mobile">Mobile: </label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={inputs.mobile || ''}
            onChange={handleChange}
            className={errors.mobile ? 'input-error' : ''}
          />
          {errors.mobile && <div className="error-message">{errors.mobile}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password || ''}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
          
          {inputs.password && (
            <div className="password-strength-meter">
              <div className="strength-bars">
                <div 
                  className={`strength-bar ${passwordStrength.score >= 1 ? passwordStrength.level : ''} ${passwordStrength.score >= 1 ? 'active' : ''}`}
                ></div>
                <div 
                  className={`strength-bar ${passwordStrength.score >= 2 ? passwordStrength.level : ''} ${passwordStrength.score >= 2 ? 'active' : ''}`}
                ></div>
                <div 
                  className={`strength-bar ${passwordStrength.score >= 3 ? passwordStrength.level : ''} ${passwordStrength.score >= 3 ? 'active' : ''}`}
                ></div>
                <div 
                  className={`strength-bar ${passwordStrength.score >= 4 ? passwordStrength.level : ''} ${passwordStrength.score >= 4 ? 'active' : ''}`}
                ></div>
                <div 
                  className={`strength-bar ${passwordStrength.score >= 5 ? passwordStrength.level : ''} ${passwordStrength.score >= 5 ? 'active' : ''}`}
                ></div>
                <div 
                  className={`strength-bar ${passwordStrength.score >= 6 ? passwordStrength.level : ''} ${passwordStrength.score >= 6 ? 'active' : ''}`}
                ></div>
              </div>
              <div className="strength-text">
                <strong>Password Strength: </strong>
                {passwordStrength.level === 'weak' && <span style={{color: '#ff3860'}}>{passwordStrength.message}</span>}
                {passwordStrength.level === 'medium' && <span style={{color: '#ffaa00'}}>{passwordStrength.message}</span>}
                {passwordStrength.level === 'strong' && <span style={{color: '#23d160'}}>{passwordStrength.message}</span>}
              </div>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password: </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={inputs.confirmPassword || ''}
            onChange={handleChange}
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
        
        <button 
          type="submit" 
          disabled={submitStatus.submitting}
          className="submit-button"
        >
          {submitStatus.submitting ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}
