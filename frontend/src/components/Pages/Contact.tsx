import { FC, useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
    IconMail,
    IconPhone,
    IconMapPin,
    IconClock,
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandYoutube,
    IconSend,
    IconUser,
    IconMessageCircle,
} from '@tabler/icons-react'
import { toastSuccess, toastError } from '../../lib/toast'
import Chat from '../Chat'

const Contact: FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.message) {
            toastError('Molimo popunite sva obavezna polja')
            return
        }

        if (!formData.email.includes('@')) {
            toastError('Unesite validnu email adresu')
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            toastSuccess(
                'Poruka uspješno poslata! Odgovorićemo vam u najkraćem roku.'
            )
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            })
            setIsSubmitting(false)
        }, 1500)
    }

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const contactInfo = [
        {
            icon: <IconMapPin className="w-6 h-6" />,
            title: 'Adresa',
            info: 'Kulina bana br. 2',
            subInfo: '75000 Tuzla, BiH',
            color: 'from-blue-600 to-cyan-500',
        },
        {
            icon: <IconPhone className="w-6 h-6" />,
            title: 'Telefon',
            info: '+387 35 258 454',
            subInfo: 'Pon-Pet: 08:00 - 16:00h',
            color: 'from-purple-600 to-pink-500',
        },
        {
            icon: <IconMail className="w-6 h-6" />,
            title: 'Email',
            info: 'info@ipi-akademija.ba',
            subInfo: 'studentska@ipi-akademija.ba',
            color: 'from-orange-600 to-red-500',
        },
        {
            icon: <IconClock className="w-6 h-6" />,
            title: 'Radno vrijeme',
            info: 'Ponedjeljak - Petak',
            subInfo: '08:00 - 16:00h',
            color: 'from-green-600 to-teal-500',
        },
    ]

    const departments = [
        {
            name: 'Studentska služba',
            email: 'studentska@ipi-akademija.ba',
            phone: '+387 35 258 454',
            description:
                'Za sve upite vezane za upis, dokumente i student servis',
        },
        {
            name: 'Dekanat',
            email: 'dekanat@ipi-akademija.ba',
            phone: '+387 35 258 455',
            description: 'Za akademska pitanja i saradnju',
        },
        {
            name: 'IT podrška',
            email: 'it@ipi-akademija.ba',
            phone: '+387 35 258 456',
            description: 'Tehnička podrška za student portal i sisteme',
        },
        {
            name: 'Marketing',
            email: 'marketing@ipi-akademija.ba',
            phone: '+387 35 258 457',
            description: 'Za saradnju, promociju i medijske upite',
        },
    ]

    const socialLinks = [
        {
            icon: <IconBrandFacebook />,
            url: 'https://www.facebook.com/ipiakademija',
            label: 'Facebook',
            color: 'hover:text-blue-600',
        },
        {
            icon: <IconBrandInstagram />,
            url: 'https://www.instagram.com/ipiakademija',
            label: 'Instagram',
            color: 'hover:text-pink-600',
        },
        {
            icon: <IconBrandLinkedin />,
            url: 'https://www.linkedin.com/school/ipi-akademija',
            label: 'LinkedIn',
            color: 'hover:text-blue-700',
        },
        {
            icon: <IconBrandYoutube />,
            url: 'https://www.youtube.com/@ipi-akademija',
            label: 'YouTube',
            color: 'hover:text-red-600',
        },
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
                            📞 Kontaktirajte nas
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Javite nam se{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                u bilo kojem trenutku
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8">
                            Naš tim je tu da odgovori na sva vaša pitanja.
                            Kontaktirajte nas putem forme, telefona, email-a ili
                            dođite u posjetu!
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 -mt-10">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                <div
                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-700 font-semibold">
                                    {item.info}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {item.subInfo}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-white rounded-3xl p-8 shadow-xl">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Pošaljite nam poruku
                                </h2>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Ime i prezime{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <IconUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                placeholder="Vaše ime i prezime"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                    placeholder="vas@email.com"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Telefon
                                            </label>
                                            <div className="relative">
                                                <IconPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                                    placeholder="+387 ..."
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Predmet
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">
                                                Izaberite predmet
                                            </option>
                                            <option value="upis">
                                                Upis i prijava
                                            </option>
                                            <option value="programi">
                                                Studijski programi
                                            </option>
                                            <option value="dokument">
                                                Dokumenti i certifikati
                                            </option>
                                            <option value="tehnicka">
                                                Tehnička podrška
                                            </option>
                                            <option value="saradnja">
                                                Saradnja i partnerstvo
                                            </option>
                                            <option value="ostalo">
                                                Ostalo
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Poruka{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <IconMessageCircle className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                                                placeholder="Unesite vašu poruku..."
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                                Slanje...
                                            </>
                                        ) : (
                                            <>
                                                <IconSend className="w-5 h-5" />
                                                Pošalji poruku
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            {/* Departments */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    Odjeljenja
                                </h3>
                                <div className="space-y-4">
                                    {departments.map((dept, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                                        >
                                            <h4 className="font-bold text-gray-900 mb-1">
                                                {dept.name}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {dept.description}
                                            </p>
                                            <div className="flex flex-col gap-1 text-sm">
                                                <a
                                                    href={`mailto:${dept.email}`}
                                                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                >
                                                    <IconMail className="w-4 h-4" />
                                                    {dept.email}
                                                </a>
                                                <a
                                                    href={`tel:${dept.phone}`}
                                                    className="text-gray-600 hover:text-gray-700 flex items-center gap-1"
                                                >
                                                    <IconPhone className="w-4 h-4" />
                                                    {dept.phone}
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">
                                    Pratite nas na društvenim mrežama
                                </h3>
                                <p className="text-blue-100 mb-6">
                                    Budite u toku sa najnovijim vijestima,
                                    događajima i uspjesima naših studenata.
                                </p>
                                <div className="flex gap-4">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, y: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                                            aria-label={social.label}
                                        >
                                            <div className="text-white">
                                                {social.icon}
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Map */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2873.897611037641!2d18.672911476648693!3d44.53730197107558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475e86dbaf677e5f%3A0x5f5e85e2e8e8e8e8!2sKulina%20bana%202%2C%20Tuzla%2C%20Bosnia%20and%20Herzegovina!5e0!3m2!1sen!2sba!4v1732639200000!5m2!1sen!2sba"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="IPI Akademija Location"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

export default Contact
