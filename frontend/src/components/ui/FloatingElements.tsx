/**
 * 🎨 Floating Elements Background
 * Decorative floating shapes for backgrounds
 */

import { motion } from 'framer-motion'
import { floatingCard } from '../../lib/animations'

interface FloatingElementsProps {
    count?: number
    colors?: string[]
}

export const FloatingElements = ({
    count = 3,
    colors = ['bg-blue-400', 'bg-purple-400', 'bg-indigo-400'],
}: FloatingElementsProps) => {
    const positions = [
        { top: '10%', left: '10%' },
        { top: '50%', right: '10%' },
        { bottom: '10%', left: '50%' },
    ]

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    variants={floatingCard}
                    animate="animate"
                    className={`absolute w-72 h-72 ${colors[i % colors.length]} rounded-full mix-blend-multiply filter blur-3xl opacity-15`}
                    style={{
                        ...positions[i % positions.length],
                        animationDelay: `${i * 0.5}s`,
                    }}
                />
            ))}
        </div>
    )
}
