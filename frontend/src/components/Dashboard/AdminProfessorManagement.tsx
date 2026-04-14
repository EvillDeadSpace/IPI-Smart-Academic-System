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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    const filteredSubjects = allSubjects.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm)
    )
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <nav className="bg-blue-600 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/admin')}
                                className="p-2 hover:bg-white/15 rounded-lg transition-colors"
                                title="Nazad na Admin Panel"
                            >
                                <IconArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <IconSchool className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-syne font-bold text-white leading-tight">
                                    Upravljanje Profesorima
                                </h1>
                                <p className="text-xs text-blue-100">
                                    {studentName || 'System Administrator'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white mb-8"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute -right-8 -top-8 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-syne font-semibold tracking-widest uppercase text-blue-200 mb-2">
                                IPI Akademija · Profesori
                            </p>
                            <h1 className="text-2xl font-syne font-bold mb-1">
                                Upravljanje Profesorima
                            </h1>
                            <p className="text-blue-100 text-sm opacity-90">
                                Dodajte profesore i dodijelite im predmete
                            </p>
                        </div>
                        <motion.button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold text-sm shadow-md hover:bg-blue-50 transition-colors duration-200 flex-shrink-0"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <IconUserPlus className="w-4 h-4" />
                            Dodaj Profesora
                        </motion.button>
                    </div>
                </motion.div>

                {/* Professors Grid */}
                {professors.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {professors.map((professor, index) => (
                            <motion.div
                                key={professor.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                                }}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                            >
                                {/* Card top accent */}
                                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />

                                {/* Card Header */}
                                <div className="p-5 border-b border-slate-100 bg-blue-50/40">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                                            <IconSchool className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-syne font-bold text-slate-800 leading-tight">
                                                {professor.title}{' '}
                                                {professor.firstName}{' '}
                                                {professor.lastName}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                {professor.email}
                                            </p>
                                            {professor.office && (
                                                <div className="flex items-center gap-1 mt-1.5">
                                                    <IconBook className="w-3.5 h-3.5 text-blue-500" />
                                                    <p className="text-xs text-blue-600 font-medium">
                                                        Kabinet: {professor.office}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                                        Predmeti ({professor.subjects.length})
                                    </p>
                                    {professor.subjects.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {professor.subjects.map((subject) => (
                                                <span
                                                    key={subject.id}
                                                    className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100"
                                                >
                                                    {subject.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">
                                            Nema dodijeljenih predmeta
                                        </p>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(professor)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <IconEdit className="w-3.5 h-3.5" />
                                        Uredi
                                    </button>
                                    <button
                                        onClick={() => handleDelete(professor.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <IconTrash className="w-3.5 h-3.5" />
                                        Obriši
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                            <IconUserPlus className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-syne font-bold text-slate-600 mb-1">
                            Nema profesora
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Dodajte prvog profesora klikom na dugme iznad.
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                                            className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                                        className="ml-4 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg p-2 w-64 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-sm"
                                    />
                                </label>

                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-2">
                                        {filteredSubjects.map((subject) => (
                                            <label
                                                key={subject.id}
                                                className="flex items-center gap-2 p-3 hover:bg-white rounded-lg cursor-pointer border border-transparent hover:border-blue-200 transition-all"
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
                                                    className="form-checkbox text-blue-600 w-5 h-5 rounded border-gray-300 focus:ring-blue-500"
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
                                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-700 font-medium">
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
                                    className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
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
