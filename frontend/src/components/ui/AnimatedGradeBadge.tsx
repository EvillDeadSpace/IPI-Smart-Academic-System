/**
 * 🎓 Animated Grade Badge
 * Grade display with reveal animation
 */

import { motion } from 'framer-motion'
import { gradeReveal } from '../../lib/animations'

interface AnimatedGradeBadgeProps {
    grade: number
    label?: string
    delay?: number
}

export const AnimatedGradeBadge = ({
    grade,
    label = 'Ocjena',
    delay = 0,
}: AnimatedGradeBadgeProps) => {
    const getGradeColor = (grade: number) => {
        if (grade >= 9)
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        if (grade >= 7)
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        if (grade >= 6)
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }

    return (
        <div className="text-center">
            {label && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {label}
                </p>
            )}
            <motion.div
                variants={gradeReveal}
                initial="hidden"
                animate="visible"
                transition={{ delay }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl font-bold ${getGradeColor(grade)}`}
            >
                {grade}
            </motion.div>
        </div>
    )
}
