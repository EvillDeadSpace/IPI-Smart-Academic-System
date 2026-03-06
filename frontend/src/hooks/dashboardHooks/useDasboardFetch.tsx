import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '../../config'
import { toastError, toastSuccess } from '../../lib/toast'
import { GradeShape, ProgressShape } from '../../types/DashboardTypes/Dashboard'
import { useEffect } from 'react'

export default function useFetchStudentProgress(studentMail: string) {
    const {
        data: progress = null,
        isLoading: isLoadingProgress,
        error: progressError,
        refetch: refetchProgress,
    } = useQuery({
        queryKey: ['studentProgress', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/student/progress/${studentMail}`
            )
            if (!response.ok) throw new Error('Failed to fetch progress')
            return (await response.json()) as ProgressShape
        },
        enabled: !!studentMail,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        retryDelay: 1000,
    })

    const {
        data: grades = [],
        isLoading: isLoadingGrades,
        error: gradesError,
        refetch: refetchGrades,
    } = useQuery({
        queryKey: ['studentGrades', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/student/grades/${studentMail}`
            )
            if (!response.ok) throw new Error('Failed to fetch grades')
            return (await response.json()) as GradeShape[]
        },
        enabled: !!studentMail,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        retryDelay: 1000,
    })

    // Success toast only when both queries succeed for the first time
    useEffect(() => {
        if (!isLoadingProgress && !isLoadingGrades && progress && grades.length >= 0) {
            toastSuccess('Podaci za dashboard su uspješno učitani.')
        }
    }, [isLoadingProgress, isLoadingGrades, progress, grades])

    // Error handling
    useEffect(() => {
        if (progressError) {
            toastError('Greška pri učitavanju napretka studenta.')
        }
        if (gradesError) {
            toastError('Greška pri učitavanju ocjena studenta.')
        }
    }, [progressError, gradesError])

    const isLoading = isLoadingProgress || isLoadingGrades
    const hasError = !!progressError || !!gradesError

    const refetchAll = () => {
        refetchProgress()
        refetchGrades()
    }

    return {
        grades,
        progress,
        isLoading,
        hasError,
        refetchAll,
        refetchProgress,
        refetchGrades,
    }
}
