import { IconNews, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { NewsModalProps } from '../../../../types/NewsTypes/NewsModalTypes'

export default function NewsModal({
    isOpen,
    onClose,
    news,
    loadingRequests,
    newsFormData,
    deleteModalState,
    onNewsInputChange,
    onNewsSubmit,
    onDeleteNews,
    onConfirmDelete,
    onCancelDelete,
}: NewsModalProps) {
    const [page, setPage] = useState(1)

    if (!isOpen) return null

    return (
        <>
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
                                <IconNews className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-syne font-bold text-white leading-tight">
                                    Upravljanje Novostima
                                </h2>
                                <p className="text-blue-100 text-xs">
                                    {page === 1 ? 'Kreiraj novu vijest' : 'Pregled svih vijesti'}
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

                    {/* Tabs */}
                    <div className="bg-white px-6 pt-4 pb-0 border-b border-slate-200">
                        <div className="flex gap-1">
                            <button
                                onClick={() => setPage(1)}
                                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
                                    page === 1
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-slate-500 border-transparent hover:text-slate-700'
                                }`}
                            >
                                Dodaj Vijest
                            </button>
                            <button
                                onClick={() => setPage(2)}
                                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${
                                    page === 2
                                        ? 'text-blue-600 border-blue-600'
                                        : 'text-slate-500 border-transparent hover:text-slate-700'
                                }`}
                            >
                                Sve Vijesti
                                <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{news.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-190px)] p-6">
                        {page === 1 ? (
                            <form onSubmit={onNewsSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategorija</label>
                                    <select
                                        name="tagName"
                                        value={newsFormData.tagName}
                                        onChange={onNewsInputChange}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                                        required
                                    >
                                        <option value="">Izaberite kategoriju...</option>
                                        <option value="achievements">Uspjesi</option>
                                        <option value="announcements">Obavještenja</option>
                                        <option value="partnerships">Partnerstva</option>
                                        <option value="events">Događaji</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Naslov</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newsFormData.title}
                                        onChange={onNewsInputChange}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                                        placeholder="Unesite naslov novosti"
                                        required
                                    />
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <input
                                        type="checkbox"
                                        id="calendarNews"
                                        name="calendarNews"
                                        checked={newsFormData.calendarNews}
                                        onChange={onNewsInputChange}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded mt-0.5"
                                    />
                                    <div>
                                        <label htmlFor="calendarNews" className="text-sm font-semibold text-blue-900 cursor-pointer block mb-0.5">
                                            Prikaži na News i Calendar
                                        </label>
                                        <p className="text-xs text-blue-700">
                                            Sa kvačicom — vidljivo i na Calendar stranici
                                        </p>
                                    </div>
                                </div>

                                {newsFormData.calendarNews && (
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                        <label className="block text-xs font-semibold text-blue-900 mb-1.5">
                                            Datum i vrijeme događaja
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="eventDate"
                                            value={newsFormData.eventDate}
                                            onChange={onNewsInputChange}
                                            className="w-full px-4 py-2.5 text-sm border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                            required={newsFormData.calendarNews}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sadržaj</label>
                                    <textarea
                                        name="content"
                                        value={newsFormData.content}
                                        onChange={onNewsInputChange}
                                        rows={5}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50 resize-none"
                                        placeholder="Unesite sadržaj novosti..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                        Povezano sa <span className="text-slate-400 font-normal">(opcionalno)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="linksParent"
                                        value={newsFormData.linksParent}
                                        onChange={onNewsInputChange}
                                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-slate-50"
                                        placeholder="npr. ime studenta, profesora ili organizacije"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        Odustani
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
                                    >
                                        Dodaj Vijest
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-3">
                                {loadingRequests ? (
                                    <div className="flex justify-center items-center py-16">
                                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600" />
                                    </div>
                                ) : news.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <IconNews className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-600 font-medium">Nema kreiranih vijesti</p>
                                        <p className="text-slate-400 text-sm mt-1">Dodajte prvu vijest preko forme</p>
                                    </div>
                                ) : (
                                    news.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-semibold">
                                                    {item.tagName}
                                                </span>
                                                <button
                                                    onClick={() => onDeleteNews(item.id)}
                                                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                                                >
                                                    <IconX className="w-3 h-3" />
                                                    Obriši
                                                </button>
                                            </div>
                                            <h3 className="text-sm font-syne font-bold text-slate-800 mb-1">{item.titles}</h3>
                                            <p className="text-xs text-slate-500 line-clamp-2">{item.content}</p>
                                            {item.linksParent && (
                                                <p className="text-xs text-blue-600 mt-2">🔗 {item.linksParent}</p>
                                            )}
                                        </div>
                                    ))
                                )}
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

            {/* Delete Confirmation */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[60]">
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-red-500 px-6 py-5 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <IconX className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-syne font-bold text-white leading-tight">Potvrda Brisanja</h2>
                                <p className="text-red-100 text-xs">Ova akcija se ne može poništiti</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-slate-600 text-sm mb-2">Da li ste sigurni da želite obrisati vijest:</p>
                            <p className="font-syne font-bold text-slate-800 mb-3">"{deleteModalState.newsTitle}"</p>
                            <p className="text-xs text-slate-500">Ova akcija će trajno ukloniti vijest iz sistema.</p>
                        </div>

                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3">
                            <button
                                onClick={onCancelDelete}
                                className="flex-1 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Otkaži
                            </button>
                            <button
                                onClick={onConfirmDelete}
                                className="flex-1 px-5 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                            >
                                Obriši Vijest
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
