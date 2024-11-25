import { FC, useState } from 'react'
import Lottie from 'lottie-react'
import animation from '../assets/wired-gradient-981-consultation-hover-conversation.json'
import animationChat from '../assets/AnimationChat.json'
import { RiRobot2Line } from 'react-icons/ri'

const Chat: FC = () => {
    const [data, setData] = useState<{ word: string[] } | null>(null) // Type as needed
    const [word, setWord] = useState<string>('') // State for user input
    const [messages, setMessages] = useState<
        { text: string; isUser: boolean }[]
    >([])
    const [isLoading, setIsLoading] = useState<boolean>(false) // State for loading
    const [showChat, setShowChat] = useState<boolean>(false)

    const handleContinue = () => {
        setShowChat(true)
    }

    console.log(data)

    // Function to handle input field changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWord(event.target.value)
    }

    // Function to handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (word.trim()) {
            // Add new user message to the messages array
            setMessages([...messages, { text: word, isUser: true }])
            // Reset the input field
            setWord('')
        }

        setIsLoading(true) // Set loading to true before fetching data

        try {
            const response = await fetch('http://127.0.0.1:5000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word }), // Send word instead of query
            })
            const result = await response.json()
            console.log(result) // Log the result to the console
            setData(result as { word: string[] })

            // Add AI response to the messages array
            if (result.sentence && result.sentence.length > 0) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: result.sentence, isUser: false },
                ])
            }
        } catch (error) {
            console.error('There was an error!', error)
        } finally {
            setIsLoading(false) // Set loading to false after fetching data
        }
    }

    return (
        <>
            <div className="lottie-container">
                <Lottie animationData={animation} className="lottie-icon" />
            </div>
            <div className="chat-window">
                {!showChat ? (
                    <>
                        <div>
                            <h1 className="text-blue-700 font-medium text-center text-xl">
                                Tvoj IPI asistent
                            </h1>
                            <p className="text-center mx-4  gap-2 mt-5 text-gray-600">
                                Koristeci ovaj chat, mozes pitati bilo koje
                                pitanje koje zelis i ja cu ti brzo naci odgovor.{' '}
                            </p>
                            <Lottie
                                animationData={animationChat}
                                className="w-1/2 mx-auto mt-8"
                            />
                        </div>
                        <div className="flex justify-center mt-auto">
                            <button
                                onClick={handleContinue}
                                className="w-full bg-blue-500 text-white py-2 px-4  mb-2 border-2  rounded-3xl border-blue-500 "
                            >
                                <p className="text-white">Nastavi</p>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p>
                            <RiRobot2Line />
                        </p>
                        <div className="chat-content max-h-96 overflow-y-auto p-4">
                            {messages.map((message, index) => (
                                <p
                                    className={`border-2 rounded-3xl p-2 m-2 ${
                                        message.isUser
                                            ? 'text-left bg-gray-400'
                                            : 'text-right bg-gray-200'
                                    }`}
                                    key={index}
                                >
                                    {message.text}
                                </p>
                            ))}
                            {isLoading && <p>Loading...</p>}
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="border-2 m-2 p-1 rounded-3xl placeholder-italic placeholder-gray-600"
                                    type="text"
                                    value={word}
                                    onChange={handleInputChange}
                                    placeholder="Enter your word"
                                />
                                <button type="submit">Pretrazi</button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Chat
