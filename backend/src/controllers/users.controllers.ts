/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserService from '../services/users.services';
import {
  loginValidation,
  registerValidation,
} from '../validators/userValidator';
import { validationResult } from 'express-validator';
import chalk from 'chalk';
import { getIO } from '../routes/socket.route';

/**
 * UserController - Handles all user-related operations
 */
export default abstract class UserController {
  /**
   * Express-validator middleware for user registration validation
   */
  static registerValidation = registerValidation;

  /**
   * Express-validator middleware for user login validation
   */
  static loginValidation = loginValidation;

  /**
   * Handles user login
   * @param req Express request object
   * @param res Express response object
   */
  static loginUser = async (req: Request, res: Response) => {
    try {
      console.log(chalk.bgGreen.white('Login'), 'user login');
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });

        return;
      }

      const user = await UserService.loginUser(req.body);

      res
        .cookie('refreshToken', user.token.refresh_token, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json(user);
    } catch (err: any) {
      res.status(err?.statusCode || 500).json({
        error: true,
        message: err?.message || 'Internal Server Error',
      });
    }
  };

  /**
   * Gets list of all users (requires authentication)
   * @param req Express request object
   * @param res Express response object
   */
  static getUserList = async (req: Request, res: Response) => {
    try {
      const users = await UserService.getUserList();

      res.status(200).json(users);
    } catch (err: any) {
      res.status(err?.statusCode || 500).json({
        error: true,
        message: err?.message || 'Internal Server Error',
      });
    }
  };

  /**
   * Handles new user registration
   * @param req Express request object
   * @param res Express response object
   */
  static createUser = async (req: Request, res: Response) => {
    try {
      console.log(chalk.bgGreen.white('registration'), 'user registration');
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          data: { error: true, message: errors.array()[0].msg },
          status: 400,
        });

        return;
      }

      const user = await UserService.createUser(req.body);
      const io = getIO();
      const userList = await UserService.getUserList();

      io.emit('all_users', userList);

      res
        .cookie('refreshToken', user.token.refresh_token, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json(user);
    } catch (err: any) {
      res.status(err?.statusCode || 500).json({
        error: true,
        message: err?.message || 'Internal Server Error',
      });
    }
  };
}
