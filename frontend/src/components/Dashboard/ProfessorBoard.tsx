import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfessorBoard.css' // We'll create this next
import { useChat } from '../../Context'

interface Exam {
    id?: number
    subject: string
    examTime: string
    classroom: string
    maxPoints: number // Added this field
    professor?: {
        id: number
    }
}

interface Professor {
    id?: number
    titula: string
    kabinet: string
    subjects: string[] // Add subjects array
}

interface GradeSubmission {
    points: number
    registrationId: number
}

interface Student {
    id: number
    ime: string
    prezime: string
    indeks: string
    points?: number
    subject: string
}

interface SubjectStudents {
    [key: string]: Student[]
}

const ProfessorBoard: React.FC = () => {
    const { userType, studentMail } = useChat()
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch professor data
        const fetchProfessorData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/professors/email/${studentMail}`
                )
                if (response.ok) {
                    const data = await response.json()
                    setProfessorId(data.id)
                } else {
                    throw new Error('Failed to fetch professor data')
                }
            } catch (error) {
                console.error('Error:', error)
                navigate('/login')
            }
        }

        fetchProfessorData()
    }, [userType, studentMail, navigate])

    const [predmeti] = useState([
        { id: 1, naziv: 'Matematika' },
        { id: 2, naziv: 'Fizika' },
        { id: 3, naziv: 'Programiranje' },
    ])

    const [studenti] = useState([
        { id: 1, ime: 'Marko', prezime: 'Marković', predmetId: 1 },
        { id: 2, ime: 'Ivana', prezime: 'Ivanović', predmetId: 1 },
        { id: 3, ime: 'Ana', prezime: 'Anić', predmetId: 2 },
    ])

    const [selectedPredmet, setSelectedPredmet] = useState<number | null>(null)
    const [ocjena, setOcjena] = useState('')
    const [studentId, setStudentId] = useState<number | null>(null)

    const [professorId, setProfessorId] = useState<number | null>(null)

    const [exams, setExams] = useState<Exam[]>([])
    const [showExamModal, setShowExamModal] = useState(false)
    const [examForm, setExamForm] = useState<Exam>({
        subject: '',
        examTime: '',
        classroom: '',
        maxPoints: 100, // Default max points
    })

    const [showProfileModal, setShowProfileModal] = useState(false)
    const [professorProfile, setProfessorProfile] = useState<Professor>({
        titula: '',
        kabinet: '',
        subjects: [],
    })

    const [gradeSubmission, setGradeSubmission] = useState<GradeSubmission>({
        points: 0,
        registrationId: 0,
    })

    const [subjectStudents, setSubjectStudents] = useState<SubjectStudents>({})
    const [selectedSubject, setSelectedSubject] = useState<string>('')

    const [studentsInSubjects, setStudentsInSubjects] = useState<Student[]>([])
    const [selectedSubjectForGrading, setSelectedSubjectForGrading] =
        useState<string>('')
    const [showGradingModal, setShowGradingModal] = useState(false)

    const handleDodajOcjenu = (e: React.FormEvent) => {
        e.preventDefault()
        if (studentId && ocjena) {
            alert(`Dodana ocjena ${ocjena} za studenta ID: ${studentId}`)
            setOcjena('')
            setStudentId(null)
        } else {
            alert('Molimo odaberite studenta i unesite ocjenu.')
        }
    }

    //fetch professor's id
    const fetchProfessorId = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/professors/email/${studentMail}`
            )
            if (response.ok) {
                const data = await response.json()
                console.log(data.id)
                setProfessorId(data.id)
                return data.id
            }
        } catch (error) {
            console.error('Error fetching professor ID:', error)
        }
    }

    // Fetch professor's exams
    const fetchExams = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/exams/professor/${professorId}`
            )
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setExams(data)
            }
        } catch (error) {
            console.error('Error fetching exams:', error)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!professorId) return

        try {
            const response = await fetch(
                `http://localhost:8080/professors/${professorId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(professorProfile),
                }
            )

            if (response.ok) {
                alert('Profile updated successfully!')
                setShowProfileModal(false)
            } else {
                alert('Failed to update profile')
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Error updating profile')
        }
    }

    useEffect(() => {
        fetchProfessorId()
    }, [studentMail])

    useEffect(() => {
        if (professorId) {
            fetchExams()
        }
    }, [professorId])

    // Fetch students for a specific subject
    const fetchSubjectStudents = async (subject: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/subjects/${subject}/students`
            )
            if (response.ok) {
                const data = await response.json()
                setSubjectStudents((prev) => ({
                    ...prev,
                    [subject]: data,
                }))
            }
        } catch (error) {
            console.error('Error fetching subject students:', error)
        }
    }

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:8080/api/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...examForm,
                    professor: {
                        id: professorId,
                    },
                }),
            })

            if (response.ok) {
                alert('Exam created successfully!')
                setShowExamModal(false)
                setExamForm({
                    subject: '',
                    examTime: '',
                    classroom: '',
                    maxPoints: 100,
                })
                fetchExams() // Refresh the exams list
            } else {
                alert('Failed to create exam')
            }
        } catch (error) {
            console.error('Error creating exam:', error)
            alert('Error creating exam')
        }
    }

    const handleGradeSubmission = async (
        registrationId: number,
        points: number
    ) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/exams/${registrationId}/grade`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ points }),
                }
            )

            if (response.ok) {
                const result = await response.json()
                alert(`Grade updated: ${result.grade} (${result.description})`)
                fetchExams() // Refresh the exams list
            } else {
                alert('Failed to update grade')
            }
        } catch (error) {
            console.error('Error updating grade:', error)
            alert('Error updating grade')
        }
    }

    // Fetch professor profile including subjects
    const fetchProfessorProfile = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/professors/email/${studentMail}`
            )
            if (response.ok) {
                const data = await response.json()
                setProfessorProfile({
                    titula: data.titula,
                    kabinet: data.kabinet,
                    subjects: data.subjects || [],
                })
                setProfessorId(data.id)
            }
        } catch (error) {
            console.error('Error fetching professor profile:', error)
        }
    }

    // Fetch students for professor's subjects
    const fetchStudentsForSubject = async (subject: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/subjects/${subject}/students`
            )
            if (response.ok) {
                const data = await response.json()
                setStudentsInSubjects(data)
            }
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    // Handle giving points to student
    const handleGivePoints = async (
        studentId: number,
        points: number,
        subject: string
    ) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/students/${studentId}/points`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        points,
                        subject,
                        professorId,
                    }),
                }
            )

            if (response.ok) {
                alert('Points updated successfully!')
                fetchStudentsForSubject(selectedSubjectForGrading)
            } else {
                alert('Failed to update points')
            }
        } catch (error) {
            console.error('Error updating points:', error)
            alert('Error updating points')
        }
    }

    useEffect(() => {
        if (studentMail) {
            fetchProfessorProfile()
        }
    }, [studentMail])

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Profesor Panel</h1>
                <button
                    onClick={() => setShowProfileModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Update Profile
                </button>
            </div>

            {/* Professor Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Update Professor Profile
                        </h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Title (Titula)
                                </label>
                                <select
                                    value={professorProfile.titula}
                                    onChange={(e) =>
                                        setProfessorProfile({
                                            ...professorProfile,
                                            titula: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="">Select Title</option>
                                    <option value="Prof. dr">Prof. dr</option>
                                    <option value="Doc. dr">Doc. dr</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Mr">Mr</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Office (Kabinet)
                                </label>
                                <input
                                    type="text"
                                    value={professorProfile.kabinet}
                                    onChange={(e) =>
                                        setProfessorProfile({
                                            ...professorProfile,
                                            kabinet: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Subjects
                                </label>
                                <select
                                    multiple
                                    value={professorProfile.subjects}
                                    onChange={(e) => {
                                        const selected = Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value
                                        )
                                        setProfessorProfile({
                                            ...professorProfile,
                                            subjects: selected,
                                        })
                                    }}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    {predmeti.map((predmet) => (
                                        <option
                                            key={predmet.id}
                                            value={predmet.naziv}
                                        >
                                            {predmet.naziv}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Hold Ctrl/Cmd to select multiple subjects
                                </p>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Exams Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Exams</h2>
                    <button
                        onClick={() => setShowExamModal(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        Create New Exam
                    </button>
                </div>

                {/* Exams List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map((exam) => (
                        <div
                            key={exam.id}
                            className="bg-white p-4 rounded-lg shadow-md"
                        >
                            <h3 className="text-lg font-medium mb-2">
                                {exam.subject}
                            </h3>
                            <p className="text-gray-600">
                                Date: {new Date(exam.examTime).toLocaleString()}
                            </p>
                            <p className="text-gray-600">
                                Location: {exam.classroom}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Exam Modal */}
            {showExamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Create New Exam
                        </h2>
                        <form onSubmit={handleCreateExam}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Subject
                                </label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={examForm.subject}
                                    onChange={(e) => {
                                        setExamForm({
                                            ...examForm,
                                            subject: e.target.value,
                                        })
                                        setSelectedSubject(e.target.value)
                                        fetchSubjectStudents(e.target.value)
                                    }}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {predmeti.map((predmet) => (
                                        <option
                                            key={predmet.id}
                                            value={predmet.naziv}
                                        >
                                            {predmet.naziv}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Max Points
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full p-2 border rounded"
                                    value={examForm.maxPoints}
                                    onChange={(e) =>
                                        setExamForm({
                                            ...examForm,
                                            maxPoints: parseInt(e.target.value),
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Date and Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-2 border rounded"
                                    value={examForm.examTime}
                                    onChange={(e) =>
                                        setExamForm({
                                            ...examForm,
                                            examTime: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Classroom
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={examForm.classroom}
                                    onChange={(e) =>
                                        setExamForm({
                                            ...examForm,
                                            classroom: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* Show enrolled students for selected subject */}
                            {selectedSubject &&
                                subjectStudents[selectedSubject] && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Enrolled Students
                                        </label>
                                        <div className="max-h-40 overflow-y-auto border rounded p-2">
                                            {subjectStudents[
                                                selectedSubject
                                            ].map((student) => (
                                                <div
                                                    key={student.id}
                                                    className="py-1"
                                                >
                                                    {student.ime}{' '}
                                                    {student.prezime} (
                                                    {student.indeks})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowExamModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Create Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Prikaz predmeta */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Moji Predmeti</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predmeti.map((predmet) => (
                        <div
                            key={predmet.id}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedPredmet(predmet.id)}
                        >
                            <h3 className="text-lg font-medium">
                                {predmet.naziv}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prikaz studenata za odabrani predmet */}
            {selectedPredmet && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Studenti na predmetu
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studenti
                            .filter(
                                (student) =>
                                    student.predmetId === selectedPredmet
                            )
                            .map((student) => (
                                <div
                                    key={student.id}
                                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <h3 className="text-lg font-medium">
                                        {student.ime} {student.prezime}
                                    </h3>
                                    <button
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                        onClick={() => setStudentId(student.id)}
                                    >
                                        Dodaj Ocjenu
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Forma za dodavanje ocjene */}
            {studentId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Dodaj Ocjenu
                        </h2>
                        <form onSubmit={handleDodajOcjenu}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Ocjena
                                </label>
                                <input
                                    type="text"
                                    value={ocjena}
                                    onChange={(e) => setOcjena(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Unesi ocjenu"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                                    onClick={() => setStudentId(null)}
                                >
                                    Zatvori
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Spremi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Students Grading Section */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Student Grading</h2>

                <div className="mb-4">
                    <select
                        value={selectedSubjectForGrading}
                        onChange={(e) => {
                            setSelectedSubjectForGrading(e.target.value)
                            fetchStudentsForSubject(e.target.value)
                        }}
                        className="w-full md:w-64 px-3 py-2 border rounded-md"
                    >
                        <option value="">Select Subject</option>
                        {professorProfile.subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedSubjectForGrading && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Index
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Points
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {studentsInSubjects.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.ime} {student.prezime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.indeks}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.points || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setGradeSubmission({
                                                        points: 0,
                                                        registrationId:
                                                            student.id,
                                                    })
                                                    setShowGradingModal(true)
                                                }}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Give Points
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Grading Modal */}
            {showGradingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Give Points
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleGivePoints(
                                    gradeSubmission.registrationId,
                                    gradeSubmission.points,
                                    selectedSubjectForGrading
                                )
                                setShowGradingModal(false)
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Points (0-100)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={gradeSubmission.points}
                                    onChange={(e) =>
                                        setGradeSubmission({
                                            ...gradeSubmission,
                                            points: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowGradingModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Submit Points
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfessorBoard
