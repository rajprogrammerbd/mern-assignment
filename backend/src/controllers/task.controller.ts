/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { createTaskValidation } from '../validators/taskCreationValidator';
import TaskService from '../services/task.service';
import { validateTaskUpdate } from '../validators/taskUpdatedValidator';

/**
 * TaskController - Handles all task-related operations
 */
export default abstract class TaskController {
  /**
   * Express-validator middleware for task creation validation
   */
  static createTaskValidation = createTaskValidation;

  static taskUpdatedValidator = validateTaskUpdate;

  /**
   * Deletes a task
   * @param req Express request object with taskId in params and user email in request
   * @param res Express response object
   */
  static deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const { email } = req.user;

      await TaskService.deleteTask({ taskId, email });

      res.status(201).end();
    } catch (err: any) {
      console.log('error visible', err);
      res.status(err?.statusCode || 500).json({
        error: true,
        message: err?.message || 'Internal Server Error',
      });
    }
  };

  /**
   * Creates a new task
   * @param req Express request object with task data in body
   * @param res Express response object
   */
  static createTask = async (req: Request, res: Response) => {
    try {
      await TaskService.createTask(req.body);

      res.status(201).end();
    } catch (err: any) {
      res.status(err?.statusCode || 500).json({
        error: true,
        message: err?.message || 'Internal Server Error',
      });
    }
  };

  /**
   * Gets all tasks
   * @param req Express request object
   * @param res Express response object with array of tasks
   */
  static getAllTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await TaskService.getAllTasks();

      res.status(200).json(tasks);
    } catch (err: any) {
      res.status(err?.statusCode || 500).json({
        error: true,
        message: err?.message || 'Internal Server Error',
      });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      await TaskService.updateTask({
        ...req.body
      });

      res.status(201).end();
    } catch (err: any) {
      res.status(err?.statusCode || 500).json({
        error: true,
        message: err?.message || 'Internal Server Error',
      });
    }
  };
}
