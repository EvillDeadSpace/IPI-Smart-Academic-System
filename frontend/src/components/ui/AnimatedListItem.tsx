/**
 * 📝 Animated List Item
 * Individual item with fade-in animation
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { staggerItem, tableRow } from '../../lib/animations'

interface AnimatedListItemProps {
    children: ReactNode
    className?: string
    hover?: boolean
}

export const AnimatedListItem = ({
    children,
    className = '',
    hover = true,
}: AnimatedListItemProps) => {
    return (
        <motion.div
            variants={hover ? tableRow : staggerItem}
            whileHover={hover ? 'hover' : undefined}
            className={className}
        >
            {children}
        </motion.div>
    )
}
