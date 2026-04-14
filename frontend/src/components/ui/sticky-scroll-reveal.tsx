'use client'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string
        description: string
        content?: React.ReactNode
        bg?: string
    }[]
    contentClassName?: string
}) => {
    const [activeCard, setActiveCard] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Subtle blue shade variation per section — keeps brand but adds depth/rhythm
    const sectionBgs = useMemo(
        () => [
            { from: '#1d4ed8', to: '#2563eb' }, // blue-700 → blue-600
            { from: '#2563eb', to: '#3b82f6' }, // blue-600 → blue-500
            { from: '#1e40af', to: '#2563eb' }, // blue-800 → blue-600
            { from: '#1d4ed8', to: '#1e40af' }, // blue-700 → blue-800
            { from: '#3b82f6', to: '#2563eb' }, // blue-500 → blue-600
        ],
        []
    )

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = parseInt(
                            entry.target.getAttribute('data-section') || '0'
                        )
                        setActiveCard(idx)
                    }
                })
            },
            {
                threshold: 0.25,
                rootMargin: '0% 0px -45% 0px',
            }
        )

        if (containerRef.current) {
            const sections = containerRef.current.querySelectorAll('[data-section]')
            sections.forEach((s) => observer.observe(s))
            return () => sections.forEach((s) => observer.unobserve(s))
        }
    }, [content])

    const currentBg = sectionBgs[activeCard % sectionBgs.length]

    return (
        <div ref={containerRef} className="relative">
            <motion.div
                className="flex min-h-screen w-full relative"
                animate={{ backgroundColor: currentBg.from }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{
                    background: `linear-gradient(145deg, ${currentBg.from} 0%, ${currentBg.to} 100%)`,
                }}
            >
                {/* ── Left: text content ──────────────────────────────── */}
                <div className="flex-1 flex flex-col justify-start px-6 lg:px-20 py-16 md:py-24">
                    <div className="container mx-auto max-w-2xl">
                        {content.map((item, index) => (
                            <motion.div
                                key={item.title + index}
                                data-section={index}
                                className="min-h-screen flex flex-col justify-center py-20"
                                initial={{ opacity: 0.25 }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.25,
                                    y: activeCard === index ? 0 : 20,
                                }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                {/* Section counter */}
                                <motion.span
                                    className="text-xs font-syne font-bold tracking-widest text-blue-400 uppercase mb-6 block"
                                    animate={{ opacity: activeCard === index ? 1 : 0.4 }}
                                >
                                    {String(index + 1).padStart(2, '0')} / {String(content.length).padStart(2, '0')}
                                </motion.span>

                                <motion.div
                                    className="w-10 h-0.5 bg-blue-400 rounded-full mb-6"
                                    animate={{
                                        width: activeCard === index ? '2.5rem' : '1.25rem',
                                        opacity: activeCard === index ? 1 : 0.4,
                                    }}
                                    transition={{ duration: 0.4 }}
                                />

                                <motion.h2
                                    className="text-4xl md:text-5xl lg:text-6xl font-syne font-bold text-white mb-8 leading-[1.15]"
                                    animate={{
                                        opacity: activeCard === index ? 1 : 0.3,
                                        x: activeCard === index ? 0 : -20,
                                    }}
                                    transition={{ duration: 0.5, delay: 0.05 }}
                                >
                                    {item.title}
                                </motion.h2>

                                <motion.p
                                    className="text-lg md:text-xl text-blue-100/80 leading-relaxed font-light"
                                    animate={{
                                        opacity: activeCard === index ? 1 : 0.3,
                                        x: activeCard === index ? 0 : -20,
                                    }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    {item.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Right: sticky visual card ────────────────────────── */}
                <div className="hidden lg:flex w-[45%] relative flex-shrink-0">
                    <div className="sticky top-0 h-screen w-full flex items-center justify-center p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`card-${activeCard}`}
                                className={cn(
                                    'w-full max-w-md h-[440px] rounded-3xl overflow-hidden border border-white/10',
                                    contentClassName
                                )}
                                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    boxShadow:
                                        '0 30px 60px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
                                }}
                            >
                                {content[activeCard].content ?? (
                                    <div className="flex items-center justify-center h-full bg-blue-900/50 text-white text-2xl font-syne font-bold">
                                        {content[activeCard].title}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Navigation dots ──────────────────────────────────── */}
                <div className="hidden lg:flex flex-col items-center justify-center gap-3 fixed right-6 top-1/2 -translate-y-1/2 z-30">
                    {content.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const section = containerRef.current?.querySelector(
                                    `[data-section="${idx}"]`
                                )
                                section?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                            }}
                            className="group flex items-center justify-center"
                            aria-label={`Sekcija ${idx + 1}`}
                        >
                            <motion.div
                                animate={{
                                    width: activeCard === idx ? '1.75rem' : '0.4rem',
                                    backgroundColor:
                                        activeCard === idx
                                            ? 'rgba(147,197,253,1)'
                                            : 'rgba(147,197,253,0.35)',
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-1.5 rounded-full"
                            />
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

export default StickyScroll
