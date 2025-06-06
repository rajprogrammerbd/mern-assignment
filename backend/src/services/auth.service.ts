import bcrypt from 'bcryptjs';
import prisma from '../utils/db';
import { ApiError } from '../utils/ApiError';
import { generateTokenPair } from '../utils/jwt';
import { ILoginUserResponse, IUser } from '../types';

const SALT_ROUNDS = 12;

/**
 * AuthService - Handles authentication-related operations
 */
export class AuthService {
  /**
   * Registers a new user
   * @param username User's username
   * @param email User's email
   * @param password User's password
   * @returns {Promise<ILoginUserResponse>} User data and tokens
   * @throws {ApiError} If email is already in use
   */
  static async register(username: string, email: string, password: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(400, 'Email already in use');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = (await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    })) as IUser;

    // Generate JWT token
    const token = generateTokenPair({
      id: user.id,
      email: user.email,
    });

    return {
      user,
      token: {
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
      },
    };
  }

  /**
   * Logs in an existing user
   * @param email User's email
   * @param password User's password
   * @returns {Promise<ILoginUserResponse>} User data and tokens
   * @throws {ApiError} If credentials are invalid
   */
  static async login(
    email: string,
    password: string
  ): Promise<ILoginUserResponse> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = generateTokenPair({
      id: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token: {
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
      },
    };
  }

  /**
   * Gets user by ID
   * @param userId The user's ID
   * @returns {Promise<IUser | null>} User data or null if not found
   */
  static async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }
}
