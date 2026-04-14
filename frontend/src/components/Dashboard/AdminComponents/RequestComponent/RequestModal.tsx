import { IconCheck, IconFileText, IconX } from '@tabler/icons-react'
import { RequestModalProps } from '../../../../types/RequestTypes/Request'

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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <IconFileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-syne font-bold text-white leading-tight">
                                Zahtjevi za dokumente
                            </h2>
                            <p className="text-blue-100 text-xs">
                                Upravljanje studentskim zahtjevima
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-130px)] p-6">
                    {loadingRequests ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600" />
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <IconFileText className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium">Nema zahtjeva za prikazivanje</p>
                            <p className="text-slate-400 text-sm mt-1">Zahtjevi će se pojaviti ovdje</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="border border-slate-200 rounded-xl p-5 bg-white hover:border-blue-200 transition-colors"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <IconFileText className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 text-sm">{request.studentName}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{request.email}</p>
                                                <div className="flex gap-4 mt-2">
                                                    <div>
                                                        <p className="text-xs text-slate-400">Tip dokumenta</p>
                                                        <p className="text-xs font-medium text-slate-700 mt-0.5">{request.documentType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400">Datum</p>
                                                        <p className="text-xs font-medium text-slate-700 mt-0.5">
                                                            {new Date(request.requestDate).toLocaleDateString('sr-Latn-RS')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                request.status === 'PENDING'
                                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                    : request.status === 'APPROVED'
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                {request.status === 'PENDING' ? 'Na čekanju'
                                                    : request.status === 'APPROVED' ? 'Odobreno'
                                                    : 'Odbijeno'}
                                            </span>

                                            {request.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onApprove(request.id)}
                                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                                                    >
                                                        <IconCheck className="w-3.5 h-3.5" />
                                                        Odobri
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(request.id)}
                                                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                                                    >
                                                        <IconX className="w-3.5 h-3.5" />
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

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Zatvori
                    </button>
                </div>
            </div>
        </div>
    )
}
