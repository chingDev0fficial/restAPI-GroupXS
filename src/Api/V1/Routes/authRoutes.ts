import { Router } from "express";
import passport from "../../../config/passport";
import AuthController from "../Controllers/AuthController";
import { requireJwt } from "../../../middleware/auth";

const router = Router();
const authController = new AuthController();

// Start Google OAuth — redirects to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Google redirects here after login
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => authController.googleCallback(req, res)
);

// Protected: current user (requires Authorization: Bearer <token>)
router.get("/me", requireJwt, (req, res) => authController.me(req, res));

export default router;