import {
    IconCertificate,
    IconFileText,
    IconHeartbeat,
    IconSchool,
} from '@tabler/icons-react'

export interface DocumentRequest {
    id: number
    documentType: string
    status: string
    requestDate: string
    processedDate?: string
    pdfUrl?: string
    student: {
        firstName: string
        lastName: string
        email: string
    }
}

export const documentTypes = [
    {
        type: 'HEALTH_CERTIFICATE',
        name: 'Uvjerenje o zdravstvenom osiguranju',
        icon: IconHeartbeat,
        color: 'from-red-400 to-red-600',
        description: 'Za potrebe zdravstvenog osiguranja',
    },
    {
        type: 'STATUS_CONFIRMATION',
        name: 'Potvrda o statusu studenta',
        icon: IconSchool,
        color: 'from-blue-400 to-blue-600',
        description: 'Za potrebe stipendije, prevoza, itd.',
    },
    {
        type: 'TRANSCRIPT',
        name: 'Prijepis ocjena',
        icon: IconCertificate,
        color: 'from-green-400 to-green-600',
        description: 'Službeni dokument sa svim ocjenama',
    },
    {
        type: 'ENROLLMENT_CONFIRMATION',
        name: 'Potvrda o upisu',
        icon: IconFileText,
        color: 'from-purple-400 to-purple-600',
        description: 'Potvrda o upisu na akademsku godinu',
    },
]
