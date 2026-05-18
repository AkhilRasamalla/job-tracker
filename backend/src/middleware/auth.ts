import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include the authenticated user id
export interface AuthRequest extends Request {
  userId?: string;
}

// Middleware that verifies the JWT from the Authorization header
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  console.log('[auth] Checking Authorization header');

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    console.log(`[auth] Token valid for userId: ${decoded.userId}`);
    next();
  } catch (error) {
    console.error('[auth] Token verification failed:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
