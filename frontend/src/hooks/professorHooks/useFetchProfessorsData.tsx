import { useCallback, useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import { toastError } from '../../lib/toast'
import { Professor, Subject } from '../../types/AdminTypes/AdminProfessor'

export default function useFetchProfessorsData() {
    const [isLoading, setIsLoading] = useState(true)
    const [professors, setProfessors] = useState<Professor[]>([])
    const [allSubjects, setAllSubjects] = useState<Subject[]>([])

    const fetchProfessors = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${BACKEND_URL}/api/professors`)
            if (response.ok) {
                const data = await response.json()
                setProfessors(data)
            }
        } catch {
            toastError('Greška pri učitavanju profesora')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const fetchSubjects = useCallback(async () => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/majors/with-subjects`
            )
            if (response.ok) {
                const majors = await response.json()
                const subjects: Subject[] = []
                majors.forEach((major: { subjects: Subject[] }) => {
                    major.subjects.forEach((subject: Subject) => {
                        if (!subjects.find((s) => s.id === subject.id)) {
                            subjects.push(subject)
                        }
                    })
                })
                setAllSubjects(subjects)
            }
        } catch {
            toastError('Greška pri učitavanju predmeta')
        }
    }, [])

    const refetch = useCallback(async () => {
        await Promise.all([fetchProfessors(), fetchSubjects()])
    }, [fetchProfessors, fetchSubjects])

    useEffect(() => {
        refetch()
    }, [refetch])

    return { isLoading, professors, allSubjects, refetch }
}
