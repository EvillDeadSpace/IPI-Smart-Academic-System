import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context'
import {
    IconUsers,
    IconClipboardList,
    IconUserCircle,
    IconCalendarEvent,
} from '@tabler/icons-react'

interface Exam {
    id?: number
    subject: string
    examTime: string
    classroom: string
    maxPoints: number
    professor?: {
        id: number
    }
}

interface Professor {
    id?: number
    titula: string
    kabinet: string
    subjects: string[]
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

interface SetupModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (subjects: string[]) => Promise<void>
    availableSubjects: string[]
}

const ProfessorBoard: React.FC = () => {
    const { userType, studentMail } = useAuth()
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [showExamModal, setShowExamModal] = useState(false)
    const [showGradingModal, setShowGradingModal] = useState(false)
    const [examForm, setExamForm] = useState<Exam>({
        subject: '',
        examTime: '',
        classroom: '',
        maxPoints: 100,
    })
    const [professorProfile, setProfessorProfile] = useState<Professor>({
        titula: '',
        kabinet: '',
        subjects: [],
    })
    const [exams, setExams] = useState<Exam[]>([])
    const [selectedSubjectForGrading, setSelectedSubjectForGrading] =
        useState('')
    const [subjectStudents, setSubjectStudents] = useState<SubjectStudents>({})
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [gradeSubmission, setGradeSubmission] = useState<GradeSubmission>({
        points: 0,
        registrationId: 0,
    })
    const [professorId, setProfessorId] = useState<number>(0)
    const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(true)
    const [showSetupModal, setShowSetupModal] = useState(false)
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
    const [examCount, setExamCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (studentMail && userType === 'PROFESOR') {
            checkFirstTimeLogin()
            fetchExams()
        }
    }, [studentMail])

    const checkFirstTimeLogin = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/professors/email/${studentMail}`
            )
            if (!response.ok) {
                throw new Error('Failed to fetch professor data')
            }

            const data = await response.json()

            // Set professor ID first
            setProfessorId(data.id)

            // If professor has no subjects, consider it first time setup
            if (!data.subjects || data.subjects.length === 0) {
                setIsFirstTimeSetup(true)
                setShowSetupModal(true)
            } else {
                setIsFirstTimeSetup(false)
                setProfessorProfile({
                    titula: data.titula,
                    kabinet: data.kabinet,
                    subjects: data.subjects || [],
                })
            }

            await fetchAvailableSubjects()
        } catch (error) {
            console.error('Error checking first time login:', error)
        }
    }

    const fetchExams = async () => {
        if (!professorId) {
            console.log('No professor ID available yet')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(
                `http://localhost:8080/api/exams/professor/${professorId}`
            )
            if (response.ok) {
                const data = await response.json()
                setExams(data)
            } else {
                const errorData = await response.json()
                console.error('Error fetching exams:', errorData)
            }
        } catch (error) {
            console.error('Error fetching exams:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Add a useEffect to fetch exams whenever professorId changes
    useEffect(() => {
        if (professorId) {
            fetchExams()
        }
    }, [professorId])

    const fetchAvailableSubjects = async () => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/subjects/all'
            ) // Updated endpoint
            if (response.ok) {
                const data = await response.json()
                setAvailableSubjects(data.map((subject: any) => subject.name))
            }
        } catch (error) {
            console.error('Error fetching available subjects:', error)
        }
    }

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const examData = {
                ...examForm,
                professor: {
                    id: professorId,
                },
            }

            const response = await fetch('http://localhost:8080/api/exams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(examData),
            })

            if (response.ok) {
                alert('Ispit uspješno kreiran!')
                setShowExamModal(false)
                setExamForm({
                    subject: '',
                    examTime: '',
                    classroom: '',
                    maxPoints: 100,
                })
                // Fetch exams to update the count
                await fetchExams()
            } else {
                alert('Greška pri kreiranju ispita')
            }
        } catch (error) {
            console.error('Error creating exam:', error)
            alert('Greška pri kreiranju ispita')
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

    const handleProfileUpdate = async () => {
        try {
            // Add your profile update logic here
            setShowProfileModal(false)
        } catch (error) {
            console.error('Error updating profile:', error)
        }
    }

    //first time when login this function was calling
    const handleSetupSubmit = async (selectedSubjects: string[]) => {
        if (!professorId) {
            console.error('Professor ID not set')
            return
        }
        try {
            const response = await fetch(
                `http://localhost:8080/professors/setup/${professorId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ subjects: selectedSubjects }),
                }
            )

            if (response.ok) {
                // First update the state
                setProfessorProfile((prev) => ({
                    ...prev,
                    subjects: selectedSubjects,
                }))

                // Then close the modal
                setIsFirstTimeSetup(false)
                setShowSetupModal(false)

                // Optional: Show success message
                alert('Subjects successfully updated!')

                // Refresh the professor data
                await checkFirstTimeLogin()
            } else {
                alert('Failed to update subjects. Please try again.')
            }
        } catch (error) {
            console.error('Error submitting setup:', error)
            alert('Error updating subjects. Please try again.')
        }
    }

    const SetupModal: React.FC<SetupModalProps> = ({
        isOpen,
        onClose,
        onSubmit,
        availableSubjects,
    }) => {
        const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

        // Reset selected subjects when modal opens
        useEffect(() => {
            if (isOpen) {
                setSelectedSubjects([])
            }
        }, [isOpen])

        if (!isOpen) return null

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-200">
                            Dobrodošli! Postavite svoj profil
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Molimo odaberite predmete koje predajete:
                    </p>
                    <div className="space-y-2 mb-6">
                        {availableSubjects.map((subject) => (
                            <label
                                key={subject}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(subject)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedSubjects([
                                                ...selectedSubjects,
                                                subject,
                                            ])
                                        } else {
                                            setSelectedSubjects(
                                                selectedSubjects.filter(
                                                    (s) => s !== subject
                                                )
                                            )
                                        }
                                    }}
                                    className="form-checkbox text-blue-500"
                                />
                                <span className="text-gray-300">{subject}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="w-1/2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit(selectedSubjects)}
                            className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            disabled={selectedSubjects.length === 0}
                        >
                            Potvrdi
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-300 mt-4">Loading exams...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-gray-300">
            <SetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                onSubmit={handleSetupSubmit}
                availableSubjects={availableSubjects}
            />
            {/* Top Welcome Section */}
            <div className="p-6 pb-6 flex flex-col gap-6">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-gray-200">
                    <h1 className="text-3xl font-bold mb-2">
                        Dobrodošli, Professor {studentMail}
                    </h1>
                    <p className="text-gray-300">
                        Upravljajte ispitima i ocjenama sa jednog mjesta
                    </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-900/20 to-blue-900/10 p-6 rounded-xl">
                        <div className="flex items-center gap-4">
                            <IconClipboardList className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Total Exams
                                </h3>
                                <p className="text-2xl font-bold text-blue-500">
                                    {exams.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] p-6 rounded-xl hover:bg-[#252525] transition-all cursor-pointer border border-neutral-800">
                        <div className="flex items-center gap-4">
                            <IconUsers className="h-8 w-8 text-green-400" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-200">
                                    Studenti
                                </h3>
                                <p className="text-2xl font-bold text-green-400">
                                    {
                                        Object.values(subjectStudents).flat()
                                            .length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1a] p-6 rounded-xl hover:bg-[#252525] transition-all cursor-pointer border border-neutral-800">
                        <div className="flex items-center gap-4">
                            <IconClipboardList className="h-8 w-8 text-purple-400" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-200">
                                    Predmeti
                                </h3>
                                <p className="text-2xl font-bold text-purple-400">
                                    {professorProfile.subjects.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-[#1a1a1a] p-6 rounded-xl hover:bg-[#252525] transition-all cursor-pointer border border-neutral-800"
                        onClick={() => setShowProfileModal(true)}
                    >
                        <div className="flex items-center gap-4">
                            <IconUserCircle className="h-8 w-8 text-orange-400" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-200">
                                    Profil
                                </h3>
                                <p className="text-sm text-orange-400">
                                    Ažuriraj podatke
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {/* Create Exam Card */}
                    <div
                        className="bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#252525] transition-all cursor-pointer border border-neutral-800"
                        onClick={() => setShowExamModal(true)}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                            <img
                                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000"
                                alt="Create Exam"
                                className="w-full h-48 object-cover rounded-lg mb-4 opacity-60"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-200">
                            Kreiraj Ispit
                        </h3>
                        <p className="text-gray-400">
                            Dodaj novi ispit i upravljaj prijavama studenata
                        </p>
                    </div>

                    {/* Grade Students Card */}
                    <div
                        className="bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#252525] transition-all cursor-pointer border border-neutral-800"
                        onClick={() =>
                            setSelectedSubjectForGrading(
                                professorProfile.subjects[0]
                            )
                        }
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                            <img
                                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=1000"
                                alt="Grade Students"
                                className="w-full h-48 object-cover rounded-lg mb-4 opacity-60"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-200">
                            Ocjenjivanje
                        </h3>
                        <p className="text-gray-400">
                            Pregledaj i ocijeni rezultate studenata
                        </p>
                    </div>

                    {/* View Reports Card */}
                    <div className="bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#252525] transition-all cursor-pointer border border-neutral-800">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
                                alt="View Reports"
                                className="w-full h-48 object-cover rounded-lg mb-4 opacity-60"
                            />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-200">
                            Izvještaji
                        </h3>
                        <p className="text-gray-400">
                            Pregled statistike i generisanje izvještaja
                        </p>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-200 mb-6">
                        Raspored Ispita
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#252525] transition-all border border-neutral-800"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-200">
                                                {exam.subject}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <IconCalendarEvent className="h-4 w-4 text-blue-400" />
                                                <span className="text-gray-400">
                                                    {exam.examTime}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-6">
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    Učionica
                                                </p>
                                                <p className="text-gray-200 font-medium">
                                                    {exam.classroom}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    Maksimalni Bodovi
                                                </p>
                                                <p className="text-gray-200 font-medium">
                                                    {exam.maxPoints} bodova
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                                            Aktivan
                                        </span>
                                        <button className="bg-[#252525] hover:bg-[#303030] text-gray-200 px-4 py-2 rounded-lg transition-all border border-neutral-700">
                                            Detalji
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Exam Creation Modal */}
            {showExamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">
                            Kreiraj Novi Ispit
                        </h2>
                        <form onSubmit={handleCreateExam}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-200 mb-2">
                                        Predmet:
                                    </label>
                                    <select
                                        value={examForm.subject}
                                        onChange={(e) =>
                                            setExamForm({
                                                ...examForm,
                                                subject: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-2 w-full"
                                        required
                                    >
                                        <option value="">
                                            Odaberi predmet
                                        </option>
                                        {professorProfile.subjects.map(
                                            (subject) => (
                                                <option
                                                    key={subject}
                                                    value={subject}
                                                >
                                                    {subject}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-200 mb-2">
                                        Vrijeme ispita:
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
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-2 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-200 mb-2">
                                        Učionica:
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
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-2 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-200 mb-2">
                                        Maksimalni bodovi:
                                    </label>
                                    <input
                                        type="number"
                                        value={examForm.maxPoints}
                                        onChange={(e) =>
                                            setExamForm({
                                                ...examForm,
                                                maxPoints: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-2 w-full"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowExamModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-gray-200"
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Kreiraj Ispit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grading Modal */}
            {showGradingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">
                            Dodijeli Bodove
                        </h2>
                        <div className="mb-4">
                            <p className="text-gray-200">
                                Student: {selectedStudent?.ime}{' '}
                                {selectedStudent?.prezime}
                            </p>
                            <p className="text-gray-400">
                                Indeks: {selectedStudent?.indeks}
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                                Bodovi:
                            </label>
                            <input
                                type="number"
                                value={gradeSubmission.points}
                                onChange={(e) =>
                                    setGradeSubmission({
                                        ...gradeSubmission,
                                        points: parseInt(e.target.value),
                                    })
                                }
                                className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-2 w-full"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowGradingModal(false)}
                                className="px-4 py-2 text-gray-400 hover:text-gray-200"
                            >
                                Odustani
                            </button>
                            <button
                                onClick={handleGradeSubmission}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Potvrdi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md border border-neutral-800">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200">
                            Ažuriraj Profil
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleProfileUpdate()
                            }}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-200 mb-2">
                                        Titula:
                                    </label>
                                    <input
                                        type="text"
                                        value={professorProfile.titula}
                                        onChange={(e) =>
                                            setProfessorProfile({
                                                ...professorProfile,
                                                titula: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-200 mb-2">
                                        Kabinet:
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
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-2 w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-gray-200"
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Sačuvaj
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
