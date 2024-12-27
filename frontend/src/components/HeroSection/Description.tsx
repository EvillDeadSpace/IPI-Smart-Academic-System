import type { FC } from 'react'

const Description: FC = () => {
    return (
        <div
            className="bg-black p-6 bg-cover bg-center"
            style={{
                backgroundImage: `url(https://ipi-akademija.ba/cimage/module/custom/image-217.png)`,
                // Adjust the size of the background image

                backgroundRepeat: 'no-repeat', // Center the background image
            }}
        >
            <div className="bg-gray-800 opacity-85 p-4 sm:p-20 text-white max-w-full mx-auto">
                <h1 className="text-center  text-3xl font-semibold mb-4 ">
                    Odluči se za kvalitet - biraj studij po mjeri poslodavca!
                </h1>
                <p className="text-center text-wrap text-base mx-0 sm:mx-14  sm:text-lg ">
                    Na IPI Akademiji možete upisati trogodišnje studijske
                    programe (180ECTS) iz oblasti: Informacionih tehnologija,
                    Tržišnih komunikacija, Savremenog poslovanja i informatičkog
                    menadžmenta; ili četverogodišnje studijske programe
                    (240ECTS): Informatika i računarstvo, Računovodstvo i
                    finansije. Uz praktičnu nastavu, obaveznu stručnu praksu,
                    visok nivo znanja i stručnosti akademskog kadra obrazujemo i
                    pružamo podršku mladima u razvoju njihovih ideja, te ih
                    adekvatno pripremamo za tržište
                </p>
            </div>
        </div>
    )
}
export default Description
