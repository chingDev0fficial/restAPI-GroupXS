import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Controller from "./Controller";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

export default class AuthController extends Controller {
  /**
   * Callback handler after Google OAuth. Expects req.user set by Passport.
   * Returns JSON with token (or redirects to frontend with token in query).
   */
  googleCallback(req: Request, res: Response) {
    const user = (req as any).user;
    if (!user) {
      return this.sendErrorResponse(res, "Not authenticated", 401);
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Option A: JSON response (e.g. for mobile or API-only clients)
    return this.sendSuccessResponse(res, {
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName, photo: user.photo },
    });

    // Option B: Redirect to frontend with token (uncomment and remove Option A if you prefer)
    // res.redirect(`${FRONTEND_URL}/auth/callback?token=${encodeURIComponent(token)}`);
  }

  /**
   * Get current user from JWT (use requireJwt middleware before this).
   */
  me(req: Request, res: Response) {
    const authReq = req as import("../middleware/auth").AuthRequest;
    const user = authReq.user;
    if (!user) {
      return this.sendErrorResponse(res, "Not authenticated", 401);
    }
    return this.sendSuccessResponse(res, { id: user.id, email: user.email });
  }
}