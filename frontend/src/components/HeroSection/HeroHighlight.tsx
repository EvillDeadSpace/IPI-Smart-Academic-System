import { motion } from 'framer-motion'
import { HeroHighlight, Highlight } from '../ui/hero-highlight'

export function HeroHighlightComponent() {
    return (
        <HeroHighlight>
            <motion.h1
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white max-w-5xl text-center mx-auto px-4 sm:px-6 leading-tight"
            >
                <span className="block ">Sve na jednom mjestu</span>
                <span className="block">
                    <span className="inline-block">
                        <Highlight className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                            Internacionalna poslovno-informaciona akademija
                            Tuzla
                        </Highlight>
                    </span>
                </span>
            </motion.h1>
        </HeroHighlight>
    )
}
