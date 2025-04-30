/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ICreateUserProperties,
  ILoginUserProperties,
  ILoginUserResponse,
  IUser,
} from '../types';
import { ApiError } from '../utils/ApiError';
import prisma from '../utils/db';
import { AuthService } from './auth.service';

export default abstract class UserService {
  static createUser = async ({
    username,
    email,
    password,
  }: ICreateUserProperties): Promise<ILoginUserResponse> => {
    const newUser = AuthService.register(username, email, password);

    return newUser;
  };

  static getUserList = async (): Promise<IUser[]> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      if (users.length === 0) {
        return [];
      }

      return users;
    } catch (error: any) {
      throw new ApiError(error.statusCode, error);
    }
  };

  static loginUser = async ({
    email,
    password,
  }: ILoginUserProperties): Promise<ILoginUserResponse> => {
    const user = AuthService.login(email, password);

    return user;
  };
}
