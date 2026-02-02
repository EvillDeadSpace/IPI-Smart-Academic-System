/**
 * 📋 Animated List Container
 * Container for staggered list animations
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { staggerContainer } from '../../lib/animations'

interface AnimatedListProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
}

export const AnimatedList = ({
    children,
    className = '',
    staggerDelay = 0.1,
}: AnimatedListProps) => {
    return (
        <motion.div
            variants={{
                ...staggerContainer,
                animate: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: 0.2,
                    },
                },
            }}
            initial="initial"
            animate="animate"
            className={className}
        >
            {children}
        </motion.div>
    )
}
