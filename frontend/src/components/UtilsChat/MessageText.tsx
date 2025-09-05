import { motion } from 'motion/react'
import { FC, useEffect, useState } from 'react'

// For animation text
export const MessageText: FC<{ text: string; isUser: boolean }> = ({
    text,
    isUser,
}) => {
    const [displayedText, setDisplayedText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (isUser) {
            setDisplayedText(text)
            return
        }

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex])
                setCurrentIndex((prev) => prev + 1)
            }, 30) // Adjust typing speed here (lower = faster)

            return () => clearTimeout(timeout)
        }
    }, [text, currentIndex, isUser])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="whitespace-pre-wrap"
        >
            {displayedText}
            {!isUser && currentIndex < text.length && (
                <span className="animate-pulse">|</span>
            )}
        </motion.div>
    )
}
