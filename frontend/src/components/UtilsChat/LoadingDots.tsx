import { motion } from 'motion/react'

export const LoadingDots = () => (
    <div className="flex space-x-1 items-center justify-center">
        {[1, 2, 3].map((dot) => (
            <motion.div
                key={dot}
                className="w-2 h-2 bg-blue-500 rounded-full"
                initial={{ y: 0 }}
                animate={{ y: [-2, 2] }}
                transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: dot * 0.1,
                }}
            />
        ))}
    </div>
)
