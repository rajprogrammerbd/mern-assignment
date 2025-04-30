import { body } from 'express-validator';

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3, max: 15 })
    .withMessage(
      'Username must be at least 3 characters long and at most 15 characters long.'
    ),

  body('email').isEmail().withMessage('Email is invalid.').normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];

/**
 * Validation rules for user login
 */
export const loginValidation = [
  body('email').isEmail().withMessage('Email is invalid.').normalizeEmail(),

  body('password').notEmpty().withMessage('Password is required.'),
];
