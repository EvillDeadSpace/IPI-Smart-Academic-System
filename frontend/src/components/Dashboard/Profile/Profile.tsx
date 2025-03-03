import React, { useEffect, useState } from 'react'
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
                setProgress(data)
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
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {error}
            </div>
        )
    }

    if (!progress) {
        return (
            <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
                No progress data available
            </div>
        )
    }

    const getProgressBarColor = (points: number): string => {
        if (points === 0) return 'bg-gray-300'
        if (points < 25) return 'bg-red-500'
        if (points < 45) return 'bg-orange-500'
        if (points < 54) return 'bg-yellow-500'
        if (points < 65) return 'bg-lime-500'
        if (points < 75) return 'bg-green-500'
        if (points < 85) return 'bg-emerald-500'
        if (points < 95) return 'bg-teal-500'
        return 'bg-blue-500' // 95-100
    }

    const renderSubjectCard = (subject: Subject) => (
        <div className="border-b pb-3 last:border-b-0">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-gray-600">{subject.ects} ECTS</p>
                </div>
                <div className="text-right">
                    <span
                        className={`inline-block px-2 py-1 rounded text-sm ${
                            subject.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                        {subject.status}
                    </span>
                    {subject.grade !== '-' && (
                        <p className="font-bold mt-1">Grade: {subject.grade}</p>
                    )}
                </div>
            </div>
            {/* Points Progress Bar */}
            <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Points: {subject.points}/100</span>
                    <span>{subject.points}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
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
        <div className="p-6 max-w-4xl mx-auto">
            {/* Student Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {progress.studentName}
                        </h1>
                        <p className="text-gray-600">{progress.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-semibold">
                            {progress.major}
                        </p>
                        <p className="text-gray-600">Year: {progress.year}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                            Progress ({progress.earnedEcts}/{progress.totalEcts}{' '}
                            ECTS)
                        </span>
                        <span className="text-sm font-medium">
                            {progress.progress.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress.progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Required Subjects */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Required Subjects
                    </h2>
                    <div className="space-y-4">
                        {progress.requiredSubjects.map((subject, index) => (
                            <div key={index}>{renderSubjectCard(subject)}</div>
                        ))}
                    </div>
                </div>

                {/* Elective Subjects */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Elective Subjects
                    </h2>
                    <div className="space-y-4">
                        {progress.electiveSubjects.map((subject, index) => (
                            <div key={index}>{renderSubjectCard(subject)}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
