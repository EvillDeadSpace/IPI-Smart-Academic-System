import { useQuery } from '@tanstack/react-query'
import { BACKEND_URL } from '../../config'
import { toastError, toastSuccess } from '../../lib/toast'
import {
    AssignmentProgressItem,
    GradeShape,
    ProgressShape,
} from '../../types/DashboardTypes/Dashboard'
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
        data: assignmentProgress = [],
        isLoading: isLoadingAssignmentProgress,
        error: assignmentProgressError,
        refetch: refetchAssignmentProgress,
    } = useQuery({
        queryKey: ['assignmentProgress', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/assignments/progress/${studentMail}`
            )
            if (!response.ok)
                throw new Error('Failed to fetch assignment progress')
            return (await response.json()) as AssignmentProgressItem[]
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

    // Success toast only when all queries succeed
    useEffect(() => {
        if (
            !isLoadingProgress &&
            !isLoadingGrades &&
            !isLoadingAssignmentProgress &&
            progress &&
            grades.length >= 0
        ) {
            toastSuccess('Podaci za dashboard su uspješno učitani.')
        }
    }, [isLoadingProgress, isLoadingGrades, isLoadingAssignmentProgress, progress, grades])

    // Error handling
    useEffect(() => {
        if (progressError) {
            toastError('Greška pri učitavanju napretka studenta.')
        }
        if (gradesError) {
            toastError('Greška pri učitavanju ocjena studenta.')
        }
        if (assignmentProgressError) {
            toastError('Greška pri učitavanju bodova zadaća.')
        }
    }, [progressError, gradesError, assignmentProgressError])

    const isLoading =
        isLoadingProgress || isLoadingGrades || isLoadingAssignmentProgress
    const hasError =
        !!progressError || !!gradesError || !!assignmentProgressError

    const refetchAll = () => {
        refetchProgress()
        refetchGrades()
        refetchAssignmentProgress()
    }

    return {
        grades,
        progress,
        assignmentProgress,
        isLoading,
        hasError,
        refetchAll,
        refetchProgress,
        refetchGrades,
        refetchAssignmentProgress,
    }
}
