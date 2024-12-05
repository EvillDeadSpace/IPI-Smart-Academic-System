import Lottie from 'lottie-react'
import animationRobot from '../../assets/AnimationChat.json'

interface StartPageProps {
    onContinue: () => void
}

function StartPage({ onContinue }: StartPageProps) {
    return (
        <>
            <div>
                <h1 className="text-blue-700 font-medium text-center text-xl">
                    Tvoj IPI asistent
                </h1>
                <p className="text-center mx-4 gap-2 mt-5 text-gray-600">
                    Koristeći ovaj chat, možeš pitati bilo koje pitanje koje
                    želiš, i ja ću ti brzo naći odgovor.
                </p>
                <Lottie
                    animationData={animationRobot}
                    className="w-1/2 mx-auto mt-8"
                />
            </div>
            <div className="flex justify-center mt-auto">
                <button
                    onClick={onContinue}
                    className="w-full bg-blue-500 text-white py-2 px-4 mb-2 border-2 rounded-3xl border-blue-500"
                >
                    <p className="text-white">Nastavi</p>
                </button>
            </div>
        </>
    )
}

export default StartPage
