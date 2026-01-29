import { useCallback, useEffect, useState } from 'react'
import { BACKEND_URL, NLP_URL } from '../../config'
import { toastError, toastSuccess } from '../../lib/toast'
import {
    S3File,
    Subject,
    SubjectEnrollment,
} from '../../types/HomeWorkTypes/homework'

export default function useHomeWork(studentMail: string) {
    const [loading, setLoading] = useState(true)
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
        null
    )
    const [files, setFiles] = useState<S3File[]>([])
    const [filesLoading, setFilesLoading] = useState(false)

    // Fetch subjects when studentMail changes
    const fetchSubjects = useCallback(async () => {
        if (!studentMail) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const response = await fetch(
                `${BACKEND_URL}/api/students/email/${studentMail}`
            )

            if (response.ok) {
                const responseData = await response.json()
                const studentData = responseData.data || responseData

                if (
                    studentData.subjectEnrollments &&
                    studentData.subjectEnrollments.length > 0
                ) {
                    const enrolledSubjects = studentData.subjectEnrollments.map(
                        (enrollment: SubjectEnrollment) => ({
                            id: enrollment.subject.id,
                            name: enrollment.subject.name,
                            code: enrollment.subject.code,
                        })
                    )
                    setSubjects(enrolledSubjects)
                    toastSuccess(`Učitano ${enrolledSubjects.length} predmeta!`)
                } else {
                    setSubjects([])
                    toastError('Ne pohađate nijedan predmet trenutno.')
                }
            } else {
                toastError('Greška pri učitavanju predmeta.')
            }
        } catch (error) {
            console.error('Error fetching subjects:', error)
            toastError('Greška pri učitavanju podataka.')
        } finally {
            setLoading(false)
        }
    }, [studentMail])

    useEffect(() => {
        fetchSubjects()
    }, [fetchSubjects])

    // Fetch files when selectedSubjectId changes
    useEffect(() => {
        if (!selectedSubjectId) {
            setFiles([])
            return
        }

        const selectedSubject = subjects.find((s) => s.id === selectedSubjectId)
        if (!selectedSubject) {
            setFiles([])
            return
        }

        async function fetchHomeworks() {
            if (!selectedSubject) return

            setFilesLoading(true)
            setFiles([])
            try {
                const response = await fetch(`${NLP_URL}/get_all_file_s3`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subject: selectedSubject.name }),
                })

                if (!response.ok) {
                    throw new Error('Fetch failed')
                }

                const data = await response.json()
                const fileList = data.professor_subject || []
                setFiles(fileList)
            } catch (err) {
                console.error('❌ Error fetching homeworks:', err)
                setFiles([])
            } finally {
                setFilesLoading(false)
            }
        }

        fetchHomeworks()
    }, [selectedSubjectId, subjects])

    return {
        subjects,
        loading,
        selectedSubjectId,
        setSelectedSubjectId,
        files,
        filesLoading,
        refetchSubjects: fetchSubjects,
    }
}
