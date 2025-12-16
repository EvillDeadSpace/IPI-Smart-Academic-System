import { FC, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IconCalendar,
    IconClock,
    IconMapPin,
    IconUser,
    IconX,
} from '@tabler/icons-react'
import { BACKEND_URL } from '../../config'

interface Event {
    id: number
    title: string
    time: string
    color: string
    description: string
    location: string
    professor: string
    day: number
}

interface BackendExam {
    id: number
    examTime: string
    location: string
    maxPoints: number
    subject: {
        name: string
        code: string
    }
    professor: {
        firstName: string
        lastName: string
    }
}

// Helper functions for formatting and data transformation
const formatTime = (date: Date): string => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const start = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    // Calculate end time (2 hours duration)
    const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000)
    const endHours = endDate.getHours()
    const endMinutes = endDate.getMinutes()
    const end = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`

    return `${start} - ${end}`
}

const assignColor = (subjectName: string): string => {
    const colors = ['purple', 'green', 'blue', 'yellow']
    const hash = subjectName
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
}

const transformExamToEvent = (exam: BackendExam): Event => {
    const examDate = new Date(exam.examTime)

    return {
        id: exam.id,
        title: `Ispit - ${exam.subject.name}`,
        time: formatTime(examDate),
        color: assignColor(exam.subject.name),
        description: `${exam.subject.code} - Maksimalno bodova: ${exam.maxPoints}`,
        location: exam.location || 'Nije navedeno',
        professor: `${exam.professor.firstName} ${exam.professor.lastName}`,
        day: examDate.getDate(),
    }
}

const Calendar: FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [events, setEvents] = useState<Event[]>([])

    const now = new Date()
    const monthName = now.toLocaleDateString('en-US', { month: 'long' })
    const year = now.getFullYear()
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()

    // Fetch exam calendar data from backend
    useEffect(() => {
        async function fetchCalendarEvents() {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/exams/calendar/all`
                )
                const data: BackendExam[] = await response.json()
                console.log('Calendar Events:', data)

                // Transform backend data to Event format
                const transformedEvents = data.map(transformExamToEvent)
                setEvents(transformedEvents)
            } catch (error) {
                console.error('Error fetching calendar events:', error)
            }
        }
        fetchCalendarEvents()
    }, [])

    return (
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <IconCalendar className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold mb-1">
                                    Kalendar Ispita
                                </h1>
                                <p className="opacity-90 text-sm">
                                    Pratite raspored ispita i rokove
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 rounded-lg">
                                <IconCalendar className="w-5 h-5" />
                            </div>
                            <h6 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                {monthName} {year}
                            </h6>
                        </div>
                    </div>

                    {/* Glavni sadržaj - Kalendar + Detail panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Kalendar - 75% širine */}
                        <div className="lg:col-span-9">
                            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                {/* Calendar header with days of the week */}
                                <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                                    {[
                                        'Pon',
                                        'Uto',
                                        'Sri',
                                        'Čet',
                                        'Pet',
                                        'Sub',
                                        'Ned',
                                    ].map((day) => (
                                        <div
                                            key={day}
                                            className="p-3 text-center font-semibold text-neutral-700 dark:text-neutral-300 text-sm"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid with days */}
                                <div className="grid grid-cols-7">
                                    {[...Array(daysInMonth)].map(
                                        (_, dayIndex) => {
                                            const dayNum = dayIndex + 1
                                            const dayEvents = events.filter(
                                                (e) => e.day === dayNum
                                            )

                                            return (
                                                <div
                                                    key={dayNum}
                                                    className="h-24 border-r border-b border-neutral-100 dark:border-neutral-700 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/70 transition-all duration-200 cursor-pointer overflow-hidden"
                                                >
                                                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                                        {dayNum}
                                                    </span>

                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {dayEvents.length > 0 &&
                                                            dayEvents
                                                                .slice(0, 4)
                                                                .map(
                                                                    (event) => {
                                                                        return (
                                                                            <motion.div
                                                                                key={
                                                                                    event.id
                                                                                }
                                                                                whileHover={{
                                                                                    scale: 1.05,
                                                                                }}
                                                                                onClick={() =>
                                                                                    setSelectedEvent(
                                                                                        event
                                                                                    )
                                                                                }
                                                                                className={`rounded px-1.5 py-1 border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-sm hover:shadow-md transition-shadow ${
                                                                                    dayEvents.length ===
                                                                                    1
                                                                                        ? 'w-full'
                                                                                        : 'w-[calc(50%-0.25rem)]'
                                                                                }`}
                                                                            >
                                                                                <p className="text-xs font-medium text-blue-900 dark:text-blue-100 line-clamp-1">
                                                                                    {event.title.split(
                                                                                        ' - '
                                                                                    )[1] ||
                                                                                        event.title}
                                                                                </p>
                                                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold truncate">
                                                                                    {
                                                                                        event.time.split(
                                                                                            ' - '
                                                                                        )[0]
                                                                                    }
                                                                                </p>
                                                                            </motion.div>
                                                                        )
                                                                    }
                                                                )}
                                                        {dayEvents.length >
                                                            4 && (
                                                            <div className="w-full text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                                                +
                                                                {dayEvents.length -
                                                                    4}{' '}
                                                                more
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Event details panel - 25% width */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                {selectedEvent ? (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-5 sticky top-4"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                                Detalji
                                            </h3>
                                            <button
                                                onClick={() =>
                                                    setSelectedEvent(null)
                                                }
                                                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                            >
                                                <IconX className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
                                                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-base mb-2">
                                                    {selectedEvent.title}
                                                </h4>
                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                                                    {selectedEvent.time}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                                                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                        Dan:
                                                    </span>
                                                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                                        {selectedEvent.day}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                                                    <IconClock className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                                            Vrijeme
                                                        </p>
                                                        <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                                                            {selectedEvent.time}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                                                    <IconMapPin className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                                            Lokacija
                                                        </p>
                                                        <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                                                            {
                                                                selectedEvent.location
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors">
                                                    <IconUser className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                                            Profesor
                                                        </p>
                                                        <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                                                            {
                                                                selectedEvent.professor
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t-2 border-neutral-100 dark:border-neutral-700">
                                                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
                                                        Opis
                                                    </p>
                                                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                                        {
                                                            selectedEvent.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-8 text-center min-h-[400px] flex flex-col items-center justify-center sticky top-4"
                                    >
                                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                                            <IconCalendar className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                                            Odaberite Ispit
                                        </h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Kliknite na bilo koji ispit u
                                            kalendaru da vidite detalje
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Calendar
