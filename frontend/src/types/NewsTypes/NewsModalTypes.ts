interface BackendNews {
    id: number
    tagName: string
    content: string
    linksParent?: string
    titles: string
    likes: number
}

interface NewsFormData {
    tagName: string
    title: string
    content: string
    likes: number
    linksParent: string
    calendarNews: boolean
    eventDate: string
}

export interface NewsModalProps {
    isOpen: boolean
    onClose: () => void
    news: BackendNews[]
    loadingRequests: boolean
    newsFormData: NewsFormData
    deleteModalState: {
        isOpen: boolean
        newsId: number | null
        newsTitle: string
    }
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
