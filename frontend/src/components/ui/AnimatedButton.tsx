/**
 * 🎯 Animated Button Component
 * Button with press, hover, and loading animations
 */

import { HTMLMotionProps, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { buttonHover } from '../../lib/animations'

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
    children: ReactNode
    loading?: boolean
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
    className?: string
}

export const AnimatedButton = ({
    children,
    loading = false,
    variant = 'primary',
    className = '',
    ...props
}: AnimatedButtonProps) => {
    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
    }

    return (
        <motion.button
            variants={buttonHover}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </motion.button>
    )
}
