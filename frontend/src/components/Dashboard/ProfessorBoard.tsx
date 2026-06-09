import {
    IconBook,
    IconCalendarEvent,
    IconClipboardList,
    IconDownload,
    IconFileText,
    IconGitCompare,
    IconPlus,
    IconTrash,
    IconUpload,
    IconUserCircle,
    IconUsers,
    IconX,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { BACKEND_URL, NLP_URL } from '../../constants/storage'
import { useAuth } from '../../Context'
import useFetchAboutProfessorData from '../../hooks/professorHooks/useProfessorsHooks'
import { toastError, toastSuccess } from '../../lib/toast'

import {
    AssignmentFormData,
    EnrolledStudent,
    ExamFormData,
    GradeAssignmentFormData,
    GradeFormData,
    SimilarityResult,
    SubjectInfo,
} from '../../types/ProfessorsTypes/Professors'

const SIMILARITY_THRESHOLD_CRITICAL = 0.9
const SIMILARITY_THRESHOLD_WARNING = 0.75
const SIMILARITY_THRESHOLD_NOTICE = 0.45

const ProfessorBoard: React.FC = () => {
    const { studentMail, studentName } = useAuth()

    // Use custom hook for data fetching
    const {
        isLoading,
        subjectsWithStudents,
        professorId,
        exams,
        stats,
        professorAssignments,
        assignmentsLoading,
        backendAssignments,
        backendAssignmentsLoading,
        refetch,
        refetchExams,
        refetchAssignments,
        refetchBackendAssignments,
        gradeAssignment,
    } = useFetchAboutProfessorData(studentMail)

    // For compairing file similarity states
    const [similarityResult, setSimilarityResult] =
        useState<SimilarityResult | null>(null)
    const [compareFile1, setCompareFile1] = useState<File | null>(null)
    const [compareFile2, setCompareFile2] = useState<File | null>(null)
    const [isComparing, setIsComparing] = useState(false)

    const [activeSection, setActiveSection] = useState<
        'ispiti' | 'zadace' | 'pitanja'
    >('ispiti')

    // Questions state
    const [allQuestions, setAllQuestions] = useState<
        {
            id: number
            text: string
            answer: string | null
            createdAt: string
            assignmentId: number
            assignment: { title: string; subject: { name: string; code: string } }
            student: { firstName: string; lastName: string; email: string }
        }[]
    >([])
    const [questionsLoading, setQuestionsLoading] = useState(false)
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null)
    const [answerText, setAnswerText] = useState('')
    const [questionFilter, setQuestionFilter] = useState<'otvorena' | 'odgovorena' | 'sve'>('otvorena')
    const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)

    const [showGradeModal, setShowGradeModal] = useState(false)
    const [showGradeAssignmentModal, setShowGradeAssignmentModal] =
        useState(false)
    const [gradeAssignmentForm, setGradeAssignmentForm] =
        useState<GradeAssignmentFormData>({
            assignmentId: 0,
            assignmentTitle: '',
            maxPoints: 0,
            studentEmail: '',
            studentName: '',
            pointsEarned: 0,
            feedback: '',
        })
    const [isGradingAssignment, setIsGradingAssignment] = useState(false)
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
        type: 'Zadaća',
        difficulty: 'Srednje',
        maxPoints: 20,
        file: null,
    })
    const [isUploading, setIsUploading] = useState(false)
    const [selectedAssignmentSubject, setSelectedAssignmentSubject] =
        useState<string>('')

    // Convert points (0-100) into grade (5-10) using thresholds
    const fetchAllQuestions = async () => {
        if (!backendAssignments.length) return
        setQuestionsLoading(true)
        try {
            const results = await Promise.all(
                backendAssignments.map(async (assignment) => {
                    const res = await fetch(
                        `${BACKEND_URL}/api/assignments/${assignment.id}/questions`
                    )
                    if (!res.ok) return []
                    const data = await res.json()
                    const questions = data.question ?? []
                    return questions.map(
                        (q: {
                            id: number
                            text: string
                            answer: string | null
                            createdAt: string
                            student: { firstName: string; lastName: string; email: string }
                        }) => ({
                            ...q,
                            assignmentId: assignment.id,
                            assignment: {
                                title: assignment.title,
                                subject: assignment.subject,
                            },
                        })
                    )
                })
            )
            setAllQuestions(results.flat())
        } finally {
            setQuestionsLoading(false)
        }
    }

    useEffect(() => {
        if (activeSection === 'pitanja' && backendAssignments.length > 0) {
            fetchAllQuestions()
        }
    }, [activeSection, backendAssignments])

    const handleSubmitAnswer = async () => {
        if (!selectedQuestionId || !answerText.trim()) return
        const q = allQuestions.find((q) => q.id === selectedQuestionId)
        if (!q) return
        setIsSubmittingAnswer(true)
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/assignments/${q.assignmentId}/questions/${selectedQuestionId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answer: answerText }),
                }
            )
            if (res.ok) {
                const wasAlreadyAnswered = !!q.answer
                setAllQuestions((prev) =>
                    prev.map((item) =>
                        item.id === selectedQuestionId
                            ? { ...item, answer: answerText }
                            : item
                    )
                )
                if (wasAlreadyAnswered) {
                    toastSuccess('Odgovor uspješno ažuriran!')
                } else {
                    toastSuccess('Odgovor objavljen!')
                    setSelectedQuestionId(null)
                    setAnswerText('')
                    setQuestionFilter('odgovorena')
                }
            } else {
                toastError('Greška pri slanju odgovora')
            }
        } catch {
            toastError('Greška pri slanju odgovora')
        } finally {
            setIsSubmittingAnswer(false)
        }
    }

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

        if (!assignmentForm.dueDate) {
            toastError('Morate odabrati rok predaje!')
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
                if (professorId) {
                    try {
                        const ext =
                            assignmentForm.file!.name.split('.').pop() || 'pdf'
                        const professorS3Path = `${subjectName}/${assignmentForm.title}.${ext}`
                        await fetch(`${BACKEND_URL}/api/assignments`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: assignmentForm.title,
                                description: assignmentForm.description || null,
                                type: assignmentForm.type,
                                difficulty: assignmentForm.difficulty,
                                dueDate: assignmentForm.dueDate,
                                maxPoints: assignmentForm.maxPoints,
                                professorS3Path,
                                subjectId: assignmentForm.subjectId,
                                professorId,
                            }),
                        })
                        await refetchBackendAssignments(professorId)
                    } catch (err) {
                        console.error('❌ Backend assignment save error:', err)
                    }
                }

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

                toastSuccess('Zadaća uspješno postavljena!')
                setShowAssignmentModal(false)
                setAssignmentForm({
                    subjectId: 0,
                    dueDate: '',
                    title: '',
                    description: '',
                    type: 'Zadaća',
                    difficulty: 'Srednje',
                    maxPoints: 20,
                    file: null,
                })
                // Refresh assignments list
                await refetchAssignments()
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

            // Get emarefetchtudents enrolled in this specific subject
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
                if (professorId) await refetchExams(professorId)
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
                if (professorId) await refetchExams(professorId)
            } else {
                toastError('Greška pri brisanju ispita')
            }
        } catch (error) {
            console.error('Delete exam error:', error)
            toastError('Greška pri brisanju ispita')
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

            await refetch()
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
                await refetchAssignments()
            } else {
                toastError('Greška pri brisanju zadaće')
            }
        } catch (error) {
            console.error('Delete assignment error:', error)
            toastError('Greška pri brisanju zadaće')
        }
    }

    const handleDownloadSubmission = async (s3Path: string) => {
        try {
            const [folderName, fileName] = s3Path.split('/')
            const response = await fetch(
                `${NLP_URL}/get_file_from_s3?folder_name=${encodeURIComponent(folderName)}&file_name=${encodeURIComponent(fileName)}`
            )
            if (!response.ok) throw new Error('Download failed')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toastSuccess(`Preuzeto: ${fileName}`)
        } catch {
            toastError('Greška pri preuzimanju fajla')
        }
    }

    const handleGradeAssignment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!professorId) return
        setIsGradingAssignment(true)
        try {
            await gradeAssignment(
                gradeAssignmentForm.assignmentId,
                gradeAssignmentForm.studentEmail,
                gradeAssignmentForm.pointsEarned,
                gradeAssignmentForm.feedback,
                professorId
            )
            toastSuccess(
                `Ocijenjeno: ${gradeAssignmentForm.studentName} — ${gradeAssignmentForm.pointsEarned}/${gradeAssignmentForm.maxPoints} bodova`
            )
            setShowGradeAssignmentModal(false)
            await refetchBackendAssignments(professorId)
        } catch (error) {
            toastError(
                `Greška: ${error instanceof Error ? error.message : 'Pokušajte ponovo'}`
            )
        } finally {
            setIsGradingAssignment(false)
        }
    }

    const handleCompareAssignments = async () => {
        if (!compareFile1 || !compareFile2) {
            toastError('Morate odabrati oba fajla za poređenje!')
            return
        }
        setIsComparing(true)
        try {
            toastSuccess('Poređenje zadaća u toku...')

            // Send files to NLP service endpoint
            const formData = new FormData()
            formData.append('file_1', compareFile1 as File)
            formData.append('file_2', compareFile2 as File)

            const response = await fetch(`${NLP_URL}/check_two_file`, {
                method: 'POST',
                body: formData,
            })

            const result = await response.json().catch(() => null)

            if (response.ok && result) {
                setSimilarityResult(result)
                toastSuccess('Rezultat dobijen')
            } else {
                const errMsg =
                    result?.message ||
                    (await response.text().catch(() => 'Greška na NLP servisu'))
                toastError(errMsg)
            }
        } catch (error) {
            toastError(
                'Greška pri poređenju zadaća' +
                    (error instanceof Error ? `: ${error.message}` : '')
            )
            console.error('Comparison error:', error)
        } finally {
            setIsComparing(false)
        }
    }

    // Helper to summarize similarity into label, color and percent
    const summarizeSimilarity = (sim: SimilarityResult | null) => {
        if (!sim) return null
        const score = sim.result?.score ?? 0
        const pct = Number((score * 100).toFixed(1))
        let label = 'Niska sličnost — različiti radovi'
        let color = 'bg-green-600'
        let textColor = 'text-green-300'

        if (score >= SIMILARITY_THRESHOLD_CRITICAL) {
            label = 'Vrlo visoka sličnost — mogući plagijat'
            color = 'bg-red-600'
            textColor = 'text-red-300'
        } else if (score >= SIMILARITY_THRESHOLD_WARNING) {
            label = 'Visoka sličnost — provjeriti prepisivanje'
            color = 'bg-orange-600'
            textColor = 'text-orange-300'
        } else if (score >= SIMILARITY_THRESHOLD_NOTICE) {
            label = 'Ista tema — slične ideje'
            color = 'bg-yellow-500'
            textColor = 'text-yellow-300'
        }

        return { score, pct, label, color, textColor }
    }

    const similaritySummary = summarizeSimilarity(similarityResult)

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

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 border-b border-neutral-800 pb-4">
                <button
                    onClick={() => setActiveSection('ispiti')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === 'ispiti'
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-200 border border-neutral-800'
                    }`}
                >
                    Raspored Ispita
                </button>
                <button
                    onClick={() => setActiveSection('zadace')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === 'zadace'
                            ? 'bg-purple-600 text-white'
                            : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-200 border border-neutral-800'
                    }`}
                >
                    Zadaće
                </button>
                <button
                    onClick={() => setActiveSection('pitanja')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeSection === 'pitanja'
                            ? 'bg-green-600 text-white'
                            : 'bg-[#1a1a1a] text-gray-400 hover:text-gray-200 border border-neutral-800'
                    }`}
                >
                    Pitanja studenata
                </button>
            </div>

            {/* Exams Section */}
            {activeSection === 'ispiti' && <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-neutral-800 mb-8"
            >
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
                        {exams.map((exam, examIndex) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: examIndex * 0.1,
                                    duration: 0.4,
                                }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="bg-[#252525] rounded-lg p-4 border border-neutral-700 hover:border-blue-500/50 transition-all"
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
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() =>
                                                handleDeleteExam(
                                                    exam.id,
                                                    exam.subject.name
                                                )
                                            }
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                            title="Obriši ispit"
                                        >
                                            <IconTrash className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>}

            {activeSection === 'zadace' && <>
            {/* Assignments Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-neutral-800 mb-8"
            >
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
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
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
                            </motion.button>
                            {Object.entries(professorAssignments).map(
                                ([subjectName, files]) => (
                                    <motion.button
                                        key={subjectName}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
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
                                    </motion.button>
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
                                            <motion.div
                                                key={`${subjectName}-${index}`}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    delay: index * 0.05,
                                                    duration: 0.3,
                                                }}
                                                whileHover={{
                                                    scale: 1.05,
                                                    y: -5,
                                                }}
                                                className="group relative bg-gradient-to-br from-purple-900/20 to-purple-800/20 hover:from-purple-800/30 hover:to-purple-700/30 p-5 rounded-xl border-2 border-purple-700 hover:border-purple-500 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
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
                                                    <div className="flex">
                                                        <motion.button
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.95,
                                                            }}
                                                            onClick={() =>
                                                                handleDeleteAssignment(
                                                                    subjectName,
                                                                    fileName
                                                                )
                                                            }
                                                            className="bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-red-500/30 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/40 transition-all duration-200 select-none"
                                                        >
                                                            Izbriši
                                                        </motion.button>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 rounded-xl transition-colors pointer-events-none" />
                                            </motion.div>
                                        )
                                    })
                                )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Compare Assignments Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl p-8 border border-neutral-800 mb-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <IconGitCompare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-200">
                                Uporedi Zadaće
                            </h2>
                            <p className="text-sm text-gray-400">
                                Provjera sličnosti pomoću NLP servisa
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#252525] rounded-xl p-6 border-2 border-dashed border-neutral-700 hover:border-blue-500 transition-all"
                        >
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-blue-500/10 rounded-full mb-4">
                                    <IconUpload className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                                    Prva zadaća
                                </h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    {compareFile1
                                        ? compareFile1.name
                                        : 'Odaberite fajl'}
                                </p>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.docx,.doc,.txt"
                                        onChange={(e) =>
                                            setCompareFile1(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                        className="hidden"
                                    />
                                    <span className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all inline-block">
                                        {compareFile1
                                            ? 'Promijeni'
                                            : 'Odaberi fajl'}
                                    </span>
                                </label>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#252525] rounded-xl p-6 border-2 border-dashed border-neutral-700 hover:border-purple-500 transition-all"
                        >
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                                    <IconUpload className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                                    Druga zadaća
                                </h3>
                                <p className="text-sm text-gray-400 mb-4">
                                    {compareFile2
                                        ? compareFile2.name
                                        : 'Odaberite fajl'}
                                </p>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.docx,.doc,.txt"
                                        onChange={(e) =>
                                            setCompareFile2(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                        className="hidden"
                                    />
                                    <span className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all inline-block">
                                        {compareFile2
                                            ? 'Promijeni'
                                            : 'Odaberi fajl'}
                                    </span>
                                </label>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCompareAssignments}
                            disabled={
                                !compareFile1 || !compareFile2 || isComparing
                            }
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3"
                        >
                            {isComparing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Poređenje u toku...
                                </>
                            ) : (
                                <>
                                    <IconGitCompare className="w-5 h-5" />
                                    Uporedi zadaće
                                </>
                            )}
                        </motion.button>
                    </div>
                    {similarityResult ? (
                        <div className="mt-6 p-6 bg-gradient-to-r from-slate-900 to-slate-800 border border-neutral-700 rounded-lg">
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-200">
                                        Analiza sličnosti
                                    </h3>
                                    <div className="mt-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${similaritySummary?.textColor} ${similaritySummary?.color}`}
                                            >
                                                {similaritySummary?.label}
                                            </div>
                                            <div className="ml-auto text-right">
                                                <div className="text-3xl font-bold text-white">
                                                    {similaritySummary?.pct}%
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    Ukupna sličnost
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 h-2 w-full bg-neutral-800 rounded overflow-hidden">
                                            <div
                                                className={`${similaritySummary?.color} h-2`}
                                                style={{
                                                    width: `${similaritySummary?.pct}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-60">
                                    <div className="text-lg text-gray-400 mb-2">
                                        Brza procjena
                                    </div>
                                    <div className="p-3 bg-[#0b1220] rounded border border-neutral-700">
                                        <div className="text-sm text-gray-200 font-medium mb-1">
                                            {similaritySummary?.label}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Ocjena:{' '}
                                            <span className="font-semibold text-white">
                                                {similaritySummary?.pct}%
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400">
                                            {(similaritySummary?.score ?? 0) >=
                                                SIMILARITY_THRESHOLD_CRITICAL && (
                                                <>
                                                    <strong>Upozorenje:</strong>{' '}
                                                    Visoka vjerovatnoća
                                                    prepisivanja.
                                                </>
                                            )}
                                            {(similaritySummary?.score ?? 0) <
                                                SIMILARITY_THRESHOLD_CRITICAL &&
                                                (similaritySummary?.score ??
                                                    0) >=
                                                    SIMILARITY_THRESHOLD_WARNING && (
                                                    <>
                                                        <strong>
                                                            Preporuka:
                                                        </strong>{' '}
                                                        Detaljno provjeriti
                                                        slične dijelove.
                                                    </>
                                                )}
                                            {(similaritySummary?.score ?? 0) <
                                                SIMILARITY_THRESHOLD_WARNING &&
                                                (similaritySummary?.score ??
                                                    0) >=
                                                    SIMILARITY_THRESHOLD_NOTICE && (
                                                    <>
                                                        <strong>
                                                            Napomena:
                                                        </strong>{' '}
                                                        Iste teme/ideje — moguće
                                                        preklapanje
                                                        literaturama.
                                                    </>
                                                )}
                                            {(similaritySummary?.score ?? 0) <
                                                SIMILARITY_THRESHOLD_NOTICE && (
                                                <>
                                                    <strong>Ok:</strong> Niska
                                                    sličnost, radovi su
                                                    različiti.
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#111827] p-3 rounded border border-neutral-700">
                                    <h4 className="text-sm text-gray-300 font-medium mb-2">
                                        Matrica sličnosti
                                    </h4>
                                    <pre className="text-xs text-gray-200 bg-transparent overflow-auto p-2">
                                        {JSON.stringify(
                                            similarityResult.result.matrix,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                                <div className="bg-[#111827] p-3 rounded border border-neutral-700">
                                    <h4 className="text-sm text-gray-300 font-medium mb-2">
                                        Tumačenje
                                    </h4>
                                    <ul className="text-sm text-gray-400 list-disc list-inside">
                                        <li>
                                            <strong>Ocjena</strong>: Postotak
                                            sličnosti između dva poslana fajla.
                                        </li>
                                        <li>
                                            <strong>Matrica</strong>: Matrica
                                            parnih sličnosti (po
                                            segmentima/rečenicama).
                                        </li>
                                        <li>
                                            <strong>Zaključak</strong>:
                                            Koristite kao smjernicu — provjerite
                                            istaknute dijelove u detaljnom
                                            izvještaju.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-300 text-center">
                            💡 NLP servis će analizirati sličnost između dvije
                            zadaće i pružiti detaljan izvještaj
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Grade Assignments Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.5 }}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-neutral-800 mb-8"
            >
                <h2 className="text-2xl font-bold text-gray-200 mb-6">
                    Ocijeni Zadaće
                </h2>

                {backendAssignmentsLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-3"></div>
                        <p className="text-gray-400">Učitavanje...</p>
                    </div>
                ) : backendAssignments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <IconClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nema kreiranih zadaća</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {backendAssignments.map((assignment) => {
                            const pending = assignment.submissions.filter(
                                (s) => s.status === 'PENDING'
                            )
                            const graded = assignment.submissions.filter(
                                (s) => s.status === 'GRADED'
                            )
                            return (
                                <div
                                    key={assignment.id}
                                    className="bg-[#252525] rounded-xl p-5 border border-neutral-700"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-medium">
                                                    {assignment.type}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {assignment.subject.code}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-200">
                                                {assignment.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Rok:{' '}
                                                {new Date(
                                                    assignment.dueDate
                                                ).toLocaleDateString('bs-BA')}{' '}
                                                · Maks:{' '}
                                                <span className="text-green-400 font-semibold">
                                                    {assignment.maxPoints} bodova
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full">
                                                {graded.length} ocijenjeno
                                            </span>
                                            <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full">
                                                {pending.length} čeka
                                            </span>
                                        </div>
                                    </div>

                                    {assignment.submissions.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">
                                            Nema predaja za ovu zadaću
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {assignment.submissions.map(
                                                (sub) => (
                                                    <div
                                                        key={sub.id}
                                                        className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-4 py-3"
                                                    >
                                                        <div>
                                                            <p className="text-gray-200 font-medium text-sm">
                                                                {
                                                                    sub.student
                                                                        .firstName
                                                                }{' '}
                                                                {
                                                                    sub.student
                                                                        .lastName
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {
                                                                    sub.student
                                                                        .indexNumber
                                                                }{' '}
                                                                ·{' '}
                                                                {
                                                                    sub.student
                                                                        .email
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {sub.status ===
                                                            'GRADED' ? (
                                                                <span className="text-green-400 font-semibold text-sm">
                                                                    {
                                                                        sub.pointsEarned
                                                                    }
                                                                    /
                                                                    {
                                                                        assignment.maxPoints
                                                                    }{' '}
                                                                    bodova
                                                                </span>
                                                            ) : null}
                                                            {sub.s3Path && (
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleDownloadSubmission(sub.s3Path!)}
                                                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                                                                    title="Preuzmi zadaću"
                                                                >
                                                                    <IconDownload className="w-4 h-4" />
                                                                    Preuzmi
                                                                </motion.button>
                                                            )}
                                                            <motion.button
                                                                whileHover={{
                                                                    scale: 1.05,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.95,
                                                                }}
                                                                onClick={() => {
                                                                    setGradeAssignmentForm(
                                                                        {
                                                                            assignmentId:
                                                                                assignment.id,
                                                                            assignmentTitle:
                                                                                assignment.title,
                                                                            maxPoints:
                                                                                assignment.maxPoints,
                                                                            studentEmail:
                                                                                sub
                                                                                    .student
                                                                                    .email,
                                                                            studentName: `${sub.student.firstName} ${sub.student.lastName}`,
                                                                            pointsEarned:
                                                                                sub.status ===
                                                                                'GRADED'
                                                                                    ? sub.pointsEarned
                                                                                    : 0,
                                                                            feedback:
                                                                                sub.feedback ||
                                                                                '',
                                                                        }
                                                                    )
                                                                    setShowGradeAssignmentModal(
                                                                        true
                                                                    )
                                                                }}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                                    sub.status ===
                                                                    'GRADED'
                                                                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                                                                        : 'bg-green-500 text-white hover:bg-green-600'
                                                                }`}
                                                            >
                                                                {sub.status ===
                                                                'GRADED'
                                                                    ? 'Ažuriraj'
                                                                    : 'Ocijeni'}
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            {/* Subjects with Students */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="space-y-6"
            >
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-2xl font-bold text-gray-200"
                >
                    Predmeti i Studenti
                </motion.h2>

                {subjectsWithStudents.map((item, index) => (
                    <motion.div
                        key={item.subject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.45 + index * 0.08,
                            duration: 0.5,
                        }}
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
                                        <th className="pb-3 px-4 font-semibold">
                                            Indeks
                                        </th>
                                        <th className="pb-3 px-4 font-semibold">
                                            Ime
                                        </th>
                                        <th className="pb-3 px-4 font-semibold">
                                            Email
                                        </th>
                                        <th className="pb-3 px-4 font-semibold">
                                            Ocjena
                                        </th>
                                        <th className="pb-3 px-4 font-semibold">
                                            Bodovi
                                        </th>
                                        <th className="pb-3 px-4 font-semibold">
                                            Akcije
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.students
                                        .filter(
                                            (student, index, self) =>
                                                index ===
                                                self.findIndex(
                                                    (s) =>
                                                        s.email ===
                                                        student.email
                                                )
                                        )
                                        .map((student, studentIndex) => (
                                            <motion.tr
                                                key={`${item.subject.id}-${student.email}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay:
                                                        0.5 +
                                                        index * 0.08 +
                                                        studentIndex * 0.02,
                                                    duration: 0.3,
                                                }}
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
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
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
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ))}

                {subjectsWithStudents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] rounded-xl p-12 text-center border border-neutral-800"
                    >
                        <IconClipboardList className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">
                            Nema upisanih studenata
                        </h3>
                        <p className="text-gray-500">
                            Trenutno nema studenata upisanih na predmete.
                        </p>
                    </motion.div>
                )}
            </motion.div>
            </>}

            {/* Questions Section */}
            {activeSection === 'pitanja' && (() => {
                const pending = allQuestions.filter((q) => !q.answer)
                const filtered =
                    questionFilter === 'otvorena'
                        ? allQuestions.filter((q) => !q.answer)
                        : questionFilter === 'odgovorena'
                          ? allQuestions.filter((q) => q.answer)
                          : allQuestions
                const selected = allQuestions.find((q) => q.id === selectedQuestionId) ?? null

                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1a1a1a] rounded-xl border border-neutral-800 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-800">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-gray-200">
                                    Pitanja studenata
                                </h2>
                                {pending.length > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {pending.length} čeka odgovor
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400">
                                Odgovori se automatski objavljuju svim studentima predmeta
                            </p>
                        </div>

                        <div className="flex h-[600px]">
                            {/* Left panel */}
                            <div className="w-96 border-r border-neutral-800 flex flex-col">
                                {/* Filter tabs */}
                                <div className="flex gap-2 p-4 border-b border-neutral-800">
                                    {(
                                        [
                                            { key: 'otvorena', label: 'Otvorena', count: allQuestions.filter((q) => !q.answer).length },
                                            { key: 'odgovorena', label: 'Odgovorena', count: allQuestions.filter((q) => q.answer).length },
                                            { key: 'sve', label: 'Sve', count: allQuestions.length },
                                        ] as const
                                    ).map((tab) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setQuestionFilter(tab.key)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                                questionFilter === tab.key
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-[#252525] text-gray-400 hover:text-gray-200'
                                            }`}
                                        >
                                            {tab.label}
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${questionFilter === tab.key ? 'bg-blue-500' : 'bg-neutral-700'}`}>
                                                {tab.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Question list */}
                                <div className="flex-1 overflow-y-auto">
                                    {questionsLoading ? (
                                        <div className="p-6 text-center text-gray-500 text-sm">
                                            Učitavanje...
                                        </div>
                                    ) : filtered.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500 text-sm">
                                            Nema pitanja
                                        </div>
                                    ) : (
                                        filtered.map((q) => {
                                            const initials = `${q.student.firstName[0]}${q.student.lastName[0]}`
                                            return (
                                                <button
                                                    key={q.id}
                                                    onClick={() => {
                                                        setSelectedQuestionId(q.id)
                                                        setAnswerText(q.answer ?? '')
                                                    }}
                                                    className={`w-full text-left p-4 border-b border-neutral-800 hover:bg-[#252525] transition-all ${
                                                        selectedQuestionId === q.id ? 'bg-[#252525] border-l-2 border-l-blue-500' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold flex items-center justify-center">
                                                                {initials}
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-300">
                                                                {q.student.firstName} {q.student.lastName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(q.createdAt).toLocaleDateString('bs-BA')}
                                                            </span>
                                                            {!q.answer && (
                                                                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                                                        {q.text}
                                                    </p>
                                                    <div className="flex gap-1.5">
                                                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                                            {q.assignment.subject.code}
                                                        </span>
                                                        <span className="text-xs bg-neutral-700 text-gray-400 px-2 py-0.5 rounded">
                                                            {q.assignment.subject.name}
                                                        </span>
                                                    </div>
                                                </button>
                                            )
                                        })
                                    )}
                                </div>

                            </div>

                            {/* Right panel */}
                            <div className="flex-1 flex flex-col">
                                {selected ? (
                                    <>
                                        {/* Question detail */}
                                        <div className="p-6 border-b border-neutral-800">
                                            <p className="text-xs text-gray-500 mb-4">
                                                {selected.assignment.subject.name} · {selected.assignment.title}
                                            </p>
                                            <div className="bg-[#252525] rounded-xl p-5 border border-neutral-700">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 text-sm font-bold flex items-center justify-center">
                                                        {selected.student.firstName[0]}{selected.student.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-200">
                                                            {selected.student.firstName} {selected.student.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(selected.createdAt).toLocaleString('bs-BA', { dateStyle: 'medium', timeStyle: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-200 font-medium text-lg">
                                                    {selected.text}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Answer area */}
                                        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
                                            <p className="text-xs font-bold text-gray-400 tracking-wider">
                                                TVOJ ODGOVOR
                                            </p>
                                            <textarea
                                                value={answerText}
                                                onChange={(e) => setAnswerText(e.target.value)}
                                                placeholder="Napiši odgovor..."
                                                className="flex-1 min-h-32 bg-[#252525] border border-neutral-700 rounded-xl p-4 text-gray-200 text-sm resize-none focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={handleSubmitAnswer}
                                                    disabled={!answerText.trim() || isSubmittingAnswer}
                                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                                >
                                                    {isSubmittingAnswer ? 'Slanje...' : 'Objavi odgovor'}
                                                </button>
                                                <span className="text-xs text-gray-500">
                                                    {selected.answer ? '✓ Već odgovoreno' : 'Čeka odgovor'}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                                        Odaberi pitanje s lijeve strane
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )
            })()}

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
                                        Tip zadaće *
                                    </label>
                                    <select
                                        value={assignmentForm.type}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                type: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        disabled={isUploading}
                                    >
                                        <option value="Zadaća">Zadaća</option>
                                        <option value="Parcijalni ispit">
                                            Parcijalni ispit
                                        </option>
                                        <option value="Projekt">Projekt</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Težina zadaće
                                    </label>
                                    <select
                                        value={assignmentForm.difficulty}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                difficulty: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        disabled={isUploading}
                                    >
                                        <option value="Lagan">Lagan</option>
                                        <option value="Srednje">Srednje</option>
                                        <option value="Težak">Težak</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Broj bodova *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={assignmentForm.maxPoints}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                maxPoints: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                        disabled={isUploading}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        1 bod = 1% konačne ocjene
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Rok predaje *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={assignmentForm.dueDate}
                                        onChange={(e) =>
                                            setAssignmentForm({
                                                ...assignmentForm,
                                                dueDate: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
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
            {/* Grade Assignment Modal */}
            {showGradeAssignmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-200">
                                Ocijeni zadaću
                            </h2>
                            <button
                                onClick={() =>
                                    setShowGradeAssignmentModal(false)
                                }
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mb-5 p-4 bg-[#252525] rounded-lg space-y-1">
                            <p className="text-xs text-gray-400">Zadaća</p>
                            <p className="text-base font-bold text-gray-200">
                                {gradeAssignmentForm.assignmentTitle}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Student
                            </p>
                            <p className="text-base font-bold text-gray-200">
                                {gradeAssignmentForm.studentName}
                            </p>
                        </div>

                        <form onSubmit={handleGradeAssignment}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Bodovi (0 -{' '}
                                        {gradeAssignmentForm.maxPoints}):
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={gradeAssignmentForm.maxPoints}
                                        value={gradeAssignmentForm.pointsEarned}
                                        onChange={(e) =>
                                            setGradeAssignmentForm({
                                                ...gradeAssignmentForm,
                                                pointsEarned: parseInt(
                                                    e.target.value || '0'
                                                ),
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-green-500 focus:outline-none"
                                        required
                                        disabled={isGradingAssignment}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-200 mb-2 font-semibold">
                                        Komentar (opcionalno):
                                    </label>
                                    <textarea
                                        value={gradeAssignmentForm.feedback}
                                        onChange={(e) =>
                                            setGradeAssignmentForm({
                                                ...gradeAssignmentForm,
                                                feedback: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-green-500 focus:outline-none resize-none"
                                        placeholder="Napomena za studenta..."
                                        disabled={isGradingAssignment}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowGradeAssignmentModal(false)
                                    }
                                    className="px-6 py-2 text-gray-400 hover:text-gray-200 font-medium transition-colors"
                                    disabled={isGradingAssignment}
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                                    disabled={isGradingAssignment}
                                >
                                    {isGradingAssignment ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Čuvam...
                                        </>
                                    ) : (
                                        'Potvrdi ocjenu'
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
