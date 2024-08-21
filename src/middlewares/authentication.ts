import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config as envConfig } from "dotenv";
envConfig()

const secret = process.env.JWT_KEY;

export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No token, authorization denied",
        });
    }

    try {
        const token = authToken.split(" ")[1];

        if (!secret) {
            throw new Error("JWT_KEY is not defined in environment variables");
        }

        const user = jwt.verify(token, secret);
        req.user = user;

        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token is expired" });
        }
        if (err.name === "JsonWebTokenError") {
            console.log("Invalid token:", err);
            return res.status(401).json({ message: "Invalid token" });
        }

        console.error('Token verification error:', err);
        return res.status(500).json({ message: "An error occurred during token verification" });
    }
};
