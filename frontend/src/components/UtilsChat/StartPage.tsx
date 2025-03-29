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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex flex-col justify-between p-6"
        >
            <div className="space-y-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center space-y-2"
                >
                    <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-sm">
                        Tvoj IPI asistent
                    </h1>
                    <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500/40 to-blue-600/40 rounded-full" />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-blue-500/5 border border-blue-100/50"
                >
                    <p className="text-center text-gray-700 leading-relaxed font-medium">
                        Koristeći ovaj chat, možeš pitati bilo koje pitanje koje
                        želiš, i ja ću ti brzo naći odgovor.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="relative flex justify-center items-center p-6"
                >
                    <Suspense
                        fallback={
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-500" />
                            </div>
                        }
                    >
                        <Lottie
                            animationData={animationRobot}
                            className="w-2/3 drop-shadow-xl"
                        />
                    </Suspense>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 mb-4"
            >
                <motion.button
                    onClick={onContinue}
                    className="   group w-full relative overflow-hidden   bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700   text-white text-lg font-semibold   py-3  rounded-2xl   shadow-lg shadow-blue-500/30   transition-all duration-300 ease-out   hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5   active:shadow-md active:translate-y-0.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Nastavi
                        <svg
                            className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default StartPage
