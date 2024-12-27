import Chat from './Chat'
import Footer from './Footer/Footer'
import Collaboration from './HeroSection/Collaboration'
import Description from './HeroSection/Description'
import HeroSection from './HeroSection/HeroSection'

function HeroSite() {
    return (
        <>
            <Chat />
            <HeroSection />
            <Description />
            <Collaboration />
            <Footer />
        </>
    )
}

export default HeroSite
