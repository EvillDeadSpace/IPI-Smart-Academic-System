import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { BackendExam, BackendNews, Event } from '../../types/calendar'
export default function useCalendarFeatures() {
    const [events, setEvents] = useState<Event[]>([])

    // Fetch exam and news calendar data from backend
    useEffect(() => {
        async function fetchCalendarEvents() {
            try {
                // Fetch exams
                const examsResponse = await fetch(
                    `${BACKEND_URL}/api/exams/calendar/all`
                )
                const examsData: BackendExam[] = await examsResponse.json()

                // Fetch calendar news (calendarNews = true)
                const newsResponse = await fetch(`${BACKEND_URL}/api/news`)
                const allNews: BackendNews[] = await newsResponse.json()
                const calendarNews = allNews.filter(
                    (news) => news.calendarNews && news.eventDate
                )

                // Transform and combine
                const examEvents = examsData.map(transformExamToEvent)
                const newsEvents = calendarNews.map(transformNewsToEvent)

                setEvents([...examEvents, ...newsEvents])
            } catch (error) {
                console.error('Error fetching calendar events:', error)
            }
        }
        fetchCalendarEvents()
    }, [])

    return { events }
}

const transformNewsToEvent = (news: BackendNews): Event => {
    const newsDate = new Date(news.eventDate)

    return {
        id: news.id,
        title: `📰 ${news.title}`,
        time: newsDate.toLocaleTimeString('bs-BA', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        description: news.content.substring(0, 150) + '...',
        location: news.tagName,
        professor: 'IPI Akademija',
        day: newsDate.getDate(),
        type: 'news',
    }
}

const transformExamToEvent = (exam: BackendExam): Event => {
    const examDate = new Date(exam.examTime)

    return {
        id: exam.id,
        title: `Ispit - ${exam.subject.name}`,
        time: formatTime(examDate),
        description: `${exam.subject.code} - Maksimalno bodova: ${exam.maxPoints}`,
        location: exam.location || 'Nije navedeno',
        professor: `${exam.professor.firstName} ${exam.professor.lastName}`,
        day: examDate.getDate(),
        type: 'exam',
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
