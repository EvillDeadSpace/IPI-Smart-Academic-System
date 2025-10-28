// src/components/AdminPanel.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'
import {
    IconUserPlus,
    IconUsers,
    IconSchool,
    IconLogout,
    IconChartBar,
} from '@tabler/icons-react'

const AdminPanel: React.FC = () => {
    const navigate = useNavigate()
    const { logout, studentName } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        indexNumber: '',
        dateOfBirth: '',
        majorId: '1',
        password: '',
    })

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            interface StudentPayload {
                firstName: string
                lastName: string
                email: string
                dateOfBirth: string
                majorId: number
                password: string
                indexNumber?: string
            }

            const payload: StudentPayload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                dateOfBirth: formData.dateOfBirth,
                majorId: Number(formData.majorId),
                password: formData.password,
            }

            if (formData.indexNumber && formData.indexNumber.trim() !== '') {
                payload.indexNumber = formData.indexNumber.trim()
            }

            const response = await fetch(`${BACKEND_URL}/api/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const text = await response.text()
            let data: unknown
            try {
                data = JSON.parse(text)
            } catch {
                data = text
            }

            if (response.ok) {
                alert('Korisnik uspješno dodan!')
                closeModal()
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    indexNumber: '',
                    dateOfBirth: '',
                    majorId: '1',
                    password: '',
                })
            } else {
                console.error('Create failed', response.status, data)
                const errorMsg =
                    (data as { error?: string })?.error || JSON.stringify(data)
                alert(`Greška: ${errorMsg}`)
            }
        } catch (error) {
            console.error('Greška:', error)
            alert('Došlo je do greške pri slanju zahtjeva.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <IconSchool className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Admin Panel
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {studentName || 'System Administrator'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => logout(navigate)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <IconLogout className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Add Student */}
                    <div
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
                        onClick={openModal}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <IconUserPlus className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Dodaj Studenta
                            </h3>
                            <p className="text-sm text-gray-600">
                                Kreiraj novi studentski nalog u sistemu
                            </p>
                        </div>
                        <div className="bg-blue-50 px-6 py-3">
                            <p className="text-xs text-blue-700 font-medium">
                                Click to add →
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Manage Professors */}
                    <div
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
                        onClick={() => navigate('/admin/professors')}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <IconUsers className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Upravljanje Profesorima
                            </h3>
                            <p className="text-sm text-gray-600">
                                Dodaj, izmijeni ili obriši profesore
                            </p>
                        </div>
                        <div className="bg-green-50 px-6 py-3">
                            <p className="text-xs text-green-700 font-medium">
                                Click to manage →
                            </p>
                        </div>
                    </div>

                    {/* Card 3: View Statistics */}
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden opacity-60">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <IconChartBar className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Statistike
                            </h3>
                            <p className="text-sm text-gray-600">
                                Pregled sistema i izvještaji
                            </p>
                        </div>
                        <div className="bg-purple-50 px-6 py-3">
                            <p className="text-xs text-purple-700 font-medium">
                                Coming soon...
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Adding Student */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Dodaj Novog Korisnika
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Ime
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Unesi ime"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Prezime
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Unesi prezime"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Unesi email"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    IndexNumber (opcionalno)
                                </label>
                                <input
                                    type="text"
                                    name="indexNumber"
                                    value={formData.indexNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Unesi index number (ostavi prazno za automatski)"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Godina rodenja
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Unesi godinu rodenja"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                {/* majorId will be sent as number; default 1 */}
                                <input
                                    type="hidden"
                                    name="majorId"
                                    value={formData.majorId}
                                />
                                <label className="block text-sm font-medium mb-1">
                                    Godina studija
                                </label>
                                <div className="text-sm text-gray-600">
                                    Major ID: {formData.majorId}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Unesite password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Unesi password"
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                                    onClick={closeModal}
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

export default AdminPanel
