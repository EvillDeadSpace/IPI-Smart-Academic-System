'use client'
import StickyScroll from '../ui/sticky-scroll-reveal'
import { motion } from 'framer-motion'
import Chat from '../Chat'

import type { FC } from 'react'

const content = [
    {
        title: 'Naša Misija',
        description:
            'Formirati stručnjake koji će biti lideri u digitalnoj transformaciji društva. Kroz inovativne studijske programe i praktičnu nastavu, pripremaamo buduće eksperte za IT industriju koji će doprinijeti razvoju Bosne i Hercegovine.',
        content: (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">Misija</h3>
                <p className="text-center text-blue-100">
                    Obrazovanje za budućnost
                </p>
            </div>
        ),
    },
    {
        title: 'Naša Istorija',
        description:
            'Osnovan 2010. godine, IPI se razvio od male privatne škole do vodećeg centra za informacione tehnologije. Naša tradicija kvalitetnog obrazovanja i partnerstva sa industrijskim liderima čini nas jedinstvenim na regionalnom nivou.',
        content: (
            <div className="flex h-full w-full items-center justify-center relative">
                <img
                    src="/ipizgrada.jpg"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                    alt="IPI zgrada"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                        <div className="text-4xl font-bold">2010</div>
                        <p className="text-lg">Godina osnivanja</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: 'Naše Vrijednosti',
        description:
            'Inovacija, kvaliteta i integritet su temelji našeg rada. Vjerujemo u praktičan pristup učenju, kontinuirano usavršavanje i etičko ponašanje. Naši studenti su u centru svega što radimo.',
        content: (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-800 text-white p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-3xl mb-2">💡</div>
                        <p className="font-semibold">Inovacija</p>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">⭐</div>
                        <p className="font-semibold">Kvaliteta</p>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">🤝</div>
                        <p className="font-semibold">Integritet</p>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">🎓</div>
                        <p className="font-semibold">Izvrsnost</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: 'Statistike i Uspjesi',
        description:
            'Preko 2.000 diplomiranih studenata, 95% stopa zapošljavanja u IT sektoru, partnerstva sa više od 50 kompanija. Naši rezultati govore o kvaliteti obrazovanja koji pružamo i uspjehu naših absolventa.',
        content: (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                        <div className="text-3xl font-bold text-yellow-300">
                            2000+
                        </div>
                        <p className="text-sm">Diplomiranih</p>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-yellow-300">
                            95%
                        </div>
                        <p className="text-sm">Zapošljavanja</p>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-yellow-300">
                            50+
                        </div>
                        <p className="text-sm">Partnera</p>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-yellow-300">
                            15+
                        </div>
                        <p className="text-sm">Godina iskustva</p>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: 'Naš Tim',
        description:
            'Iskusni profesori i saradnici koji kombinuju akademsko znanje sa praktičnim iskustvom iz industrije. Naš tim čine doktori nauka, certificirani IT stručnjaci i uspješni preduzetnici koji aktivno učestvuju u razvoju IT scene.',
        content: (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-orange-600 to-red-600 text-white p-8">
                <div className="text-center">
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-xl font-bold mb-2">Stručan Tim</h3>
                    <div className="space-y-2 text-orange-100">
                        <p>• Doktori nauka</p>
                        <p>• IT stručnjaci</p>
                        <p>• Industriski eksprti</p>
                    </div>
                </div>
            </div>
        ),
    },
]

const About: FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
            style={{ margin: 0, padding: 0 }}
        >
            {/* Fixed chat button - kao na HeroSite */}
            <div className="fixed bottom-4 right-4 z-50">
                <Chat />
            </div>

            {/* About section with sticky scroll */}
            <section className="relative min-h-screen w-full">
                <StickyScroll content={content} />
            </section>
        </motion.div>
    )
}
export default About
