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
                className="text-2xl px-6 md:text-4xl lg:text-6xl font-bold text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
            >
                Sve na jednom mjesto <br />
                <Highlight className="overflow-hidden text-center text-white mx-auto mt-8 md:mt-12 lg:mt-16">
                    Internacionalna poslovno-informaciona akademija Tuzla
                </Highlight>
            </motion.h1>
        </HeroHighlight>
    )
}
