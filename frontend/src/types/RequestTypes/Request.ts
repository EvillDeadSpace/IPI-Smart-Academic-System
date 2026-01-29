interface DocumentRequest {
    id: number
    studentName: string
    email: string
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface RequestCardProps {
    requests: DocumentRequest[]
    loadingRequests: boolean
    onFetchRequests: () => void
    onApprove: (id: number) => void
    onReject: (id: number) => void
}

interface DocumentRequest {
    id: number
    studentName: string
    email: string
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface RequestModalProps {
    isOpen: boolean
    onClose: () => void
    requests: DocumentRequest[]
    loadingRequests: boolean
    onApprove: (id: number) => void
    onReject: (id: number) => void
}
