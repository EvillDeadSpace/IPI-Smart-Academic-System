import {
    IconBook,
    IconCalendarEvent,
    IconClipboardList,
    IconFileText,
    IconPlus,
    IconTrash,
    IconUserCircle,
    IconUsers,
    IconX,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { BACKEND_URL, NLP_URL } from '../../constants/storage'
import { useAuth } from '../../Context'
import { toastError, toastSuccess } from '../../lib/toast'

// Types matching Prisma backend
interface SubjectInfo {
    id: number
    name: string
    code: string
    ects: number
    isElective: boolean
    year: number
    semester: number
}

interface EnrolledStudent {
    id: number
    firstName: string
    lastName: string
    email: string
    indexNumber: string
    currentGrade?: number
    currentPoints?: number
    hasGrade: boolean
}

interface SubjectWithStudents {
    subject: SubjectInfo
    students: EnrolledStudent[]
}

interface GradeFormData {
    studentEmail: string
    studentName: string
    subjectId: number
    subjectName: string
    grade: number
    points: number
}

interface ExamData {
    id: number
    subjectId: number
    examTime: string
    location: string | null
    maxPoints: number
    subject: {
        id: number
        name: string
        code: string
    }
}

interface ExamFormData {
    subjectId: number
    examTime: string
    location: string
    maxPoints: number
}

interface AssignmentFormData {
    subjectId: number
    dueDate: string
    title: string
    description: string
    maxPoints: number
    file: File | null
}

const ProfessorBoard: React.FC = () => {
    const { studentMail, studentName } = useAuth() // Get professor email
    const [isLoading, setIsLoading] = useState(true)
    const [subjectsWithStudents, setSubjectsWithStudents] = useState<
        SubjectWithStudents[]
    >([])
    const [showGradeModal, setShowGradeModal] = useState(false)
    const [gradeForm, setGradeForm] = useState<GradeFormData>({
        studentEmail: '',
        studentName: '',
        subjectId: 0,
        subjectName: '',
        grade: 6,
        points: 60,
    })
    const [showExamModal, setShowExamModal] = useState(false)
    const [showAssignmentModal, setShowAssignmentModal] = useState(false)
    const [exams, setExams] = useState<ExamData[]>([])
    const [professorId, setProfessorId] = useState<number | null>(null)
    const [examForm, setExamForm] = useState<ExamFormData>({
        subjectId: 0,
        examTime: '',
        location: '',
        maxPoints: 100,
    })
    const [assignmentForm, setAssignmentForm] = useState<AssignmentFormData>({
        subjectId: 0,
        dueDate: '',
        title: '',
        description: '',
        maxPoints: 100,
        file: null,
    })
    const [isUploading, setIsUploading] = useState(false)
    const [professorAssignments, setProfessorAssignments] = useState<{
        [subjectName: string]: string[]
    }>({})
    const [assignmentsLoading, setAssignmentsLoading] = useState(false)
    const [selectedAssignmentSubject, setSelectedAssignmentSubject] =
        useState<string>('')

    // Convert points (0-100) into grade (5-10) using thresholds
    const computeGradeFromPoints = (points: number | null | undefined) => {
        if (points === null || points === undefined || isNaN(points)) return 5
        const p = Math.max(0, Math.min(100, Math.round(points)))
        if (p < 54) return 5
        if (p <= 62) return 6
        if (p <= 71) return 7
        if (p <= 80) return 8
        if (p <= 89) return 9
        return 10
    }
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalSubjects: 0,
        averageGrade: 0,
        gradedStudents: 0,
    })

    // Fetch all data and filter by professor's subjects
    useEffect(() => {
        if (studentMail) {
            fetchProfessorData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentMail])

    // Fetch assignments when subjects are loaded
    useEffect(() => {
        if (subjectsWithStudents.length > 0) {
            fetchAllAssignments()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectsWithStudents])

    const fetchProfessorData = async () => {
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
            setIsLoading(false)
            toastError('Greška pri dohvaćanju podataka profesora')
        }
    }

    const fetchProfessorExams = async (profId: number) => {
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
    }

    const fetchAllAssignments = async () => {
        setAssignmentsLoading(true)
        const allAssignments: { [subjectName: string]: string[] } = {}

        try {
            // Fetch assignments for each subject
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
    }

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!assignmentForm.file) {
            toastError('Morate priložiti fajl!')
            return
        }

        if (assignmentForm.subjectId === 0) {
            toastError('Morate odabrati predmet!')
            return
        }

        setIsUploading(true)

        try {
            // Get subject name for S3 metadata
            const subjectName =
                subjectsWithStudents.find(
                    (item) => item.subject.id === assignmentForm.subjectId
                )?.subject.name || 'Nepoznat_Predmet'

            const formData = new FormData()

            formData.append('professor_subject', subjectName)
            formData.append('assignment', assignmentForm.title)
            formData.append('file', assignmentForm.file)

            console.log('📤 Uploadujem:', {
                professor_subject: subjectName,
                assignment: assignmentForm.title,
                file: assignmentForm.file?.name,
            })

            const response = await fetch(`${NLP_URL}/save_s3`, {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                // Get enrolled students for this subject
                const enrolledStudentEmails =
                    subjectsWithStudents
                        .find((s) => s.subject.id === assignmentForm.subjectId)
                        ?.students.map((student) => student.email) || []

                // Format emails for Recipients
                const recipients = enrolledStudentEmails.map((email) => ({
                    Email: email,
                }))

                // Send notification only if there are students
                if (recipients.length > 0) {
                    const payload = {
                        type: 'assignment',
                        subject: subjectName,
                        Text: `Nova zadaća "${assignmentForm.title}" je postavljena za predmet ${subjectName}. Prijavite se na IPI Smart sistem i preuzmite materijale.`,
                        Recipients: recipients,
                    }

                    try {
                        const response_notification_service = await fetch(
                            `${NLP_URL}/notification-services`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload),
                            }
                        )

                        if (response_notification_service.ok) {
                            console.log(
                                '✅ Email notifikacije poslane studentima'
                            )
                        } else {
                            console.error('❌ Greška pri slanju notifikacija')
                        }
                    } catch (error) {
                        console.error('❌ Notification service error:', error)
                    }
                }

                toastSuccess('Zadaća uspješno postavljena! 🎉')
                setShowAssignmentModal(false)
                setAssignmentForm({
                    subjectId: 0,
                    dueDate: '',
                    title: '',
                    description: '',
                    maxPoints: 100,
                    file: null,
                })
                // Refresh assignments list
                await fetchAllAssignments()
            } else {
                const errorData = await response.json().catch(() => ({}))
                toastError(
                    errorData.message || 'Greška pri postavljanju zadaće'
                )
            }
        } catch (error) {
            console.error('❌ Upload error:', error)
            toastError('Greška pri postavljanju zadaće')
        } finally {
            setIsUploading(false)
        }
    }

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!professorId) {
            toastError('Professor ID not found')
            return
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...examForm,
                    professorId,
                }),
            })

            // Get subject name
            const subjectName =
                subjectsWithStudents.find(
                    (s) => s.subject.id === examForm.subjectId
                )?.subject.name || 'Predmet'

            // Get emails of students enrolled in this specific subject
            const enrolledStudentEmails =
                subjectsWithStudents
                    .find((s) => s.subject.id === examForm.subjectId)
                    ?.students.map((student) => student.email) || []

            // Format emails for Recipients
            const recipients = enrolledStudentEmails.map((email) => ({
                Email: email,
            }))

            const payload = {
                type: 'exam',
                subject: examForm.subjectId,
                subjectName: subjectName,
                Text: `Novi ispit je zakazan za predmet ${subjectName} dana ${examForm.examTime} u učionici ${examForm.location}. Maksimalan broj bodova: ${examForm.maxPoints}`,
                Recipients: recipients,
            }

            // Send notification only if there are students
            if (recipients.length > 0) {
                try {
                    const respone_notification_service = await fetch(
                        `${NLP_URL}/notification-services`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                        }
                    )

                    if (respone_notification_service.ok) {
                        toastSuccess(
                            `Email notifikacije poslane za ${recipients.length} studenata!`
                        )
                        console.log('Notifikacije poslane studentima')
                    } else {
                        const errorText =
                            await respone_notification_service.text()
                        toastError('Greška pri slanju email notifikacija')
                        console.error(
                            'Greška pri slanju notifikacija:',
                            errorText
                        )
                    }
                } catch (error) {
                    toastError(
                        'Nije moguće povezati se sa servisom za notifikacije'
                    )
                    console.error('Notification service error:', error)
                }
            }

            if (response.ok) {
                toastSuccess('Ispit uspješno kreiran!')
                setShowExamModal(false)
                setExamForm({
                    subjectId: 0,
                    examTime: '',
                    location: '',
                    maxPoints: 100,
                })
                if (professorId) await fetchProfessorExams(professorId)
            } else {
                toastError('Greška pri kreiranju ispita')
            }
        } catch {
            toastError('Greška pri kreiranju ispita')
        }
    }

    const handleDeleteExam = async (examId: number, subjectName: string) => {
        // Confirmation dialog
        const confirmed = window.confirm(
            `Da li ste sigurni da želite obrisati ispit iz predmeta "${subjectName}"?\n\nOva akcija se ne može poništiti.`
        )

        if (!confirmed) return

        try {
            const response = await fetch(`${BACKEND_URL}/api/exams/${examId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toastSuccess('Ispit uspješno obrisan!')
                // Refresh exams list
                if (professorId) await fetchProfessorExams(professorId)
            } else {
                toastError('Greška pri brisanju ispita')
            }
        } catch (error) {
            console.error('Delete exam error:', error)
            toastError('Greška pri brisanju ispita')
        }
    }

    const fetchAllData = async (allowedSubjectIds: number[] = []) => {
        setIsLoading(true)
        try {
            const majorsRes = await fetch(
                `${BACKEND_URL}/api/majors/with-subjects`
            )
            if (!majorsRes.ok) {
                toastError('Failed to fetch majors')
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
                toastError('Failed to fetch students')
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
                            const [progressRes, gradesRes] = await Promise.all([
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
                                enrollments: progress.subjectEnrollments || [],
                                grades: grades || [],
                            }
                        } catch {
                            return { ...student, enrollments: [], grades: [] }
                        }
                    }
                )
            )

            // Step 4: Group students by subject
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

                            // Find if student has a grade for this subject
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

            // Step 5: Create final structure
            const result: SubjectWithStudents[] = []

            filteredSubjects.forEach((subject) => {
                const students = subjectMap.get(subject.id) || []

                if (students.length > 0) {
                    result.push({ subject, students })
                } else {
                    result.push({ subject, students: [] })
                }
            })

            setSubjectsWithStudents(result)

            // Calculate stats - ONLY for students enrolled in professor's subjects
            // Collect all unique students from professor's subjects
            const uniqueStudentIds = new Set<number>()
            result.forEach((item) => {
                item.students.forEach((student) => {
                    uniqueStudentIds.add(student.id)
                })
            })

            const totalStudents = uniqueStudentIds.size // Students in professor's subjects ONLY
            const totalSubjects = result.length

            // Count graded students (only those in professor's subjects)
            const studentsInProfessorSubjects = studentsWithEnrollments.filter(
                (s: { id: number }) => uniqueStudentIds.has(s.id)
            )

            const gradedStudents = studentsInProfessorSubjects.filter(
                (s: { grades: { grade: number; subjectId: number }[] }) =>
                    s.grades.some(
                        (g: { grade: number; subjectId: number }) =>
                            g.grade >= 6 &&
                            allowedSubjectIds.includes(g.subjectId)
                    )
            ).length

            // Calculate average grade (only for professor's subjects)
            const allGrades = studentsInProfessorSubjects.flatMap(
                (s: { grades: { grade: number; subjectId: number }[] }) =>
                    s.grades.filter((g: { subjectId: number }) =>
                        allowedSubjectIds.includes(g.subjectId)
                    ) || []
            )
            const avgGrade =
                allGrades.length > 0
                    ? allGrades.reduce(
                          (sum: number, g: { grade: number }) => sum + g.grade,
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
    }

    const openGradeModal = (student: EnrolledStudent, subject: SubjectInfo) => {
        const points = student.currentPoints ?? 0
        setGradeForm({
            studentEmail: student.email,
            studentName: `${student.firstName} ${student.lastName}`,
            subjectId: subject.id,
            subjectName: subject.name,
            grade: student.currentGrade ?? computeGradeFromPoints(points),
            points: points,
        })
        setShowGradeModal(true)
    }

    const handleSubmitGrade = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const computedGrade = computeGradeFromPoints(gradeForm.points)

            const response = await fetch(`${BACKEND_URL}/api/grades`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentEmail: gradeForm.studentEmail,
                    subjectId: gradeForm.subjectId,
                    grade: computedGrade,
                    points: gradeForm.points,
                    examType: 'REGULAR',
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    errorData.error ||
                        errorData.message ||
                        'Failed to submit grade'
                )
            }

            await response.json()

            toastSuccess(
                `Ocjena uspješno unesena: ${gradeForm.studentName} - ${gradeForm.subjectName} - Ocjena: ${gradeForm.grade}`
            )
            setShowGradeModal(false)

            await fetchProfessorData()
        } catch (error) {
            toastError(
                `Greška pri unosu ocjene: ${error instanceof Error ? error.message : 'Pokušajte ponovo'}`
            )
        }
    }

    const handleDeleteAssignment = async (
        folderName: string,
        fileName: string
    ) => {
        // Confirmation dialog
        const confirmed = window.confirm(
            `Da li ste sigurni da želite obrisati zadaću "${fileName}"?\n\nOva akcija se ne može poništiti.`
        )

        if (!confirmed) return

        try {
            const response = await fetch(`${NLP_URL}/delete_file_s3`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    folder_name: folderName,
                    file_name: fileName,
                }),
            })

            if (response.ok) {
                toastSuccess('Zadaća uspješno obrisana!')
                await fetchAllAssignments()
            } else {
                toastError('Greška pri brisanju zadaće')
            }
        } catch (error) {
            console.error('Delete assignment error:', error)
            toastError('Greška pri brisanju zadaće')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-300 mt-4 text-lg">
                        Učitavanje podataka...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-gray-300 p-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-gray-200 mb-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Dobrodošli, {studentName || 'Profesore'}
                        </h1>
                        <p className="text-gray-300">{studentMail}</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Upravljajte ocjenama i pratite napredak studenata
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <IconUserCircle className="w-20 h-20 text-blue-300 opacity-50" />
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-800/50">
                    <div className="flex items-center gap-2 text-sm">
                        <IconBook className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300">
                            Predmeti koje predajete: {stats.totalSubjects}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800 hover:bg-[#252525] hover:scale-105 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <IconUsers className="w-10 h-10 text-blue-500" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400">
                                Ukupno Studenata
                            </h3>
                            <p className="text-3xl font-bold text-blue-500">
                                {stats.totalStudents}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800 hover:bg-[#252525] hover:scale-105 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <IconClipboardList className="w-10 h-10 text-green-500" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400">
                                Predmeti
                            </h3>
                            <p className="text-3xl font-bold text-green-500">
                                {stats.totalSubjects}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800 hover:bg-[#252525] hover:scale-105 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <IconUserCircle className="w-10 h-10 text-purple-500" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400">
                                Ocijenjeno
                            </h3>
                            <p className="text-3xl font-bold text-purple-500">
                                {stats.gradedStudents}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800 hover:bg-[#252525] hover:scale-105 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <IconBook className="w-10 h-10 text-orange-500" />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400">
                                Prosjek Ocjena
                            </h3>
                            <p className="text-3xl font-bold text-orange-500">
                                {stats.averageGrade.toFixed(1)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Exams Section */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-neutral-800 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-200">
                        Raspored Ispita
                    </h2>
                    <button
                        onClick={() => setShowExamModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                        <IconPlus className="w-5 h-5" />
                        Kreiraj Ispit
                    </button>
                </div>

                {exams.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <IconCalendarEvent className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Nema zakazanih ispita</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-[#252525] rounded-lg p-4 border border-neutral-700 hover:border-neutral-600 transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-200 mb-2">
                                            {exam.subject.name} (
                                            {exam.subject.code})
                                        </h3>
                                        <div className="flex gap-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <IconCalendarEvent className="w-4 h-4" />
                                                <span>
                                                    {new Date(
                                                        exam.examTime
                                                    ).toLocaleString('bs-BA', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>
                                            {exam.location && (
                                                <div>
                                                    <span className="font-medium">
                                                        Lokacija:
                                                    </span>{' '}
                                                    {exam.location}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium">
                                                    Max bodova:
                                                </span>{' '}
                                                {exam.maxPoints}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                            Zakazan
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleDeleteExam(
                                                    exam.id,
                                                    exam.subject.name
                                                )
                                            }
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-110"
                                            title="Obriši ispit"
                                        >
                                            <IconTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Assignments Section */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 border border-neutral-800 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-200">
                        Postavljene Zadaće
                    </h2>
                    <button
                        onClick={() => setShowAssignmentModal(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                        <IconPlus className="w-5 h-5" />
                        Postavi Zadaću
                    </button>
                </div>

                {assignmentsLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Učitavanje zadaća...</p>
                    </div>
                ) : Object.keys(professorAssignments).length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <IconClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Nema postavljenih zadaća</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Subject Tabs */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedAssignmentSubject('')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    selectedAssignmentSubject === ''
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-[#252525] text-gray-400 hover:bg-[#2a2a2a]'
                                }`}
                            >
                                Svi predmeti (
                                {
                                    Object.values(professorAssignments).flat()
                                        .length
                                }
                                )
                            </button>
                            {Object.entries(professorAssignments).map(
                                ([subjectName, files]) => (
                                    <button
                                        key={subjectName}
                                        onClick={() =>
                                            setSelectedAssignmentSubject(
                                                subjectName
                                            )
                                        }
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            selectedAssignmentSubject ===
                                            subjectName
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-[#252525] text-gray-400 hover:bg-[#2a2a2a]'
                                        }`}
                                    >
                                        {subjectName} ({files.length})
                                    </button>
                                )
                            )}
                        </div>

                        {/* Assignments Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(professorAssignments)
                                .filter(
                                    ([subjectName]) =>
                                        selectedAssignmentSubject === '' ||
                                        subjectName ===
                                            selectedAssignmentSubject
                                )
                                .flatMap(([subjectName, files]) =>
                                    files.map((filePath, index) => {
                                        const fileName =
                                            filePath.split('/')[1] || filePath
                                        const fileExtension =
                                            fileName
                                                .split('.')
                                                .pop()
                                                ?.toLowerCase() || ''

                                        return (
                                            <div
                                                key={`${subjectName}-${index}`}
                                                className="group relative bg-gradient-to-br from-purple-900/20 to-purple-800/20 hover:from-purple-800/30 hover:to-purple-700/30 p-5 rounded-xl border-2 border-purple-700 hover:border-purple-500 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                                            >
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="bg-purple-600 p-3 rounded-lg group-hover:bg-purple-500 transition-colors">
                                                            <IconFileText className="h-6 w-6 text-white" />
                                                        </div>
                                                        {fileExtension && (
                                                            <span className="px-2 py-1 bg-purple-700 text-purple-200 text-xs font-semibold rounded uppercase">
                                                                {fileExtension}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-purple-400 font-semibold mb-1">
                                                            📚 {subjectName}
                                                        </div>
                                                        <h4 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                                                            {fileName}
                                                        </h4>
                                                        <p className="text-xs text-gray-400">
                                                            ✅ Postavljeno
                                                        </p>
                                                    </div>
                                                    <div
                                                        role="button"
                                                        onClick={() =>
                                                            handleDeleteAssignment(
                                                                subjectName,
                                                                fileName
                                                            )
                                                        }
                                                        className="flex "
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteAssignment(
                                                                    subjectName,
                                                                    fileName
                                                                )
                                                            }
                                                            className="bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md  shadow-red-500/30 hover:bg-red-600  hover:shadow-lg  hover:shadow-red-500/40  active:bg-red-700 active:scale-95 transition-all duration-200 select-none "
                                                        >
                                                            Izbriši
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 rounded-xl transition-colors pointer-events-none" />
                                            </div>
                                        )
                                    })
                                )}
                        </div>
                    </div>
                )}
            </div>

            {/* Subjects with Students */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-200">
                    Predmeti i Studenti
                </h2>

                {subjectsWithStudents.map((item, index) => (
                    <motion.div
                        key={item.subject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 border border-neutral-800"
                    >
                        {/* Subject Header */}
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-700">
                            <div>
                                <h3 className="text-xl font-bold text-gray-200">
                                    {item.subject.name}
                                </h3>
                                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                                    <span>Kod: {item.subject.code}</span>
                                    <span>
                                        ECTS: {item.subject.ects} bodova
                                    </span>
                                    <span>
                                        {item.subject.year}. godina, Semestar{' '}
                                        {item.subject.semester}
                                    </span>
                                    <span
                                        className={
                                            item.subject.isElective
                                                ? 'text-purple-400'
                                                : 'text-blue-400'
                                        }
                                    >
                                        {item.subject.isElective
                                            ? 'Izborni'
                                            : 'Obavezan'}
                                    </span>
                                </div>
                            </div>
                            <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold">
                                {item.students.length} studenata
                            </span>
                        </div>

                        {/* Students Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-neutral-700">
                                        <th className="pb-3 px-4">Indeks</th>
                                        <th className="pb-3 px-4">Ime</th>
                                        <th className="pb-3 px-4">Email</th>
                                        <th className="pb-3 px-4">Ocjena</th>
                                        <th className="pb-3 px-4">Bodovi</th>
                                        <th className="pb-3 px-4">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.students.map((student) => (
                                        <tr
                                            key={student.id}
                                            className="border-b border-neutral-800 hover:bg-[#252525] transition-colors"
                                        >
                                            <td className="py-4 px-4 text-gray-300">
                                                {student.indexNumber}
                                            </td>
                                            <td className="py-4 px-4 text-gray-200 font-medium">
                                                {student.firstName}{' '}
                                                {student.lastName}
                                            </td>
                                            <td className="py-4 px-4 text-gray-400 text-sm">
                                                {student.email}
                                            </td>
                                            <td className="py-4 px-4">
                                                {student.hasGrade ||
                                                (student.currentPoints !==
                                                    undefined &&
                                                    student.currentPoints !==
                                                        null) ? (
                                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                                                        {student.currentGrade ??
                                                            computeGradeFromPoints(
                                                                student.currentPoints
                                                            )}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 italic">
                                                        Nije ocijenjeno
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-gray-300">
                                                {student.hasGrade
                                                    ? `${student.currentPoints}/100`
                                                    : '-'}
                                            </td>
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() =>
                                                        openGradeModal(
                                                            student,
                                                            item.subject
                                                        )
                                                    }
                                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                        student.hasGrade
                                                            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                                    }`}
                                                >
                                                    {student.hasGrade
                                                        ? 'Ažuriraj'
                                                        : 'Ocijeni'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ))}

                {subjectsWithStudents.length === 0 && (
                    <div className="bg-[#1a1a1a] rounded-xl p-12 text-center border border-neutral-800">
                        <IconClipboardList className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">
                            Nema upisanih studenata
                        </h3>
                        <p className="text-gray-500">
                            Trenutno nema studenata upisanih na predmete.
                        </p>
                    </div>
                )}
            </div>

            {/* Grade Modal */}
            {showGradeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">
                            Unos Ocjene
                        </h2>

                        <div className="mb-6 p-4 bg-[#252525] rounded-lg">
                            <p className="text-sm text-gray-400">Student</p>
                            <p className="text-lg font-bold text-gray-200">
                                {gradeForm.studentName}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                Predmet
                            </p>
                            <p className="text-lg font-bold text-gray-200">
                                {gradeForm.subjectName}
                            </p>
                        </div>

                        <form onSubmit={handleSubmitGrade}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Bodovi (0-100):
                                    </label>
                                    <input
                                        min="0"
                                        max="100"
                                        value={gradeForm.points}
                                        onChange={(e) => {
                                            const pts = parseInt(
                                                e.target.value || '0'
                                            )
                                            setGradeForm({
                                                ...gradeForm,
                                                points: isNaN(pts) ? 0 : pts,
                                                grade: computeGradeFromPoints(
                                                    pts
                                                ),
                                            })
                                        }}
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                    />

                                    <p className="text-sm text-gray-400 mt-2">
                                        Ocjena će se izračunati automatski iz
                                        bodova.
                                    </p>

                                    <div className="mt-3 bg-[#111111] p-3 rounded text-sm text-gray-400">
                                        <p className="font-semibold text-gray-200 mb-1">
                                            Pravila konverzije bodova → ocjena:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>0 - 53: 5 (pala)</li>
                                            <li>54 - 62: 6</li>
                                            <li>63 - 71: 7</li>
                                            <li>72 - 80: 8</li>
                                            <li>81 - 89: 9</li>
                                            <li>90 - 100: 10</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowGradeModal(false)}
                                    className="px-6 py-2 text-gray-400 hover:text-gray-200 font-medium transition-colors"
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
                                >
                                    Potvrdi Ocjenu
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Exam Creation Modal */}
            {showExamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-200">
                                Kreiraj Ispit
                            </h2>
                            <button
                                onClick={() => setShowExamModal(false)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateExam}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Predmet *
                                    </label>
                                    <select
                                        value={examForm.subjectId}
                                        onChange={(e) =>
                                            setExamForm({
                                                ...examForm,
                                                subjectId: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                    >
                                        <option value={0}>
                                            Odaberi predmet
                                        </option>
                                        {subjectsWithStudents.map((item) => (
                                            <option
                                                key={item.subject.id}
                                                value={item.subject.id}
                                            >
                                                {item.subject.name} (
                                                {item.subject.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Datum i Vrijeme *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={examForm.examTime}
                                        onChange={(e) =>
                                            setExamForm({
                                                ...examForm,
                                                examTime: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Lokacija (učionica)
                                    </label>
                                    <input
                                        type="text"
                                        value={examForm.location}
                                        onChange={(e) =>
                                            setExamForm({
                                                ...examForm,
                                                location: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        placeholder="npr. A101"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Maksimalni Bodovi
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="200"
                                        value={examForm.maxPoints}
                                        onChange={(e) =>
                                            setExamForm({
                                                ...examForm,
                                                maxPoints: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowExamModal(false)}
                                    className="px-6 py-2 text-gray-400 hover:text-gray-200 font-medium transition-colors"
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105"
                                >
                                    Kreiraj Ispit
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Assignment modal  */}
            {showAssignmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-200">
                                Kreiraj Zadaću
                            </h2>
                            <button
                                onClick={() => setShowAssignmentModal(false)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAssignment}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Predmet *
                                    </label>
                                    <select
                                        value={assignmentForm.subjectId}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                subjectId: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                        disabled={isUploading}
                                    >
                                        <option value={0}>
                                            Odaberi predmet
                                        </option>
                                        {subjectsWithStudents.map((item) => (
                                            <option
                                                key={item.subject.id}
                                                value={item.subject.id}
                                            >
                                                {item.subject.name} (
                                                {item.subject.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Naziv zadaće *
                                    </label>
                                    <input
                                        type="text"
                                        value={assignmentForm.title}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                title: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        placeholder="npr. Domaća zadaća 1"
                                        required
                                        disabled={isUploading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Priloži fajl (PDF, DOCX, ZIP) *
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.docx,.doc,.zip,.rar"
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                file:
                                                    e.target.files?.[0] || null,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer"
                                        required
                                        disabled={isUploading}
                                    />
                                    {assignmentForm.file && (
                                        <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                                            <span>📎</span>
                                            {assignmentForm.file.name}
                                            <span className="text-xs text-gray-500">
                                                (
                                                {(
                                                    assignmentForm.file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{' '}
                                                MB)
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAssignmentModal(false)
                                    }
                                    className="px-6 py-2 text-gray-400 hover:text-gray-200 font-medium transition-colors"
                                    disabled={isUploading}
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Uploadujem...
                                        </>
                                    ) : (
                                        'Postavi Zadaću'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default ProfessorBoard
