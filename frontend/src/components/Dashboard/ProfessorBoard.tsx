import { useNavigate } from 'react-router-dom'
import { useChat } from '../../Context'
import React, { useState, useEffect } from 'react'

interface Exam {
    id?: number
    subject: string
    examTime: string
    classroom: string
    professor?: {
        id: number
    }
}

interface Professor {
    id?: number
    titula: string
    kabinet: string
}

const ProfessorBoard: React.FC = () => {
    const { userType, studentMail } = useChat()
    const navigate = useNavigate()

    useEffect(() => {
        // Double-check authorization
        if (userType !== 'PROFESOR') {
            navigate('/login')
            return
        }

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
    })

    const [showProfileModal, setShowProfileModal] = useState(false)
    const [professorProfile, setProfessorProfile] = useState<Professor>({
        titula: '',
        kabinet: '',
    })

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
                        id: professorId, // Replace with actual professor ID
                    },
                }),
            })

            if (response.ok) {
                alert('Exam created successfully!')
                setShowExamModal(false)
                setExamForm({ subject: '', examTime: '', classroom: '' })
                fetchExams() // Refresh the exams list
            } else {
                alert('Failed to create exam')
            }
        } catch (error) {
            console.error('Error creating exam:', error)
            alert('Error creating exam')
        }
    }

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
                                    <option value="Dr">Dr</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Professor">Professor</option>
                                    <option value="Associate Professor">
                                        Associate Professor
                                    </option>
                                    <option value="Assistant Professor">
                                        Assistant Professor
                                    </option>
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
                                    placeholder="Enter office number"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                                    onClick={() => setShowProfileModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Save
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
                                <input
                                    type="text"
                                    value={examForm.subject}
                                    onChange={(e) =>
                                        setExamForm({
                                            ...examForm,
                                            subject: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Date and Time
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
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Classroom
                                </label>
                                <input
                                    type="text"
                                    value={examForm.classroom}
                                    onChange={(e) =>
                                        setExamForm({
                                            ...examForm,
                                            classroom: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                                    onClick={() => setShowExamModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
        </div>
    )
}

export default ProfessorBoard
