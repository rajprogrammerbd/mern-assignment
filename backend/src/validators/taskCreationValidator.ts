import { body } from 'express-validator';
import { Priority, Status } from '../types';

/**
 * Express-validator rules for task creation
 */
export const createTaskValidation = [
  body('title').isString().withMessage('Title is required').notEmpty(),

  body('description')
    .isString()
    .withMessage('Description is required')
    .notEmpty(),

  body('priority')
    .isIn(Object.values(Priority))
    .withMessage(
      `Priority must be one of ${Object.values(Priority).join(', ')}`
    ),

  body('status')
    .isIn(Object.values(Status))
    .withMessage(`Status must be one of ${Object.values(Status).join(', ')}`),

  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date format')
    .notEmpty(),

  body('userId').isString().withMessage('User ID is required').notEmpty(),

  body('assignedTo')
    .isString()
    .withMessage('Assigned user ID is required')
    .notEmpty(),
];
