import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// In-memory user store (replace with DB later)
export const usersByGoogleId = new Map<
    string,
    { id: string; googleId: string; email: string; displayName: string; photo: string | undefined }
>();

passport.use(
new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    (_accessToken, _refreshToken, profile, done) => {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value ?? "";
    const displayName = profile.displayName ?? "";
    const photo = profile.photos?.[0]?.value;

    let user = usersByGoogleId.get(googleId);
    if (!user) {
        user = {
        id: `user-${Date.now()}`,
        googleId,
        email,
        displayName,
        photo,
    };
        usersByGoogleId.set(googleId, user);
        }
            return done(null, user);
        }
    )
);

export default passport;