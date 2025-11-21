import { body, validationResult } from 'express-validator';

/**
 * Validation middleware for common inputs
 */

// Email validation
export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email address');

// Password validation (relaxed for existing users, can be strengthened later)
export const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');
  // Optional: Uncomment for stronger passwords
  // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');

// Name validation
export const validateName = body('name')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('Name can only contain letters and spaces');

// Description validation
export const validateDescription = body('description')
  .trim()
  .isLength({ min: 10, max: 1000 })
  .withMessage('Description must be between 10 and 1000 characters');

// Coordinates validation
export const validateLat = body('lat')
  .isFloat({ min: -90, max: 90 })
  .withMessage('Latitude must be between -90 and 90');

export const validateLng = body('lng')
  .isFloat({ min: -180, max: 180 })
  .withMessage('Longitude must be between -180 and 180');

// Check validation results
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

