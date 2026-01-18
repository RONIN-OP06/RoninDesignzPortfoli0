// form validation
import { CONFIG } from './config';

export class FormValidator {
  constructor() {
    this.validators = {
      name: this._validateName.bind(this),
      email: this._validateEmail.bind(this),
      password: this._validatePassword.bind(this),
      phone: this._validatePhone.bind(this)
    };
  }

  _validateName(value) {
    if (!value || value.trim().length === 0) {
      return { isValid: false, message: 'Name is required' };
    }
    if (value.trim().length < CONFIG.VALIDATION.NAME.MIN_LENGTH) {
      return { isValid: false, message: `Name must be at least ${CONFIG.VALIDATION.NAME.MIN_LENGTH} characters` };
    }
    return { isValid: true, message: '' };
  }

  _validateEmail(value) {
    if (!value || value.trim().length === 0) {
      return { isValid: false, message: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    const domain = value.split('@')[1]?.toLowerCase();
    if (domain && !CONFIG.VALIDATION.EMAIL.ALLOWED_DOMAINS.includes(domain)) {
      return { isValid: false, message: `Email must be from one of: ${CONFIG.VALIDATION.EMAIL.ALLOWED_DOMAINS.join(', ')}` };
    }
    
    return { isValid: true, message: '' };
  }

  _validatePassword(value) {
    if (!value || value.length === 0) {
      return { isValid: false, message: 'Password is required' };
    }
    
    if (value.length < CONFIG.VALIDATION.PASSWORD.MIN_LENGTH) {
      return { isValid: false, message: `Password must be at least ${CONFIG.VALIDATION.PASSWORD.MIN_LENGTH} characters` };
    }
    
    if (CONFIG.VALIDATION.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(value)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    
    if (CONFIG.VALIDATION.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(value)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    
    if (CONFIG.VALIDATION.PASSWORD.REQUIRE_NUMBER && !/[0-9]/.test(value)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    
    return { isValid: true, message: '' };
  }

  _validatePhone(value) {
    if (!value || value.length === 0) {
      return { isValid: false, message: 'Phone number is required' };
    }
    
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== CONFIG.VALIDATION.PHONE.LENGTH) {
      return { isValid: false, message: `Phone number must be ${CONFIG.VALIDATION.PHONE.LENGTH} digits` };
    }
    
    return { isValid: true, message: '' };
  }

  validate(field, value) {
    const validator = this.validators[field];
    if (!validator) {
      return { isValid: null, message: '' };
    }
    return validator(value);
  }
}


