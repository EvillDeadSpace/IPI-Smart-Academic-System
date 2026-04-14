import { IconNews } from '@tabler/icons-react'
import { motion } from 'framer-motion'
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
            <motion.div
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer overflow-hidden h-full flex flex-col"
                onClick={openModal}
                whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(37,99,235,0.15)' }}
                transition={{ duration: 0.25 }}
            >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-sky-400" />

                <div className="p-6 flex-1">
                    {/* Icon + number */}
                    <div className="flex items-start justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
                            <IconNews className="w-6 h-6 text-sky-600" />
                        </div>
                        <span className="text-3xl font-syne font-bold text-slate-100 select-none leading-none">04</span>
                    </div>

                    <h3 className="text-base font-syne font-bold text-slate-800 mb-1.5">
                        Upravljanje novostima
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Kreiraj i upravljaj vijestima fakulteta
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors duration-200">
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-sky-600 transition-colors duration-200">
                        Upravljaj novostima
                    </span>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </motion.div>

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
