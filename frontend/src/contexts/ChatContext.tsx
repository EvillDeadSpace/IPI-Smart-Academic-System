import { createContext, useContext, useState } from 'react'

import { ChatContextType, ChatProviderProps } from '../types/chat'

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Custom hooks for fetch status
import useFetchStatus from '../hooks/chatHooks/useChatHooks'

// Context for Chat
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false)

    const { setStatus, status } = useFetchStatus()

    return (
        <ChatContext.Provider
            value={{ status, setStatus, isChatOpen, setIsChatOpen }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}
