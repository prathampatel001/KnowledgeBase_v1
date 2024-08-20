
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.header('Authorization');
    // console.log("err=>",token);

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("decoded token=>",decoded);
    
    req.headers.userId = (decoded as any).userId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
