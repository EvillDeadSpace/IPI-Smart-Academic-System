import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BACKEND_URL } from '../../config'
import { toastError } from '../../lib/toast'
import { Grade, StudentProgress } from '../../types/SubjectTypes/Profile'

export default function useFetchProgress(studentMail: string) {
    const {
        data: progress = null,
        isLoading: isLoadingProgress,
        error: progressError,
    } = useQuery({
        queryKey: ['studentProgress', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/student/progress/${studentMail}`
            )
            if (!response.ok)
                throw new Error('Neuspjelo dohvaćanje podataka o napretku')
            return (await response.json()) as StudentProgress
        },
        enabled: !!studentMail,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    const {
        data: grades = [],
        isLoading: isLoadingGrades,
        error: gradesError,
    } = useQuery({
        queryKey: ['studentGrades', studentMail],
        queryFn: async () => {
            const response = await fetch(
                `${BACKEND_URL}/api/student/grades/${studentMail}`
            )
            if (!response.ok) throw new Error('Neuspjelo dohvaćanje ocjena')
            return (await response.json()) as Grade[]
        },
        enabled: !!studentMail,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    const {
        data: subjectsMap = {},
        isLoading: isLoadingSubjects,
        error: subjectsError,
    } = useQuery({
        queryKey: ['subjectsLookup'],
        queryFn: async () => {
            const resp = await fetch(`${BACKEND_URL}/api/majors/with-subjects`)
            if (!resp.ok)
                throw new Error('Neuspjelo dohvaćanje podataka o predmetima')
            const majors = await resp.json()
            const map: Record<number, string> = {}
            if (Array.isArray(majors)) {
                majors.forEach((m: unknown) => {
                    if (m && typeof m === 'object') {
                        const mm = m as { subjects?: unknown[] }
                        if (Array.isArray(mm.subjects)) {
                            mm.subjects.forEach((s: unknown) => {
                                if (s && typeof s === 'object') {
                                    const ss = s as {
                                        id?: string | number
                                        name?: string
                                    }
                                    const maybeId = ss.id
                                    const maybeName = ss.name
                                    if (typeof maybeId !== 'undefined') {
                                        map[Number(maybeId)] =
                                            typeof maybeName === 'string'
                                                ? maybeName
                                                : map[Number(maybeId)] || ''
                                    }
                                }
                            })
                        }
                    }
                })
            }
            return map
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

    useEffect(() => {
        if (progressError) {
            toastError('Neuspjelo dohvaćanje podataka o napretku')
        }
        if (gradesError) {
            toastError('Neuspjelo dohvaćanje ocjena')
        }
        if (subjectsError) {
            toastError('Neuspjelo dohvaćanje podataka o predmetima')
        }
    }, [progressError, gradesError, subjectsError])

    const loading = isLoadingProgress || isLoadingGrades || isLoadingSubjects
    const error =
        progressError || gradesError || subjectsError
            ? 'Greška pri učitavanju'
            : null

    return { loading, error, progress, grades, subjectsMap }
}
