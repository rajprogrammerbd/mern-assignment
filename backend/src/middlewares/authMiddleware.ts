import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/jwt'; // Adjust the path as needed

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      res
        .status(401)
        .json({ error: true, message: 'No token provided, please log in' });

      return;
    }

    const decoded = await verifyToken(token);

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({ error: true, message: 'Invalid or expired token' });

    return;
  }
};
