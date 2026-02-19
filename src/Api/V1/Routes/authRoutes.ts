import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import passport, { isGoogleConfigured } from "../../../Config/passport";
import AuthController from "../Controllers/AuthController";

// Guard — returns 503 if Google credentials are missing in .env
function requireGoogleConfigured(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!isGoogleConfigured) {
    res.status(503).json({
      success: false,
      error:
        "Google OAuth is not configured. " +
        "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.",
    });
    return;
  }
  next();
}

const router = Router();
const authController = new AuthController();

/**
 * GET /api/v1/auth/google
 *
 * Step 1 — Redirect the user to Google's consent screen.
 * `state: true` tells Passport to generate a random state handle and store it
 * via our custom MapStateStore (CSRF protection, no session required).
 */
router.get(
  "/google",
  requireGoogleConfigured,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: true, // ✅ CSRF protection via MapStateStore in passport.ts
    session: false,
  }),
);

/**
 * GET /api/v1/auth/google/callback
 *
 * Step 2 — Google redirects here with ?code=...&state=...
 * Passport verifies the state via MapStateStore, exchanges the code for tokens,
 * fetches the user profile, then calls googleCallback.
 */
router.get(
  "/google/callback",
  requireGoogleConfigured,
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/failure",
  }),
  authController.googleCallback.bind(authController),
);

/**
 * POST /api/v1/auth/refresh
 * Body: { "refreshToken": "<token>" }
 *
 * Exchange a valid refresh token for a new access + refresh token pair.
 */
router.post("/refresh", authController.refreshToken.bind(authController));

/**
 * POST /api/v1/auth/logout
 *
 * Notify the server of logout. Client must discard tokens on its end.
 */
router.post("/logout", authController.logout.bind(authController));

/**
 * GET /api/v1/auth/failure
 * Fallback when Google auth fails (e.g. user denied consent).
 */
router.get("/failure", (_req, res) => {
  res
    .status(401)
    .json({ success: false, error: "Google authentication failed" });
});

export default router;
