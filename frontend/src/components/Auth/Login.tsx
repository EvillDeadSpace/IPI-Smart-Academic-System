import { motion } from 'framer-motion'
import { FC, useState } from 'react'
import {
    AiOutlineArrowRight,
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineLock,
    AiOutlineMail,
} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'
import { toastError, toastInfo, toastSuccess } from '../../lib/toast'

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

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault()
        toastInfo(
            'Za resetovanje šifre kontaktirajte studentsku službu na info@ipi-akademija.ba'
        )
    }

    const handleContactService = (e: React.MouseEvent) => {
        e.preventDefault()
        toastInfo(
            'Kontaktirajte studentsku službu: info@ipi-akademija.ba ili +387 35 258 454'
        )
    }

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
            toastSuccess('Admin login successful! Redirecting...')
            return
        }

        if (email === 'profesor' && password === 'profesor') {
            // Professor shortcut
            setStudentName('Test Profesor')
            setUserType('PROFESSOR')
            login('profesor@ipi.com', 'Test Profesor', 'PROFESSOR')
            setMessage('Professor login successful! Redirecting...')
            toastSuccess('Professor login successful! Redirecting...')
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

            // If response is not OK show single toast and abort
            if (!response.ok) {
                const errText = await response.text().catch(() => null)
                toastError(errText || `Network error: ${response.status}`)
                setLoading(false)
                return
            }

            const data = await response.json()

            if (data.message !== 'Success') {
                toastError('Login failed: ' + (data.message || 'Unknown'))
                setLoading(false)
                return
            }

            if (!data.userEmail || !data.StudentName || !data.TipUsera) {
                toastError('Incomplete data received from server.')
                setLoading(false)
                return
            }

            // Set user data in Context first
            setStudentName(data.StudentName)
            login(data.userEmail, data.StudentName, data.TipUsera)

            // If professor, fetch and store professor ID
            if (data.TipUsera === 'PROFESSOR') {
                try {
                    const profResponse = await fetch(
                        `${BACKEND_URL}/api/professors/email/${data.userEmail}`
                    )
                    if (profResponse.ok) {
                        const profData = await profResponse.json()
                        const profId = profData.data?.id || profData.id
                        if (profId) {
                            localStorage.setItem(
                                'professorId',
                                profId.toString()
                            )
                            console.log('Professor ID saved:', profId)
                        }
                    }
                } catch (err) {
                    console.error('Failed to fetch professor ID:', err)
                }
            }

            // Show success toast and navigate
            toastSuccess('Prijava uspješna — preusmjeravam...')
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
        } catch (err) {
            // Show a single friendly toast on unexpected errors
            const msg =
                err instanceof Error ? err.message : 'Došlo je do greške'
            toastError(msg)
            setMessage(
                'Login failed. Please check your credentials and try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
            {/* Subtle grid pattern on background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.1),transparent)]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-sm"
            >
                {/* Login Card — clean white */}
                <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/40 p-7">
                    {/* Header */}
                    <div className="w-full text-center mb-6">
                        <img
                            src="/image-17.png"
                            alt="IPI Akademija"
                            className="h-36 w-36 object-contain inline-block"
                            style={{ transform: 'translateX(35%)' }}
                        />
                        <p className="text-gray-500 text-sm mt-3">
                            Prijavite se na svoj nalog
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                <AiOutlineMail className="h-3.5 w-3.5 text-blue-500" />
                                Email adresa
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    transition-all duration-200 text-sm text-gray-900 placeholder-gray-400"
                                placeholder="vaš@email.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                <AiOutlineLock className="h-3.5 w-3.5 text-blue-500" />
                                Šifra
                            </label>
                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-3.5 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        transition-all duration-200 text-sm text-gray-900 placeholder-gray-400"
                                    placeholder="Unesite vašu šifru"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
                                onClick={handleForgotPassword}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
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
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl
                                font-semibold text-sm shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300
                                transition-all duration-300 flex items-center justify-center gap-2
                                disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                    Prijavljivanje...
                                </>
                            ) : (
                                <>
                                    Prijavite se
                                    <AiOutlineArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-5 text-center">
                        <p className="text-gray-500 text-xs">
                            Nemate nalog?{' '}
                            <a
                                href="#"
                                onClick={handleContactService}
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                            >
                                Kontaktirajte studentsku službu
                            </a>
                        </p>
                    </div>

                    {/* Message */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 p-3 rounded-xl text-center text-xs font-medium ${
                                message.includes('failed') || message.includes('Login failed')
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
