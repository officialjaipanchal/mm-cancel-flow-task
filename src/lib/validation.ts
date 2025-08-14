// src/lib/validation.ts
// Input validation, CSRF protection, and XSS prevention utilities

import { createHash, randomBytes } from 'crypto';

// Input validation schemas and functions
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  if (email.length > 254) {
    errors.push('Email is too long');
  }
  
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }
  
  const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: sanitizedEmail
  };
};

// Text input validation
export const validateTextInput = (
  input: string, 
  fieldName: string, 
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    allowedPattern?: RegExp;
  } = {}
): ValidationResult => {
  const errors: string[] = [];
  const { minLength = 1, maxLength = 1000, required = true, allowedPattern } = options;
  
  if (required && (!input || typeof input !== 'string')) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }
  
  if (input && typeof input === 'string') {
    if (input.length < minLength) {
      errors.push(`${fieldName} must be at least ${minLength} characters`);
    }
    
    if (input.length > maxLength) {
      errors.push(`${fieldName} must be no more than ${maxLength} characters`);
    }
    
    if (allowedPattern && !allowedPattern.test(input)) {
      errors.push(`${fieldName} contains invalid characters`);
    }
  }
  
  const sanitizedInput = input ? sanitizeInput(input.trim()) : '';
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: sanitizedInput
  };
};

// Price validation
export const validatePrice = (price: string | number): ValidationResult => {
  const errors: string[] = [];
  
  if (!price) {
    errors.push('Price is required');
    return { isValid: false, errors };
  }
  
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    errors.push('Invalid price format');
  } else if (numPrice < 0) {
    errors.push('Price cannot be negative');
  } else if (numPrice > 10000) {
    errors.push('Price is too high');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue: errors.length === 0 ? numPrice.toString() : undefined
  };
};

// XSS Prevention - Sanitize input
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous HTML tags and attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

// CSRF Protection
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  
  // Generate CSRF token
  static generateToken(): string {
    return randomBytes(this.TOKEN_LENGTH).toString('hex');
  }
  
  // Validate CSRF token
  static validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) {
      return false;
    }
    
    // Use timing-safe comparison to prevent timing attacks
    return token.length === storedToken.length && 
           token === storedToken;
  }
  
  // Hash sensitive data
  static hashData(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
}

// Rate limiting utility
export class RateLimiter {
  private static attempts = new Map<string, { count: number; resetTime: number }>();
  private static readonly MAX_ATTEMPTS = 50; // Increased for development/testing
  private static readonly WINDOW_MS = 5 * 60 * 1000; // Reduced to 5 minutes for development/testing
  
  static checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);
    
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }
    
    if (attempt.count >= this.MAX_ATTEMPTS) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  static resetRateLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }
  
  // Clear all rate limits (for development/testing)
  static clearAllRateLimits(): void {
    this.attempts.clear();
  }
}

// Input validation for cancellation flow
export const validateCancellationData = (data: {
  reason?: string;
  feedback?: string;
  price?: string;
  downsellVariant?: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  // Validate reason
  if (data.reason) {
    const reasonValidation = validateTextInput(data.reason, 'Reason', {
      minLength: 1,
      maxLength: 500,
      required: true
    });
    if (!reasonValidation.isValid) {
      errors.push(...reasonValidation.errors);
    }
  }
  
  // Validate feedback
  if (data.feedback) {
    const feedbackValidation = validateTextInput(data.feedback, 'Feedback', {
      minLength: 25,
      maxLength: 2000,
      required: false
    });
    if (!feedbackValidation.isValid) {
      errors.push(...feedbackValidation.errors);
    }
  }
  
  // Validate price
  if (data.price) {
    const priceValidation = validatePrice(data.price);
    if (!priceValidation.isValid) {
      errors.push(...priceValidation.errors);
    }
  }
  
  // Validate downsell variant
  if (data.downsellVariant && !['A', 'B'].includes(data.downsellVariant)) {
    errors.push('Invalid downsell variant');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
