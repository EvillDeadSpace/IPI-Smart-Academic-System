import { useCallback, useEffect, useState } from 'react'
import { BACKEND_URL, NLP_URL } from '../../config'
import { toastError } from '../../lib/toast'
import {
    EnrolledStudent,
    ExamData,
    SubjectInfo,
    SubjectWithStudents,
} from '../../types/ProfessorsTypes/Professors'

export default function useFetchAboutProfessorData(studentMail: string) {
    const [isLoading, setIsLoading] = useState(true)
    const [professorId, setProfessorId] = useState<number | null>(null)
    const [exams, setExams] = useState<ExamData[]>([])
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalSubjects: 0,
        averageGrade: 0,
        gradedStudents: 0,
    })
    const [subjectsWithStudents, setSubjectsWithStudents] = useState<
        SubjectWithStudents[]
    >([])
    const [professorAssignments, setProfessorAssignments] = useState<{
        [subjectName: string]: string[]
    }>({})
    const [assignmentsLoading, setAssignmentsLoading] = useState(false)

    const fetchProfessorExams = useCallback(async (profId: number) => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/exams/professor/${profId}`
            )
            if (response.ok) {
                const data = await response.json()
                setExams(data)
            }
        } catch {
            toastError('Greška pri dohvaćanju ispita')
        }
    }, [])

    const fetchAllData = useCallback(
        async (allowedSubjectIds: number[] = []) => {
            setIsLoading(true)
            try {
                const majorsRes = await fetch(
                    `${BACKEND_URL}/api/majors/with-subjects`
                )
                if (!majorsRes.ok) {
                    throw new Error('Failed to fetch majors')
                }

                const majorsData = await majorsRes.json()
                const allSubjects: SubjectInfo[] = []

                majorsData.forEach((major: { subjects: SubjectInfo[] }) => {
                    major.subjects.forEach((subject: SubjectInfo) => {
                        if (!allSubjects.find((s) => s.id === subject.id)) {
                            allSubjects.push(subject)
                        }
                    })
                })

                const filteredSubjects =
                    allowedSubjectIds.length > 0
                        ? allSubjects.filter((s) =>
                              allowedSubjectIds.includes(s.id)
                          )
                        : allSubjects

                const studentsRes = await fetch(`${BACKEND_URL}/api/students`)
                if (!studentsRes.ok) {
                    throw new Error('Failed to fetch students')
                }

                const studentsResponse = await studentsRes.json()
                const studentsData = studentsResponse.data || studentsResponse

                const studentsWithEnrollments = await Promise.all(
                    studentsData.map(
                        async (student: {
                            id: number
                            email: string
                            firstName: string
                            lastName: string
                            indexNumber: string
                        }) => {
                            try {
                                const [progressRes, gradesRes] =
                                    await Promise.all([
                                        fetch(
                                            `${BACKEND_URL}/api/student/progress/${student.email}`
                                        ),
                                        fetch(
                                            `${BACKEND_URL}/api/student/grades/${student.email}`
                                        ),
                                    ])

                                if (!progressRes.ok || !gradesRes.ok)
                                    return {
                                        ...student,
                                        enrollments: [],
                                        grades: [],
                                    }

                                const progress = await progressRes.json()
                                const grades = await gradesRes.json()

                                return {
                                    ...student,
                                    enrollments:
                                        progress.subjectEnrollments || [],
                                    grades: grades || [],
                                }
                            } catch {
                                return {
                                    ...student,
                                    enrollments: [],
                                    grades: [],
                                }
                            }
                        }
                    )
                )

                const subjectMap = new Map<number, EnrolledStudent[]>()

                studentsWithEnrollments.forEach(
                    (student: {
                        id: number
                        email: string
                        firstName: string
                        lastName: string
                        indexNumber: string
                        enrollments: { id: number; name: string }[]
                        grades: {
                            grade: number
                            points: number
                            subjectId: number
                            subject?: { id: number }
                        }[]
                    }) => {
                        student.enrollments.forEach(
                            (enrollment: { id: number; name: string }) => {
                                const subjectId = enrollment.id

                                const gradeData = student.grades.find(
                                    (g: {
                                        subjectId: number
                                        subject?: { id: number }
                                    }) =>
                                        g.subjectId === subjectId ||
                                        g.subject?.id === subjectId
                                )

                                const enrolledStudent: EnrolledStudent = {
                                    id: student.id,
                                    firstName: student.firstName,
                                    lastName: student.lastName,
                                    email: student.email,
                                    indexNumber: student.indexNumber,
                                    currentGrade: gradeData?.grade,
                                    currentPoints: gradeData?.points,
                                    hasGrade: !!gradeData,
                                }

                                if (!subjectMap.has(subjectId)) {
                                    subjectMap.set(subjectId, [])
                                }
                                subjectMap.get(subjectId)!.push(enrolledStudent)
                            }
                        )
                    }
                )

                const result: SubjectWithStudents[] = []

                filteredSubjects.forEach((subject) => {
                    const students = subjectMap.get(subject.id) || []
                    result.push({ subject, students })
                })

                setSubjectsWithStudents(result)

                const uniqueStudentIds = new Set<number>()
                result.forEach((item) => {
                    item.students.forEach((student) => {
                        uniqueStudentIds.add(student.id)
                    })
                })

                const totalStudents = uniqueStudentIds.size
                const totalSubjects = result.length

                const studentsInProfessorSubjects =
                    studentsWithEnrollments.filter((s: { id: number }) =>
                        uniqueStudentIds.has(s.id)
                    )

                const gradedStudents = studentsInProfessorSubjects.filter(
                    (s: { grades: { grade: number; subjectId: number }[] }) =>
                        s.grades.some(
                            (g: { grade: number; subjectId: number }) =>
                                g.grade >= 6 &&
                                allowedSubjectIds.includes(g.subjectId)
                        )
                ).length

                const allGrades = studentsInProfessorSubjects.flatMap(
                    (s: { grades: { grade: number; subjectId: number }[] }) =>
                        s.grades.filter((g: { subjectId: number }) =>
                            allowedSubjectIds.includes(g.subjectId)
                        ) || []
                )
                const avgGrade =
                    allGrades.length > 0
                        ? allGrades.reduce(
                              (sum: number, g: { grade: number }) =>
                                  sum + g.grade,
                              0
                          ) / allGrades.length
                        : 0

                setStats({
                    totalStudents,
                    totalSubjects,
                    averageGrade: Math.round(avgGrade * 10) / 10,
                    gradedStudents,
                })
            } catch {
                toastError('Greška pri dohvaćanju podataka profesora')
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    const fetchProfessorData = useCallback(async () => {
        setIsLoading(true)

        try {
            const profResponse = await fetch(
                `${BACKEND_URL}/api/professors/email/${studentMail}`
            )

            if (profResponse.ok) {
                const profData = await profResponse.json()
                setProfessorId(profData.id)
                const subjectIds = profData.subjects.map(
                    (s: { id: number }) => s.id
                )

                await fetchProfessorExams(profData.id)
                await fetchAllData(subjectIds)
            } else {
                await fetchAllData([])
            }
        } catch {
            toastError('Greška pri dohvaćanju podataka profesora')
        } finally {
            setIsLoading(false)
        }
    }, [studentMail, fetchAllData, fetchProfessorExams])

    const refetch = useCallback(async () => {
        await fetchProfessorData()
    }, [fetchProfessorData])

    const fetchAllAssignments = useCallback(async () => {
        setAssignmentsLoading(true)
        const allAssignments: { [subjectName: string]: string[] } = {}

        try {
            for (const item of subjectsWithStudents) {
                const response = await fetch(`${NLP_URL}/get_all_file_s3`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ subject: item.subject.name }),
                })

                if (response.ok) {
                    const data = await response.json()
                    const files = data.professor_subject || []
                    if (files.length > 0) {
                        allAssignments[item.subject.name] = files
                    }
                }
            }

            setProfessorAssignments(allAssignments)
        } catch (error) {
            console.error('❌ Error fetching assignments:', error)
        } finally {
            setAssignmentsLoading(false)
        }
    }, [subjectsWithStudents])

    useEffect(() => {
        if (studentMail) {
            fetchProfessorData()
        }
    }, [studentMail, fetchProfessorData])

    useEffect(() => {
        if (subjectsWithStudents.length > 0) {
            fetchAllAssignments()
        }
    }, [subjectsWithStudents, fetchAllAssignments])

    return {
        exams,
        isLoading,
        stats,
        subjectsWithStudents,
        professorId,
        professorAssignments,
        assignmentsLoading,
        refetch,
        refetchExams: fetchProfessorExams,
        refetchAssignments: fetchAllAssignments,
    }
}
