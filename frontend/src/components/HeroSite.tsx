import Chat from './Chat'
import Footer from './Footer/Footer'
import { AppleCardsCarousel } from './HeroSection/CardCarousel'
import Collaboration from './HeroSection/Collaboration'
import Description from './HeroSection/Description'
import { HeroHighlightComponent } from './HeroSection/HeroHighlight'
import HeroSection from './HeroSection/HeroSection'
import SectionComponent from './HeroSection/SectionComponent'
import { TestimonialComponent } from './HeroSection/TestimonialComponent'
import { motion } from 'framer-motion'

function HeroSite() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
            style={{ margin: 0, padding: 0 }}
        >
            {/* Fixed chat button */}
            <div className="fixed bottom-4 right-4 z-50">
                <Chat />
            </div>

            {/* Hero Section with Highlight */}
            <section className="relative">
                <HeroHighlightComponent />
            </section>

            {/* Main Content */}
            <main className="relative z-10">
                {/* About Section with parallax effect */}
                <section className="relative overflow-hidden">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <HeroSection />
                    </motion.div>
                </section>

                {/* Description with gradient overlay */}
                <section className="relative bg-gradient-to-b from-blue-50 to-white py-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <Description />
                    </motion.div>
                </section>
                {/* Partners Showcase */}
                <section className="w-full">
                    <Collaboration />
                </section>

                {/* Testimonials with background pattern */}
                <section className="relative bg-gray-50 py-20">
                    <div className="absolute inset-0 bg-dot-thick-neutral-100 opacity-50" />
                    <div className="relative z-10">
                        <TestimonialComponent />
                    </div>
                </section>

                {/* Interactive Cards Section */}
                <section className="py-20 bg-gradient-to-b from-white to-blue-50">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <AppleCardsCarousel />
                    </motion.div>
                </section>

                {/* Call to Action Section */}
                <section className="bg-blue-600 text-white pt-10 pb-0 mb-0">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <SectionComponent />
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <div className="mt-0" style={{ margin: 0, padding: 0 }}>
                <Footer />
            </div>
        </motion.div>
    )
}

export default HeroSite
