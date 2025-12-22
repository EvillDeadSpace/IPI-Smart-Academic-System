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
    IconPaperBag,
    IconNews,
} from '@tabler/icons-react'
import { toastError, toastSuccess } from '../../lib/toast'

interface DocumentRequest {
    id: number
    studentName: string
    email: string
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    student?: {
        firstName: string
        lastName: string
        email: string
    }
}

interface BackendNews {
    id: number
    tagName: string
    content: string
    linksParent?: string
    titles: string
    likes: number
}

interface BackendDocumentRequest {
    id: number
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    student: {
        firstName: string
        lastName: string
        email: string
    }
}

const AdminPanel: React.FC = () => {
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const { logout, studentName, studentMail } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false)
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
    const [requests, setRequests] = useState<DocumentRequest[]>([])
    const [loadingRequests, setLoadingRequests] = useState(false)
    const [news, setNews] = useState<BackendNews[]>([])
    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean
        newsId: number | null
        newsTitle: string
    }>({ isOpen: false, newsId: null, newsTitle: '' })
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        indexNumber: '',
        dateOfBirth: '',
        majorId: '1',
        password: '',
    })
    const [newsFormData, setNewsFormData] = useState({
        tagName: '',
        title: '',
        content: '',
        likes: 0,
        linksParent: '',
        calendarNews: false,
        eventDate: '',
    })

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)
    const openRequestsModal = () => {
        setIsRequestsModalOpen(true)
        fetchDocumentRequests()
    }
    const closeRequestsModal = () => setIsRequestsModalOpen(false)
    const openNewsModal = () => setIsNewsModalOpen(true)
    const closeNewsModal = () => setIsNewsModalOpen(false)

    // News modal
    const openRequestsNewsModal = () => {
        openNewsModal()
        fetchNewsRequests()
    }

    const fetchNewsRequests = async () => {
        try {
            setLoadingRequests(true)
            const response = await fetch(`${BACKEND_URL}/api/news`)

            if (!response.ok) {
                throw new Error(`Failed to fetch news: ${response.status}`)
            }

            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server did not return JSON')
            }

            const data: BackendNews[] = await response.json()
            const transformedRequests = data.map((req) => ({
                id: req.id,
                tagName: req.tagName,
                content: req.content,
                linksParent: req.linksParent,
                titles: req.titles,
                likes: req.likes,
            }))
            setNews(transformedRequests)
        } catch (error) {
            console.error('Error fetching news requests:', error)
            toastError('Greška pri učitavanju vijesti')
        } finally {
            setLoadingRequests(false)
        }
    }

    const fetchDocumentRequests = async () => {
        try {
            setLoadingRequests(true)
            const response = await fetch(`${BACKEND_URL}/api/document-requests`)
            if (response.ok) {
                const data: BackendDocumentRequest[] = await response.json()
                // Transform backend data to match interface
                const transformedRequests = data.map((req) => ({
                    id: req.id,
                    studentName: `${req.student.firstName} ${req.student.lastName}`,
                    email: req.student.email,
                    documentType: req.documentType,
                    requestDate: req.requestDate,
                    status: req.status,
                }))
                setRequests(transformedRequests)
            }
        } finally {
            setLoadingRequests(false)
        }
    }

    const handleApproveRequest = async (id: number) => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/document-requests/${id}/approve`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adminEmail: studentMail }),
                }
            )

            if (response.ok) {
                // Update local state
                setRequests((prev) =>
                    prev.map((req) =>
                        req.id === id ? { ...req, status: 'APPROVED' } : req
                    )
                )
                toastSuccess('Zahtjev odobren! PDF će biti dostupan studentu.')
            } else {
                const error = await response.json()
                toastError(
                    `Greška: ${error.error || 'Nije moguće odobriti zahtjev'}`
                )
            }
        } catch {
            toastError('Došlo je do greške')
        }
    }

    const handleRejectRequest = async (id: number) => {
        const reason = prompt('Razlog odbijanja (opcionalno):')
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/document-requests/${id}/reject`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adminEmail: studentMail, reason }),
                }
            )

            if (response.ok) {
                setRequests((prev) =>
                    prev.map((req) =>
                        req.id === id ? { ...req, status: 'REJECTED' } : req
                    )
                )
                toastError('Zahtjev odbijen')
            } else {
                const error = await response.json()
                toastError(
                    `Greška: ${error.error || 'Nije moguće odbiti zahtjev'}`
                )
            }
        } catch {
            toastError('Došlo je do greške')
        }
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    // News form handlers
    const handleNewsInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        setNewsFormData({
            ...newsFormData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleNewsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const payload = {
                tagName: newsFormData.tagName,
                titles: newsFormData.title,
                content: newsFormData.content,
                likes: newsFormData.likes,
                linksParent: newsFormData.linksParent || undefined,
                calendarNews: newsFormData.calendarNews,
                eventDate: newsFormData.eventDate || undefined,
            }

            const response = await fetch(`${BACKEND_URL}/api/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                // Check if response is JSON
                const contentType = response.headers.get('content-type')
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Failed to submit news.')
                } else {
                    throw new Error(
                        `Server returned ${response.status}: Backend endpoint may not be available`
                    )
                }
            }

            toastSuccess('Vjesti su uspješno dodane!')
            setNewsFormData({
                tagName: '',
                title: '',
                content: '',
                likes: 0,
                linksParent: '',
                calendarNews: false,
                eventDate: '',
            })
            closeNewsModal()
            fetchNewsRequests() // Refresh the list
        } catch (error) {
            console.error('Error submitting news:', error)
            toastError(
                error instanceof Error
                    ? error.message
                    : 'Došlo je do greške pri slanju vijesti.'
            )
        }
    }

    const handleDeleteNews = async (id: number) => {
        const newsItem = news.find((item) => item.id === id)
        if (!newsItem) return

        // Open custom delete modal
        setDeleteModalState({
            isOpen: true,
            newsId: id,
            newsTitle: newsItem.titles,
        })
    }

    const confirmDeleteNews = async () => {
        const { newsId } = deleteModalState
        if (!newsId) return
        try {
            const response = await fetch(`${BACKEND_URL}/api/news`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newsId: newsId }),
            })

            if (!response.ok) {
                throw new Error('Failed to delete news')
            }

            toastSuccess('Vijest uspješno obrisana!')
            setNews((prev) => prev.filter((item) => item.id !== newsId))
            setDeleteModalState({ isOpen: false, newsId: null, newsTitle: '' })
        } catch (error) {
            console.error('Error deleting news:', error)
            toastError('Greška pri brisanju vijesti')
        }
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

            let data: unknown
            try {
                data = await response.json()
            } catch {
                data = await response.text()
            }

            if (response.ok) {
                toastSuccess('Korisnik uspješno dodan!')
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
                const errorMsg =
                    (data as { error?: string })?.error || JSON.stringify(data)
                toastError(`Greška: ${errorMsg}`)
            }
        } catch {
            toastError('Došlo je do greške pri slanju zahtjeva.')
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
                    <div
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
                        onClick={openRequestsModal}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <IconPaperBag className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Upravljanje zahtjevima
                            </h3>
                            <p className="text-sm text-gray-600">
                                Pregeld svih zahtjeva za obradu dokumenata
                            </p>
                        </div>
                        <div className="bg-purple-50 px-6 py-3">
                            <p className="text-xs text-purple-700 font-medium">
                                Click to manage →
                            </p>
                        </div>
                    </div>

                    {/* Card 4 : News update*/}
                    <div
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
                        onClick={openRequestsNewsModal}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <IconNews className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Upravljanje novostima
                            </h3>
                            <p className="text-sm text-gray-600">
                                Pregeld svih zahtjeva za obradu dokumenata
                            </p>
                        </div>
                        <div className="bg-blue-50 px-6 py-3">
                            <p className="text-xs text-blue-700 font-medium">
                                Click to manage →
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

            {/* Document Requests Modal */}
            {isRequestsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <IconPaperBag className="w-7 h-7 text-white" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Zahtjevi za Dokumentima
                                    </h2>
                                    <p className="text-purple-100 text-sm">
                                        Pregledaj i upravljaj zahtjevima
                                        studenata
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeRequestsModal}
                                className="text-white hover:bg-purple-800 rounded-lg p-2 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <div className="flex space-x-4">
                                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium text-sm">
                                    Svi ({requests.length})
                                </button>
                                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors">
                                    Na čekanju (
                                    {
                                        requests.filter(
                                            (r) => r.status === 'PENDING'
                                        ).length
                                    }
                                    )
                                </button>
                                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors">
                                    Odobreno (
                                    {
                                        requests.filter(
                                            (r) => r.status === 'APPROVED'
                                        ).length
                                    }
                                    )
                                </button>
                            </div>
                        </div>

                        {/* Requests List */}
                        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                            {loadingRequests ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                    <p className="text-gray-500">
                                        Učitavam zahtjeve...
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {requests.map((request) => (
                                        <div
                                            key={request.id}
                                            className={`bg-white border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg ${
                                                request.status === 'PENDING'
                                                    ? 'border-orange-200 hover:border-orange-300'
                                                    : request.status ===
                                                        'APPROVED'
                                                      ? 'border-green-200 bg-green-50'
                                                      : 'border-red-200 bg-red-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                {/* Left side - Student info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                            {request.studentName.charAt(
                                                                0
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-800">
                                                                {
                                                                    request.studentName
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-500">
                                                                {request.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="ml-15 space-y-2">
                                                        <div className="flex items-center text-sm">
                                                            <span className="font-medium text-gray-600 w-32">
                                                                Dokument:
                                                            </span>
                                                            <span className="text-gray-800 font-medium">
                                                                {
                                                                    request.documentType
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <span className="font-medium text-gray-600 w-32">
                                                                Datum zahtjeva:
                                                            </span>
                                                            <span className="text-gray-800">
                                                                {new Date(
                                                                    request.requestDate
                                                                ).toLocaleDateString(
                                                                    'bs-BA'
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right side - Status and actions */}
                                                <div className="flex flex-col items-end space-y-3">
                                                    {/* Status Badge */}
                                                    <span
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                            request.status ===
                                                            'PENDING'
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : request.status ===
                                                                    'APPROVED'
                                                                  ? 'bg-green-100 text-green-700'
                                                                  : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {request.status ===
                                                            'PENDING' &&
                                                            '⏳ Na čekanju'}
                                                        {request.status ===
                                                            'APPROVED' &&
                                                            '✓ Odobreno'}
                                                        {request.status ===
                                                            'REJECTED' &&
                                                            '✗ Odbijeno'}
                                                    </span>

                                                    {/* Action Buttons */}
                                                    {request.status ===
                                                        'PENDING' && (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleApproveRequest(
                                                                        request.id
                                                                    )
                                                                }
                                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 shadow-md"
                                                            >
                                                                ✓ Odobri
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleRejectRequest(
                                                                        request.id
                                                                    )
                                                                }
                                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 shadow-md"
                                                            >
                                                                ✗ Odbij
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loadingRequests && requests.length === 0 && (
                                <div className="text-center py-12">
                                    <IconPaperBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">
                                        Nema zahtjeva za dokumentima
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <button
                                onClick={closeRequestsModal}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Zatvori
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* News Modal */}
            {isNewsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <IconNews className="w-7 h-7 text-white" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Upravljanje Novostima
                                    </h2>
                                    <p className="text-blue-100 text-sm">
                                        {page === 1
                                            ? 'Kreiraj novu vijest'
                                            : 'Pregled svih vijesti'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeNewsModal}
                                className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Page Navigation Tabs */}
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setPage(1)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                        page === 1
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    ➕ Dodaj Vijest
                                </button>
                                <button
                                    onClick={() => setPage(2)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                        page === 2
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    📰 Sve Vijesti ({news.length})
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                            {page === 1 ? (
                                /* Page 1: Add News Form */
                                <form
                                    onSubmit={handleNewsSubmit}
                                    className="space-y-6"
                                >
                                    {/* Tag Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kategorija
                                        </label>
                                        <select
                                            name="tagName"
                                            value={newsFormData.tagName}
                                            onChange={handleNewsInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                            required
                                        >
                                            <option value="">
                                                Izaberite kategoriju...
                                            </option>
                                            <option value="achievements">
                                                🏆 Uspjesi
                                            </option>
                                            <option value="announcements">
                                                📢 Obavještenja
                                            </option>
                                            <option value="partnerships">
                                                🤝 Partnerstva
                                            </option>
                                            <option value="events">
                                                📅 Događaji
                                            </option>
                                        </select>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Naslov
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newsFormData.title}
                                            onChange={handleNewsInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Unesite naslov novosti"
                                            required
                                        />
                                    </div>
                                    {/* Calendar News Checkbox */}
                                    <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <input
                                            type="checkbox"
                                            id="calendarNews"
                                            name="calendarNews"
                                            checked={newsFormData.calendarNews}
                                            onChange={handleNewsInputChange}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-0.5"
                                        />
                                        <div className="flex-1">
                                            <label
                                                htmlFor="calendarNews"
                                                className="text-sm font-bold text-blue-900 cursor-pointer block mb-1"
                                            >
                                                📅 Prikaži na News i Calendar
                                            </label>
                                            <p className="text-xs text-blue-700">
                                                ✅ <strong>Sa kvakom:</strong>{' '}
                                                Vidljivo na News i Calendar
                                                stranicama
                                                <br />❌{' '}
                                                <strong>Bez kvake:</strong>{' '}
                                                Vidljivo samo na News stranici
                                            </p>
                                        </div>
                                    </div>

                                    {/* Event Date Input - pokazuje se samo ako je calendarNews true */}
                                    {newsFormData.calendarNews && (
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <label className="block text-sm font-bold text-blue-900 mb-2">
                                                📆 Datum i vrijeme događaja
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="eventDate"
                                                value={newsFormData.eventDate}
                                                onChange={handleNewsInputChange}
                                                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required={
                                                    newsFormData.calendarNews
                                                }
                                            />
                                            <p className="text-xs text-blue-700 mt-2">
                                                Unesite datum i vrijeme kada će
                                                se događaj prikazati na
                                                kalendaru
                                            </p>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sadržaj
                                        </label>
                                        <textarea
                                            name="content"
                                            value={newsFormData.content}
                                            onChange={handleNewsInputChange}
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            placeholder="Unesite sadržaj novosti..."
                                            required
                                        />
                                    </div>

                                    {/* Links Parent */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Povezano sa (opcionalno)
                                        </label>
                                        <input
                                            type="text"
                                            name="linksParent"
                                            value={newsFormData.linksParent}
                                            onChange={handleNewsInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="npr. ime studenta, profesora ili organizacije"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Unesite ime osobe ili organizacije
                                            za koju je vezana vijest
                                        </p>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={closeNewsModal}
                                            className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Odustani
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Dodaj Vijest
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* Page 2: News List */
                                <div className="space-y-4">
                                    {news.length === 0 ? (
                                        <div className="text-center py-12">
                                            <IconNews className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg">
                                                Nema kreiranih vijesti
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                Dodajte prvu vijest preko forme
                                            </p>
                                        </div>
                                    ) : (
                                        news.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                        {item.tagName}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteNews(
                                                                item.id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 hover:shadow-md"
                                                        title="Obriši vijest"
                                                    >
                                                        🗑️ Obriši
                                                    </button>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                    {item.titles}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                                    {item.content}
                                                </p>
                                                {item.linksParent && (
                                                    <p className="text-xs text-blue-600">
                                                        🔗 {item.linksParent}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                {page === 1
                                    ? 'Forma za kreiranje nove vijesti'
                                    : `Ukupno ${news.length} vijesti u sistemu`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Fancy Delete Confirmation Modal */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp transform scale-100">
                        {/* Warning Header */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                <span className="text-3xl">⚠️</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Potvrda Brisanja
                                </h3>
                                <p className="text-red-100 text-sm">
                                    Ova akcija se ne može poništiti
                                </p>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Da li ste sigurni da želite obrisati vijest:
                            </p>
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                                <p className="font-semibold text-gray-900 mb-1">
                                    {deleteModalState.newsTitle}
                                </p>
                                <p className="text-sm text-red-600">
                                    🗑️ Vijest će biti trajno uklonjena iz
                                    sistema
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() =>
                                        setDeleteModalState({
                                            isOpen: false,
                                            newsId: null,
                                            newsTitle: '',
                                        })
                                    }
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-all duration-200"
                                >
                                    ❌ Odustani
                                </button>
                                <button
                                    onClick={confirmDeleteNews}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    ✓ Obriši Vijest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminPanel
