export interface BackendNews {
    id: number
    tagName: string
    content: string
    linksParent?: string
    titles: string
    likes: number
}

export interface NewsFormData {
    tagName: string
    title: string
    content: string
    likes: number
    linksParent: string
    calendarNews: boolean
    eventDate: string
}

export interface NewsCardProps {
    news: BackendNews[]
    loadingRequests: boolean
    newsFormData: NewsFormData
    deleteModalState: {
        isOpen: boolean
        newsId: number | null
        newsTitle: string
    }
    onFetchNews: () => void
    onNewsInputChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void
    onNewsSubmit: (e: React.FormEvent) => void
    onDeleteNews: (id: number) => void
    onConfirmDelete: () => void
    onCancelDelete: () => void
}
export interface NewsItem {
    id: number
    tagName: string
    title: string
    content: string
    likes: number
    linksParent?: string
    createdAt: string
    updatedAt: string
}

export interface Comment {
    id: string
    content: string
    createdAt: string
    student: {
        id: number
        firstName: string
        lastName: string
        email: string
    }
}
