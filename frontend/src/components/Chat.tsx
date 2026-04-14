import { AnimatePresence, motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { FC, useEffect, useRef, useState } from 'react'
import { TbArrowBadgeRightFilled } from 'react-icons/tb'
import animation from '../assets/wired-gradient-981-consultation-hover-conversation.json'

// Chat utils
import { useChat } from '../contexts/ChatContext'
import { useChatSubmit } from './Utils/CustomHook'
import { LoadingDots } from './UtilsChat/LoadingDots'
import { MessageText } from './UtilsChat/MessageText'
import StartPage from './UtilsChat/StartPage'
import ChatHeader from './UtilsChat/StatusComponent'

const Chat: FC = () => {
    // const for fast response in chat
    const fastResponse = [
        'Cijena fakulteta',
        'Smjerovi na fakultetu',
        'Lokacija fakulteta',
    ]

    const { status, isChatOpen, setIsChatOpen } = useChat()
    const { word, setWord, messages, isLoading, handleSubmit, rateLimitError } =
        useChatSubmit()
    const [showChat, setShowChat] = useState<boolean>(false)
    const [showFastResponses, setShowFastResponses] = useState<boolean>(true)
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

    const handleFastResponse = (text: string) => {
        setWord(text)
        setShowFastResponses(false) // Hide fast responses after selection
    }

    // Show fast responses only when there are no professor/AI messages
    // and the input is empty. Hide them when user types or when a
    // non-user message (professor/AI) appears in the conversation.
    useEffect(() => {
        const hasNonUserMessage = messages.some((m) => !m.isUser)

        if (word.trim() !== '' || hasNonUserMessage) {
            setShowFastResponses(false)
        } else {
            setShowFastResponses(true)
        }
    }, [word, messages])

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
                                    className="chat-content max-h-[400px] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent"
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
                                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                                                    message.isUser
                                                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-200'
                                                        : 'text-blue-900 rounded-tl-none'
                                                }`}
                                                style={!message.isUser ? {
                                                    background: 'rgba(239,246,255,0.9)',
                                                    border: '1px solid rgba(59,130,246,0.12)',
                                                } : undefined}
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
                                            <div className="p-4 rounded-2xl rounded-tl-none" style={{ background: 'rgba(239,246,255,0.9)', border: '1px solid rgba(59,130,246,0.12)' }}>
                                                <LoadingDots />
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </motion.div>

                                <AnimatePresence>
                                    {showFastResponses && (
                                        <motion.div
                                            className="flex flex-wrap gap-2 px-4 py-2"
                                            initial={{ opacity: 1, y: 0 }}
                                            exit={{
                                                opacity: 0,
                                                y: -10,
                                                height: 0,
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                ease: 'easeInOut',
                                            }}
                                        >
                                            {fastResponse.map((text, index) => (
                                                <motion.button
                                                    key={index}
                                                    className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                                                    onClick={() =>
                                                        handleFastResponse(text)
                                                    }
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                        duration: 0.3,
                                                    }}
                                                    whileHover={{
                                                        scale: 1.05,
                                                        y: -2,
                                                    }}
                                                    whileTap={{
                                                        scale: 0.95,
                                                    }}
                                                >
                                                    {text}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    className="p-4 border-t border-blue-100"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {rateLimitError && (
                                        <div className="mb-3 p-2 rounded-xl text-xs text-center text-amber-700 bg-amber-50 border border-amber-200">
                                            ⚠️ Limit dostignut. Pokušajte za 2 minute.
                                        </div>
                                    )}
                                    <form
                                        onSubmit={handleSubmit}
                                        className="relative"
                                    >
                                        <input
                                            className={`w-full px-4 py-3 rounded-full text-sm text-gray-800 placeholder-blue-300 focus:outline-none focus:border-blue-400 pr-12 transition-all duration-200 bg-white border border-blue-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            type="text"
                                            value={word}
                                            onChange={handleInputChange}
                                            placeholder={
                                                isLoading
                                                    ? 'Čekam odgovor...'
                                                    : 'Postavi pitanje...'
                                            }
                                            disabled={isLoading}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <motion.button
                                                type="submit"
                                                className={`p-2 rounded-full text-white transition-all duration-200 flex items-center justify-center ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-md shadow-blue-200'}`}
                                                whileHover={
                                                    isLoading
                                                        ? {}
                                                        : { scale: 1.1 }
                                                }
                                                whileTap={
                                                    isLoading
                                                        ? {}
                                                        : { scale: 0.9 }
                                                }
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
