import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'
import { motion } from 'framer-motion'
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineMail,
    AiOutlineLock,
    AiOutlineArrowRight,
} from 'react-icons/ai'

const Login: FC = () => {
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    // Navigation
    const nav = useNavigate()

    // Context
    const { setStudentName, login, setUserType } = useAuth()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setMessage('')

        // Dev shortcuts for quick testing
        if (email === 'admin' && password === 'admin') {
            // Admin shortcut
            setStudentName('System Admin')
            setUserType('ADMIN')
            login('admin@ipi.com', 'System Admin', 'ADMIN')
            setMessage('Admin login successful! Redirecting...')
            setTimeout(() => nav('/admin'), 500)
            setLoading(false)
            return
        }

        if (email === 'profesor' && password === 'profesor') {
            // Professor shortcut
            setStudentName('Test Profesor')
            setUserType('PROFESSOR')
            login('profesor@ipi.com', 'Test Profesor', 'PROFESSOR')
            setMessage('Professor login successful! Redirecting...')
            setTimeout(() => nav('/profesor'), 500)
            setLoading(false)
            return
        }

        // Real API login
        try {
            const response = await fetch(`${BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()
            console.log(data)

            if (data.message !== 'Success') {
                throw new Error('Login failed: ' + data.message)
            }

            if (!data.userEmail || !data.StudentName || !data.TipUsera) {
                throw new Error('Invalid response data')
            }

            // Set user data in Context first
            setStudentName(data.StudentName)
            login(data.userEmail, data.StudentName, data.TipUsera)

            console.log('Login response:', data)
            console.log('User email:', data.userEmail)
            console.log('User type:', data.TipUsera)

            setMessage('Login successful! Redirecting...')

            // Wait briefly for Context state to update before navigation
            setTimeout(() => {
                switch (data.TipUsera) {
                    case 'ADMIN':
                        nav('/admin')
                        break
                    case 'PROFESSOR':
                        nav('/profesor')
                        break
                    case 'STUDENT':
                    default:
                        nav('/dashboard')
                        break
                }
            }, 100) // Short delay to let Context update
        } catch (error) {
            console.error('Došlo je do greške:', error)
            setMessage(
                'Login failed. Please check your credentials and try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-sm"
            >
                {/* Login Card */}
                <div className="bg-blue-900/90 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-700/50 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-center mb-6"
                    >
                        <div className="mx-auto flex justify-center mb-4">
                            <img
                                className="h-40 w-40 object-contain"
                                src="/image-17.png"
                                alt="IPI Akademija"
                            />
                        </div>

                        <p className="text-gray-300 mt-1 text-sm">
                            Prijavite se na svoj nalog
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="space-y-4"
                        onSubmit={handleSubmit}
                    >
                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-blue-100 flex items-center gap-2">
                                <AiOutlineMail className="h-3 w-3 text-blue-300" />
                                Email adresa
                            </label>
                            <div className="relative">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-3 py-3 bg-blue-800/30 border border-blue-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 placeholder-blue-200 backdrop-blur-sm text-sm text-white"
                                    placeholder="vaš@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-blue-100 flex items-center gap-2">
                                <AiOutlineLock className="h-3 w-3 text-blue-300" />
                                Šifra
                            </label>
                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-3 py-3 pr-10 bg-blue-800/30 border border-blue-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 placeholder-blue-200 backdrop-blur-sm text-sm text-white"
                                    placeholder="Unesite vašu šifru"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible className="h-4 w-4" />
                                    ) : (
                                        <AiOutlineEye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <a
                                href="#"
                                className="text-xs text-blue-300 hover:text-blue-100 font-medium transition-colors duration-200"
                            >
                                Zaboravili ste šifru?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Prijavljivanje...
                                </>
                            ) : (
                                <>
                                    Prijavite se
                                    <AiOutlineArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="mt-6 text-center"
                    >
                        <p className="text-blue-100 text-xs">
                            Nemate nalog?{' '}
                            <a
                                href="#"
                                className="text-blue-300 hover:text-blue-100 font-semibold transition-colors duration-200"
                            >
                                Kontaktirajte studentsku službu
                            </a>
                        </p>
                    </motion.div>

                    {/* Message */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 p-3 rounded-xl text-center text-xs font-medium ${
                                message.includes('failed') ||
                                message.includes('Login failed')
                                    ? 'bg-red-50 text-red-600 border border-red-200'
                                    : 'bg-green-50 text-green-600 border border-green-200'
                            }`}
                        >
                            {message}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default Login
