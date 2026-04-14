import {
    IconCalendar,
    IconId,
    IconInfoCircle,
    IconLock,
    IconMail,
    IconSchool,
    IconUser,
    IconUserPlus,
} from '@tabler/icons-react'
import { StudentModalProps } from '../../../../types/AdminTypes/studentModal'

export default function StudentModal({
    isOpen,
    onClose,
    formData,
    handleInputChange,
    handleSubmit,
}: StudentModalProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-blue-950/70 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <IconUserPlus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-syne font-bold text-white leading-tight">
                                Dodaj Novog Studenta
                            </h2>
                            <p className="text-blue-100 text-xs">
                                Unesite podatke o novom studentu
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

                {/* Form */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-syne font-bold text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
                                <IconUser className="w-4 h-4 text-blue-600" />
                                Lični podaci
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ime *</label>
                                    <div className="relative">
                                        <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50"
                                            placeholder="Unesi ime"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Prezime *</label>
                                    <div className="relative">
                                        <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50"
                                            placeholder="Unesi prezime"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email adresa *</label>
                                <div className="relative">
                                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50"
                                        placeholder="student@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Datum rođenja *</label>
                                <div className="relative">
                                    <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-syne font-bold text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
                                <IconSchool className="w-4 h-4 text-blue-600" />
                                Akademski podaci
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Broj indeksa{' '}
                                    <span className="text-slate-400 font-normal">(opcionalno)</span>
                                </label>
                                <div className="relative">
                                    <IconId className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="indexNumber"
                                        value={formData.indexNumber}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50"
                                        placeholder="npr. 2024/001"
                                    />
                                </div>
                            </div>
                            <div className="rounded-xl p-4 flex items-start gap-3 bg-blue-50 border border-blue-100">
                                <IconInfoCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-semibold text-blue-900 mb-0.5">Smjer studija</p>
                                    <p className="text-xs text-blue-700">Smjer ID: {formData.majorId} (Računarstvo)</p>
                                </div>
                                <input type="hidden" name="majorId" value={formData.majorId} />
                            </div>
                        </div>

                        {/* Security */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-syne font-bold text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
                                <IconLock className="w-4 h-4 text-blue-600" />
                                Sigurnost
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Lozinka *</label>
                                <div className="relative">
                                    <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50"
                                        placeholder="Unesite jaku lozinku"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1.5">Lozinka mora biti sigurna i lako pamtljiva</p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Otkaži
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm shadow-blue-200 hover:shadow-md flex items-center gap-2"
                    >
                        <IconUserPlus className="w-4 h-4" />
                        Dodaj studenta
                    </button>
                </div>
            </div>
        </div>
    )
}
