import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose } from 'react-icons/io5'
import { useAuth } from '../../Context'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { navLinks } from './AnimationHeader'

// Header components
const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const nav = useNavigate()
    const location = useLocation()
    const { studentMail, logout } = useAuth()

    useEffect(() => {
        const debounce = (func: () => void, delay: number) => {
            let timeout: number
            return () => {
                clearTimeout(timeout)
                timeout = window.setTimeout(() => func(), delay)
            }
        }

        const handleScroll = debounce(() => {
            setScrolled(window.scrollY > 20)
        }, 100) // 100ms debounce

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const toggleMenu = () => setIsOpen(!isOpen)
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-lg'
                    : 'bg-blue-500'
            }`}
        >
            <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        className="flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/" className="flex items-center">
                            <img
                                className="h-12 w-auto"
                                src="/logo.png"
                                alt="IPI Akademija"
                            />
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:gap-x-8">
                        {navLinks.map((link) => (
                            <motion.div
                                key={link.to}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                            >
                                <Link
                                    to={link.to}
                                    className={`text-sm font-semibold transition-colors duration-300 ${
                                        location.pathname === link.to
                                            ? scrolled
                                                ? 'text-blue-600'
                                                : 'text-white'
                                            : scrolled
                                              ? 'text-gray-600 hover:text-blue-600'
                                              : 'text-white/80 hover:text-white'
                                    }`}
                                >
                                    {link.text}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="hidden lg:flex items-center gap-4">
                        {studentMail ? (
                            <div className="relative">
                                <motion.button
                                    onClick={toggleMenu}
                                    className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
                                        scrolled
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {studentMail}
                                </motion.button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden"
                                        >
                                            <div className="py-1">
                                                <Link
                                                    to="/dashboard"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300"
                                                >
                                                    Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => logout(nav)}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                                                >
                                                    Odjava
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.button
                                onClick={() => nav('/login')}
                                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                                    scrolled
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-white text-blue-500 hover:bg-blue-50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Login
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="lg:hidden"
                        onClick={toggleSidebar}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <GiHamburgerMenu
                            className={`w-6 h-6 ${scrolled ? 'text-blue-500' : 'text-white'}`}
                        />
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={toggleSidebar}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl"
                        >
                            <div className="px-6 py-4 flex items-center justify-between">
                                <img
                                    className="h-8 w-auto"
                                    src="/logo.png"
                                    alt="IPI Akademija"
                                />
                                <motion.button
                                    onClick={toggleSidebar}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <IoClose className="w-6 h-6 text-gray-500" />
                                </motion.button>
                            </div>

                            <div className="px-6 py-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        onClick={toggleSidebar}
                                        className="block py-3 text-base font-medium text-gray-900 hover:text-blue-600 transition-colors duration-300"
                                    >
                                        {link.text}
                                    </Link>
                                ))}

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    {studentMail ? (
                                        <>
                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                Prijavljeni kao:
                                                <div className="font-medium text-gray-900">
                                                    {studentMail}
                                                </div>
                                            </div>
                                            <Link
                                                to="/dashboard"
                                                onClick={toggleSidebar}
                                                className="block w-full px-4 py-2 mt-4 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout(nav)
                                                    toggleSidebar()
                                                }}
                                                className="block w-full px-4 py-2 mt-2 text-center text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300"
                                            >
                                                Odjava
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                nav('/login')
                                                toggleSidebar()
                                            }}
                                            className="block w-full px-4 py-2 text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                        >
                                            Login
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    )
}

export default Header
