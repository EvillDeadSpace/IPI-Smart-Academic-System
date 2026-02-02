/**
 * 📊 Animated Stat Counter
 * Counter with spring animation when value changes
 */

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

interface AnimatedCounterProps {
    value: number
    duration?: number
    className?: string
    prefix?: string
    suffix?: string
}

export const AnimatedCounter = ({
    value,
    duration = 1.5,
    className = '',
    prefix = '',
    suffix = '',
}: AnimatedCounterProps) => {
    const spring = useSpring(0, {
        stiffness: 75,
        damping: 15,
        duration: duration * 1000,
    })

    const display = useTransform(spring, (current) =>
        Math.round(current).toLocaleString()
    )

    useEffect(() => {
        spring.set(value)
    }, [spring, value])

    return (
        <motion.span className={className}>
            {prefix}
            <motion.span>{display}</motion.span>
            {suffix}
        </motion.span>
    )
}
