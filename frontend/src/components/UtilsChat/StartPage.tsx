import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
const Lottie = lazy(() => import('lottie-react'))
import animationRobot from '../../assets/AnimationChat.json'

interface StartPageProps {
    onContinue: () => void
}

function StartPage({ onContinue }: StartPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col justify-between px-6 pt-6 pb-5"
        >
            <div className="space-y-4">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-center"
                >
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                        style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.18)' }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" style={{ boxShadow: '0 0 5px rgba(37,99,235,0.6)' }} />
                        <span className="text-xs text-blue-600 font-medium tracking-wide">AI Asistent</span>
                    </div>
                    <h1 className="text-2xl font-syne font-bold text-blue-900 leading-tight">
                        Tvoj IPI asistent
                    </h1>
                    <div
                        className="h-px w-20 mx-auto mt-3"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)' }}
                    />
                </motion.div>

                {/* Description card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="rounded-2xl px-5 py-4"
                    style={{ background: 'rgba(239,246,255,0.8)', border: '1px solid rgba(59,130,246,0.12)' }}
                >
                    <p className="text-center text-blue-800/75 leading-relaxed text-sm">
                        Postavi mi bilo koje pitanje o IPI Akademiji — od cijena i smjerova
                        do lokacije i upisa. Tu sam da pomognem.
                    </p>
                </motion.div>

                {/* Lottie robot */}
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="relative flex justify-center items-center py-2"
                >
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="w-28 h-28 rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }}
                        />
                    </div>
                    <Suspense
                        fallback={
                            <div className="flex justify-center items-center h-36">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500" />
                            </div>
                        }
                    >
                        <Lottie animationData={animationRobot} className="w-[55%] relative z-10" />
                    </Suspense>
                </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <motion.button
                    onClick={onContinue}
                    className="group w-full relative overflow-hidden text-white text-sm font-semibold py-3.5 rounded-2xl transition-all duration-300"
                    style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        boxShadow: '0 8px 24px -6px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-syne">
                        Započni razgovor
                        <svg
                            className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default StartPage
