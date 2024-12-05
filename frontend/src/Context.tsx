import React, { createContext, useContext, useState, useEffect } from 'react'

interface ChatContextType {
    status: boolean
    setStatus: React.Dispatch<React.SetStateAction<boolean>>
    isChatOpen: boolean
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
    children: React.ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [status, setStatus] = useState<boolean>(false)
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false)

    // Fetching the status from the server
    useEffect(() => {
        // Function to fetch status from the backend
        const fetchStatus = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/status')
                const data = await response.json()

                // Only update the status if it's different from the current one
                if (data.status !== status) {
                    setStatus(data.status) // Update status based on the response
                }
            } catch (error) {
                console.error('There was an error fetching the status!', error)
                setStatus(false) // Set status to false in case of an error
            }
        }

        // Fetch status initially
        fetchStatus()

        // Set interval to fetch status every 5 seconds
        const interval = setInterval(() => {
            fetchStatus()
        }, 5000) // 5000 milliseconds = 5 seconds

        // Cleanup function to clear interval when component is unmounted
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
