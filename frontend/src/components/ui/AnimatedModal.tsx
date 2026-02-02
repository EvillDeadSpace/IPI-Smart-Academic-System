/**
 * 🎭 Animated Modal
 * Modal with backdrop blur and spring entrance
 */

import { IconX } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { modalBackdrop, modalContent } from '../../lib/animations'

interface AnimatedModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const AnimatedModal = ({
    isOpen,
    onClose,
    children,
    title,
    size = 'md',
}: AnimatedModalProps) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={modalBackdrop}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            variants={modalContent}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-auto`}
                        >
                            {/* Header */}
                            {title && (
                                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {title}
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <IconX className="h-6 w-6" />
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">{children}</div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
