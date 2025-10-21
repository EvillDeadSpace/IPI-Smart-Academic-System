import { FC, useState, useEffect } from 'react'
import {
    IconCalendarEvent,
    IconClock,
    IconMapPin,
    IconUserCircle,
    IconCheck,
    IconAlertCircle,
} from '@tabler/icons-react'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'

interface Exam {
    id: number
    subjectId: number
    examTime: string
    location: string | null
    maxPoints: number
    subject: {
        id: number
        name: string
        code: string
    }
    professor: {
        id: number
        firstName: string
        lastName: string
        title: string
    }
}

const StudentExams: FC = () => {
    const { studentMail } = useAuth()
    const [exams, setExams] = useState<Exam[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchExams = async () => {
            if (!studentMail) return

            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/exams/student/${studentMail}`
                )
                if (response.ok) {
                    const data = await response.json()
                    setExams(data)
                } else {
                    console.error('Failed to fetch exams')
                }
            } catch (error) {
                console.error('Error fetching exams:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchExams()
    }, [studentMail])

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

    const getExamStatus = (
        examTime: string
    ): 'upcoming' | 'completed' | 'ongoing' => {
        const now = new Date()
        const exam = new Date(examTime)

        if (exam < now) return 'completed'
        return 'upcoming'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <p className="text-center text-gray-600">
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
                            Raspored Ispita
                        </h1>
                        <p className="opacity-90">
                            Pregled svih predstojećih ispita i raspored
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-lg">
                                    <IconCalendarEvent className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Predstojeći Ispiti
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
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
                                        2
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
                                    <IconAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Rok za Prijavu
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        2 dana
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exam List */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                                Predstojeći Ispiti
                            </h2>
                            <div className="space-y-4">
                                {exams.length === 0 ? (
                                    <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
                                        Trenutno nema zakazanih ispita za vaše
                                        predmete.
                                    </p>
                                ) : (
                                    exams.map((exam) => {
                                        const status = getExamStatus(
                                            exam.examTime
                                        )
                                        return (
                                            <div
                                                key={exam.id}
                                                className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-2">
                                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                            {exam.subject.name}{' '}
                                                            ({exam.subject.code}
                                                            )
                                                        </h3>
                                                        <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                            <div className="flex items-center gap-2">
                                                                <IconCalendarEvent className="h-4 w-4" />
                                                                <span>
                                                                    {formatDate(
                                                                        exam.examTime
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <IconClock className="h-4 w-4" />
                                                                <span>
                                                                    {formatTime(
                                                                        exam.examTime
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <IconMapPin className="h-4 w-4" />
                                                                <span>
                                                                    {exam.location ||
                                                                        'Lokacija nije navedena'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <IconUserCircle className="h-4 w-4" />
                                                                <span>
                                                                    {
                                                                        exam
                                                                            .professor
                                                                            .title
                                                                    }{' '}
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
                                                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                                            Maksimalno poena:{' '}
                                                            {exam.maxPoints}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {status ===
                                                            'upcoming' && (
                                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                                                                Prijavi se
                                                            </button>
                                                        )}
                                                        {status ===
                                                            'completed' && (
                                                            <span className="text-neutral-500 text-sm">
                                                                Završen
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentExams
