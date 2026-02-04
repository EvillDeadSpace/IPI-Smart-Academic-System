import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '../../config'
import { BackendExam, BackendNews, Event } from '../../types/calendar'

export default function useCalendarFeatures() {
    const {
        data: events = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['calendarEvents'],
        queryFn: async () => {
            // Fetch exams
            const examsResponse = await fetch(
                `${BACKEND_URL}/api/exams/calendar/all`
            )
            const examsData: BackendExam[] = await examsResponse.json()

            console.log('test')
            // Fetch calendar news
            const newsResponse = await fetch(`${BACKEND_URL}/api/news`)
            const allNews: BackendNews[] = await newsResponse.json()
            const calendarNews = allNews.filter(
                (news) => news.calendarNews && news.eventDate
            )

            // Transform and combine
            const examEvents = examsData.map(transformExamToEvent)
            const newsEvents = calendarNews.map(transformNewsToEvent)

            return [...examEvents, ...newsEvents]
        },

        // Cache events for 5 minutes and garbage collect after 10 minutes to balance freshness and performance
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    return { events, isLoading, error }
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
