import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET =
  process.env.JWT_SECRET || "devportal-jwt-secret-change-in-production";

export interface AuthPayload {
  id: string;
  name: string;
  role: string;
  email: string;
}

// Extend Express Request to carry authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Middleware – verifies the JWT from the Authorization header and attaches
 * the decoded payload to `req.user`. Returns 401 if the token is missing
 * or invalid.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    const payload = decoded as jwt.JwtPayload & AuthPayload;
    req.user = {
      id: payload.id,
      name: payload.name,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Middleware – requires the authenticated user to have the "Admin" role.
 * Must be used after `authenticate`. Returns 403 if not Admin.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== "Admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}
