// src/components/AdminPanel.tsx
import React, { useState } from 'react'
import { BACKEND_URL } from '../../constants/storage'

const AdminPanel: React.FC = () => {
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
            const payload: any = {
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
            let data: any
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
                alert(`Greška: ${data?.error || JSON.stringify(data)}`)
            }
        } catch (error) {
            console.error('Greška:', error)
            alert('Došlo je do greške pri slanju zahtjeva.')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Kartica za dodavanje korisnika */}
                <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold mb-4">
                        Dodaj Korisnika
                    </h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                        onClick={openModal}
                    >
                        Dodaj Korisnika
                    </button>
                </div>
            </div>

            {/* Modal */}
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
