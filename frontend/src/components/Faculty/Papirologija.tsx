import React, { useState, useEffect } from 'react'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'
import {
    IconFileText,
    IconHeartbeat,
    IconSchool,
    IconCertificate,
    IconClock,
    IconCheck,
    IconX,
    IconDownload,
} from '@tabler/icons-react'

interface DocumentRequest {
    id: number
    documentType: string
    status: string
    requestDate: string
    processedDate?: string
    pdfUrl?: string
    student: {
        firstName: string
        lastName: string
        email: string
    }
}

const Papirologija: React.FC = () => {
    const { studentMail } = useAuth()
    const [requests, setRequests] = useState<DocumentRequest[]>([])
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDocType, setSelectedDocType] = useState('')

    const documentTypes = [
        {
            type: 'HEALTH_CERTIFICATE',
            name: 'Uvjerenje o zdravstvenom osiguranju',
            icon: IconHeartbeat,
            color: 'from-red-400 to-red-600',
            description: 'Za potrebe zdravstvenog osiguranja',
        },
        {
            type: 'STATUS_CONFIRMATION',
            name: 'Potvrda o statusu studenta',
            icon: IconSchool,
            color: 'from-blue-400 to-blue-600',
            description: 'Za potrebe stipendije, prevoza, itd.',
        },
        {
            type: 'TRANSCRIPT',
            name: 'Prijepis ocjena',
            icon: IconCertificate,
            color: 'from-green-400 to-green-600',
            description: 'Službeni dokument sa svim ocjenama',
        },
        {
            type: 'ENROLLMENT_CONFIRMATION',
            name: 'Potvrda o upisu',
            icon: IconFileText,
            color: 'from-purple-400 to-purple-600',
            description: 'Potvrda o upisu na akademsku godinu',
        },
    ]

    useEffect(() => {
        fetchRequests()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const response = await fetch(
                `${BACKEND_URL}/api/document-requests?studentEmail=${studentMail}`
            )
            if (response.ok) {
                const data = await response.json()
                setRequests(data)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRequestDocument = async (documentType: string) => {
        try {
            if (!studentMail) {
                alert('Greška: Niste prijavljeni kao student')
                return
            }

            const studentResponse = await fetch(
                `${BACKEND_URL}/api/students/email/${studentMail}`
            )

            if (!studentResponse.ok) {
                alert('Greška: Student nije pronađen')
                return
            }

            const student = await studentResponse.json()
            const studentData = student.data || student

            if (!studentData.id) {
                alert('Greška: Student ID nije pronađen')
                return
            }

            const response = await fetch(
                `${BACKEND_URL}/api/document-requests`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: studentData.id,
                        documentType,
                    }),
                }
            )

            if (response.ok) {
                alert('Zahtjev uspješno poslan!')
                setIsModalOpen(false)
                fetchRequests()
            } else {
                const error = await response.json()
                alert(`Greška: ${error.error || 'Nepoznata greška'}`)
            }
        } catch {
            alert('Došlo je do greške')
        }
    }

    const openRequestModal = (documentType: string) => {
        setSelectedDocType(documentType)
        setIsModalOpen(true)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-medium">
                        <IconClock className="w-3.5 h-3.5" />
                        Na čekanju
                    </span>
                )
            case 'APPROVED':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                        <IconCheck className="w-3.5 h-3.5" />
                        Odobreno
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                        <IconX className="w-3.5 h-3.5" />
                        Odbijeno
                    </span>
                )
            default:
                return null
        }
    }

    const getDocumentTypeName = (type: string) => {
        const doc = documentTypes.find((d) => d.type === type)
        return doc?.name || type
    }

    const handleDownloadPDF = async () => {
        try {
            const studentResponse = await fetch(
                `${BACKEND_URL}/api/students/email/${studentMail}`
            )

            if (!studentResponse.ok) {
                alert('Greška: Ne mogu učitati podatke studenta')
                return
            }

            const studentJson = await studentResponse.json()
            const studentData = studentJson.data

            const pdfRequestData = {
                fullName: `${studentData.firstName} ${studentData.lastName}`,
                jmbg: studentData.indexNumber,
                city: 'Tuzla',
                dateOfBirth: new Date(studentData.dateOfBirth)
                    .toISOString()
                    .split('T')[0],
                yearsOfStudy: String(studentData.currentYear),
                academicYear: '24/25',
            }

            const pdfResponse = await fetch(
                'http://localhost:5000/health-certificate',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pdfRequestData),
                }
            )

            if (!pdfResponse.ok) {
                alert(`Greška pri generisanju PDF-a: ${pdfResponse.status}`)
                return
            }

            const blob = await pdfResponse.blob()

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `health_certificate_${studentData.indexNumber}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Nepoznata greška'
            alert(`Došlo je do greške: ${errorMessage}`)
        }
    }

    return (
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            📄 Papirologija
                        </h1>
                        <p className="opacity-90">
                            Zatražite i preuzmite potrebnu dokumentaciju
                        </p>
                    </div>

                    {/* Document Types Grid - Responsive */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {documentTypes.map((doc) => {
                            const Icon = doc.icon
                            return (
                                <div
                                    key={doc.type}
                                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-200 dark:border-neutral-700 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.01]"
                                    onClick={() => openRequestModal(doc.type)}
                                >
                                    <div
                                        className={`h-2 bg-gradient-to-r ${doc.color}`}
                                    />
                                    <div className="p-4">
                                        <div
                                            className={`w-12 h-12 bg-gradient-to-br ${doc.color} rounded-lg flex items-center justify-center mb-3`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-2">
                                            {doc.name}
                                        </h3>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                                            {doc.description}
                                        </p>
                                        <button className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                                            Zatraži →
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Requests History */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                            Moji zahtjevi
                        </h2>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                                <p className="text-neutral-600 dark:text-neutral-400 mt-4">
                                    Učitavam...
                                </p>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-12">
                                <IconFileText className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                                <p className="text-neutral-500 dark:text-neutral-400 text-base">
                                    Još uvijek niste zatražili nijedan dokument
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-neutral-50 dark:bg-neutral-900/50"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                            <div className="flex-1">
                                                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                                                    {getDocumentTypeName(
                                                        request.documentType
                                                    )}
                                                </h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                                    Zatraženo:{' '}
                                                    {new Date(
                                                        request.requestDate
                                                    ).toLocaleDateString(
                                                        'bs-BA'
                                                    )}
                                                </p>
                                                {request.processedDate && (
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        Obrađeno:{' '}
                                                        {new Date(
                                                            request.processedDate
                                                        ).toLocaleDateString(
                                                            'bs-BA'
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col sm:items-end gap-2">
                                                {getStatusBadge(request.status)}
                                                {request.status ===
                                                    'APPROVED' &&
                                                    request.pdfUrl && (
                                                        <button
                                                            onClick={() =>
                                                                handleDownloadPDF()
                                                            }
                                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                                        >
                                                            <IconDownload className="w-4 h-4" />
                                                            Preuzmi PDF
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Request Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 max-w-md w-full border border-neutral-200 dark:border-neutral-700">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                            Potvrda zahtjeva
                        </h2>
                        <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                            Da li ste sigurni da želite zatražiti:{' '}
                            <strong>
                                {getDocumentTypeName(selectedDocType)}
                            </strong>
                            ?
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                            Vaš zahtjev će biti proslijeđen administraciji. Bit
                            ćete obaviješteni kada dokument bude odobren.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Odustani
                            </button>
                            <button
                                onClick={() =>
                                    handleRequestDocument(selectedDocType)
                                }
                                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Potvrdi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Papirologija
