import { IconLogout, IconSchool } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useAuth } from '../../Context'
import { BACKEND_URL, NLP_URL } from '../../constants/storage'
import { toastError, toastSuccess } from '../../lib/toast'
import {
    BackendDocumentRequest,
    DocumentRequest,
    StudentFormData,
} from '../../types/AdminTypes/admin'
import { BackendNews } from '../../types/NewsTypes/NewsTypes'
import StudentCard from './AdminComponents/AdminComponent/StudentCard'
import NewsCard from './AdminComponents/NewsComponent/NewsCard'
import ProfessorCard from './AdminComponents/ProfessorComponent/ProfessorCard'
import RequestCard from './AdminComponents/RequestComponent/RequestCard'

const AdminPanel: React.FC = () => {
    const { logout, studentName, studentMail } = useAuth()
    const [requests, setRequests] = useState<DocumentRequest[]>([])
    const [loadingRequests, setLoadingRequests] = useState(false)
    const [news, setNews] = useState<BackendNews[]>([])
    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean
        newsId: number | null
        newsTitle: string
    }>({ isOpen: false, newsId: null, newsTitle: '' })
    const [newsFormData, setNewsFormData] = useState({
        tagName: '',
        title: '',
        content: '',
        likes: 0,
        linksParent: '',
        calendarNews: false,
        eventDate: '',
    })

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
            const response = await fetch(`${BACKEND_URL}/api/news/${newsId}`, {
                method: 'DELETE',
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

    const handleAddStudent = async (formData: StudentFormData) => {
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

                try {
                    // Send email welcome
                    const response_notification_service = await fetch(
                        `${NLP_URL}/notification-services`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'welcome',
                                studentName: `${formData.firstName} ${formData.lastName}`,
                                Recipients: [
                                    {
                                        Email: formData.email,
                                        Name: `${formData.firstName} ${formData.lastName}`,
                                    },
                                ],
                            }),
                        }
                    )
                    if (response_notification_service.ok) {
                        toastSuccess(`Email notifikacija je poslana studentu`)
                        console.log('Notifikacije poslane studentima')
                    } else {
                        const errorText =
                            await response_notification_service.text()
                        toastError('Greška pri slanju email notifikacija')
                        console.error(
                            'Greška pri slanju notifikacija:',
                            errorText
                        )
                    }
                } catch (error) {
                    console.log(error)
                }
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
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <nav className="bg-blue-600 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <IconSchool className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-syne font-bold text-white leading-tight">
                                    Admin Panel
                                </h1>
                                <p className="text-xs text-blue-100">
                                    {studentName || 'System Administrator'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-white/15 rounded-lg transition-all duration-200"
                        >
                            <IconLogout className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
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
                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute -right-8 -top-8 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                        <p className="text-xs font-syne font-semibold tracking-widest uppercase text-blue-200 mb-2">
                            IPI Akademija · Admin
                        </p>
                        <h1 className="text-2xl font-syne font-bold mb-1">
                            Dobrodošli, {studentName || 'Administrator'}
                        </h1>
                        <p className="text-blue-100 text-sm opacity-90">
                            Upravljajte studentima, profesorima, zahtjevima i vijestima
                        </p>
                    </div>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
                >
                    {[
                        <StudentCard key="student" onSubmit={handleAddStudent} />,
                        <ProfessorCard key="professor" />,
                        <RequestCard
                            key="request"
                            requests={requests}
                            loadingRequests={loadingRequests}
                            onFetchRequests={fetchDocumentRequests}
                            onApprove={handleApproveRequest}
                            onReject={handleRejectRequest}
                        />,
                        <NewsCard
                            key="news"
                            news={news}
                            loadingRequests={loadingRequests}
                            newsFormData={newsFormData}
                            deleteModalState={deleteModalState}
                            onFetchNews={fetchNewsRequests}
                            onNewsInputChange={handleNewsInputChange}
                            onNewsSubmit={handleNewsSubmit}
                            onDeleteNews={handleDeleteNews}
                            onConfirmDelete={confirmDeleteNews}
                            onCancelDelete={() =>
                                setDeleteModalState({ isOpen: false, newsId: null, newsTitle: '' })
                            }
                        />,
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                            }}
                        >
                            {card}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}

export default AdminPanel
