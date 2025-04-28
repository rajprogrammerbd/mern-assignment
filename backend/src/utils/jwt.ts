// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { JwtPayload } from '../types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'your-strong-default-secret';

export type TokenType = 'access' | 'refresh';

export const generateToken = (
  payload: JwtPayload,
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    issuer: 'task-management',
    audience: 'web',
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new Error('Invalid or expired token');
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

export const refreshTokens = (refreshToken: string) => {
  const decoded = verifyToken(refreshToken);

  return generateTokenPair({
    userId: decoded.userId,
    email: decoded.email,
  });
};
