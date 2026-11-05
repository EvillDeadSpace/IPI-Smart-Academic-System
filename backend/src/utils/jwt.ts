import jwt from "jsonwebtoken";

export type UserRole = "STUDENT" | "PROFESSOR" | "ADMIN";

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
};

const TOKEN_TTL = "7d";

// Read at call time so tests and deploys can set it after import.
const getSecret = () => process.env.JWT_SECRET;

export const isAuthConfigured = () => Boolean(getSecret());

/** Returns null when JWT_SECRET is not set, so login keeps working on an unconfigured deploy. */
export function signToken(user: AuthUser): string | null {
  const secret = getSecret();
  if (!secret) return null;
  return jwt.sign({ email: user.email, role: user.role }, secret, {
    subject: String(user.id),
    expiresIn: TOKEN_TTL,
    algorithm: "HS256",
  });
}

/** Throws on a missing secret, bad signature, wrong algorithm, or expired token. */
export function verifyToken(token: string): AuthUser {
  const secret = getSecret();
  if (!secret) throw new Error("JWT_SECRET is not configured");

  const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
  if (typeof payload === "string" || !payload.sub) throw new Error("Malformed token");

  return {
    id: Number(payload.sub),
    email: String(payload.email),
    role: payload.role as UserRole,
  };
}
