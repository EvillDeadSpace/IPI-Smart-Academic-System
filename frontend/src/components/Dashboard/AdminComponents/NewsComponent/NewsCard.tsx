import { IconNews } from '@tabler/icons-react'
import { useState } from 'react'
import NewsModal from './NewsModal'

import { NewsCardProps } from '../../../../types/NewsTypes/NewsTypes'

export default function NewsCard({
    news,
    loadingRequests,
    newsFormData,
    deleteModalState,
    onFetchNews,
    onNewsInputChange,
    onNewsSubmit,
    onDeleteNews,
    onConfirmDelete,
    onCancelDelete,
}: NewsCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => {
        setIsOpen(true)
        onFetchNews()
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
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <IconNews className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Upravljanje novostima
                    </h3>
                    <p className="text-sm text-gray-600">
                        Kreiraj i upravljaj vijestima fakulteta
                    </p>
                </div>
                <div className="bg-blue-50 px-6 py-3">
                    <p className="text-xs text-blue-700 font-medium">
                        Click to manage →
                    </p>
                </div>
            </div>

            {/* Modal */}
            <NewsModal
                isOpen={isOpen}
                onClose={closeModal}
                news={news}
                loadingRequests={loadingRequests}
                newsFormData={newsFormData}
                deleteModalState={deleteModalState}
                onNewsInputChange={onNewsInputChange}
                onNewsSubmit={onNewsSubmit}
                onDeleteNews={onDeleteNews}
                onConfirmDelete={onConfirmDelete}
                onCancelDelete={onCancelDelete}
            />
        </>
    )
}
