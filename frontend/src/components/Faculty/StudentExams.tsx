import type { FC } from 'react'
import {
    IconCalendarEvent,
    IconClock,
    IconMapPin,
    IconUserCircle,
    IconCheck,
    IconAlertCircle,
} from '@tabler/icons-react'

interface Exam {
    subject: string
    date: string
    time: string
    location: string
    professor: string
    status: 'upcoming' | 'completed' | 'ongoing'
}

const mockExams: Exam[] = [
    {
        subject: 'Mathematics 101',
        date: 'March 15, 2024',
        time: '10:00 AM - 12:00 PM',
        location: 'Room A101',
        professor: 'Dr. Smith',
        status: 'upcoming',
    },
    {
        subject: 'Physics 201',
        date: 'March 20, 2024',
        time: '1:00 PM - 3:00 PM',
        location: 'Lab B202',
        professor: 'Dr. Johnson',
        status: 'upcoming',
    },
    {
        subject: 'Chemistry 301',
        date: 'March 25, 2024',
        time: '9:00 AM - 11:00 AM',
        location: 'Lab C303',
        professor: 'Dr. Williams',
        status: 'upcoming',
    },
]

const StudentExams: FC = () => {
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
                                {mockExams.map((exam, index) => (
                                    <div
                                        key={index}
                                        className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                    {exam.subject}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                    <div className="flex items-center gap-2">
                                                        <IconCalendarEvent className="h-4 w-4" />
                                                        <span>{exam.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <IconClock className="h-4 w-4" />
                                                        <span>{exam.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <IconMapPin className="h-4 w-4" />
                                                        <span>
                                                            {exam.location}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <IconUserCircle className="h-4 w-4" />
                                                        <span>
                                                            {exam.professor}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button className="bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white px-4 py-2 rounded-lg transition-colors">
                                                    Detalji
                                                </button>
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                                                    Prijavi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentExams
