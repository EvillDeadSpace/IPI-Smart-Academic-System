import { FC, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IconCalendar,
    IconClock,
    IconUser,
    IconEye,
    IconHeart,
    IconShare,
    IconTrophy,
    IconSchool,
    IconBriefcase,
    IconUsers,
} from '@tabler/icons-react'
import Chat from '../Chat'

interface NewsItem {
    id: string
    title: string
    excerpt: string
    content: string
    category: 'events' | 'achievements' | 'announcements' | 'partnerships'
    date: string
    author: string
    image: string
    readTime: string
    views: number
    likes: number
}

const News: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

    const newsItems: NewsItem[] = [
        {
            id: '1',
            title: 'IPI Akademija dobila prestižnu akreditaciju za IT programe',
            excerpt:
                'Naša institucija je dobila međunarodnu akreditaciju za sve IT studijske programe, što studentima omogućava globalno priznavanje diplome.',
            content:
                'IPI Akademija je zvanično dobila prestižnu međunarodnu akreditaciju od strane European Quality Assurance Register for Higher Education (EQAR). Ova akreditacija potvrđuje visok kvalitet naših IT studijskih programa i omogućava našim studentima da njihove diplome budu priznate širom Evrope i svijeta. Proces akreditacije je trajao godinu dana i uključivao je detaljnu evaluaciju nastavnog kadra, programa, infrastrukture i ishoda učenja. Posebno su pohvaljeni naši praktični pristupi nastavi i saradnja sa IT industrijskom.',
            category: 'achievements',
            date: '2025-11-20',
            author: 'Prof. Dr. Marko Marković',
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920',
            readTime: '5 min',
            views: 1250,
            likes: 89,
        },
        {
            id: '2',
            title: 'Otvorene prijave za upis 2025/2026 akademske godine',
            excerpt:
                'Počeo je proces prijave za novu akademsku godinu. Prijave se primaju online do 31. avgusta 2025. godine.',
            content:
                'Dragi budući studenti, sa ponosom najavljujemo da su otvorene prijave za upis u akademsku 2025/2026 godinu! Proces prijave je potpuno digitalizovan i možete aplicirati online kroz naš student portal. Nudimo 6 akreditovanih studijskih programa sa mogućnošću stipendija za najuspješnije kandidate. Prijave se primaju do 31. avgusta, a upis počinje 1. septembra. Za dodatne informacije kontaktirajte našu studentsku službu.',
            category: 'announcements',
            date: '2025-11-15',
            author: 'Studentska služba',
            image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1920',
            readTime: '3 min',
            views: 2340,
            likes: 156,
        },
        {
            id: '3',
            title: 'Naši studenti osvojili prvo mjesto na Hackathon-u u Zagrebu',
            excerpt:
                'Tim studenata IPI Akademije pobijedio je na regionalnom Hackathon-u razvivši inovativnu AI aplikaciju za zdravstvo.',
            content:
                'Tim od četiri studenta treće godine programa Informacione tehnologije osvojio je prvo mjesto na prestižnom Balkan Tech Hackathon-u u Zagrebu! Njihovo rješenje "MediAI" koristi umjetnu inteligenciju za rano otkrivanje bolesti na osnovu medicinskih snimaka. Tim je radio 48 sati non-stop i nadmašio preko 50 timova iz cijelog regiona. Nagrada uključuje €5000, mentorstvo od vodećih tech kompanija i mogućnost razvoja aplikacije uz podršku investitora. Čestitamo Amiru, Lani, Davidu i Emiru!',
            category: 'achievements',
            date: '2025-11-10',
            author: 'Prof. Ana Tomić',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920',
            readTime: '4 min',
            views: 1890,
            likes: 234,
        },
        {
            id: '4',
            title: 'Novi partnerski sporazum sa Microsoft-om',
            excerpt:
                'IPI Akademija potpisala je strateški partnerski sporazum sa Microsoft-om za akademsku saradnju i sertifikaciju studenata.',
            content:
                'Sa velikim zadovoljstvom objavljujemo partnerstvo sa Microsoft-om! Ovaj sporazum donosi brojne benefite našim studentima: besplatne Azure kredite, pristup Microsoft Learn platformi, mogućnost sticanja Microsoft certificata po povoljnijim cijenama, mentorstvo od Microsoft inženjera, i prioritet u aplikacijama za Microsoft praksu. Takođe, Microsoft će podržati naš AI lab sa najnovijom tehnologijom. Ovo partnerstvo dodatno jača naš položaj kao vodećoj IT instituciji u regionu.',
            category: 'partnerships',
            date: '2025-11-05',
            author: 'Dekan, Prof. Dr. Ismet Hodžić',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920',
            readTime: '6 min',
            views: 3120,
            likes: 287,
        },
        {
            id: '5',
            title: 'IT Job Fair 2025 - Upoznaj poslodavce!',
            excerpt:
                'Dana 5. decembra održava se godišnji IT Job Fair gdje ćete moći da upoznate preko 30 vodećih IT kompanija.',
            content:
                'Pozivamo sve studente da prisustvuju našem godišnjem IT Job Fair-u koji se održava 5. decembra u našim prostorijama! Očekujemo preko 30 IT kompanija iz Bosne i Hercegovine i regiona, uključujući Mistral, Lanaco, Infobip, Atlantbh, Symphony, i mnoge druge. Program uključuje: panel diskusije sa tech liderima, speed intervjue, networking sesije, prezentacije kompanija, i workshop-e. Moći ćete direktno aplicirati za praksu, stažiranje ili puno radno vrijeme. Registracija je obavezna kroz student portal.',
            category: 'events',
            date: '2025-11-01',
            author: 'Centar za karijeru',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1920',
            readTime: '4 min',
            views: 2560,
            likes: 198,
        },
        {
            id: '6',
            title: 'Otvorena moderna biblioteka sa IT study zonom',
            excerpt:
                'Renovirana biblioteka nudi novi prostor za učenje sa 100+ radnih mjesta, VR lab i gaming zonu za odmor.',
            content:
                "Nakon tri mjeseca renoviranja, otvaramo potpuno novu biblioteku sa modernim IT study prostorom! Nova biblioteka nudi: 100+ radnih mjesta sa PC računarima i punjačima, VR lab za eksperimentiranje, tihu study zonu, gaming zonu za odmor između časova, 3D printer dostupan studentima, i podcast studio. Biblioteka je otvorena 24/7 tokom semestra sa kontrolom pristupa putem student kartica. Dodatno, nabavili smo preko 500 novih knjiga iz IT oblasti i pretplate na Udemy, Pluralsight i O'Reilly platforme.",
            category: 'announcements',
            date: '2025-10-25',
            author: 'Biblioteka IPI',
            image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1920',
            readTime: '5 min',
            views: 1670,
            likes: 142,
        },
    ]

    const categories = [
        {
            id: 'all',
            label: 'Sve novosti',
            icon: <IconSchool />,
            count: newsItems.length,
        },
        {
            id: 'events',
            label: 'Događaji',
            icon: <IconCalendar />,
            count: newsItems.filter((n) => n.category === 'events').length,
        },
        {
            id: 'achievements',
            label: 'Uspjesi',
            icon: <IconTrophy />,
            count: newsItems.filter((n) => n.category === 'achievements')
                .length,
        },
        {
            id: 'announcements',
            label: 'Obavještenja',
            icon: <IconUsers />,
            count: newsItems.filter((n) => n.category === 'announcements')
                .length,
        },
        {
            id: 'partnerships',
            label: 'Partnerstva',
            icon: <IconBriefcase />,
            count: newsItems.filter((n) => n.category === 'partnerships')
                .length,
        },
    ]

    const filteredNews =
        selectedCategory === 'all'
            ? newsItems
            : newsItems.filter((n) => n.category === selectedCategory)

    const getCategoryColor = (category: string) => {
        const colors = {
            events: 'from-blue-600 to-cyan-500',
            achievements: 'from-purple-600 to-pink-500',
            announcements: 'from-orange-600 to-red-500',
            partnerships: 'from-green-600 to-teal-500',
        }
        return colors[category as keyof typeof colors]
    }

    const getCategoryLabel = (category: string) => {
        const labels = {
            events: 'Događaj',
            achievements: 'Uspjeh',
            announcements: 'Obavještenje',
            partnerships: 'Partnerstvo',
        }
        return labels[category as keyof typeof labels]
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
                            Pratite najnovije vijesti, događaje, uspjehe naših
                            studenata i partnerstva koje ostvarujemo sa vodećim
                            kompanijama.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category.icon}
                                {category.label}
                                <span className="text-xs opacity-75">
                                    ({category.count})
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredNews.map((news, index) => (
                                <motion.article
                                    key={news.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                                    onClick={() => setSelectedNews(news)}
                                >
                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(news.category)} opacity-60`}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
                                                {getCategoryLabel(
                                                    news.category
                                                )}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 flex items-center gap-3 text-white text-sm">
                                            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                                                <IconEye className="w-4 h-4" />
                                                {news.views}
                                            </span>
                                            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                                                <IconHeart className="w-4 h-4" />
                                                {news.likes}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                            <span className="flex items-center gap-1">
                                                <IconCalendar className="w-4 h-4" />
                                                {new Date(
                                                    news.date
                                                ).toLocaleDateString('bs-BA')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <IconClock className="w-4 h-4" />
                                                {news.readTime}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {news.title}
                                        </h3>

                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {news.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <IconUser className="w-4 h-4" />
                                                {news.author}
                                            </div>
                                            <span className="text-blue-600 font-semibold text-sm group-hover:text-purple-600 transition-colors">
                                                Pročitaj više →
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* News Detail Modal */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedNews(null)}
                    >
                        <motion.article
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-3xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Hero Image */}
                            <div className="relative h-96 overflow-hidden">
                                <img
                                    src={selectedNews.image}
                                    alt={selectedNews.title}
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(selectedNews.category)} opacity-70`}
                                />
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/30 transition-colors"
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

                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-4">
                                        {getCategoryLabel(
                                            selectedNews.category
                                        )}
                                    </span>
                                    <h2 className="text-4xl font-bold text-white mb-4">
                                        {selectedNews.title}
                                    </h2>
                                    <div className="flex items-center gap-6 text-white text-sm">
                                        <span className="flex items-center gap-2">
                                            <IconUser className="w-5 h-5" />
                                            {selectedNews.author}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <IconCalendar className="w-5 h-5" />
                                            {new Date(
                                                selectedNews.date
                                            ).toLocaleDateString('bs-BA')}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <IconClock className="w-5 h-5" />
                                            {selectedNews.readTime}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                {/* Stats */}
                                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                                    <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                                        <IconHeart className="w-5 h-5" />
                                        <span className="font-semibold">
                                            {selectedNews.likes}
                                        </span>
                                    </button>
                                    <span className="flex items-center gap-2 text-gray-600">
                                        <IconEye className="w-5 h-5" />
                                        <span className="font-semibold">
                                            {selectedNews.views}
                                        </span>
                                    </span>
                                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                                        <IconShare className="w-5 h-5" />
                                        <span className="font-semibold">
                                            Podijeli
                                        </span>
                                    </button>
                                </div>

                                {/* Article Content */}
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                        {selectedNews.content}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => setSelectedNews(null)}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                    >
                                        Zatvori
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default News
