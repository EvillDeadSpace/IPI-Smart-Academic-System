import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../../constants/storage'

export default function useFetchStatus() {
    const [status, setStatus] = useState<boolean>(false)

    useEffect(() => {
        // Function to fetch status from the backend
        const fetchStatus = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.STATUS_CHECK)
                const data = await response.json()

                // Only update the status if it's different from the current one
                if (data.status !== status) {
                    setStatus(data.status)
                }
            } catch {
                setStatus(false)
            }
        }

        fetchStatus()

        const interval = setInterval(() => {
            fetchStatus()
        }, 5000) // 5000 milliseconds = 5 seconds

        return () => {
            clearInterval(interval) // Clear interval when the component is unmounted
        }
    }, [status])

    return { status, setStatus }
}
