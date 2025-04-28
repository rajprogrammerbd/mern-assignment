import { JwtPayload } from '../index'; // Adjust this path if needed

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
