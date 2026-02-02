/**
 * 🎨 Animated Card Component
 * Reusable card with hover effects, entrance animations
 */

import { HTMLMotionProps, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cardAppear, cardHover } from '../../lib/animations'

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    delay?: number
    hover?: boolean
    className?: string
}

export const AnimatedCard = ({
    children,
    delay = 0,
    hover = true,
    className = '',
    ...props
}: AnimatedCardProps) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            whileHover={hover ? 'hover' : undefined}
            whileTap={hover ? 'tap' : undefined}
            variants={cardHover}
            className={className}
            style={{ transformStyle: 'preserve-3d' }}
            {...props}
        >
            <motion.div
                variants={cardAppear}
                transition={{ delay }}
                className="h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
