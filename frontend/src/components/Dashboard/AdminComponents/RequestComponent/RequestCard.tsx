import { IconPaperBag } from '@tabler/icons-react'
import { useState } from 'react'
import RequestModal from './RequestModal'

interface DocumentRequest {
    id: number
    studentName: string
    email: string
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

interface RequestCardProps {
    requests: DocumentRequest[]
    loadingRequests: boolean
    onFetchRequests: () => void
    onApprove: (id: number) => void
    onReject: (id: number) => void
}

export default function RequestCard({
    requests,
    loadingRequests,
    onFetchRequests,
    onApprove,
    onReject,
}: RequestCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => {
        setIsOpen(true)
        onFetchRequests()
    }

    const closeModal = () => setIsOpen(false)

    return (
        <>
            {/* Card */}
            <div
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
                onClick={openModal}
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
                        Pregled svih zahtjeva za obradu dokumenata
                    </p>
                </div>
                <div className="bg-purple-50 px-6 py-3">
                    <p className="text-xs text-purple-700 font-medium">
                        Click to manage →
                    </p>
                </div>
            </div>

            {/* Modal */}
            <RequestModal
                isOpen={isOpen}
                onClose={closeModal}
                requests={requests}
                loadingRequests={loadingRequests}
                onApprove={onApprove}
                onReject={onReject}
            />
        </>
    )
}
