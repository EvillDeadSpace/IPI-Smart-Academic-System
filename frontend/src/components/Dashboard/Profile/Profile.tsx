import { useEffect, useState } from 'react'
import { useChat } from '../../../Context'

interface Subject {
    name: string
    ects: number
    grade: string | number
    status: string
    points: number
}

interface StudentProgress {
    studentName: string
    email: string
    major: string
    year: string
    requiredSubjects: Subject[]
    electiveSubjects: Subject[]
    totalEcts: number
    earnedEcts: number
    progress: number
}

const Profile = () => {
    const { studentMail } = useChat()
    const [progress, setProgress] = useState<StudentProgress | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/student/progress/${studentMail}`
                )
                if (!response.ok) {
                    throw new Error('Failed to fetch progress')
                }
                const data = await response.json()
                setProgress(data) // This will now only contain enrolled subjects
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchProgress()
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
                            Oops! Something went wrong
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
                            Try Again
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
                    No progress data available
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

    const renderSubjectCard = (subject: Subject) => (
        <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3 last:border-b-0">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                        {subject.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {subject.ects} ECTS
                    </p>
                </div>
                <div className="text-right">
                    <span
                        className={`inline-block px-2 py-1 rounded text-sm ${
                            subject.status === 'Completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                    >
                        {subject.status}
                    </span>
                    {subject.grade !== '-' && (
                        <p className="font-bold mt-1 text-neutral-900 dark:text-white">
                            Grade: {subject.grade}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-2">
                <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                    <span>Points: {subject.points}/100</span>
                    <span>{subject.points}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${getProgressBarColor(
                            typeof subject.points === 'number'
                                ? subject.points
                                : 0
                        )}`}
                        style={{
                            width: `${
                                typeof subject.points === 'number'
                                    ? Math.max(0, Math.min(100, subject.points))
                                    : 0
                            }%`,
                            transition: 'width 0.5s ease-in-out',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex flex-1 h-screen dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Student Info Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    {progress.studentName}
                                </h1>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    {progress.email}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                                    {progress.major}
                                </p>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Year: {progress.year}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                    Progress ({progress.earnedEcts}/
                                    {progress.totalEcts} ECTS)
                                </span>
                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                    {progress.progress.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-blue-100 to-white h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Required Subjects */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                                Required Subjects
                            </h2>
                            <div className="space-y-4">
                                {progress.requiredSubjects.map(
                                    (subject, index) => (
                                        <div key={index}>
                                            {renderSubjectCard(subject)}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Elective Subjects */}
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                                Elective Subjects
                            </h2>
                            <div className="space-y-4">
                                {progress.electiveSubjects.map(
                                    (subject, index) => (
                                        <div key={index}>
                                            {renderSubjectCard(subject)}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
