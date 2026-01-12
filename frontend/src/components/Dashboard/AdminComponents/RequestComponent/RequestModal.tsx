import { IconFileText, IconX, IconCheck } from '@tabler/icons-react'

interface DocumentRequest {
    id: number
    studentName: string
    email: string
    documentType: string
    requestDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

interface RequestModalProps {
    isOpen: boolean
    onClose: () => void
    requests: DocumentRequest[]
    loadingRequests: boolean
    onApprove: (id: number) => void
    onReject: (id: number) => void
}

export default function RequestModal({
    isOpen,
    onClose,
    requests,
    loadingRequests,
    onApprove,
    onReject,
}: RequestModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <IconFileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Zahtjevi za dokumente
                            </h2>
                            <p className="text-purple-100 text-sm">
                                Upravljanje studentskim zahtjevima
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
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

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                    {loadingRequests ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IconFileText className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">
                                Nema zahtjeva za prikazivanje
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <IconFileText className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {request.studentName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {request.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Tip dokumenta
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {request.documentType}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Datum zahtjeva
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {new Date(
                                                            request.requestDate
                                                        ).toLocaleDateString(
                                                            'sr-Latn-RS'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-4 flex flex-col items-end gap-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    request.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : request.status ===
                                                            'APPROVED'
                                                          ? 'bg-green-100 text-green-800'
                                                          : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {request.status === 'PENDING'
                                                    ? 'Na čekanju'
                                                    : request.status ===
                                                        'APPROVED'
                                                      ? 'Odobreno'
                                                      : 'Odbijeno'}
                                            </span>

                                            {request.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            onApprove(
                                                                request.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        <IconCheck className="w-4 h-4" />
                                                        Odobri
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            onReject(request.id)
                                                        }
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                                                    >
                                                        <IconX className="w-4 h-4" />
                                                        Odbij
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        Zatvori
                    </button>
                </div>
            </div>
        </div>
    )
}
