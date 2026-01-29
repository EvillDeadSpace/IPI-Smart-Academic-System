import {
    IconAlertCircle,
    IconCalendarEvent,
    IconCheck,
    IconClock,
    IconMapPin,
    IconUserCircle,
} from '@tabler/icons-react'
import { FC, useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'

import { Exam, ExamRegistration } from '../../types/SubjectTypes/exam'

const StudentExams: FC = () => {
    const { studentMail: contextMail } = useAuth()

    // Fallback to localStorage if Context is empty
    const studentMail =
        contextMail || localStorage.getItem('student mail') || ''

    const [availableExams, setAvailableExams] = useState<Exam[]>([])
    const [registeredExams, setRegisteredExams] = useState<ExamRegistration[]>(
        []
    )
    const [completedExams, setCompletedExams] = useState<Exam[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<
        'available' | 'registered' | 'completed'
    >('registered')

    const fetchExamData = useCallback(async () => {
        if (!studentMail) {
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            // Fetch available exams for student's enrolled subjects
            const availableResponse = await fetch(
                `${BACKEND_URL}/api/exams/available/${studentMail}`
            )
            if (availableResponse.ok) {
                const data = await availableResponse.json()
                setAvailableExams(data)
            }

            // Fetch registered exams
            const registeredResponse = await fetch(
                `${BACKEND_URL}/api/exams/registered/${studentMail}`
            )
            if (registeredResponse.ok) {
                const data = await registeredResponse.json()
                setRegisteredExams(data)
            }

            // Fetch completed exams (with grades)
            const completedResponse = await fetch(
                `${BACKEND_URL}/api/exams/completed/${studentMail}`
            )
            if (completedResponse.ok) {
                const data = await completedResponse.json()
                setCompletedExams(data)
            }
        } finally {
            setLoading(false)
        }
    }, [studentMail])

    useEffect(() => {
        fetchExamData()
    }, [fetchExamData])

    const handleRegisterExam = async (examId: number) => {
        if (!studentMail) {
            alert('Greška: Student email nije pronađen.')
            return
        }

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/${examId}/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: studentMail,
                    }),
                }
            )

            if (response.ok) {
                await fetchExamData()
                alert('Uspješno ste se prijavili na ispit!')
            } else {
                const error = await response.json()
                alert(error.error || 'Greška pri prijavi na ispit.')
            }
        } catch {
            alert('Greška pri prijavi na ispit.')
        }
    }

    const handleUnregisterExam = async (registrationId: number) => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/registration/${registrationId}`,
                {
                    method: 'DELETE',
                }
            )

            if (response.ok) {
                await fetchExamData()
                alert('Uspješno ste se odjavili sa ispita!')
            } else {
                const error = await response.json()
                alert(error.error || 'Greška pri odjavi sa ispita.')
            }
        } catch {
            alert('Greška pri odjavi sa ispita.')
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('sr-Latn-RS', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString('sr-Latn-RS', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getDaysUntilExam = (examTime: string): number => {
        const now = new Date()
        const exam = new Date(examTime)
        const diffTime = exam.getTime() - now.getTime()
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const getGradeColor = (grade: number) => {
        if (grade >= 9) return 'text-green-600 dark:text-green-400'
        if (grade >= 7) return 'text-blue-600 dark:text-blue-400'
        if (grade >= 6) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-red-600 dark:text-red-400'
    }

    if (loading) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Učitavanje ispita...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            📝 Moji Ispiti
                        </h1>
                        <p className="opacity-90">
                            Pregled prijavljenih, dostupnih i završenih ispita
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                                    <IconCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Prijavljeni Ispiti
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        {registeredExams.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-lg">
                                    <IconCalendarEvent className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Dostupni Ispiti
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        {availableExams.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <IconAlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Završeni Ispiti
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        {completedExams.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex gap-2 p-2">
                                <button
                                    onClick={() => setActiveTab('registered')}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'registered'
                                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    ✅ Prijavljeni ({registeredExams.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('available')}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'available'
                                            ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    📅 Dostupni ({availableExams.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('completed')}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'completed'
                                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    ✔️ Završeni ({completedExams.length})
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* REGISTERED EXAMS TAB */}
                            {activeTab === 'registered' && (
                                <div className="space-y-4">
                                    {registeredExams.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                <IconCalendarEvent className="h-8 w-8 text-neutral-400" />
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                                                Trenutno nemate prijavljenih
                                                ispita
                                            </p>
                                            <button
                                                onClick={() =>
                                                    setActiveTab('available')
                                                }
                                                className="text-blue-600 hover:underline"
                                            >
                                                Pogledaj dostupne ispite →
                                            </button>
                                        </div>
                                    ) : (
                                        registeredExams.map((registration) => {
                                            const exam = registration.exam
                                            const daysUntil = getDaysUntilExam(
                                                exam.examTime
                                            )
                                            return (
                                                <div
                                                    key={registration.id}
                                                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-6 border-2 border-green-200 dark:border-green-800"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="space-y-3 flex-1">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                                                                        {
                                                                            exam
                                                                                .subject
                                                                                .name
                                                                        }
                                                                    </h3>
                                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                                        {
                                                                            exam
                                                                                .subject
                                                                                .code
                                                                        }{' '}
                                                                        •{' '}
                                                                        {
                                                                            exam
                                                                                .subject
                                                                                .ects
                                                                        }{' '}
                                                                        ECTS
                                                                    </p>
                                                                </div>
                                                                {daysUntil >
                                                                    0 && (
                                                                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                                                                        {daysUntil ===
                                                                        1
                                                                            ? 'Sutra'
                                                                            : `Za ${daysUntil} dana`}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconCalendarEvent className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    <span className="font-medium">
                                                                        {formatDate(
                                                                            exam.examTime
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconClock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    <span className="font-medium">
                                                                        {formatTime(
                                                                            exam.examTime
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconMapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    <span>
                                                                        {exam.location ||
                                                                            'Lokacija nije navedena'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconUserCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                    <span>
                                                                        {exam
                                                                            .professor
                                                                            .title ||
                                                                            ''}{' '}
                                                                        {
                                                                            exam
                                                                                .professor
                                                                                .firstName
                                                                        }{' '}
                                                                        {
                                                                            exam
                                                                                .professor
                                                                                .lastName
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                                    Max bodova:{' '}
                                                                    {
                                                                        exam.maxPoints
                                                                    }
                                                                </span>
                                                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                                                                    Status:{' '}
                                                                    {
                                                                        registration.status
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleUnregisterExam(
                                                                        registration.id
                                                                    )
                                                                }
                                                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                                            >
                                                                Odjavi se
                                                            </button>
                                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                                                                Prijavljen{' '}
                                                                {formatDate(
                                                                    registration.registrationDate
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            )}

                            {/* AVAILABLE EXAMS TAB */}
                            {activeTab === 'available' && (
                                <div className="space-y-4">
                                    {availableExams.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                <IconCalendarEvent className="h-8 w-8 text-neutral-400" />
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400">
                                                Trenutno nema dostupnih ispita
                                                za vaše predmete
                                            </p>
                                        </div>
                                    ) : (
                                        availableExams.map((exam) => {
                                            const daysUntil = getDaysUntilExam(
                                                exam.examTime
                                            )
                                            const canRegister =
                                                daysUntil > 0 &&
                                                !exam.isRegistered
                                            return (
                                                <div
                                                    key={exam.id}
                                                    className={`rounded-xl p-6 border-2 transition-all ${
                                                        exam.isRegistered
                                                            ? 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 opacity-60'
                                                            : 'bg-white dark:bg-neutral-800 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600'
                                                    }`}
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div className="space-y-3 flex-1">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                                                                        {
                                                                            exam
                                                                                .subject
                                                                                .name
                                                                        }
                                                                    </h3>
                                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                                        {
                                                                            exam
                                                                                .subject
                                                                                .code
                                                                        }{' '}
                                                                        •{' '}
                                                                        {
                                                                            exam
                                                                                .subject
                                                                                .ects
                                                                        }{' '}
                                                                        ECTS
                                                                    </p>
                                                                </div>
                                                                {exam.isRegistered && (
                                                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                                                        ✓
                                                                        Prijavljen
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconCalendarEvent className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                                    <span className="font-medium">
                                                                        {formatDate(
                                                                            exam.examTime
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconClock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                                    <span className="font-medium">
                                                                        {formatTime(
                                                                            exam.examTime
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconMapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                                    <span>
                                                                        {exam.location ||
                                                                            'Lokacija nije navedena'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                    <IconUserCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                                    <span>
                                                                        {exam
                                                                            .professor
                                                                            .title ||
                                                                            ''}{' '}
                                                                        {
                                                                            exam
                                                                                .professor
                                                                                .firstName
                                                                        }{' '}
                                                                        {
                                                                            exam
                                                                                .professor
                                                                                .lastName
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                                <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                                    Max bodova:{' '}
                                                                    {
                                                                        exam.maxPoints
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {canRegister ? (
                                                                <button
                                                                    onClick={() =>
                                                                        handleRegisterExam(
                                                                            exam.id
                                                                        )
                                                                    }
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium whitespace-nowrap"
                                                                >
                                                                    Prijavi se
                                                                </button>
                                                            ) : exam.isRegistered ? (
                                                                <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                                                                    Već
                                                                    prijavljen
                                                                </span>
                                                            ) : (
                                                                <span className="text-neutral-500 text-sm">
                                                                    Ispit prošao
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            )}

                            {/* COMPLETED EXAMS TAB */}
                            {activeTab === 'completed' && (
                                <div className="space-y-4">
                                    {completedExams.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                                <IconCheck className="h-8 w-8 text-neutral-400" />
                                            </div>
                                            <p className="text-neutral-600 dark:text-neutral-400">
                                                Nemate završenih ispita
                                            </p>
                                        </div>
                                    ) : (
                                        completedExams.map((exam) => (
                                            <div
                                                key={exam.id}
                                                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-3 flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                                                                    {
                                                                        exam
                                                                            .subject
                                                                            .name
                                                                    }
                                                                </h3>
                                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                                    {
                                                                        exam
                                                                            .subject
                                                                            .code
                                                                    }{' '}
                                                                    •{' '}
                                                                    {
                                                                        exam
                                                                            .subject
                                                                            .ects
                                                                    }{' '}
                                                                    ECTS
                                                                </p>
                                                            </div>
                                                            {exam.grade && (
                                                                <div className="text-right">
                                                                    <div
                                                                        className={`text-3xl font-bold ${getGradeColor(
                                                                            exam.grade
                                                                        )}`}
                                                                    >
                                                                        {
                                                                            exam.grade
                                                                        }
                                                                    </div>
                                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                                        Ocjena
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                <IconCalendarEvent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                <span>
                                                                    {formatDate(
                                                                        exam.examTime
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                <IconMapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                <span>
                                                                    {exam.location ||
                                                                        'Lokacija nije navedena'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                                                                <IconUserCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                <span>
                                                                    {exam
                                                                        .professor
                                                                        .title ||
                                                                        ''}{' '}
                                                                    {
                                                                        exam
                                                                            .professor
                                                                            .firstName
                                                                    }{' '}
                                                                    {
                                                                        exam
                                                                            .professor
                                                                            .lastName
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentExams
