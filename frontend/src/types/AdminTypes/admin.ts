export interface DocumentRequest {
    id: number
    studentName: string
    email: string
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    student?: {
        firstName: string
        lastName: string
        email: string
    }
}

export interface BackendDocumentRequest {
    id: number
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    student: {
        firstName: string
        lastName: string
        email: string
    }
}

export interface StudentFormData {
    firstName: string
    lastName: string
    email: string
    indexNumber: string
    dateOfBirth: string
    majorId: string
    password: string
}
