import type { FC } from 'react'
import { motion } from 'framer-motion'
import {
    IconBrain,
    IconBook,
    IconCertificate,
    IconUsers,
} from '@tabler/icons-react'

const Description: FC = () => {
    const features = [
        {
            icon: <IconBook className="w-8 h-8" />,
            title: 'Trogodišnji programi (180 ECTS)',
            items: [
                'Informacione tehnologije',
                'Tržišne komunikacije',
                'Savremeno poslovanje',
                'Informatički menadžment',
            ],
        },
        {
            icon: <IconCertificate className="w-8 h-8" />,
            title: 'Četverogodišnji programi (240 ECTS)',
            items: ['Informatika i računarstvo', 'Računovodstvo i finansije'],
        },
    ]

    return (
        <div className="relative bg-gradient-to-b from-white to-blue-50 py-20">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-dot-thick-blue-100 opacity-30" />

            <div className="container mx-auto px-4">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Odluči se za kvalitet
                        <span className="text-blue-600">
                            {' '}
                            - biraj studij po mjeri poslodavca!
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Pridruži se vodećoj instituciji koja obrazuje buduće
                        lidere u tehnologiji i poslovanju
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{
                                opacity: 0,
                                x: index % 2 === 0 ? -20 : 20,
                            }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {feature.title}
                                </h3>
                            </div>
                            <ul className="space-y-3">
                                {feature.items.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className="flex items-center text-gray-700"
                                    >
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-8 text-center">
                            Zašto odabrati IPI Akademiju?
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <IconBrain className="w-12 h-12 mx-auto mb-4" />
                                <h4 className="font-semibold mb-2">
                                    Praktična nastava
                                </h4>
                                <p className="text-blue-100">
                                    Učenje kroz rad i realne projekte
                                </p>
                            </div>
                            <div className="text-center">
                                <IconUsers className="w-12 h-12 mx-auto mb-4" />
                                <h4 className="font-semibold mb-2">
                                    Stručni kadar
                                </h4>
                                <p className="text-blue-100">
                                    Iskusni profesori i stručnjaci iz prakse
                                </p>
                            </div>
                            <div className="text-center">
                                <IconCertificate className="w-12 h-12 mx-auto mb-4" />
                                <h4 className="font-semibold mb-2">
                                    Priznata diploma
                                </h4>
                                <p className="text-blue-100">
                                    Međunarodno priznate kvalifikacije
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <button
                        className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold 
                        hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                        Započni svoju karijeru danas
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
export default Description
