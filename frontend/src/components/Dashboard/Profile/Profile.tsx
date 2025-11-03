import { useEffect, useState } from 'react'
import { useAuth } from '../../../Context'
import { BACKEND_URL } from '../../../constants/storage'

import { toastError } from '../../../lib/toast'
interface Subject {
    id: number
    name: string
    ects: number
    semester: string
    academicYear: string
}

interface Grade {
    id: number
    grade: number
    points: number
    subject: {
        id: number
        name: string
        ects: number
        isElective: boolean
    }
}

interface StudentProgress {
    student: {
        id: number
        firstName: string
        lastName: string
        email: string
        indexNumber: string
        currentYear: number
        status: string
    }
    major: {
        id: number
        name: string
        code: string
        duration: number
    }
    progress: {
        currentYear: number
        totalECTSEarned: number
        enrolledECTS: number
        passedSubjects: number
        totalSubjects: number
        canProgressToNextYear: boolean
        nextYear: number | null
        ectsNeededForNextYear: number
    }
    yearEnrollments: unknown[]
    subjectEnrollments: Subject[]
}

const Profile = () => {
    const { studentMail } = useAuth()
    const [progress, setProgress] = useState<StudentProgress | null>(null)
    const [grades, setGrades] = useState<Grade[]>([])
    const [subjectsMap, setSubjectsMap] = useState<Record<number, string>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/student/progress/${studentMail}`
                )
                if (!response.ok) {
                    toastError('Neuspjelo dohvaćanje podataka o napretku')
                    throw new Error('Neuspjelo dohvaćanje podataka o napretku')
                }
                const data = await response.json()
                setProgress(data)
            } catch (err) {
                setError(
                    toastError(
                        err instanceof Error
                            ? err.message
                            : 'Dogodila se greška'
                    )
                )
            } finally {
                setLoading(false)
            }
        }

        const fetchGrades = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/student/grades/${studentMail}`
                )
                if (response.ok) {
                    const data = await response.json()
                    setGrades(data)
                }
            } catch {
                toastError('Neuspjelo dohvaćanje ocjena')
            }
        }

        const fetchSubjectsLookup = async () => {
            try {
                const resp = await fetch(
                    `${BACKEND_URL}/api/majors/with-subjects`
                )
                if (!resp.ok) return
                const majors = await resp.json()
                const map: Record<number, string> = {}
                if (Array.isArray(majors)) {
                    majors.forEach((m: unknown) => {
                        if (m && typeof m === 'object') {
                            const mm = m as { subjects?: unknown[] }
                            if (Array.isArray(mm.subjects)) {
                                mm.subjects.forEach((s: unknown) => {
                                    if (s && typeof s === 'object') {
                                        const ss = s as {
                                            id?: string | number
                                            name?: string
                                        }
                                        const maybeId = ss.id
                                        const maybeName = ss.name
                                        if (typeof maybeId !== 'undefined') {
                                            map[Number(maybeId)] =
                                                typeof maybeName === 'string'
                                                    ? maybeName
                                                    : map[Number(maybeId)] || ''
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
                setSubjectsMap(map)
            } catch {
                toastError('Neuspjelo dohvaćanje podataka o predmetima')
            }
        }

        fetchProgress()
        fetchGrades()
        fetchSubjectsLookup()
    }, [studentMail])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen bg-white dark:bg-neutral-900">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="h-screen w-screen bg-white dark:bg-neutral-900 flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 transform transition-all">
                    <div className="flex flex-col items-center text-center">
                        <img
                            src="https://illustrations.popsy.co/red/crashed-error.svg"
                            alt="Error Illustration"
                            className="w-64 h-64 mb-6"
                        />
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                            Ups! Nešto je pošlo po zlu
                        </h2>
                        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl w-full">
                            <p className="text-red-700 dark:text-red-400 font-medium">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Pokušaj ponovo
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!progress) {
        return (
            <div className="h-screen bg-white dark:bg-neutral-900 p-6">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg">
                    Nema dostupnih podataka o napretku
                </div>
            </div>
        )
    }

    const getProgressBarColor = (points: number): string => {
        if (points === 0) return 'bg-gray-300 dark:bg-gray-600'
        if (points < 25) return 'bg-red-500'
        if (points < 45) return 'bg-orange-500'
        if (points < 54) return 'bg-yellow-500'
        if (points < 65) return 'bg-lime-500'
        if (points < 75) return 'bg-green-500'
        if (points < 85) return 'bg-emerald-500'
        if (points < 95) return 'bg-teal-500'
        return 'bg-blue-500'
    }

    // Removed renderEnrolledSubject helper and replaced with inline card rendering below.
    // Improved card styling, added clearer badges and accessible progress bar.

    // Separate enrolled subjects into required and elective
    const requiredSubjects = progress?.subjectEnrollments || []

    // We don't have separate electiveSubjects in current response,
    // so we'll show all enrolled subjects in one list

    return (
        <div className="flex flex-1 h-screen dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Student Info Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    {progress.student.firstName}{' '}
                                    {progress.student.lastName}
                                </h1>
                                <p className="text-blue-100">
                                    {progress.student.email}
                                </p>
                                <p className="text-blue-100 text-sm">
                                    Indeks: {progress.student.indexNumber}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-white">
                                    {progress.major.name}
                                </p>
                                <p className="text-blue-100">
                                    Godina: {progress.student.currentYear}
                                </p>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                                        progress.student.status === 'ACTIVE'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-500 text-white'
                                    }`}
                                >
                                    {progress.student.status}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-white">
                                    ECTS napredak (
                                    {progress.progress.totalECTSEarned}/
                                    {progress.progress.enrolledECTS} osvojeno)
                                </span>
                                <span className="text-sm font-medium text-white">
                                    {progress.progress.enrolledECTS > 0
                                        ? (
                                              (progress.progress
                                                  .totalECTSEarned /
                                                  progress.progress
                                                      .enrolledECTS) *
                                              100
                                          ).toFixed(1)
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-blue-100 to-white h-2.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            progress.progress.enrolledECTS > 0
                                                ? (progress.progress
                                                      .totalECTSEarned /
                                                      progress.progress
                                                          .enrolledECTS) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Progression Warning/Info */}
                        {!progress.progress.canProgressToNextYear &&
                            progress.progress.nextYear && (
                                <div className="bg-yellow-500/20 border border-yellow-500/50 text-white p-3 rounded-lg">
                                    <p className="font-semibold">
                                        ⚠️ Nema dovoljno ECTS za{' '}
                                        {progress.progress.nextYear}. godinu
                                    </p>
                                    <p className="text-sm">
                                        Treba vam još{' '}
                                        {
                                            progress.progress
                                                .ectsNeededForNextYear
                                        }{' '}
                                        ECTS da napredujete.
                                    </p>
                                </div>
                            )}

                        {progress.progress.canProgressToNextYear &&
                            progress.progress.nextYear && (
                                <div className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg">
                                    <p className="font-semibold">
                                        ✅ Spremni za{' '}
                                        {progress.progress.nextYear}. godinu!
                                    </p>
                                    <p className="text-sm">
                                        Imate dovoljno ECTS bodova za upis u
                                        narednu akademsku godinu.
                                    </p>
                                </div>
                            )}
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Ukupno ECTS
                            </p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {progress.progress.totalECTSEarned}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Upisani ECTS
                            </p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {progress.progress.enrolledECTS}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Položeni predmeti
                            </p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {progress.progress.passedSubjects}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Ukupno predmeta
                            </p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                {progress.progress.totalSubjects}
                            </p>
                        </div>
                    </div>

                    {/* Enrolled Subjects */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                                Upisani predmeti
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {requiredSubjects.length} predmeta
                            </p>
                        </div>

                        {requiredSubjects.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Još nema upisanih predmeta.
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                                    Idite u{' '}
                                    <span className="font-medium">
                                        Podešavanja
                                    </span>{' '}
                                    da izvršite upis.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {requiredSubjects.map((subject) => {
                                    const s = subject as unknown
                                    const maybeName =
                                        ((s as { name?: unknown })
                                            .name as unknown) ??
                                        ((s as { subject?: unknown })
                                            .subject as unknown) ??
                                        subjectsMap[subject.id]
                                    const displayName =
                                        maybeName && String(maybeName).trim()
                                            ? String(maybeName)
                                            : `ID ${subject.id}`

                                    const gradeData = grades.find((g) => {
                                        // match by nested subject name
                                        if (
                                            g.subject &&
                                            typeof g.subject.name ===
                                                'string' &&
                                            String(g.subject.name) ===
                                                displayName
                                        )
                                            return true
                                        // match by grade.subjectId (narrowed)
                                        const maybeSubjectId = (
                                            g as unknown as {
                                                subjectId?: unknown
                                            }
                                        ).subjectId
                                        if (
                                            typeof maybeSubjectId !==
                                                'undefined' &&
                                            Number(maybeSubjectId) ===
                                                Number(subject.id)
                                        )
                                            return true
                                        // match by nested subject.id (narrowed)
                                        const nestedId = (
                                            g.subject as unknown as {
                                                id?: unknown
                                            }
                                        ).id
                                        if (
                                            typeof nestedId !== 'undefined' &&
                                            Number(nestedId) ===
                                                Number(subject.id)
                                        )
                                            return true
                                        return false
                                    })
                                    const pct = gradeData
                                        ? Math.max(
                                              0,
                                              Math.min(
                                                  100,
                                                  gradeData.points || 0
                                              )
                                          )
                                        : 0
                                    return (
                                        <div
                                            key={subject.id}
                                            className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            tabIndex={0}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-baseline justify-between gap-2">
                                                        {/** Resolve display name from different response shapes */}
                                                        {(() => {
                                                            const s =
                                                                subject as unknown
                                                            const maybeName =
                                                                ((
                                                                    s as {
                                                                        name?: unknown
                                                                    }
                                                                )
                                                                    .name as unknown) ??
                                                                ((
                                                                    s as {
                                                                        subject?: unknown
                                                                    }
                                                                )
                                                                    .subject as unknown) ??
                                                                subjectsMap[
                                                                    subject.id
                                                                ]
                                                            const displayName =
                                                                maybeName &&
                                                                String(
                                                                    maybeName
                                                                ).trim()
                                                                    ? String(
                                                                          maybeName
                                                                      )
                                                                    : `ID ${subject.id}`
                                                            return (
                                                                <h3 className="font-semibold text-neutral-900 dark:text-white text-lg">
                                                                    {
                                                                        displayName
                                                                    }
                                                                </h3>
                                                            )
                                                        })()}
                                                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                                            {
                                                                subject.academicYear
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-2 text-sm">
                                                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 rounded-full">
                                                            {subject.ects} ECTS
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 rounded-full">
                                                            Sem{' '}
                                                            {subject.semester}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div
                                                        className={`inline-block px-3 py-1 rounded-full text-sm ${gradeData && gradeData.grade >= 6 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}
                                                    >
                                                        {gradeData
                                                            ? gradeData.grade >=
                                                              6
                                                                ? 'Položeno'
                                                                : 'Upisano'
                                                            : 'Upisano'}
                                                    </div>
                                                    {gradeData && (
                                                        <div className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
                                                            Ocjena:{' '}
                                                            <span className="font-medium">
                                                                {
                                                                    gradeData.grade
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                                    <span>Napredak bodova</span>
                                                    <span>{pct}%</span>
                                                </div>

                                                <div
                                                    className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3"
                                                    role="progressbar"
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-valuenow={pct}
                                                    aria-label={`Napredak ${subject.name}: ${pct} percent`}
                                                >
                                                    <div
                                                        className={`h-3 rounded-full ${getProgressBarColor(pct)}`}
                                                        style={{
                                                            width: `${pct}%`,
                                                            transition:
                                                                'width 0.5s ease-in-out',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
