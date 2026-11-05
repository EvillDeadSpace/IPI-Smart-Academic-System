import {
  WINDOW_MS,
  buildQrPayload,
  currentWindow,
  parseQrPayload,
  verifyQr,
} from "../../utils/attendanceToken";

const SECRET = "test-secret";
const SESSION_ID = 42;
const NOW = 1_800_000_000_000;

const qrFor = (window: number, secret = SECRET) =>
  parseQrPayload(buildQrPayload(secret, SESSION_ID, window))!;

describe("attendance QR token", () => {
  const now = currentWindow(NOW);

  it("accepts the current window", () => {
    expect(verifyQr(SECRET, qrFor(now), NOW)).toBe(true);
  });

  it("accepts the previous window (scan right at rotation)", () => {
    expect(verifyQr(SECRET, qrFor(now - 1), NOW)).toBe(true);
  });

  it("rejects a code two windows old (a forwarded photo)", () => {
    expect(verifyQr(SECRET, qrFor(now - 2), NOW)).toBe(false);
    expect(verifyQr(SECRET, qrFor(now), NOW + 2 * WINDOW_MS)).toBe(false);
  });

  it("rejects a future window", () => {
    expect(verifyQr(SECRET, qrFor(now + 1), NOW)).toBe(false);
  });

  it("rejects a tampered signature or session id", () => {
    const qr = qrFor(now);
    const flipped = qr.signature.slice(0, -1) + (qr.signature.endsWith("A") ? "B" : "A");
    expect(verifyQr(SECRET, { ...qr, signature: flipped }, NOW)).toBe(false);
    expect(verifyQr(SECRET, { ...qr, sessionId: SESSION_ID + 1 }, NOW)).toBe(false);
  });

  it("rejects a code signed with another session's secret", () => {
    expect(verifyQr(SECRET, qrFor(now, "other-secret"), NOW)).toBe(false);
  });

  it("parses only well-formed payloads", () => {
    expect(parseQrPayload("https://example.com")).toBeNull();
    expect(parseQrPayload("IPIATT1.x.1.sig")).toBeNull();
    expect(parseQrPayload("IPIATT1.1.2")).toBeNull();
    expect(parseQrPayload(` ${buildQrPayload(SECRET, 7, 9)} `)).toMatchObject({
      sessionId: 7,
      window: 9,
    });
  });
});
