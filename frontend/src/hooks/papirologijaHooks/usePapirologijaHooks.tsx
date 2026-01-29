import { useCallback, useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { DocumentRequest } from '../../types/AdminTypes/admin'

export default function usePapriologijaFetch(studentMail: string) {
    const [loading, setLoading] = useState(false)
    const [requests, setRequests] = useState<DocumentRequest[]>([])

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(
                `${BACKEND_URL}/api/document-requests?studentEmail=${studentMail}`
            )
            if (response.ok) {
                const data = await response.json()
                setRequests(data)
            }
        } finally {
            setLoading(false)
        }
    }, [studentMail])

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests])

    return { loading, requests, refetch: fetchRequests }
}
