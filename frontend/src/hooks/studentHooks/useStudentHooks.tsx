import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { STORAGE_KEYS } from '../../constants/storage'
import { BackendScheduleResponse } from '../../types/SubjectTypes/subject'

export default function useFetchStudentData() {
    const [scheduleData, setScheduleData] =
        useState<BackendScheduleResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        async function fetchSchedule() {
            try {
                const email = localStorage.getItem(STORAGE_KEYS.STUDENT_EMAIL)
                if (!email) {
                    setError('No email found. Please login again.')
                    console.error('No email found in localStorage')
                    setLoading(false)
                    return
                }

                console.log('Fetching schedule for:', email)
                const response = await fetch(
                    `${BACKEND_URL}/api/schedule/${email}`
                )

                if (!response.ok) {
                    const errorText = await response.text()
                    console.error('API Error:', response.status, errorText)
                    setError(`Failed to fetch schedule: ${response.status}`)
                    setLoading(false)
                    return
                }

                const data: BackendScheduleResponse = await response.json()
                console.log('Schedule data received:', data)
                setScheduleData(data)
            } catch (error: unknown) {
                console.error('Error fetching schedule:', error)
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch schedule'
                )
            } finally {
                setLoading(false)
            }
        }
        fetchSchedule()
    }, [])
    return { scheduleData, loading, error }
}
