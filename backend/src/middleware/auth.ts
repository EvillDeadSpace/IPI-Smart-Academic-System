import { NextFunction, Request, Response } from "express";
import { AuthUser, UserRole, isAuthConfigured, verifyToken } from "../utils/jwt";

/**
 * Requires `Authorization: Bearer <jwt>` and one of `roles`.
 * The verified user is stored on `res.locals.user` — handlers must take identity from
 * there, never from the request body or URL.
 */
export const requireAuth =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!isAuthConfigured()) {
      // Fail closed: without a secret nothing can be verified.
      return res
        .status(503)
        .json({ error: "Authentication is not configured", code: "AUTH_NOT_CONFIGURED" });
    }

    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token) {
      return res.status(401).json({ error: "Missing token", code: "UNAUTHENTICATED" });
    }

    let user: AuthUser;
    try {
      user = verifyToken(token);
    } catch {
      return res.status(401).json({ error: "Invalid or expired token", code: "UNAUTHENTICATED" });
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({ error: "Insufficient role", code: "FORBIDDEN" });
    }

    res.locals.user = user;
    next();
  };

export const currentUser = (res: Response) => res.locals.user as AuthUser;
