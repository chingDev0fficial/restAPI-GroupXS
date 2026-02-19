import type { Request, Response } from "express";
import Controller from "./Controller";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  type TokenPayload,
} from "../../../Utils/tokenUtils";

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  avatar: string;
  provider: "google";
}

export default class AuthController extends Controller {
  /**
   * GET /api/v1/auth/google/callback
   *
   * Called by Passport after a successful Google OAuth handshake.
   * Issues a JWT access token + refresh token, then redirects to the frontend.
   */
  public googleCallback(req: Request, res: Response): void {
    const user = req.user as GoogleUser | undefined;

    if (!user) {
      this.sendErrorResponse(res, "Authentication failed", 401);
      return;
    }

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      scope: "read write", // tailor scopes to your app's needs
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(user.id);

    this.sendSuccessResponse(res, {
      accessToken,
      refreshToken,
    });

    // const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

    // Redirect the browser back to the frontend with tokens in the URL.
    // Production recommendation: use HttpOnly cookies instead to prevent XSS.
    // res.redirect(
    //   `${frontendUrl}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`,
    // );
    // res.redirect(
    //   `https://editor.swagger.io/?access_token=${accessToken}&refresh_token=${refreshToken}`,
    // );
  }

  /**
   * POST /api/v1/auth/refresh
   * Body: { refreshToken: string }
   *
   * Validates the refresh token and issues a new access + refresh token pair.
   * ✅ Refresh token rotation: every use invalidates the old refresh token.
   * TODO: persist refresh tokens in DB and add a revocation/blocklist check.
   */
  public async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      this.sendErrorResponse(res, "refreshToken is required", 400);
      return;
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);

      // TODO: fetch fresh user claims from DB using decoded.sub
      const newPayload: TokenPayload = {
        sub: decoded.sub,
        email: "", // fetch from DB
        name: "", // fetch from DB
        scope: "read write",
      };

      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(decoded.sub); // rotate

      this.sendSuccessResponse(res, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch {
      this.sendErrorResponse(res, "Invalid or expired refresh token", 401);
    }
  }

  /**
   * POST /api/v1/auth/logout
   *
   * Stateless logout — the client must discard both tokens.
   * TODO: add the access token to a short-lived blocklist (e.g. Redis TTL = token expiry)
   *       and add the refresh token to a permanent revocation list in the DB.
   */
  public logout(_req: Request, res: Response): void {
    this.sendSuccessResponse(res, {
      message: "Logged out successfully. Please discard your tokens.",
    });
  }
}
