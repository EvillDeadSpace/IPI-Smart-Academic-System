import Chat from './Chat'
import Footer from './Footer/Footer'
import { AppleCardsCarousel } from './HeroSection/CardCarousel'
import Collaboration from './HeroSection/Collaboration'
import Description from './HeroSection/Description'
import { HeroHighlightComponent } from './HeroSection/HeroHighlight'
import HeroSection from './HeroSection/HeroSection'

import SectionComponent from './HeroSection/SectionComponent'
import { TestimonialComponent } from './HeroSection/TestimonialComponent'

function HeroSite() {
    return (
        <>
            <div className="overflow-hidden">
                <Chat />
                <HeroHighlightComponent />
                <HeroSection />
                <Description />
                <Collaboration />
                <TestimonialComponent />
                <AppleCardsCarousel />
                <SectionComponent />
                <Footer />
            </div>
        </>
    )
}

export default HeroSite
