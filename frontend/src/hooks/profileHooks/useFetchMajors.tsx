import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { toastError } from '../../lib/toast'
import { Major } from '../../types/SubjectTypes/ProfileSettings'

export function useFetchMajors() {
    const [isLoading, setIsLoading] = useState(true)
    const [majors, setMajors] = useState<Major[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/majors/with-subjects`
                )
                if (!response.ok) {
                    toastError('Neuspjelo dohvaćanje smjerova')
                    throw new Error('Neuspjelo dohvaćanje smjerova')
                }
                const data = await response.json()
                setMajors(data)
            } catch {
                setError('Neuspjelo učitavanje smjerova i predmeta')
                toastError('Neuspjelo učitavanje smjerova i predmeta')
            } finally {
                setIsLoading(false)
            }
        }

        fetchMajors()
    }, [])

    return { majors, isLoading, error }
}
