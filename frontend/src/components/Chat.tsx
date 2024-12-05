import { FC, useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import animation from '../assets/wired-gradient-981-consultation-hover-conversation.json'
import animationChat from '../assets/AnimationChat.json'
import { RiRobot2Line } from 'react-icons/ri'
import { LuDot } from 'react-icons/lu'
import { TbArrowBadgeRightFilled } from 'react-icons/tb'

const Chat: FC = () => {
    // State variables
    const [status, setStatus] = useState<boolean>(false)
    console.log(status + ' status')
    const [word, setWord] = useState<string>('')
    const [messages, setMessages] = useState<
        { text: string; isUser: boolean }[]
    >([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [showChat, setShowChat] = useState<boolean>(false)
    const [isChatOpen, setIsChatOpen] = useState(false)

    // Function to handle continue button click
    const handleContinue = () => {
        setShowChat(true)
    }
    const handleOpenChat = () => {
        setIsChatOpen(true) // Otvara chat kada klikneš na ikonicu
    }
    // Function to handle input field changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWord(event.target.value)
    }

    // Function to handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (word.trim()) {
            setMessages([...messages, { text: word, isUser: true }])
            setWord('')
        }

        setIsLoading(true)

        // Add simulated AI response to the messages

        try {
            const response = await fetch('http://127.0.0.1:5000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }),
            })
            const result = await response.json()

            // Add AI response to the messages array
            if (result.sentence && result.sentence.length > 0) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.sentence, isUser: false },
                ])
            } else if (result.message) {
                // Ako postoji message, dodaj ga kao obavještenje
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.message, isUser: false },
                ])
            }
        } catch (error) {
            console.error('There was an error!', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/status')
                const data = await response.json()
                console.log(data)
                setTimeout(() => setStatus(data.status), 5000)
            } catch (error) {
                console.error('There was an error fetching the status!', error)
                setStatus(false) // Postavite status na false u slučaju greške
            }
        }

        fetchStatus() // Pozivamo fetchStatus odmah nakon definisanja

        return () => {}
    }, [])

    return (
        <>
            <div className="lottie-container" onClick={handleOpenChat}>
                <Lottie animationData={animation} className="lottie-icon" />
            </div>

            {isChatOpen && (
                <div className="chat-window">
                    {!showChat ? (
                        <>
                            <div>
                                <h1 className="text-blue-700 font-medium text-center text-xl">
                                    Tvoj IPI asistent
                                </h1>
                                <p className="text-center mx-4 gap-2 mt-5 text-gray-600">
                                    Koristeći ovaj chat, možeš pitati bilo koje
                                    pitanje koje želiš, i ja ću ti brzo naći
                                    odgovor.
                                </p>
                                <Lottie
                                    animationData={animationChat}
                                    className="w-1/2 mx-auto mt-8"
                                />
                            </div>
                            <div className="flex justify-center mt-auto">
                                <button
                                    onClick={handleContinue}
                                    className="w-full bg-blue-500 text-white py-2 px-4 mb-2 border-2 rounded-3xl border-blue-500"
                                >
                                    <p className="text-white">Nastavi</p>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center">
                                <RiRobot2Line
                                    color="blue"
                                    size={46}
                                    className="m-2"
                                />
                                <div className="flex flex-col ml-2">
                                    <p className="text-blue-800 font-medium">
                                        IPI AI Chat
                                    </p>
                                    {!status ? (
                                        <p className="text-red-700 flex items-center">
                                            <LuDot
                                                size={24}
                                                className="ml-[-10px]"
                                            />{' '}
                                            Offline
                                        </p>
                                    ) : (
                                        <p className="text-green-700 flex items-center">
                                            <LuDot
                                                size={24}
                                                className="ml-[-10px]"
                                            />{' '}
                                            Online
                                        </p>
                                    )}
                                </div>
                            </div>
                            <hr className="border-t-2 border-black-100 my-1" />
                            <div className="chat-content max-h-max overflow-y-auto p-4">
                                {messages.map((message, index) => (
                                    <p
                                        key={index}
                                        className={`border-2 rounded-3xl p-2 m-4 ${
                                            message.isUser
                                                ? 'text-left bg-[#3369FF] rounded-2xl rounded-tr-none text-white p-5 m-2'
                                                : 'text-right rounded-2xl rounded-tl-none bg-[#EEEEEE]'
                                        }`}
                                    >
                                        {message.text}
                                    </p>
                                ))}
                                {isLoading && <p>Loading...</p>}
                                <div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="relative"
                                    >
                                        <div className="relative">
                                            <input
                                                className="border-2 m-2 p-3 rounded-3xl placeholder-italic placeholder-gray-600 pr-10 w-full"
                                                type="text"
                                                value={word}
                                                onChange={handleInputChange}
                                                placeholder="Enter your word"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-6 top-1/2 transform -translate-y-1/2"
                                            >
                                                <TbArrowBadgeRightFilled
                                                    size={24}
                                                    color="blue"
                                                />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default Chat
