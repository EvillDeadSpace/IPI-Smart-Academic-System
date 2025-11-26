import type { FC } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    IconBuildingSkyscraper,
    IconCertificate,
    IconUsers,
} from '@tabler/icons-react'

const SectionComponent: FC = () => {
    const benefits = [
        {
            icon: <IconCertificate className="w-8 h-8" />,
            title: 'Akreditovani programi',
            description:
                'Svi naši studijski programi su akreditovani i priznati od strane relevantnih obrazovnih institucija',
        },
        {
            icon: <IconUsers className="w-8 h-8" />,
            title: 'Stručni kadar',
            description:
                'Nastavu izvode vrhunski stručnjaci sa praktičnim iskustvom u svojim oblastima',
        },
        {
            icon: <IconBuildingSkyscraper className="w-8 h-8" />,
            title: 'Saradnja sa privredom',
            description:
                'Aktivna saradnja sa vodećim kompanijama omogućava studentima praktično iskustvo',
        },
    ]

    return (
        <section className="relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-blue-600">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-800/30 to-transparent" />
            </div>

            <div className="relative container mx-auto px-4 py-24">
                {/* Main Content */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            Započni svoju akademsku karijeru
                        </h2>
                        <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8">
                            IPI Akademija nudi moderne studijske programe
                            prilagođene potrebama tržišta rada. Pridružite nam
                            se i izgradite uspješnu karijeru.
                        </p>
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 
                                    transition-all duration-300"
                            >
                                <div className="text-white mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-blue-100">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="space-y-6"
                    >
                        <p className="text-xl text-blue-100">
                            Spremni ste za sljedeći korak u vašem obrazovanju?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-6 py-3 
                                    bg-white text-blue-600 font-semibold rounded-full 
                                    hover:bg-blue-50 transition-colors duration-300
                                    shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                            >
                                Upiši se odmah
                            </Link>
                            <Link
                                to="/programs"
                                className="inline-flex items-center justify-center px-6 py-3 
                                    border-2 border-white text-white font-semibold rounded-full 
                                    hover:bg-white/10 transition-colors duration-300
                                    transform hover:scale-105 active:scale-95"
                            >
                                Istraži programe
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div
                className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full 
                opacity-20 transform translate-x-1/2 -translate-y-1/2 blur-3xl"
            />
            <div
                className="absolute bottom-0 left-0 w-96 h-96 bg-blue-800 rounded-full 
                opacity-20 transform -translate-x-1/2 translate-y-1/2 blur-3xl"
            />
        </section>
    )
}

export default SectionComponent
