import { FC, useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toastSuccess, toastError } from '../../lib/toast'
import {
    CiMail,
    CiPhone,
    CiLocationOn,
    CiFacebook,
    CiInstagram,
    CiLinkedin,
    CiYoutube,
} from 'react-icons/ci'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const Footer: FC = () => {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const socialLinks = [
        {
            icon: CiYoutube,
            href: 'https://www.youtube.com/@ipi-akademija',
            label: 'YouTube',
            color: 'hover:text-red-400',
        },
        {
            icon: CiFacebook,
            href: 'https://www.facebook.com/ipiakademija',
            label: 'Facebook',
            color: 'hover:text-blue-400',
        },
        {
            icon: CiLinkedin,
            href: 'https://www.linkedin.com/school/ipi-akademija',
            label: 'LinkedIn',
            color: 'hover:text-blue-300',
        },
        {
            icon: CiInstagram,
            href: 'https://www.instagram.com/ipiakademija',
            label: 'Instagram',
            color: 'hover:text-pink-400',
        },
    ]

    const quickLinks = [
        { text: 'O nama', href: '/about' },
        { text: 'Studijski programi', href: '/programs' },
        { text: 'Novosti', href: '/news' },
        { text: 'Kontakt', href: '/contact' },
        { text: 'Upis', href: '/login' },
        { text: 'Student portal', href: '/login' },
    ]

    const handleNewsletterSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!email || !email.includes('@')) {
            toastError('Unesite validnu email adresu')
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            toastSuccess('Uspješno ste se prijavili na newsletter!')
            setEmail('')
            setIsSubmitting(false)
        }, 1000)
    }

    const containerAnimation = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <footer
            className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white mb-0 pb-0 -mt-px overflow-hidden"
            style={{ margin: 0, padding: 0 }}
        >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />

            {/* Main content */}
            <div className="container mx-auto px-6 pt-4 pb-0 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Logo and Description */}
                    <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <img
                            src="/logo.png"
                            alt="IPI Akademija Logo"
                            className="h-16 w-auto filter brightness-110"
                        />
                        <p className="text-blue-100 leading-relaxed">
                            IPI Akademija je vodeća visokoškolska ustanova koja
                            pruža kvalitetno obrazovanje i priprema studente za
                            uspješnu karijeru u digitalnom dobu.
                        </p>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-white">
                            Brzi linkovi
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.href}
                                        className="text-blue-100 hover:text-white transition-all duration-300 
                                            hover:translate-x-1 inline-block"
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-white">
                            Kontakt
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 group">
                                <CiLocationOn
                                    className="text-2xl text-blue-300 group-hover:text-white 
                                    transition-colors duration-300 mt-1"
                                />
                                <span className="text-blue-100 group-hover:text-white transition-colors duration-300">
                                    Kulina bana br. 2,
                                    <br />
                                    75000 Tuzla, BiH
                                </span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <CiPhone
                                    className="text-2xl text-blue-300 group-hover:text-white 
                                    transition-colors duration-300"
                                />
                                <span className="text-blue-100 group-hover:text-white transition-colors duration-300">
                                    +387 35 258 454
                                </span>
                            </li>
                            <li className="flex items-center space-x-3 group">
                                <CiMail
                                    className="text-2xl text-blue-300 group-hover:text-white 
                                    transition-colors duration-300"
                                />
                                <a
                                    href="mailto:info@ipi-akademija.ba"
                                    className="text-blue-100 group-hover:text-white transition-colors duration-300"
                                >
                                    info@ipi-akademija.ba
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Newsletter Signup */}
                    <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-white">
                            Ostanite informisani
                        </h3>
                        <p className="text-blue-100">
                            Prijavite se na naš newsletter i budite u toku sa
                            najnovijim vijestima.
                        </p>
                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Vaša email adresa"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 rounded-lg bg-blue-800/50 border border-blue-700 
                                        text-white placeholder-blue-300 focus:outline-none focus:ring-2 
                                        focus:ring-blue-400 focus:border-transparent transition-all duration-300
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold
                                    hover:bg-blue-400 transform hover:-translate-y-0.5 transition-all duration-300
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? 'Prijava...' : 'Prijavi se'}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Social Links & Copyright */}
                <motion.div
                    variants={containerAnimation}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-8 pt-4 pb-0 border-t border-blue-700"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-blue-200 text-sm">
                            © {new Date().getFullYear()} IPI Akademija. Sva
                            prava zadržana.
                        </div>
                        <div className="flex space-x-6">
                            {socialLinks.map((social, index) => {
                                const Icon = social.icon
                                return (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className={cn(
                                            'text-blue-300 transition-all duration-300 transform hover:-translate-y-1',
                                            social.color
                                        )}
                                    >
                                        <Icon size={32} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative background elements */}
            <div
                className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full 
                opacity-10 transform translate-x-1/2 translate-y-1/4 blur-3xl"
            />
            <div
                className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full 
                opacity-10 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"
            />
        </footer>
    )
}

export default Footer
