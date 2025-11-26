import { FC, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    IconBook,
    IconCertificate,
    IconBriefcase,
    IconUsers,
    IconClock,
    IconTrophy,
    IconChevronRight,
    IconCode,
    IconDatabase,
    IconBrandReact,
} from '@tabler/icons-react'
import Chat from '../Chat'

interface Program {
    id: string
    title: string
    duration: string
    ects: number
    degree: string
    category: 'it' | 'business' | 'marketing'
    description: string
    features: string[]
    careers: string[]
    subjects: string[]
    icon: JSX.Element
    gradient: string
    image: string
}

const Programs: FC = () => {
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

    const programs: Program[] = [
        {
            id: 'it',
            title: 'Informacione tehnologije',
            duration: '3 godine',
            ects: 180,
            degree: 'Stručni prvostepeni studij',
            category: 'it',
            description:
                'Savremeni studijski program koji vas priprema za uspješnu karijeru u IT industriji. Fokus na praktičnom radu, razvoju softvera i najnovijim tehnologijama.',
            features: [
                'Praktična nastava 70%',
                'Realni projekti',
                'Mentorstvo stručnjaka',
                'Stage i praksa',
                'Sertifikati iz industrije',
                'Portfolio projekata',
            ],
            careers: [
                'Full-stack Developer',
                'Front-end Developer',
                'Back-end Developer',
                'Mobile Developer',
                'DevOps Engineer',
                'Cloud Architect',
            ],
            subjects: [
                'Programiranje (Python, Java, JavaScript)',
                'Web Development (React, Node.js)',
                'Baze podataka (SQL, NoSQL)',
                'Cloud Computing (AWS, Azure)',
                'Mobile Development (React Native)',
                'DevOps i CI/CD',
                'Cyber Security',
                'Algoritmi i strukture podataka',
            ],
            icon: <IconCode className="w-8 h-8" />,
            gradient: 'from-blue-600 to-cyan-500',
            image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1920',
        },
        {
            id: 'marketing',
            title: 'Tržišne komunikacije',
            duration: '3 godine',
            ects: 180,
            degree: 'Stručni prvostepeni studij',
            category: 'marketing',
            description:
                'Program fokusiran na digitalni marketing, PR i kreativnu komunikaciju. Učite kako da kreirate uspješne marketinške kampanje i gradite brandove.',
            features: [
                'Digitalni marketing',
                'Social Media strategije',
                'Content kreacija',
                'PR i odnosi sa javnošću',
                'Kreativno pisanje',
                'Realni kampanje',
            ],
            careers: [
                'Digital Marketing Manager',
                'Social Media Manager',
                'Content Strategist',
                'PR Specialist',
                'Brand Manager',
                'Marketing Analyst',
            ],
            subjects: [
                'Digitalni marketing',
                'Social Media Marketing',
                'Content Marketing',
                'SEO i SEM',
                'Google Analytics',
                'Grafički dizajn',
                'Video produkcija',
                'Kreativno pisanje',
            ],
            icon: <IconUsers className="w-8 h-8" />,
            gradient: 'from-purple-600 to-pink-500',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920',
        },
        {
            id: 'business',
            title: 'Savremeno poslovanje',
            duration: '3 godine',
            ects: 180,
            degree: 'Stručni prvostepeni studij',
            category: 'business',
            description:
                'Sveobuhvatan program koji kombinuje poslovne veštine sa modernim pristupima upravljanja. Spremite se za liderske pozicije u kompanijama.',
            features: [
                'Poslovno upravljanje',
                'Finansije i analitika',
                'Projektni menadžment',
                'Preduzetništvo',
                'Strateško planiranje',
                'Leadership razvoj',
            ],
            careers: [
                'Business Manager',
                'Project Manager',
                'Business Analyst',
                'Entrepreneur',
                'Operations Manager',
                'Consultant',
            ],
            subjects: [
                'Osnove poslovanja',
                'Finansijski menadžment',
                'Marketing menadžment',
                'Upravljanje projektima',
                'Preduzetništvo',
                'Strateški menadžment',
                'Business Analytics',
                'Organizaciono ponašanje',
            ],
            icon: <IconBriefcase className="w-8 h-8" />,
            gradient: 'from-orange-600 to-red-500',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920',
        },
        {
            id: 'computer-science',
            title: 'Informatika i računarstvo',
            duration: '4 godine',
            ects: 240,
            degree: 'Akademski prvostepeni studij',
            category: 'it',
            description:
                'Napredni program sa dubokim razumevanjem računarskih nauka. Kombinacija teorije i prakse sa fokusom na istraživanje i razvoj.',
            features: [
                'Napredni algoritmi',
                'AI i Machine Learning',
                'Big Data Analytics',
                'Distributed Systems',
                'Research projekti',
                'Academic excellence',
            ],
            careers: [
                'Software Architect',
                'Data Scientist',
                'AI Engineer',
                'Research Scientist',
                'System Architect',
                'Technical Lead',
            ],
            subjects: [
                'Napredni algoritmi',
                'Veštačka inteligencija',
                'Machine Learning',
                'Big Data',
                'Distribuirani sistemi',
                'Kompajleri',
                'Računarska grafika',
                'Teorija informacija',
            ],
            icon: <IconDatabase className="w-8 h-8" />,
            gradient: 'from-indigo-600 to-blue-500',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1920',
        },
        {
            id: 'finance',
            title: 'Računovodstvo i finansije',
            duration: '4 godine',
            ects: 240,
            degree: 'Akademski prvostepeni studij',
            category: 'business',
            description:
                'Stručni program za finansije, računovodstvo i reviziju. Pripremamo vas za karijeru u finansijskom sektoru sa svim potrebnim certifikatima.',
            features: [
                'Finansijska analiza',
                'Revizija i kontrola',
                'Poreski sistem',
                'IFRS standardi',
                'Finansijsko izveštavanje',
                'Profesionalni certifikati',
            ],
            careers: [
                'Financial Analyst',
                'Accountant',
                'Auditor',
                'Tax Consultant',
                'Finance Manager',
                'Investment Analyst',
            ],
            subjects: [
                'Finansijsko računovodstvo',
                'Upravljačko računovodstvo',
                'Revizija',
                'Porezi',
                'IFRS',
                'Finansijska analiza',
                'Finansijsko tržište',
                'Korporativne finansije',
            ],
            icon: <IconTrophy className="w-8 h-8" />,
            gradient: 'from-green-600 to-teal-500',
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1920',
        },
        {
            id: 'it-management',
            title: 'Informatički menadžment',
            duration: '3 godine',
            ects: 180,
            degree: 'Stručni prvostepeni studij',
            category: 'it',
            description:
                'Kombinacija IT veština i poslovnog menadžmenta. Idealan za one koji žele da vode IT projekte i timove.',
            features: [
                'IT Project Management',
                'Agile & Scrum',
                'IT Business Analysis',
                'Team Leadership',
                'IT Strategy',
                'Digital Transformation',
            ],
            careers: [
                'IT Project Manager',
                'Product Manager',
                'Scrum Master',
                'IT Consultant',
                'CTO',
                'IT Business Analyst',
            ],
            subjects: [
                'IT Project Management',
                'Agile metodologije',
                'Business Intelligence',
                'IT Strategija',
                'Change Management',
                'IT Governance',
                'Digital transformation',
                'Product Management',
            ],
            icon: <IconBrandReact className="w-8 h-8" />,
            gradient: 'from-violet-600 to-purple-500',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920',
        },
    ]

    const categories = [
        { id: 'all', label: 'Svi programi', count: programs.length },
        {
            id: 'it',
            label: 'IT & Tehnologija',
            count: programs.filter((p) => p.category === 'it').length,
        },
        {
            id: 'business',
            label: 'Poslovanje',
            count: programs.filter((p) => p.category === 'business').length,
        },
        {
            id: 'marketing',
            label: 'Marketing',
            count: programs.filter((p) => p.category === 'marketing').length,
        },
    ]

    const filteredPrograms =
        selectedCategory === 'all'
            ? programs
            : programs.filter((p) => p.category === selectedCategory)

    const stats = [
        {
            icon: <IconUsers />,
            value: '2000+',
            label: 'Diplomiranih studenata',
        },
        { icon: <IconBriefcase />, value: '95%', label: 'Stopa zaposlenja' },
        { icon: <IconTrophy />, value: '50+', label: 'Partnera iz industrije' },
        { icon: <IconClock />, value: '15+', label: 'Godina iskustva' },
    ]

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
                {/* Background Pattern */}
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
                            Studijski programi 2024/2025
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Pronađite svoj put do{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                uspješne karijere
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8">
                            Akreditovani studijski programi prilagođeni
                            potrebama modernog tržišta rada. Praktična nastava,
                            stručni profesori i izvrsne mogućnosti zaposlenja.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Upiši se danas
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    document
                                        .getElementById('programs')
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }
                                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300"
                            >
                                Pogledaj programe
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.6 + index * 0.1,
                                    type: 'spring',
                                }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                            >
                                <div className="text-blue-600 flex justify-center mb-3">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section id="programs" className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <motion.button
                                key={category.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category.label}
                                <span className="ml-2 text-sm opacity-75">
                                    ({category.count})
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
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
                            {filteredPrograms.map((program, index) => (
                                <motion.div
                                    key={program.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                                    onClick={() => setSelectedProgram(program)}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={program.image}
                                            alt={program.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-80`}
                                        />
                                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-3 text-white">
                                            {program.icon}
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
                                                {program.degree}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {program.title}
                                        </h3>

                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <IconClock className="w-4 h-4" />
                                                {program.duration}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <IconCertificate className="w-4 h-4" />
                                                {program.ects} ECTS
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {program.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                                                Saznaj više
                                            </span>
                                            <IconChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            Spremni ste da započnete svoju akademsku avanturu?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Prijavite se danas i postanite dio naše zajednice
                            uspješnih studenata!
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Upiši se odmah
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/about')}
                                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
                            >
                                Saznaj više o nama
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Program Details Modal */}
            <AnimatePresence>
                {selectedProgram && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedProgram(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-3xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={selectedProgram.image}
                                    alt={selectedProgram.title}
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${selectedProgram.gradient} opacity-90`}
                                />
                                <button
                                    onClick={() => setSelectedProgram(null)}
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
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-white/20 backdrop-blur-md rounded-full p-3 text-white">
                                            {selectedProgram.icon}
                                        </div>
                                        <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
                                            {selectedProgram.degree}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-bold text-white">
                                        {selectedProgram.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8">
                                {/* Info Bar */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                                            <IconClock className="w-5 h-5" />
                                            <span className="font-semibold">
                                                Trajanje
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {selectedProgram.duration}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                                            <IconCertificate className="w-5 h-5" />
                                            <span className="font-semibold">
                                                ECTS bodovi
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {selectedProgram.ects} ECTS
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        O programu
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {selectedProgram.description}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Šta ćete naučiti
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {selectedProgram.features.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                                    <span className="text-gray-700">
                                                        {feature}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Subjects */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Ključni predmeti
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {selectedProgram.subjects.map(
                                            (subject, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                                                >
                                                    <IconBook className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 text-sm">
                                                        {subject}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Careers */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Mogućnosti karijere
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedProgram.careers.map(
                                            (career, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 rounded-full text-sm font-medium"
                                                >
                                                    {career}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            setSelectedProgram(null)
                                            navigate('/login')
                                        }}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                    >
                                        Upiši se sada
                                    </button>
                                    <button
                                        onClick={() => setSelectedProgram(null)}
                                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
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

export default Programs
