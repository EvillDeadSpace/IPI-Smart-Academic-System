import { FC, useState } from 'react'
import Lottie from 'lottie-react'
import animation from '../assets/wired-gradient-981-consultation-hover-conversation.json'
import { TbArrowBadgeRightFilled } from 'react-icons/tb'
import StartPage from './UtilsChat/StartPage'
import ChatHeader from './UtilsChat/StatusComponent'
import { useChat } from '../Context'
import { useChatSubmit } from './Utils/CustomHook'
const Chat: FC = () => {
    // Global state for chat
    const { status, isChatOpen, setIsChatOpen } = useChat()
    const { word, setWord, messages, isLoading, handleSubmit } = useChatSubmit()
    const [showChat, setShowChat] = useState<boolean>(false)

    // Function to handle continue button click
    const handleContinue = () => {
        setShowChat(true)
    }
    // Function to handle chat open/close
    const handleChat = (isOpen: boolean) => {
        setIsChatOpen(isOpen)
    }
    // Function to handle input field changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWord(event.target.value)
    }

    return (
        <>
            <div className="lottie-container" onClick={() => handleChat(true)}>
                <Lottie animationData={animation} className="lottie-icon" />
            </div>

            {isChatOpen && (
                <div className="chat-window">
                    {!showChat ? (
                        <>
                            <StartPage onContinue={handleContinue} />
                        </>
                    ) : (
                        <>
                            <ChatHeader
                                status={status}
                                onClose={() => handleChat(false)}
                            />
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
