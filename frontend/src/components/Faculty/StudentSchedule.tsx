import type { FC } from 'react'
import {
    IconClock,
    IconMapPin,
    IconUserCircle,
    IconBooks,
    IconCalendarTime,
    IconChalkboard,
} from '@tabler/icons-react'

interface Lecture {
    subject: string
    professor: string
    time: string
    location: string
    type: 'predavanje' | 'vjezbe'
    day: string
}

const mockSchedule: Lecture[] = [
    {
        subject: 'Matematika II',
        professor: 'Dr. Smith Johnson',
        time: '09:00 - 10:30',
        location: 'Sala A101',
        type: 'predavanje',
        day: 'Ponedjeljak',
    },
    {
        subject: 'Programiranje III',
        professor: 'Dr. Maria Garcia',
        time: '11:00 - 12:30',
        location: 'Računarski Lab 2',
        type: 'vjezbe',
        day: 'Ponedjeljak',
    },
    {
        subject: 'Baze Podataka',
        professor: 'Dr. James Wilson',
        time: '13:00 - 14:30',
        location: 'Sala B203',
        type: 'predavanje',
        day: 'Utorak',
    },
    {
        subject: 'Algoritmi i Strukture Podataka',
        professor: 'Dr. Ana Martinez',
        time: '15:00 - 16:30',
        location: 'Sala C305',
        type: 'predavanje',
        day: 'Srijeda',
    },
]

const StudentSchedule: FC = () => {
    return (
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            Raspored Predavanja
                        </h1>
                        <p className="opacity-90">
                            Pregled svih predavanja i vježbi za tekući semestar
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
                                        6
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
                                        18
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
                                        Današnja Predavanja
                                    </p>
                                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                                        3
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Grid */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                                Sedmični Raspored
                            </h2>
                            <div className="space-y-4">
                                {['Ponedjeljak', 'Utorak', 'Srijeda'].map(
                                    (day) => (
                                        <div key={day} className="space-y-3">
                                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                                                {day}
                                            </h3>
                                            <div className="space-y-3">
                                                {mockSchedule
                                                    .filter(
                                                        (lecture) =>
                                                            lecture.day === day
                                                    )
                                                    .map((lecture, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                                                        >
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                                            {
                                                                                lecture.subject
                                                                            }
                                                                        </h3>
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                                lecture.type ===
                                                                                'predavanje'
                                                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                            }`}
                                                                        >
                                                                            {lecture.type ===
                                                                            'predavanje'
                                                                                ? 'Predavanje'
                                                                                : 'Vježbe'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <IconClock className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    lecture.time
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <IconMapPin className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    lecture.location
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <IconUserCircle className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    lecture.professor
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button className="bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white px-4 py-2 rounded-lg transition-colors">
                                                                    Detalji
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
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

export default StudentSchedule
