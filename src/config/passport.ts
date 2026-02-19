import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// ─── In-Memory OAuth State Store (CSRF Protection) ──────────────────────────
// Stores short-lived state handles to verify Google's redirect is legitimate.
// Replace with Redis in production for multi-instance deployments.
const stateMap = new Map<string, number>(); // handle -> expiry timestamp

const mapStateStore = {
  // Called during initiation: generate + store a handle, return it to passport
  store: (...args: any[]) => {
    const callback = args[args.length - 1] as (
      err: Error | null,
      handle: string,
    ) => void;
    const handle = crypto.randomBytes(16).toString("hex");
    stateMap.set(handle, Date.now() + 10 * 60 * 1000); // 10 min TTL
    callback(null, handle);
  },

  // Called during callback: verify handle is valid and one-time-use
  verify: (...args: any[]) => {
    const callback = args[args.length - 1] as (
      err: Error | null,
      ok: boolean,
    ) => void;
    const handle = args[1] as string;
    const expiry = stateMap.get(handle);

    if (!expiry || Date.now() > expiry) {
      stateMap.delete(handle);
      callback(null, false); // Invalid or expired → CSRF check fails
      return;
    }

    stateMap.delete(handle); // ✅ One-time use
    callback(null, true);
  },
};

// Cleanup expired handles every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [handle, expiry] of stateMap.entries()) {
      if (now > expiry) stateMap.delete(handle);
    }
  },
  5 * 60 * 1000,
);

// ─── Google OAuth 2.0 Strategy ───────────────────────────────────────────────
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

/** True only when both Google credentials are present in .env */
export const isGoogleConfigured = Boolean(googleClientId && googleClientSecret);

if (!isGoogleConfigured) {
  console.warn(
    "[passport] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — " +
      "Google OAuth routes will be unavailable until .env is configured.",
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL ?? "",
        store: mapStateStore as any, // plug in our CSRF state store
      },
      (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        // Build a clean user object from the Google profile.
        // In production: upsert this into your DB and return the DB user.
        const user = {
          id: profile.id,
          email: profile.emails?.[0]?.value ?? "",
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value ?? "",
          provider: "google" as const,
        };

        return done(null, user);
      },
    ),
  );
}

export default passport;
