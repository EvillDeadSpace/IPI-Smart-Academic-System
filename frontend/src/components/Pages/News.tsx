import {
    IconCalendar,
    IconHeart,
    IconMessage,
    IconSend,
    IconShare,
    IconTrash,
} from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import { categories } from '../../constants/news'
import { useAuth } from '../../Context'
import { toastError, toastSuccess } from '../../lib/toast'
import { NewsItem } from '../../types/NewsTypes/NewsTypes'

import useNewsHooks from '../../hooks/newsHooks/useNewsHooks'
import Chat from '../Chat'

const News: FC = () => {
    const { studentMail } = useAuth()
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
    const [newComment, setNewComment] = useState('')

    const {
        comments,
        setComments,
        fetchComments,
        loadingComments,
        addComment,
        deleteComment,
        data,
        isLoading,
    } = useNewsHooks()

    // Get category image by tagName
    const getCategoryImage = (tagName: string) => {
        const category = categories.find((cat) => cat.id === tagName)
        return category?.image || categories[0].image
    }

    // Fetch comments when news is selected
    useEffect(() => {
        if (selectedNews) {
            fetchComments(selectedNews.id)
        }
    }, [selectedNews])

    const handleAddComment = async () => {
        if (!newComment.trim() || !selectedNews || !studentMail) return

        try {
            await addComment(selectedNews.id, newComment, studentMail)
            setNewComment('')
            toastSuccess('Komentar dodat!')
        } catch (error: unknown) {
            console.error('Error adding comment:', error)
            if (error && typeof error === 'object' && 'message' in error) {
                toastError(
                    (error as { message?: string }).message ||
                        'Greška prilikom dodavanja komentara'
                )
            } else {
                toastError('Greška prilikom dodavanja komentara')
            }
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!studentMail) return

        try {
            await deleteComment(commentId, studentMail)
            toastSuccess('Komentar obrisan!')
        } catch (error: unknown) {
            console.error('Error deleting comment:', error)
            if (error && typeof error === 'object' && 'message' in error) {
                toastError(
                    (error as { message?: string }).message ||
                        'Greška prilikom brisanja komentara'
                )
            } else {
                toastError('Greška prilikom brisanja komentara')
            }
        }
    }
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">
                        Učitavanje novosti...
                    </p>
                </div>
            </div>
        )
    }

    // Filter news by selected category
    const filteredNews =
        selectedCategory === 'all'
            ? data
            : data.filter((news: NewsItem) => news.tagName === selectedCategory)

    // Get count for each category
    const getCategoryCount = (categoryId: string) => {
        if (categoryId === 'all') return data.length
        return data.filter((news: NewsItem) => news.tagName === categoryId)
            .length
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-white to-blue-50"
        >
            {/* Fixed Chat */}
            <div className="fixed bottom-4 right-4 z-50">
                <Chat />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-dot-thick-neutral-100 opacity-30" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-block mb-6 px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold"
                        >
                            📰 Novosti i događaji
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Šta se{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                dešava kod nas
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8">
                            Pratite najnovije vijesti, događaje i obavještenja
                            iz fakulteta
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categories.map((category) => {
                            const Icon = category.icon
                            const count = getCategoryCount(category.id)
                            const isActive = selectedCategory === category.id

                            return (
                                <motion.button
                                    key={category.id}
                                    onClick={() =>
                                        setSelectedCategory(category.id)
                                    }
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        flex items-center gap-3 px-6 py-3 rounded-full font-semibold
                                        transition-all duration-300 shadow-md
                                        ${
                                            isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{category.name}</span>
                                    <span
                                        className={`
                                            px-2 py-0.5 rounded-full text-xs font-bold
                                            ${
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                            }
                                        `}
                                    >
                                        {count}
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    {filteredNews.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg mb-6">
                                <IconCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">
                                    Trenutno nema dostupnih novosti
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Provjerite ponovo kasnije
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredNews.map((news, index) => (
                                <motion.div
                                    key={news.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                                    onClick={() => setSelectedNews(news)}
                                >
                                    {/* Background Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={getCategoryImage(news.tagName)}
                                            alt={news.tagName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                        {/* Category Badge on Image */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-sm font-semibold shadow-lg">
                                                {news.tagName}
                                            </span>
                                        </div>

                                        {/* Likes on Image */}
                                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                            <IconHeart className="w-4 h-4 text-red-500" />
                                            <span className="text-sm font-medium text-gray-800">
                                                {news.likes}
                                            </span>
                                        </div>
                                    </div>

                                    {/* News Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {news.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {news.content}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <IconCalendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(
                                                        news.createdAt
                                                    ).toLocaleDateString(
                                                        'bs-BA',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <span className="text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                                                Pročitaj →
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* News Detail Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedNews(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {selectedNews.tagName}
                                    </span>
                                    <button
                                        onClick={() => setSelectedNews(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
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

                                {/* Title */}
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    {selectedNews.title}
                                </h2>

                                {/* Meta */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <IconCalendar className="w-4 h-4" />
                                        <span>
                                            {new Date(
                                                selectedNews.createdAt
                                            ).toLocaleDateString('bs-BA', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IconHeart className="w-4 h-4 text-red-500" />
                                        <span className="font-medium">
                                            {selectedNews.likes} likes
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="prose prose-lg max-w-none mb-6">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedNews.content}
                                    </p>
                                </div>

                                {/* Link */}
                                {selectedNews.linksParent && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <a
                                            href={selectedNews.linksParent}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <IconShare className="w-5 h-5" />
                                            Posjeti povezani link
                                        </a>
                                    </div>
                                )}

                                {/* Comments Section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <IconMessage className="w-5 h-5 text-blue-600" />
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Komentari ({comments.length})
                                        </h3>
                                    </div>

                                    {/* Add Comment */}
                                    {studentMail ? (
                                        <div className="mb-6">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) =>
                                                        setNewComment(
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddComment()
                                                        }
                                                    }}
                                                    placeholder="Dodaj komentar..."
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    onClick={handleAddComment}
                                                    disabled={
                                                        !newComment.trim()
                                                    }
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                                >
                                                    <IconSend className="w-4 h-4" />
                                                    Pošalji
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                            <p className="text-blue-800">
                                                🔒 Morate biti prijavljeni da
                                                biste komentarisali
                                            </p>
                                        </div>
                                    )}

                                    {/* Comments List */}
                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                        {loadingComments ? (
                                            <p className="text-gray-500 text-center py-4">
                                                Učitavanje komentara...
                                            </p>
                                        ) : comments.length === 0 ? (
                                            <p className="text-gray-500 text-center py-4">
                                                Nema komentara. Budite prvi koji
                                                će komentarisati!
                                            </p>
                                        ) : (
                                            comments.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="p-4 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    comment
                                                                        .student
                                                                        .firstName
                                                                }{' '}
                                                                {
                                                                    comment
                                                                        .student
                                                                        .lastName
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(
                                                                    comment.createdAt
                                                                ).toLocaleString(
                                                                    'bs-BA'
                                                                )}
                                                            </p>
                                                        </div>
                                                        {studentMail ===
                                                            comment.student
                                                                .email && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteComment(
                                                                        comment.id
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                            >
                                                                <IconTrash className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-700">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Close Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            setSelectedNews(null)
                                            setComments([])
                                            setNewComment('')
                                        }}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                                    >
                                        Zatvori
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default News
