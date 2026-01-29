export interface Event {
    id: number
    title: string
    time: string
    description: string
    location: string
    professor: string
    day: number
    type: 'exam' | 'news'
}

export interface BackendExam {
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

export interface BackendNews {
    id: number
    tagName: string
    title: string
    content: string
    likes: number
    eventDate: string
    calendarNews: boolean
}
