import {
    IconBooks,
    IconCalendarTime,
    IconChalkboard,
    IconUserCircle,
} from '@tabler/icons-react'
import type { FC } from 'react'
import useFetchStudentData from '../../hooks/studentHooks/useStudentHooks'

const StudentSchedule: FC = () => {
    const { error, loading, scheduleData } = useFetchStudentData()

    if (loading) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <div className="text-neutral-600 dark:text-neutral-400">
                    Loading schedule...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-2">
                        Error: {error}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Check console for details
                    </p>
                </div>
            </div>
        )
    }

    if (!scheduleData) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <div className="text-neutral-600 dark:text-neutral-400">
                    No schedule data available
                </div>
            </div>
        )
    }

    // Group subjects by semester
    const semester1Subjects = scheduleData.subjects.filter(
        (s) => s.semester === 1
    )
    const semester2Subjects = scheduleData.subjects.filter(
        (s) => s.semester === 2
    )

    return (
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            Raspored kurseva - Godina{' '}
                            {scheduleData.student.currentYear}
                        </h1>
                        <p className="opacity-90">
                            {scheduleData.student.majorName} -{' '}
                            {scheduleData.student.firstName}{' '}
                            {scheduleData.student.lastName}
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
                                    <IconBooks className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Ukupno Predmeta
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        {scheduleData.totalSubjects}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <IconChalkboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Časova Sedmično
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        {scheduleData.requiredSubjects}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                                    <IconCalendarTime className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Izborni predmeti
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        {scheduleData.electiveSubjects}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Grid */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                                Godisnje Raspored Predmeta
                            </h2>
                            <div className="space-y-6">
                                {/* Semester 1 */}
                                {semester1Subjects.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                                            Semestar 1
                                        </h3>
                                        <div className="space-y-3">
                                            {semester1Subjects.map(
                                                (subject) => (
                                                    <div
                                                        key={subject.id}
                                                        className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                                        {
                                                                            subject.name
                                                                        }
                                                                    </h3>
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                            subject.isElective
                                                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                        }`}
                                                                    >
                                                                        {subject.isElective
                                                                            ? 'Izborni'
                                                                            : 'Obavezni'}
                                                                    </span>
                                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                        {
                                                                            subject.ects
                                                                        }{' '}
                                                                        ECTS
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                                    <div className="flex items-center gap-2">
                                                                        <IconBooks className="h-4 w-4" />
                                                                        <span>
                                                                            {
                                                                                subject.code
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    {subject.professor && (
                                                                        <div className="flex items-center gap-2">
                                                                            <IconUserCircle className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    subject
                                                                                        .professor
                                                                                        .fullName
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Semester 2 */}
                                {semester2Subjects.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                                            Semester 2
                                        </h3>
                                        <div className="space-y-3">
                                            {semester2Subjects.map(
                                                (subject) => (
                                                    <div
                                                        key={subject.id}
                                                        className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                                        {
                                                                            subject.name
                                                                        }
                                                                    </h3>
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                            subject.isElective
                                                                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                        }`}
                                                                    >
                                                                        {subject.isElective
                                                                            ? 'Izborni'
                                                                            : 'Obavezni'}
                                                                    </span>
                                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                        {
                                                                            subject.ects
                                                                        }{' '}
                                                                        ECTS
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                                    <div className="flex items-center gap-2">
                                                                        <IconBooks className="h-4 w-4" />
                                                                        <span>
                                                                            {
                                                                                subject.code
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    {subject.professor && (
                                                                        <div className="flex items-center gap-2">
                                                                            <IconUserCircle className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    subject
                                                                                        .professor
                                                                                        .fullName
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentSchedule
