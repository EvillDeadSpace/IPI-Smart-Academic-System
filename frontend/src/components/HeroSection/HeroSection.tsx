import type { FC } from 'react'
import AnimatedContent from '../ui/animation-content'
import { motion } from 'framer-motion'

const HeroSection: FC = () => {
    return (
        <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
        >
            <section className="relative min-h-screen w-full bg-gradient-to-b from-blue-50 to-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-dot-thick-neutral-100 opacity-30" />

                {/* Main Content Container */}
                <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 space-y-6"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Dobrodošli na{' '}
                                <span className="text-blue-600">
                                    IPI Akademiju
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                Visoka škola za savremeno poslovanje,
                                informacione tehnologije i tržišne komunikacije
                                "Internacionalna poslovno-informaciona
                                akademija" Tuzla osnovana je 2014. godine.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    className="px-8 py-3 bg-blue-600 text-white rounded-full 
                                    font-semibold hover:bg-blue-700 transition-colors duration-300
                                    shadow-lg hover:shadow-xl"
                                >
                                    Upiši se danas
                                </button>
                                <button
                                    className="px-8 py-3 border-2 border-blue-600 text-blue-600 
                                    rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300"
                                >
                                    Saznaj više
                                </button>
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-3 gap-4 pt-8">
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold text-blue-600">
                                        2014
                                    </h3>
                                    <p className="text-gray-600">Osnovano</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold text-blue-600">
                                        1000+
                                    </h3>
                                    <p className="text-gray-600">Studenata</p>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold text-blue-600">
                                        95%
                                    </h3>
                                    <p className="text-gray-600">Zaposlenih</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content - Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="/ipizgrada.jpg"
                                    alt="IPI Akademija"
                                    className="w-full h-auto object-cover rounded-2xl 
                                        transform hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
                            </div>

                            {/* Floating Accent Elements */}
                            <div
                                className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full 
                                opacity-50 blur-xl"
                            />
                            <div
                                className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-300 rounded-full 
                                opacity-30 blur-2xl"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div
                    className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t 
                    from-white to-transparent"
                />
            </section>
        </AnimatedContent>
    )
}

export default HeroSection
