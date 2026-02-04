import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BACKEND_URL } from '../../constants/storage'
import { Exam, ExamRegistration } from '../../types/SubjectTypes/exam'
import { toastError, toastSuccess } from '../../lib/toast'

export default function useStudentExams(studentMail: string) {
    const queryClient = useQueryClient()

    // Fetch available exams
    const {
        data: availableExams = [],
        isLoading: isLoadingAvailable,
        error: availableError,
    } = useQuery({
        queryKey: ['availableExams', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/available/${studentMail}`
            )
            if (!response.ok) throw new Error('Failed to fetch available exams')
            return (await response.json()) as Exam[]
        },
        enabled: !!studentMail,
        staleTime: 1 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
        retry: 2,
    })

    // Fetch registered exams
    const {
        data: registeredExams = [],
        isLoading: isLoadingRegistered,
        error: registeredError,
    } = useQuery({
        queryKey: ['registeredExams', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/registered/${studentMail}`
            )
            if (!response.ok) throw new Error('Failed to fetch registered exams')
            return (await response.json()) as ExamRegistration[]
        },
        enabled: !!studentMail,
        staleTime: 1 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
        retry: 2,
    })

    // Fetch completed exams
    const {
        data: completedExams = [],
        isLoading: isLoadingCompleted,
        error: completedError,
    } = useQuery({
        queryKey: ['completedExams', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/completed/${studentMail}`
            )
            if (!response.ok) throw new Error('Failed to fetch completed exams')
            return (await response.json()) as Exam[]
        },
        enabled: !!studentMail,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
    })

    // Register for exam mutation
    const registerMutation = useMutation({
        mutationFn: async (examId: number) => {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/${examId}/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: studentMail }),
                }
            )
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to register for exam')
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['availableExams', studentMail] })
            queryClient.invalidateQueries({ queryKey: ['registeredExams', studentMail] })
            toastSuccess('Uspješno ste se prijavili na ispit!')
        },
        onError: (error: Error) => {
            toastError(error.message || 'Greška pri prijavi na ispit.')
        },
    })

    // Unregister from exam mutation
    const unregisterMutation = useMutation({
        mutationFn: async (registrationId: number) => {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/registration/${registrationId}`,
                { method: 'DELETE' }
            )
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to unregister from exam')
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['availableExams', studentMail] })
            queryClient.invalidateQueries({ queryKey: ['registeredExams', studentMail] })
            toastSuccess('Uspješno ste se odjavili sa ispita!')
        },
        onError: (error: Error) => {
            toastError(error.message || 'Greška pri odjavi sa ispita.')
        },
    })

    const isLoading = isLoadingAvailable || isLoadingRegistered || isLoadingCompleted
    const hasError = !!availableError || !!registeredError || !!completedError

    return {
        availableExams,
        registeredExams,
        completedExams,
        isLoading,
        hasError,
        registerForExam: registerMutation.mutate,
        unregisterFromExam: unregisterMutation.mutate,
        isRegistering: registerMutation.isPending,
        isUnregistering: unregisterMutation.isPending,
    }
}
