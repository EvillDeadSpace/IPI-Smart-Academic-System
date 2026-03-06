import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BACKEND_URL } from '../../config'
import { toastError, toastSuccess } from '../../lib/toast'
import { useState } from 'react'

interface EnrollStudentParams {
    email: string
    majorName: string | undefined
    year: number
    subjects: number[]
}

export function useEnrollStudent() {
    const [error, setError] = useState<string | null>(null)
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (params: EnrollStudentParams) => {
            const response = await fetch(`${BACKEND_URL}/api/student/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Neuspješan upis')
            }

            return response.json()
        },
        onSuccess: (result) => {
            toastSuccess(`Upis uspješan! Ukupno ECTS: ${result.totalECTS}`)
            queryClient.invalidateQueries({ queryKey: ['studentProgress'] })
            queryClient.invalidateQueries({ queryKey: ['studentGrades'] })
            setTimeout(() => window.location.reload(), 1500)
        },
        onError: (error: Error) => {
            const errorMessage = error.message || 'Neuspješan upis. Pokušajte ponovo.'
            toastError(errorMessage)
            setError(errorMessage)
        },
    })

    return {
        enrollStudent: mutation.mutate,
        isSubmitting: mutation.isPending,
        error,
        setError,
    }
}
