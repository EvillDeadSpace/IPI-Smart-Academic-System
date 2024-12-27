import type { FC } from 'react'
import Marquee from 'react-fast-marquee'

const Collaboration: FC = () => {
    return (
        <div className="w-full  p-2 sm:p-4   ">
            <Marquee pauseOnHover={true}>
                <img
                    src="../../../public/logo7.png"
                    alt="collaboration"
                    className="max-w-full h-auto md:max-w-4/5 sm:max-w-3/5"
                />
                <img
                    src="https://ipi-akademija.ba/images/logo/logo1.jpg"
                    alt=""
                    className="max-w-full h-auto md:max-w-4/5 sm:max-w-3/5"
                />
                <img
                    src="https://ipi-akademija.ba/images/logo/logo2.jpg"
                    alt=""
                    className="max-w-full h-auto md:max-w-4/5 sm:max-w-3/5"
                />
                <img
                    src="https://ipi-akademija.ba/images/logo/logo3.jpg"
                    alt=""
                    className="max-w-full h-auto md:max-w-4/5 sm:max-w-3/5"
                />
                <img
                    src="https://ipi-akademija.ba/images/logo/logo5.jpg"
                    alt=""
                    className="max-w-full h-auto md:max-w-4/5 sm:max-w-3/5"
                />
            </Marquee>
        </div>
    )
}

export default Collaboration
