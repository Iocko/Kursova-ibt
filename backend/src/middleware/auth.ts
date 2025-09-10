import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const JWT_SECRET = "super-secret-jwt-key-123456789";
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Please authenticate." });
  }
};
