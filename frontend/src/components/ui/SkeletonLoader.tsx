/**
 * ⏳ Animated Skeleton Loader
 * Loading placeholder with pulse effect
 */

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
    height?: string
    width?: string
    rounded?: string
    className?: string
}

export const SkeletonLoader = ({
    height = 'h-4',
    width = 'w-full',
    rounded = 'rounded',
    className = '',
}: SkeletonLoaderProps) => {
    return (
        <motion.div
            animate={{
                opacity: [0.5, 1, 0.5],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={`bg-gray-300 dark:bg-gray-700 ${height} ${width} ${rounded} ${className}`}
        />
    )
}
