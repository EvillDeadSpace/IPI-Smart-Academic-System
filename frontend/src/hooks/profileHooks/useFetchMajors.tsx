import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '../../config'
import { toastError } from '../../lib/toast'
import { Major } from '../../types/SubjectTypes/ProfileSettings'
import { useEffect } from 'react'

export function useFetchMajors() {
    const {
        data: majors = [],
        isLoading,
        error: queryError,
    } = useQuery({
        queryKey: ['majorsWithSubjects'],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/majors/with-subjects`
            )
            if (!response.ok) throw new Error('Neuspjelo dohvaćanje smjerova')
            return (await response.json()) as Major[]
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    useEffect(() => {
        if (queryError) {
            toastError('Neuspjelo učitavanje smjerova i predmeta')
        }
    }, [queryError])

    const error = queryError ? 'Neuspjelo učitavanje smjerova i predmeta' : null

    return { majors, isLoading, error }
}
