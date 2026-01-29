import {
    IconArrowLeft,
    IconBook,
    IconCheck,
    IconEdit,
    IconSchool,
    IconTrash,
    IconUserPlus,
    IconX,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'
import { toastError, toastSuccess } from '../../lib/toast'

import useFetchProfessorsData from '../../hooks/professorHooks/useFetchProfessorsData'
import {
    Professor,
    ProfessorFormData,
} from '../../types/AdminTypes/AdminProfessor'

const AdminProfessorManagement: React.FC = () => {
    const navigate = useNavigate()
    const { studentName } = useAuth()
    const { allSubjects, isLoading, professors, refetch } =
        useFetchProfessorsData()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedProfessorId, setSelectedProfessorId] = useState<
        number | null
    >(null)

    const [searchTerm, setSearchTerm] = useState('')

    const [formData, setFormData] = useState<ProfessorFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        title: 'Prof',
        office: '',
        subjectIds: [],
    })

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
                    toastSuccess('Profesor uspješno ažuriran!')
                    setIsModalOpen(false)
                    await refetch()
                } else {
                    toastError('Greška pri ažuriranju profesora')
                }
            } else {
                // Create new professor
                const response = await fetch(`${BACKEND_URL}/api/professors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                })

                if (response.ok) {
                    toastSuccess('Profesor uspješno kreiran!')
                    setIsModalOpen(false)
                    await refetch()
                } else {
                    const error = await response.json()
                    toastError(`Greška: ${error.error || 'Unknown error'}`)
                }
            }
        } catch {
            toastError('Greška pri čuvanju profesora')
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
                toastSuccess('Profesor obrisan!')
                await refetch()
            } else {
                toastError('Greška pri brisanju profesora')
            }
        } catch {
            toastError('Greška pri brisanju profesora')
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        )
    }

    const filteredSubjects = allSubjects.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm)
    )
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Nazad na Admin Panel"
                            >
                                <IconArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <IconSchool className="w-8 h-8 text-green-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Upravljanje Profesorima
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Dodajte profesore i dodijelite im predmete
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Admin:{' '}
                                <span className="font-semibold">
                                    {studentName || 'Administrator'}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Professor Button Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={openCreateModal}
                        className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <IconUserPlus className="w-6 h-6" />
                            <span className="text-lg font-semibold">
                                Dodaj Novog Profesora
                            </span>
                        </div>
                    </button>
                </motion.div>

                {/* Professors Grid */}
                {professors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {professors.map((professor, index) => (
                            <motion.div
                                key={professor.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden"
                            >
                                {/* Card Header with Gradient */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border-b border-green-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {professor.title}{' '}
                                                {professor.firstName}{' '}
                                                {professor.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {professor.email}
                                            </p>
                                            {professor.office && (
                                                <div className="flex items-center gap-1 mt-2">
                                                    <IconBook className="w-4 h-4 text-green-600" />
                                                    <p className="text-sm text-green-700 font-medium">
                                                        Kabinet:{' '}
                                                        {professor.office}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-3">
                                            Predmeti (
                                            {professor.subjects.length}):
                                        </p>
                                        {professor.subjects.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {professor.subjects.map(
                                                    (subject) => (
                                                        <span
                                                            key={subject.id}
                                                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                                                        >
                                                            {subject.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">
                                                Nema dodijeljenih predmeta
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() =>
                                                openEditModal(professor)
                                            }
                                            className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-lg transition-all font-medium border border-orange-200"
                                        >
                                            <IconEdit className="w-4 h-4" />
                                            Uredi
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(professor.id)
                                            }
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-all font-medium border border-red-200"
                                        >
                                            <IconTrash className="w-4 h-4" />
                                            Obriši
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                        <IconUserPlus className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">
                            Nema profesora
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Dodajte prvog profesora klikom na zeleno dugme
                            iznad.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-8 w-full max-w-2xl border border-gray-200 max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isEditMode
                                        ? 'Ažuriraj Profesora'
                                        : 'Dodaj Novog Profesora'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isEditMode
                                        ? 'Izmjenite informacije o profesoru'
                                        : 'Popunite informacije o novom profesoru'}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                            >
                                <IconX className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                                        required
                                        disabled={isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                                        required
                                        disabled={isEditMode}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                                        required
                                        disabled={isEditMode}
                                    />
                                </div>

                                {!isEditMode && (
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                            className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
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
                                    <label className="block text-gray-700 mb-2 font-medium text-sm">
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                                        placeholder="npr. A301"
                                        disabled={isEditMode}
                                    />
                                </div>
                            </div>

                            {/* Subject Selection */}
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-3 font-medium text-sm">
                                    Dodijeli Predmete *{' '}
                                    <input
                                        placeholder="Pretrazi predmet..."
                                        type="text"
                                        id="search"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(
                                                e.target.value.toLowerCase()
                                            )
                                        }
                                        className="ml-4 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg p-2 w-64 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all text-sm"
                                    />
                                </label>

                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-2">
                                        {filteredSubjects.map((subject) => (
                                            <label
                                                key={subject.id}
                                                className="flex items-center gap-2 p-3 hover:bg-white rounded-lg cursor-pointer border border-transparent hover:border-green-200 transition-all"
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
                                                    className="form-checkbox text-green-600 w-5 h-5 rounded border-gray-300 focus:ring-green-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-gray-900 text-sm font-medium">
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
                                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-sm text-green-700 font-medium">
                                        Odabrano predmeta:{' '}
                                        <span className="font-bold">
                                            {formData.subjectIds.length}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 font-medium transition-all rounded-lg border border-gray-300"
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
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
