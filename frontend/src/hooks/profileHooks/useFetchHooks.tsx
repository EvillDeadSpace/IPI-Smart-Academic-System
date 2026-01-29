import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { toastError } from '../../lib/toast'
import { Grade, StudentProgress } from '../../types/SubjectTypes/Profile'

export default function useFetchProgress(studentMail: string) {
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState<StudentProgress | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [grades, setGrades] = useState<Grade[]>([])
    const [subjectsMap, setSubjectsMap] = useState<Record<number, string>>({})

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/student/progress/${studentMail}`
                )
                if (!response.ok) {
                    toastError('Neuspjelo dohvaćanje podataka o napretku')
                    throw new Error('Neuspjelo dohvaćanje podataka o napretku')
                }
                const data = await response.json()
                setProgress(data)
            } catch (err) {
                setError(
                    toastError(
                        err instanceof Error
                            ? err.message
                            : 'Dogodila se greška'
                    )
                )
            } finally {
                setLoading(false)
            }
        }

        const fetchGrades = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/student/grades/${studentMail}`
                )
                if (response.ok) {
                    const data = await response.json()
                    setGrades(data)
                }
            } catch {
                toastError('Neuspjelo dohvaćanje ocjena')
            }
        }

        const fetchSubjectsLookup = async () => {
            try {
                const resp = await fetch(
                    `${BACKEND_URL}/api/majors/with-subjects`
                )
                if (!resp.ok) return
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
                setSubjectsMap(map)
            } catch {
                toastError('Neuspjelo dohvaćanje podataka o predmetima')
            }
        }

        fetchProgress()
        fetchGrades()
        fetchSubjectsLookup()
    }, [studentMail])

    return { loading, error, progress, grades, subjectsMap }
}
