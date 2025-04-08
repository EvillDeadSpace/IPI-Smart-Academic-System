import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ==============================
// Interfaces
// ==============================

/**
 * User details interface representing user information
 */
interface UserDetails {
    ime: string
    prezime: string
    email: string
    tipUsera: string
    indeks?: string
    godinaStudija?: string
    smjerStudija?: string
}

/**
 * Chat context interface defining all available context properties and methods
 */
interface ChatContextType {
    // Server status
    status: boolean
    setStatus: React.Dispatch<React.SetStateAction<boolean>>

    // Chat UI state
    isChatOpen: boolean
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>

    // User information
    studentName: string
    setStudentName: React.Dispatch<React.SetStateAction<string>>
    studentMail: string
    setStudentMail: React.Dispatch<React.SetStateAction<string>>
    userType: string
    setUserType: React.Dispatch<React.SetStateAction<string>>
    userDetails: UserDetails | null
    setUserDetails: (details: UserDetails | null) => void

    // Authentication methods
    login: (userMail: string, userName: string, userType: string) => void
    logout: (navigate: ReturnType<typeof useNavigate>) => void
}

/**
 * Props for the ChatProvider component
 */
interface ChatProviderProps {
    children: React.ReactNode
}

// Create the context with undefined default value
const ChatContext = createContext<ChatContextType | undefined>(undefined)

/**
 * ChatProvider component that manages the chat and user state
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    // ==============================
    // State Management
    // ==============================

    // Server and UI state
    const [status, setStatus] = useState<boolean>(false)
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false)

    // User authentication state
    const [studentName, setStudentName] = useState<string>('')
    const [studentMail, setStudentMail] = useState<string>('')
    const [userType, setUserType] = useState<string>('')
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

    // ==============================
    // Effects
    // ==============================

    /**
     * Check if user is logged in on component mount
     */
    useEffect(() => {
        const storedMail = localStorage.getItem('student mail')
        const storedName = localStorage.getItem('student name')
        const storedUserType = localStorage.getItem('userType')

        if (storedMail) {
            setStudentMail(storedMail)
            setStudentName(storedName || '')
            setUserType(storedUserType || '')
        }
    }, [])

    /**
     * Fetch user details when student email changes
     */
    useEffect(() => {
        const storedMail = localStorage.getItem('student mail')
        if (storedMail) {
            fetchUserDetails(storedMail)
        }
    }, [studentMail])

    /**
     * Monitor server status with polling
     */
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/status')
                const data = await response.json()

                // Only update the status if it's different from the current one
                if (data.status !== status) {
                    setStatus(data.status)
                }
            } catch (error) {
                console.error('There was an error fetching the status!', error)
                setStatus(false) // Set status to false in case of an error
            }
        }

        // Fetch status initially
        fetchStatus()

        // Set interval to fetch status every 5 seconds
        const interval = setInterval(fetchStatus, 5000)

        // Cleanup function to clear interval when component is unmounted
        return () => clearInterval(interval)
    }, [status])

    // ==============================
    // Helper Functions
    // ==============================

    /**
     * Fetch user details from the server
     */
    const fetchUserDetails = async (email: string) => {
        try {
            const response = await fetch(`http://localhost:8080/user/${email}`)
            if (response.ok) {
                const details = await response.json()
                setUserDetails(details)
                localStorage.setItem('userDetails', JSON.stringify(details))
            }
        } catch (error) {
            console.error('Error fetching user details:', error)
        }
    }

    /**
     * Login user and store credentials in localStorage
     */
    const login = (userMail: string, userName: string, userType: string) => {
        setStudentMail(userMail)
        setStudentName(userName)
        setUserType(userType)
        localStorage.setItem('student mail', userMail)
        localStorage.setItem('student name', userName)
        localStorage.setItem('userType', userType)
    }

    /**
     * Logout user, clear credentials and navigate to home
     */
    const logout = (nav: ReturnType<typeof useNavigate>) => {
        setStudentMail('')
        setStudentName('')
        setUserType('')
        localStorage.removeItem('student mail')
        localStorage.removeItem('student name')
        localStorage.removeItem('userType')
        nav('/')
    }

    // ==============================
    // Render
    // ==============================
    return (
        <ChatContext.Provider
            value={{
                // Server status
                status,
                setStatus,

                // Chat UI state
                isChatOpen,
                setIsChatOpen,

                // User information
                studentName,
                setStudentName,
                studentMail,
                setStudentMail,
                userType,
                setUserType,
                userDetails,
                setUserDetails,

                // Authentication methods
                login,
                logout,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

/**
 * Custom hook to use the chat context
 * @throws Error if used outside of ChatProvider
 * @returns ChatContextType
 */
export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}
