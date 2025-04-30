/* eslint-disable @typescript-eslint/no-explicit-any */
import { body } from 'express-validator';

export const validateTaskUpdate = [
  body('taskId')
    .notEmpty().withMessage('Task ID is required')
    .isString().withMessage('Task ID must be a string')
    .trim(),

  // Validate userId (missing in original validator)
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string')
    .trim(),

  // Validate fieldChange object
  body('fieldChange')
    .notEmpty().withMessage('Field changes are required')
    .isObject().withMessage('Field changes must be an object')
    .custom((fieldChange: Record<string, any>) => {
      const allowedFields = ['title', 'description', 'priority', 'status', 'dueDate'];
      const changedFields = Object.keys(fieldChange);
      
      // Check if any invalid fields are present
      const invalidFields = changedFields.filter(f => !allowedFields.includes(f));
      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }

      // Validate each field's value type
      for (const [field, value] of Object.entries(fieldChange)) {
        switch (field) {
          case 'title':
          case 'description':
            if (typeof value !== 'string') return false;
            break;
          case 'priority':
            if (typeof value !== 'number' || value < 0) return false;
            break;
          case 'status':
            if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(value)) return false;
            break;
          case 'dueDate':
            if (isNaN(Date.parse(value))) return false;
            break;
        }
      }
      return true;
    }).withMessage('Invalid field changes'),

  // Remove these if they're not in your interface
  // body('newValue')...
  // body('previousValue')...
  // body('changeType')...
];