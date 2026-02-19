// Global Express type augmentations
// Extends Express.Request so `req.user` is typed throughout the app.
// Mirrors the shape of TokenPayload (kept in sync manually).
declare namespace Express {
  interface User {
    sub: string;
    email: string;
    name: string;
    scope: string;
  }
  interface Request {
    user?: User;
  }
}
