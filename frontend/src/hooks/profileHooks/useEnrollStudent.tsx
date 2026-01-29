import { useCallback, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { toastError, toastSuccess } from '../../lib/toast'

interface EnrollStudentParams {
    email: string
    majorName: string | undefined
    year: number
    subjects: number[]
}

export function useEnrollStudent() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const enrollStudent = useCallback(
        async ({ email, majorName, year, subjects }: EnrollStudentParams) => {
            setIsSubmitting(true)
            setError(null)

            const requestData = {
                email,
                majorName,
                year,
                subjects,
            }

            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/student/enroll`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData),
                    }
                )

                if (response.ok) {
                    const result = await response.json()
                    toastSuccess(
                        `Upis uspješan! Ukupno ECTS: ${result.totalECTS}`
                    )
                    window.location.reload()
                } else {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Neuspješan upis')
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Neuspješan upis. Pokušajte ponovo.'
                toastError(errorMessage)
                setError(errorMessage)
                throw error
            } finally {
                setIsSubmitting(false)
            }
        },
        []
    )

    return { enrollStudent, isSubmitting, error, setError }
}
