import { IconArrowLeft, IconQrcode, IconUsers, IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { Link } from 'react-router-dom'
import { BACKEND_URL, STORAGE_KEYS } from '../../constants/storage'
import { useAuth } from '../../Context'
import { toastError, toastSuccess } from '../../lib/toast'
import {
    buildQrPayload,
    currentWindow,
    importSecret,
} from '../../utils/attendanceToken'

type ProfessorLecture = {
    id: number
    dayOfWeek: number // 0 = Monday
    dayName: string
    startTime: string
    endTime: string
    room: string
    subject: { id: number; name: string; code: string }
    activeSessionId: number | null
}

type OpenSession = {
    sessionId: number
    secret: string
    windowMs: number
    serverTime: number
    expiresAt: string
    presentCount: number
    lecture: { id: number; room: string; subject: { name: string } }
}

const STATUS_POLL_MS = 3000

class SessionExpiredError extends Error {}

// Every attendance call is authenticated: identity comes from the JWT, not from an email.
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (!token) throw new SessionExpiredError()
    const res = await fetch(`${BACKEND_URL}/api/attendance${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...init.headers,
        },
    })
    if (res.status === 401) throw new SessionExpiredError()
    if (!res.ok) throw new Error(String(res.status))
    return res.json()
}

const SESSION_EXPIRED_MSG = 'Sesija je istekla. Odjavi se i prijavi ponovo.'
const errorMessage = (error: unknown, fallback: string) =>
    error instanceof SessionExpiredError ? SESSION_EXPIRED_MSG : fallback
const todayIndex = () => (new Date().getDay() + 6) % 7

// Today's lectures first, then the rest of the week in order.
const sortForToday = (lectures: ProfessorLecture[]) => {
    const today = todayIndex()
    return [...lectures].sort(
        (a, b) =>
            ((a.dayOfWeek - today + 7) % 7) - ((b.dayOfWeek - today + 7) % 7) ||
            a.startTime.localeCompare(b.startTime)
    )
}

export default function ProfessorAttendance() {
    const { studentMail: professorEmail } = useAuth()
    const [lectures, setLectures] = useState<ProfessorLecture[]>([])
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<OpenSession | null>(null)
    const [opening, setOpening] = useState<number | null>(null)

    const loadLectures = useCallback(async () => {
        if (!professorEmail) return
        try {
            setLectures(
                sortForToday(await api<ProfessorLecture[]>('/professor/lectures'))
            )
        } catch (error) {
            toastError(errorMessage(error, 'Nije moguće učitati predavanja.'))
        } finally {
            setLoading(false)
        }
    }, [professorEmail])

    useEffect(() => {
        loadLectures()
    }, [loadLectures])

    const openSession = async (lectureId: number) => {
        setOpening(lectureId)
        try {
            setSession(
                await api<OpenSession>('/sessions', {
                    method: 'POST',
                    body: JSON.stringify({ lectureId }),
                })
            )
        } catch (error) {
            toastError(errorMessage(error, 'Nije moguće pokrenuti prisustvo.'))
        } finally {
            setOpening(null)
        }
    }

    const closeSession = async () => {
        if (!session) return
        try {
            const data = await api<{ presentCount: number }>(
                `/sessions/${session.sessionId}/close`,
                { method: 'POST' }
            )
            toastSuccess(`Prisustvo zatvoreno · ${data.presentCount} studenata`)
            setSession(null)
            loadLectures()
        } catch (error) {
            toastError(errorMessage(error, 'Nije moguće zatvoriti prisustvo.'))
        }
    }

    if (session) {
        return <LiveQr session={session} onClose={closeSession} />
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-6 md:p-10">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/profesor"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6"
                >
                    <IconArrowLeft className="w-4 h-4" /> Nazad na ploču
                </Link>
                <h1 className="text-3xl font-bold mb-2">Prisustvo</h1>
                <p className="text-gray-400 mb-8">
                    Pokreni prisustvo na početku predavanja. Studenti skeniraju
                    QR kod u IPI Smart aplikaciji; kod se mijenja svakih 15
                    sekundi, pa fotografija poslana drugima ne vrijedi.
                </p>

                {loading && <p className="text-gray-500">Učitavanje…</p>}
                {!loading && lectures.length === 0 && (
                    <p className="text-gray-500">
                        Nemate zakazanih predavanja u rasporedu.
                    </p>
                )}

                <ul className="space-y-3">
                    {lectures.map((lecture) => {
                        const isToday = lecture.dayOfWeek === todayIndex()
                        return (
                            <li
                                key={lecture.id}
                                className="flex items-center gap-4 bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">
                                        {lecture.subject.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {isToday ? 'Danas' : lecture.dayName} ·{' '}
                                        {lecture.startTime}–{lecture.endTime} ·
                                        Sala {lecture.room}
                                    </p>
                                </div>
                                <button
                                    onClick={() => openSession(lecture.id)}
                                    disabled={opening !== null}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                                        lecture.activeSessionId
                                            ? 'bg-green-600 hover:bg-green-500'
                                            : 'bg-blue-600 hover:bg-blue-500'
                                    }`}
                                >
                                    <IconQrcode className="w-4 h-4" />
                                    {opening === lecture.id
                                        ? 'Pokrećem…'
                                        : lecture.activeSessionId
                                          ? 'Nastavi'
                                          : 'Pokreni'}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

function LiveQr({
    session,
    onClose,
}: {
    session: OpenSession
    onClose: () => void
}) {
    const [payload, setPayload] = useState<string | null>(null)
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [presentCount, setPresentCount] = useState(session.presentCount)
    const keyRef = useRef<CryptoKey | null>(null)
    // Classroom PCs drift. Sign with server time, not the local clock, or a PC running a few
    // seconds fast produces "future" codes the server rejects. Refreshed on every status poll.
    // ponytail: ignores half the request latency (~0.1 s) — irrelevant against a 15 s window.
    const clockOffsetRef = useRef(session.serverTime - Date.now())

    // Rotate the QR: recompute on every window boundary, show a countdown in between.
    useEffect(() => {
        let cancelled = false
        let lastWindow = -1

        const tick = async () => {
            const now = Date.now() + clockOffsetRef.current
            const window = currentWindow(session.windowMs, now)
            setSecondsLeft(
                Math.ceil(((window + 1) * session.windowMs - now) / 1000)
            )
            if (window === lastWindow) return
            lastWindow = window
            keyRef.current ??= await importSecret(session.secret)
            const next = await buildQrPayload(
                keyRef.current,
                session.sessionId,
                window
            )
            if (!cancelled) setPayload(next)
        }

        tick()
        const id = setInterval(tick, 250)
        return () => {
            cancelled = true
            clearInterval(id)
        }
    }, [session])

    // Live headcount.
    useEffect(() => {
        const id = setInterval(async () => {
            try {
                const data = await api<{
                    presentCount: number
                    serverTime: number
                }>(`/sessions/${session.sessionId}`)
                setPresentCount(data.presentCount)
                clockOffsetRef.current = data.serverTime - Date.now()
            } catch {
                // Transient network error — next poll retries.
            }
        }, STATUS_POLL_MS)
        return () => clearInterval(id)
    }, [session.sessionId])

    return (
        <div className="fixed inset-0 bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-6 gap-8">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-neutral-800 hover:bg-[#252525] text-sm"
            >
                <IconX className="w-4 h-4" /> Završi prisustvo
            </button>

            <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-gray-400">
                    Skeniraj u IPI Smart aplikaciji
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mt-2">
                    {session.lecture.subject.name}
                </h1>
                <p className="text-gray-400 mt-1">
                    Sala {session.lecture.room}
                </p>
            </div>

            <div className="bg-white p-6 rounded-3xl">
                {payload ? (
                    <QRCode
                        value={payload}
                        size={360}
                        className="w-[min(60vh,80vw)] h-auto"
                    />
                ) : (
                    <div className="w-[min(60vh,80vw)] aspect-square" />
                )}
            </div>

            <div className="flex items-center gap-8 text-lg">
                <span className="inline-flex items-center gap-2">
                    <IconUsers className="w-6 h-6 text-green-500" />
                    Prisutno: <strong className="tabular-nums">{presentCount}</strong>
                </span>
                <span className="text-gray-400 tabular-nums">
                    Novi kod za {secondsLeft}s
                </span>
            </div>
        </div>
    )
}
