import { createContext, useContext, useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../constants/storage'

import { ChatContextType } from '../types/chat'

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
    children: React.ReactNode
}

// Context for Chat
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [status, setStatus] = useState<boolean>(false)
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false)

    useEffect(() => {
        // Function to fetch status from the backend
        const fetchStatus = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.STATUS_CHECK)
                const data = await response.json()

                // Only update the status if it's different from the current one
                if (data.status !== status) {
                    setStatus(data.status)
                }
            } catch {
                setStatus(false)
            }
        }

        fetchStatus()

        const interval = setInterval(() => {
            fetchStatus()
        }, 5000) // 5000 milliseconds = 5 seconds

        return () => {
            clearInterval(interval) // Clear interval when the component is unmounted
        }
    }, [status])

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
