import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type TokenPayload } from "../Utils/tokenUtils";

/**
 * requireAuth
 * Validates the Bearer token in the Authorization header.
 * Attaches the decoded payload to `req.user` on success.
 *
 * Usage: router.get("/protected", requireAuth, handler)
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Unauthorized: missing or malformed Authorization header",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: "Unauthorized: invalid or expired token",
    });
  }
}

/**
 * requireScope
 * Checks that the authenticated user has a specific OAuth scope.
 * Must be used AFTER requireAuth.
 *
 * Usage: router.delete("/resource", requireAuth, requireScope("write"), handler)
 */
export function requireScope(scope: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const tokenScopes =
      (req.user as TokenPayload | undefined)?.scope?.split(" ") ?? [];

    if (!tokenScopes.includes(scope)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: missing required scope '${scope}'`,
      });
      return;
    }

    next();
  };
}
