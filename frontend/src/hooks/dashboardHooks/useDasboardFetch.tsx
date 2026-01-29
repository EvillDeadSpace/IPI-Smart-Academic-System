import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { toastError, toastSuccess } from '../../lib/toast'

import { GradeShape, ProgressShape } from '../../types/DashboardTypes/Dashboard'

export default function useFetchStudentProgress(studentMail: string) {
    const [progress, setProgress] = useState<ProgressShape | null>(null)
    const [grades, setGrades] = useState<GradeShape[]>([])

    useEffect(() => {
        if (!studentMail) return

        const fetchData = async () => {
            try {
                const p = await fetch(
                    `${BACKEND_URL}/api/student/progress/${studentMail}`
                )
                if (p.ok) setProgress((await p.json()) as ProgressShape)
                const g = await fetch(
                    `${BACKEND_URL}/api/student/grades/${studentMail}`
                )
                if (g.ok) setGrades((await g.json()) as GradeShape[])
                toastSuccess('Podaci za dashboard su uspješno učitani.')
            } catch {
                toastError('Greška pri učitavanju podataka za dashboard.')
            }
        }

        fetchData()
    }, [studentMail])
    return { grades, progress }
}
