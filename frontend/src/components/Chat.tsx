import { FC, useState, useEffect, useRef } from 'react'
import Lottie from 'lottie-react'
import { motion, AnimatePresence } from 'framer-motion'
import animation from '../assets/wired-gradient-981-consultation-hover-conversation.json'
import { TbArrowBadgeRightFilled } from 'react-icons/tb'

// Chat utils
import StartPage from './UtilsChat/StartPage'
import ChatHeader from './UtilsChat/StatusComponent'
import { useChat } from '../contexts/ChatContext'
import { useChatSubmit } from './Utils/CustomHook'
import { LoadingDots } from './UtilsChat/LoadingDots'
import { MessageText } from './UtilsChat/MessageText'

const Chat: FC = () => {
    const { status, isChatOpen, setIsChatOpen } = useChat()
    const { word, setWord, messages, isLoading, handleSubmit } = useChatSubmit()
    const [showChat, setShowChat] = useState<boolean>(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleContinue = () => setShowChat(true)
    const handleChat = () => setIsChatOpen(!isChatOpen)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWord(event.target.value)
    }

    return (
        <>
            <motion.div
                className="lottie-container"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleChat}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                }}
            >
                <Lottie
                    animationData={animation}
                    className="lottie-icon"
                    loop={true}
                />
            </motion.div>

            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        className="chat-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {!showChat ? (
                            <StartPage onContinue={handleContinue} />
                        ) : (
                            <>
                                <ChatHeader
                                    status={status}
                                    onClose={handleChat}
                                />
                                <motion.div
                                    className="chat-content max-h-[400px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{
                                                opacity: 0,
                                                x: message.isUser ? 20 : -20,
                                            }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                                                    message.isUser
                                                        ? 'bg-blue-500 text-white rounded-tr-none'
                                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                                }`}
                                            >
                                                <MessageText
                                                    text={message.text}
                                                    isUser={message.isUser}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start mb-4"
                                        >
                                            <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                                                <LoadingDots />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </motion.div>

                                <motion.div
                                    className="p-4 border-t border-gray-200"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <form
                                        onSubmit={handleSubmit}
                                        className="relative"
                                    >
                                        <input
                                            className="w-full px-4 py-3 rounded-full border-2 border-gray-200 
                                                focus:border-blue-500 focus:outline-none pr-12 transition-all duration-200"
                                            type="text"
                                            value={word}
                                            onChange={handleInputChange}
                                            placeholder="Type your message..."
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <motion.button
                                                type="submit"
                                                className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 
                                                    transition-colors duration-200 flex items-center justify-center"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                disabled={isLoading}
                                            >
                                                <TbArrowBadgeRightFilled
                                                    size={20}
                                                />
                                            </motion.button>
                                        </div>
                                    </form>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Chat
