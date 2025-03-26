import type { FC } from 'react'
import Marquee from 'react-fast-marquee'
import { motion } from 'framer-motion'

const Collaboration: FC = () => {
    const partners = [
        {
            src: '/logo7.png',
            alt: 'Partner Logo 7',
            href: '#',
        },
        {
            src: 'https://ipi-akademija.ba/images/logo/logo1.jpg',
            alt: 'Partner Logo 1',
            href: '#',
        },
        {
            src: 'https://ipi-akademija.ba/images/logo/logo2.jpg',
            alt: 'Partner Logo 2',
            href: '#',
        },
        {
            src: 'https://ipi-akademija.ba/images/logo/logo3.jpg',
            alt: 'Partner Logo 3',
            href: '#',
        },
        {
            src: 'https://ipi-akademija.ba/images/logo/logo5.jpg',
            alt: 'Partner Logo 5',
            href: '#',
        },
    ]

    return (
        <section className="w-full bg-gradient-to-b from-blue-50 to-white">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Naši Partneri
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto px-4">
                    Sarađujemo sa vodećim kompanijama i institucijama kako bismo
                    osigurali najbolje mogućnosti za naše studente
                </p>
            </motion.div>

            {/* Partners Marquee - Full Width */}
            <div className="relative w-full">
                {/* Gradient Overlay Left */}
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10" />

                <Marquee
                    pauseOnHover={true}
                    speed={40}
                    gradient={false}
                    className="py-8"
                >
                    {[...partners, ...partners].map((partner, index) => (
                        <motion.a
                            key={index}
                            href={partner.href}
                            className="mx-6"
                            whileHover={{ scale: 1.05 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 10,
                            }}
                        >
                            <div
                                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300
                                flex items-center justify-center h-28 w-44"
                            >
                                <img
                                    src={partner.src}
                                    alt={partner.alt}
                                    className="max-h-20 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                />
                            </div>
                        </motion.a>
                    ))}
                </Marquee>

                {/* Gradient Overlay Right */}
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10" />
            </div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center py-12"
            >
                <p className="text-gray-600 mb-6">
                    Želite postati naš partner?
                </p>
                <button
                    className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium 
                    hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                    Kontaktirajte nas
                </button>
            </motion.div>
        </section>
    )
}

export default Collaboration
