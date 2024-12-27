import {
    CiMail,
    CiPhone,
    CiLocationOn,
    CiFacebook,
    CiInstagram,
} from 'react-icons/ci'
import {
    TiSocialYoutubeCircular,
    TiSocialLinkedinCircular,
} from 'react-icons/ti'

const Footer = () => {
    const pictureSize: number = 24

    return (
        <section
            className="bg-blue-500 text-gray-600 body-font relative "
            style={{ zIndex: 1 }}
        >
            <img
                src="../../../public/ipizgrada.jpg"
                alt="Pozadinska slika"
                className="absolute inset-0 w-full h-full opacity-25 object-cover z-0 pointer-events-none"
            />
            <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
                <div className="lg:w-2/3 md:w-1/2 bg-blue-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
                    <img
                        src="../../../public/Screenshot 2024-12-27 224233.png"
                        alt="Pozadinska slika"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="bg-blue-500 relative flex flex-wrap py-6 rounded shadow-md">
                        <div className="lg:w-1/2 px-6">
                            <h2 className="title-font font-semibold text-white tracking-widest text-xs">
                                Adresa
                            </h2>
                            <p className="mt-1 text-gray-300">
                                IPI Akademija se nalazi u Tuzli,Bosne i
                                Hercegovine. Adresa je Kulina bana br.2 75000
                                Tuzla
                            </p>
                        </div>
                        <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                            <h2 className="title-font font-semibold text-white tracking-widest text-xs">
                                EMAIL
                            </h2>
                            <a className=" text-gray-300 leading-relaxed">
                                info@ipi-akademija.ba
                            </a>
                            <h2 className="title-font font-semibold text-white tracking-widest text-xs mt-4">
                                Telefon
                            </h2>
                            <p className="leading-relaxed text-gray-300">
                                +387 35 258 454
                            </p>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/3 md:w-1/2 bg-blue-500 p-4 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 relative z-10">
                    <h2 className="text-white font-semibold text-center text-lg mb-4  title-font">
                        Kontakt
                    </h2>
                    <p className="leading-relaxed mb-2  text-gray-300 flex justify-center">
                        <CiPhone className="mx-1 " /> +387 35 258 454
                    </p>
                    <p className="leading-relaxed mb-2 text-gray-300 flex  justify-center">
                        <CiPhone className="mx-1" /> +387 62 062 657
                    </p>
                    <p className="leading-relaxed mb-2 text-gray-300 flex  justify-center">
                        <CiMail className="mx-1" /> info@ipi-akademija.ba
                    </p>
                    <p className="leading-relaxed mb-2 text-gray-300 flex flex-col items-center text-center">
                        <CiLocationOn className="mx-1" />
                        <span>Kulina bana br. 2,</span>
                        <span>75000 Tuzla, Bosna i Hercegovina</span>
                    </p>
                    <p className="leading-relaxed mb-2 text-gray-300 flex  justify-center items-center text-center">
                        <TiSocialYoutubeCircular
                            className="mx-1 rounded-full 
                            "
                            size={pictureSize}
                            color=""
                        />
                        <CiFacebook
                            className="mx-1 rounded-full 
                            "
                            size={pictureSize}
                            color=""
                        />
                        <TiSocialLinkedinCircular
                            className="  
                            "
                            size={pictureSize}
                            color=""
                        />
                        <CiInstagram
                            className="  
                            "
                            size={pictureSize}
                            color=""
                        />
                    </p>
                    <div className="relative mb-4">
                        <label className="leading-7 text-sm text-gray-300">
                            Ime
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    <div className="relative mb-4">
                        <label className="leading-7 text-sm text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    <div className="relative mb-4">
                        <label className="leading-7 text-sm text-gray-300">
                            Poruka
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Posalji poruku ako te nesto zanima u vezi naseg fakulteta"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                        ></textarea>
                    </div>
                    <button className="text-white bg-white border-0 py-2 px-6 focus:outline-none hover:bg-indigo-400 rounded text-lg">
                        <p className="text-gray-700">Send</p>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Footer
