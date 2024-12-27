import type { FC } from 'react'

const HeroSection: FC<object> = () => {
    return (
        <>
            <section className="text-gray-600 body-font h-screen w-screen flex justify-center items-center">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
                        <img
                            className="object-cover object-center rounded"
                            alt="hero"
                            src="../../../public/ipizgrada.jpg"
                        />
                    </div>
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                            Dobrodošli na IPI Akademiju
                        </h1>
                        <p className="mb-8 leading-relaxed">
                            Visoka škola za savremeno poslovanje, informacione
                            tehnologije i tržišne komunikacije "Internacionalna
                            poslovno-informaciona akademija" Tuzla osnovana je
                            2014. godine i prva je domaća privatna visokoškolska
                            ustanova u Tuzli. Uz praktičnu nastavu, obaveznu
                            stručnu praksu, visok nivo znanja i stručnosti
                            akademskog kadra obrazuje i pruža podršku mladima u
                            razvoju njihovih ideja, te ih adekvatno priprema za
                            tržište rada.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection
