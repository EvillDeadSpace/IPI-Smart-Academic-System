'use client'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string
        description: string
        content?: React.ReactNode
    }[]
    contentClassName?: string
}) => {
    const [activeCard, setActiveCard] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Background gradients and colors - matching content themes
    const linearGradients = useMemo(
        () => [
            'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // blue
            'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // blue
            'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // blue
            'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // blue
            'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', // blue
        ],
        []
    )

    const backgroundColors = useMemo(
        () => [
            'rgb(37, 99, 235)', // blue-600
            'rgb(37, 99, 235)', // blue-600
            'rgb(37, 99, 235)', // blue-600
            'rgb(37, 99, 235)', // blue-600
            'rgb(37, 99, 235)', // blue-600
        ],
        []
    )

    const [backgroundGradient, setBackgroundGradient] = useState(
        linearGradients[0]
    )

    console.log(backgroundGradient)
    useEffect(() => {
        setBackgroundGradient(
            linearGradients[activeCard % linearGradients.length]
        )
    }, [activeCard, linearGradients])

    // Intersection Observer for scroll detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionIndex = parseInt(
                            entry.target.getAttribute('data-section') || '0'
                        )
                        console.log('Section in view:', sectionIndex) // Debug log
                        setActiveCard(sectionIndex)
                    }
                })
            },
            {
                threshold: 0.2, // Još brži odgovor
                rootMargin: '0% 0px -50% 0px', // Aktivira se kada sekcija tek uđe u viewport
            }
        )

        if (containerRef.current) {
            const sections =
                containerRef.current.querySelectorAll('[data-section]')
            sections.forEach((section) => observer.observe(section))

            return () => {
                sections.forEach((section) => observer.unobserve(section))
            }
        }
    }, [content])

    return (
        <div ref={containerRef} className="relative min-h-screen">
            {/* Background pattern similar to HeroSection */}
            <div className="absolute inset-0 bg-dot-thick-neutral-100 opacity-20" />

            <motion.div
                animate={{
                    backgroundColor:
                        backgroundColors[activeCard % backgroundColors.length],
                }}
                className="flex min-h-screen w-full relative z-10"
                style={{
                    background: `linear-gradient(135deg, ${backgroundColors[activeCard % backgroundColors.length]} 0%, ${backgroundColors[(activeCard + 1) % backgroundColors.length]} 100%)`,
                }}
            >
                {/* Text Content - Left Side */}
                <div className="flex-1 flex flex-col justify-start px-6 lg:px-20 py-16 md:py-24">
                    <div className="container mx-auto max-w-4xl">
                        {content.map((item, index) => (
                            <motion.div
                                key={item.title + index}
                                data-section={index}
                                className="min-h-screen flex flex-col justify-center py-24"
                                initial={{ opacity: 0.3 }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                    scale: activeCard === index ? 1 : 0.96,
                                    y: activeCard === index ? 0 : 30,
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <motion.h1
                                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight"
                                    animate={{
                                        opacity: activeCard === index ? 1 : 0.4,
                                        x: activeCard === index ? 0 : -30,
                                    }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    {item.title}
                                </motion.h1>
                                <motion.p
                                    className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl font-light"
                                    animate={{
                                        opacity: activeCard === index ? 1 : 0.4,
                                        x: activeCard === index ? 0 : -30,
                                    }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    {item.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sticky Visual Content - Right Side */}
                <div className="hidden lg:flex flex-1 relative">
                    <div className="sticky top-1/2 transform -translate-y-1/2 h-fit w-full flex items-center justify-center p-12">
                        <motion.div
                            className={cn(
                                'w-full max-w-lg h-[420px] rounded-3xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-xl bg-white/5',
                                contentClassName
                            )}
                            animate={{
                                scale: 1.02,
                                opacity: 1,
                                rotateY: 0,
                            }}
                            transition={{
                                duration: 0.7,
                                ease: 'easeOut',
                            }}
                            key={`card-${activeCard}`}
                            style={{
                                background:
                                    'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                boxShadow:
                                    '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2,
                                    ease: 'easeOut',
                                }}
                                className="h-full w-full"
                            >
                                {content[activeCard].content ?? (
                                    <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                                        {content[activeCard].title}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default StickyScroll
