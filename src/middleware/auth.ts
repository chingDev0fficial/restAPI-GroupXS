import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
    sub: string;
    email?: string;
    iat?: number;
    exp?: number;
}

export interface AuthRequest extends Request {
    user?: { id: string; email?: string | undefined };
}

export function requireJwt(req: Request, res: Response, next: NextFunction): void | Response {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, error: "Missing or invalid authorization header" });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as AuthRequest).user = { id: payload.sub, email: payload.email ?? undefined };
        next();
    } catch {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }
}