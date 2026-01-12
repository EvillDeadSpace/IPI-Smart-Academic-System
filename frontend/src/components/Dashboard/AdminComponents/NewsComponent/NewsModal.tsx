import { IconNews, IconX } from '@tabler/icons-react'
import { useState } from 'react'

interface BackendNews {
    id: number
    tagName: string
    content: string
    linksParent?: string
    titles: string
    likes: number
}

interface NewsFormData {
    tagName: string
    title: string
    content: string
    likes: number
    linksParent: string
    calendarNews: boolean
    eventDate: string
}

interface NewsModalProps {
    isOpen: boolean
    onClose: () => void
    news: BackendNews[]
    loadingRequests: boolean
    newsFormData: NewsFormData
    deleteModalState: {
        isOpen: boolean
        newsId: number | null
        newsTitle: string
    }
    onNewsInputChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void
    onNewsSubmit: (e: React.FormEvent) => void
    onDeleteNews: (id: number) => void
    onConfirmDelete: () => void
    onCancelDelete: () => void
}

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
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <IconNews className="w-7 h-7 text-white" />
                            </div>
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
                            <form onSubmit={onNewsSubmit} className="space-y-6">
                                {/* Tag Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategorija
                                    </label>
                                    <select
                                        name="tagName"
                                        value={newsFormData.tagName}
                                        onChange={onNewsInputChange}
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
                                        onChange={onNewsInputChange}
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
                                        onChange={onNewsInputChange}
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
                                            <br />❌ <strong>
                                                Bez kvake:
                                            </strong>{' '}
                                            Vidljivo samo na News stranici
                                        </p>
                                    </div>
                                </div>

                                {/* Event Date Input */}
                                {newsFormData.calendarNews && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <label className="block text-sm font-bold text-blue-900 mb-2">
                                            📆 Datum i vrijeme događaja
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="eventDate"
                                            value={newsFormData.eventDate}
                                            onChange={onNewsInputChange}
                                            className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            required={newsFormData.calendarNews}
                                        />
                                        <p className="text-xs text-blue-700 mt-2">
                                            Unesite datum i vrijeme kada će se
                                            događaj prikazati na kalendaru
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
                                        onChange={onNewsInputChange}
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
                                        onChange={onNewsInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="npr. ime studenta, profesora ili organizacije"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Unesite ime osobe ili organizacije za
                                        koju je vezana vijest
                                    </p>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
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
                                {loadingRequests ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : news.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <IconNews className="w-10 h-10 text-gray-400" />
                                        </div>
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
                                                        onDeleteNews(item.id)
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
                                            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                                <span>
                                                    ❤️ {item.likes} lajka
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
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

            {/* Delete Confirmation Modal */}
            {deleteModalState.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] animate-fadeIn">
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <IconX className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Potvrda Brisanja
                                    </h2>
                                    <p className="text-red-100 text-sm">
                                        Ova akcija se ne može poništiti
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 mb-2">
                                Da li ste sigurni da želite obrisati vijest:
                            </p>
                            <p className="text-lg font-bold text-gray-900 mb-4">
                                "{deleteModalState.newsTitle}"
                            </p>
                            <p className="text-sm text-gray-600">
                                Ova akcija će trajno ukloniti vijest iz sistema.
                            </p>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex gap-3">
                            <button
                                onClick={onCancelDelete}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                Otkaži
                            </button>
                            <button
                                onClick={onConfirmDelete}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
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
