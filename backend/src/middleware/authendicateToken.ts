import { NextFunction } from 'express';
import { BLACKLISTEDTOKENS, JWT_SECRET } from '../config/config';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Unauthorized' });
  if (BLACKLISTEDTOKENS.has(token)) return res.status(403).json({ message: 'Token has been revoked' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
