import crypto from "crypto";

/**
 * Rotating QR codes for attendance.
 *
 * The professor's browser gets the session secret once (when it opens the session) and
 * renders a new QR every WINDOW_MS. Each QR is `IPIATT1.<sessionId>.<window>.<signature>`
 * where signature = HMAC-SHA256(secret, "<sessionId>.<window>") in base64url.
 * The server recomputes the signature, so no per-rotation DB write is needed, and a photo
 * of the QR stops working after at most two windows.
 *
 * The web page (frontend/src/utils/attendanceToken.ts) implements the same signing with
 * Web Crypto — keep both in sync.
 */

export const QR_PREFIX = "IPIATT1";
export const WINDOW_MS = 15_000;

export const currentWindow = (nowMs: number = Date.now()) => Math.floor(nowMs / WINDOW_MS);

export const generateSessionSecret = () => crypto.randomBytes(32).toString("base64url");

export const signWindow = (secret: string, sessionId: number, window: number) =>
  crypto.createHmac("sha256", secret).update(`${sessionId}.${window}`).digest("base64url");

export const buildQrPayload = (secret: string, sessionId: number, window: number) =>
  `${QR_PREFIX}.${sessionId}.${window}.${signWindow(secret, sessionId, window)}`;

export type ParsedQr = { sessionId: number; window: number; signature: string };

export function parseQrPayload(payload: string): ParsedQr | null {
  const parts = payload.trim().split(".");
  if (parts.length !== 4 || parts[0] !== QR_PREFIX) return null;

  const sessionId = Number(parts[1]);
  const window = Number(parts[2]);
  if (!Number.isInteger(sessionId) || !Number.isInteger(window) || !parts[3]) return null;

  return { sessionId, window, signature: parts[3] };
}

/**
 * Valid when the signature matches AND the window is the current one or the previous one
 * (grace for a student who scans right as the code rotates).
 */
export function verifyQr(secret: string, qr: ParsedQr, nowMs: number = Date.now()): boolean {
  const now = currentWindow(nowMs);
  if (qr.window !== now && qr.window !== now - 1) return false;

  const expected = Buffer.from(signWindow(secret, qr.sessionId, qr.window));
  const received = Buffer.from(qr.signature);
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}
