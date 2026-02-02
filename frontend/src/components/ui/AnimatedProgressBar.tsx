/**
 * 📈 Animated Progress Bar
 * Progress bar with fill animation
 */

import { motion } from 'framer-motion'
import { progressBarFill } from '../../lib/animations'

interface AnimatedProgressBarProps {
    progress: number // 0-100
    height?: string
    color?: string
    backgroundColor?: string
    className?: string
    showLabel?: boolean
}

export const AnimatedProgressBar = ({
    progress,
    height = 'h-4',
    color = 'bg-blue-600',
    backgroundColor = 'bg-gray-200 dark:bg-gray-700',
    className = '',
    showLabel = true,
}: AnimatedProgressBarProps) => {
    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                        Progress
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
            <div
                className={`w-full ${backgroundColor} rounded-full ${height} overflow-hidden`}
            >
                <motion.div
                    variants={progressBarFill}
                    initial="initial"
                    animate="animate"
                    custom={progress}
                    className={`${color} ${height} rounded-full flex items-center justify-center`}
                />
            </div>
        </div>
    )
}
