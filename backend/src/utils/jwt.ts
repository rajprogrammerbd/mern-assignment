// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { IUser, JwtPayload } from '../types/index';
import prisma from './db';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-strong-default-secret';

export type TokenType = 'access' | 'refresh';

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    issuer: 'task-management',
    audience: 'web',
  });
};

export const verifyToken = async (token: string): Promise<IUser> => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!payload.id) {
      throw new Error('Token payload missing userId');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    return user;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    console.error(error);
    throw new Error('Token verification failed');
  }
};

export const extractToken = (req: Request): string | undefined => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }

  if (req.cookies?.jwt) {
    return req.cookies.jwt;
  }

  if (req.query?.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  return undefined;
};

export const generateTokenPair = (payload: JwtPayload) => {
  return {
    accessToken: generateToken(payload),
    refreshToken: generateToken(payload),
  };
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const decoded = await verifyToken(refreshToken);

    return generateTokenPair({
      id: decoded.id,
      email: decoded.email,
    });
  } catch (er) {
    console.error(er);
    throw new Error('Token refresh failed');
  }
};
