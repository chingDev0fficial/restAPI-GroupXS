import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ─── Types ───────────────────────────────────────────────────────────────────
export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  scope: string;
}

// ─── PKCE — for public clients (SPA / mobile) ────────────────────────────────
// The server generates these; the client sends codeChallenge in the auth request
// and codeVerifier when exchanging the authorization code.
export function generatePKCE(): {
  codeVerifier: string;
  codeChallenge: string;
} {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { codeVerifier, codeChallenge };
}

// ─── JWT helpers ─────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-in-production";

const BASE_OPTIONS: jwt.SignOptions = {
  issuer: "restapi",
  audience: "restapi-client",
};

/**
 * Generates a short-lived access token (15 min).
 * Keep this short — if stolen it expires quickly.
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    ...BASE_OPTIONS,
    expiresIn: "15m",
  });
}

/**
 * Generates a longer-lived refresh token (7 days).
 * Store this securely; rotate on every use.
 */
export function generateRefreshToken(sub: string): string {
  return jwt.sign({ sub, type: "refresh" }, JWT_SECRET, {
    ...BASE_OPTIONS,
    expiresIn: "7d",
  });
}

/**
 * Verifies and decodes an access token.
 * Throws if the token is invalid, expired, or tampered with.
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET, BASE_OPTIONS) as TokenPayload;
}

/**
 * Verifies and decodes a refresh token.
 * Throws if invalid or expired. Also checks the `type` claim.
 */
export function verifyRefreshToken(token: string): {
  sub: string;
  type: string;
} {
  const decoded = jwt.verify(token, JWT_SECRET, BASE_OPTIONS) as {
    sub: string;
    type: string;
  };
  if (decoded.type !== "refresh") throw new Error("Invalid token type");
  return decoded;
}

/**
 * Returns true when the access token expires within `bufferSeconds` (default 60 s).
 * Use this on the client to proactively refresh before expiry.
 */
export function isTokenExpiringSoon(
  token: string,
  bufferSeconds = 60,
): boolean {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000) + bufferSeconds;
}
