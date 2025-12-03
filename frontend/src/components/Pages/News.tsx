import { FC, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IconCalendar,
    IconHeart,
    IconShare,
    IconTrophy,
    IconUsers,
    IconBriefcase,
    IconCalendarEvent,
} from '@tabler/icons-react'
import Chat from '../Chat'
import { BACKEND_URL } from '../../config'

interface NewsItem {
    id: number
    tagName: string
    title: string
    content: string
    likes: number
    linksParent?: string
    createdAt: string
    updatedAt: string
}

const News: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
    const [newsItems, setNewsItems] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)

    // Category definitions with background images
    const categories = [
        {
            id: 'all',
            name: 'Sve',
            icon: IconCalendar,
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=85',
        },
        {
            id: 'achievements',
            name: 'Postignuća',
            icon: IconTrophy,
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=85',
        },
        {
            id: 'announcements',
            name: 'Obavještenja',
            icon: IconUsers,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85',
        },
        {
            id: 'partnerships',
            name: 'Partnerstva',
            icon: IconBriefcase,
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85',
        },
        {
            id: 'events',
            name: 'Događaji',
            icon: IconCalendarEvent,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85',
        },
    ]

    // Get category image by tagName
    const getCategoryImage = (tagName: string) => {
        const category = categories.find((cat) => cat.id === tagName)
        return category?.image || categories[0].image
    }

    useEffect(() => {
        async function fetchNews() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/news`)
                const data = await response.json()
                console.log('Fetched news from backend:', data)
                setNewsItems(data)
            } catch (error) {
                console.error('Error fetching news:', error)
            } finally {
                setLoading(false)
            }
        }
        void fetchNews()
    }, [])

    // Filter news by selected category
    const filteredNews =
        selectedCategory === 'all'
            ? newsItems
            : newsItems.filter((news) => news.tagName === selectedCategory)

    // Get count for each category
    const getCategoryCount = (categoryId: string) => {
        if (categoryId === 'all') return newsItems.length
        return newsItems.filter((news) => news.tagName === categoryId).length
    }

    if (loading) {
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

                                {/* Close Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setSelectedNews(null)}
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
