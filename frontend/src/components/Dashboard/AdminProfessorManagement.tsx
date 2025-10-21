import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    IconUserPlus,
    IconTrash,
    IconEdit,
    IconX,
    IconCheck,
} from '@tabler/icons-react'
import { BACKEND_URL } from '../../constants/storage'

interface Subject {
    id: number
    name: string
    code: string
    ects: number
}

interface Professor {
    id: number
    firstName: string
    lastName: string
    email: string
    title: string
    office: string | null
    subjects: Subject[]
}

interface ProfessorFormData {
    firstName: string
    lastName: string
    email: string
    password: string
    title: string
    office: string
    subjectIds: number[]
}

const AdminProfessorManagement: React.FC = () => {
    const [professors, setProfessors] = useState<Professor[]>([])
    const [allSubjects, setAllSubjects] = useState<Subject[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedProfessorId, setSelectedProfessorId] = useState<
        number | null
    >(null)
    const [isLoading, setIsLoading] = useState(true)

    const [formData, setFormData] = useState<ProfessorFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        title: 'Prof',
        office: '',
        subjectIds: [],
    })

    useEffect(() => {
        fetchProfessors()
        fetchSubjects()
    }, [])

    const fetchProfessors = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${BACKEND_URL}/api/professors`)
            if (response.ok) {
                const data = await response.json()
                setProfessors(data)
            }
        } catch (error) {
            console.error('Error fetching professors:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSubjects = async () => {
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
        } catch (error) {
            console.error('Error fetching subjects:', error)
        }
    }

    const openCreateModal = () => {
        setIsEditMode(false)
        setSelectedProfessorId(null)
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            title: 'Prof',
            office: '',
            subjectIds: [],
        })
        setIsModalOpen(true)
    }

    const openEditModal = (professor: Professor) => {
        setIsEditMode(true)
        setSelectedProfessorId(professor.id)
        setFormData({
            firstName: professor.firstName,
            lastName: professor.lastName,
            email: professor.email,
            password: '', // Don't show password
            title: professor.title,
            office: professor.office || '',
            subjectIds: professor.subjects.map((s) => s.id),
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (isEditMode && selectedProfessorId) {
                // Update professor's subjects
                const response = await fetch(
                    `${BACKEND_URL}/api/professors/${selectedProfessorId}/subjects`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            subjectIds: formData.subjectIds,
                        }),
                    }
                )

                if (response.ok) {
                    alert('Profesor uspješno ažuriran!')
                    setIsModalOpen(false)
                    await fetchProfessors()
                } else {
                    alert('Greška pri ažuriranju profesora')
                }
            } else {
                // Create new professor
                const response = await fetch(`${BACKEND_URL}/api/professors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (response.ok) {
                    alert('Profesor uspješno kreiran!')
                    setIsModalOpen(false)
                    await fetchProfessors()
                } else {
                    const error = await response.json()
                    alert(`Greška: ${error.error || 'Unknown error'}`)
                }
            }
        } catch (error) {
            console.error('Error saving professor:', error)
            alert('Greška pri čuvanju profesora')
        }
    }

    const handleDelete = async (id: number) => {
        if (
            !confirm(
                'Da li ste sigurni da želite obrisati ovog profesora? Ova akcija je nepovratna.'
            )
        ) {
            return
        }

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/professors/${id}`,
                {
                    method: 'DELETE',
                }
            )

            if (response.ok) {
                alert('Profesor obrisan!')
                await fetchProfessors()
            } else {
                alert('Greška pri brisanju profesora')
            }
        } catch (error) {
            console.error('Error deleting professor:', error)
            alert('Greška pri brisanju profesora')
        }
    }

    const toggleSubject = (subjectId: number) => {
        setFormData((prev) => ({
            ...prev,
            subjectIds: prev.subjectIds.includes(subjectId)
                ? prev.subjectIds.filter((id) => id !== subjectId)
                : [...prev.subjectIds, subjectId],
        }))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-200">
                        Upravljanje Profesorima
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Dodajte profesore i dodijelite im predmete
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold shadow-lg ring-1 ring-blue-400/20 transition-transform transform hover:-translate-y-0.5"
                    aria-label="Dodaj profesora"
                    title="Dodaj profesora"
                >
                    <IconUserPlus className="w-5 h-5" />
                    Dodaj Profesora
                </button>
            </div>

            {/* Professors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professors.map((professor, index) => (
                    <motion.div
                        key={professor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-200">
                                    {professor.title} {professor.firstName}{' '}
                                    {professor.lastName}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {professor.email}
                                </p>
                                {professor.office && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Kabinet: {professor.office}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(professor)}
                                    className="p-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all"
                                >
                                    <IconEdit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(professor.id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                >
                                    <IconTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-neutral-700 pt-4">
                            <p className="text-sm font-semibold text-gray-300 mb-2">
                                Predmeti ({professor.subjects.length}):
                            </p>
                            {professor.subjects.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {professor.subjects.map((subject) => (
                                        <span
                                            key={subject.id}
                                            className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {subject.name}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">
                                    Nema dodijeljenih predmeta
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {professors.length === 0 && (
                <div className="text-center py-12 bg-[#1a1a1a] rounded-xl border border-neutral-800">
                    <IconUserPlus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                        Nema profesora
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Dodajte prvog profesora klikom na dugme iznad.
                    </p>
                </div>
            )}

            {/* Floating Add Button */}
            <button
                onClick={openCreateModal}
                aria-label="Dodaj profesora"
                title="Dodaj profesora"
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transform hover:scale-105 transition-all z-50"
            >
                <IconUserPlus className="w-6 h-6" />
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-2xl border border-neutral-800 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-200">
                                {isEditMode
                                    ? 'Ažuriraj Profesora'
                                    : 'Dodaj Novog Profesora'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-200 mb-2 font-medium">
                                        Ime *
                                    </label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                        disabled={isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-medium">
                                        Prezime *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                lastName: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                        disabled={isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-medium">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        required
                                        disabled={isEditMode}
                                    />
                                </div>

                                {!isEditMode && (
                                    <div>
                                        <label className="block text-gray-200 mb-2 font-medium">
                                            Lozinka *
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-200 mb-2 font-medium">
                                        Titula
                                    </label>
                                    <select
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        disabled={isEditMode}
                                    >
                                        <option value="Prof">Prof</option>
                                        <option value="Dr">Dr</option>
                                        <option value="Docent">Docent</option>
                                        <option value="Asistent">
                                            Asistent
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-200 mb-2 font-medium">
                                        Kabinet
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.office}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                office: e.target.value,
                                            })
                                        }
                                        className="bg-[#252525] text-gray-200 border border-neutral-700 rounded-lg p-3 w-full focus:border-blue-500 focus:outline-none"
                                        placeholder="npr. A301"
                                        disabled={isEditMode}
                                    />
                                </div>
                            </div>

                            {/* Subject Selection */}
                            <div className="mb-6">
                                <label className="block text-gray-200 mb-3 font-medium">
                                    Dodijeli Predmete *
                                </label>
                                <div className="bg-[#252525] border border-neutral-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-2">
                                        {allSubjects.map((subject) => (
                                            <label
                                                key={subject.id}
                                                className="flex items-center gap-2 p-2 hover:bg-[#1a1a1a] rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.subjectIds.includes(
                                                        subject.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSubject(
                                                            subject.id
                                                        )
                                                    }
                                                    className="form-checkbox text-blue-500 w-5 h-5"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-gray-200 text-sm font-medium">
                                                        {subject.name}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {subject.code} •{' '}
                                                        {subject.ects} ECTS
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    Odabrano predmeta:{' '}
                                    {formData.subjectIds.length}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 text-gray-400 hover:text-gray-200 font-medium transition-colors"
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
                                >
                                    <IconCheck className="w-5 h-5" />
                                    {isEditMode ? 'Ažuriraj' : 'Kreiraj'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default AdminProfessorManagement
