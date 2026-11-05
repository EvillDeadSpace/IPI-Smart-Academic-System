// Browser twin of backend/src/utils/attendanceToken.ts — keep the format in sync.
// QR = IPIATT1.<sessionId>.<window>.<base64url(HMAC-SHA256(secret, "<sessionId>.<window>"))>

export const QR_PREFIX = 'IPIATT1'

export const currentWindow = (windowMs: number, nowMs: number = Date.now()) =>
    Math.floor(nowMs / windowMs)

const toBase64Url = (bytes: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(bytes)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

// The key is imported once per session and reused for every rotation.
export const importSecret = (secret: string) =>
    crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

export async function buildQrPayload(
    key: CryptoKey,
    sessionId: number,
    window: number
) {
    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(`${sessionId}.${window}`)
    )
    return `${QR_PREFIX}.${sessionId}.${window}.${toBase64Url(signature)}`
}
