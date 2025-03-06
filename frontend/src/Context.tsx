import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
interface ChatContextType {
    status: boolean
    setStatus: React.Dispatch<React.SetStateAction<boolean>>
    isChatOpen: boolean
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
    studentName: string
    setStudentName: React.Dispatch<React.SetStateAction<string>>
    studentMail: string
    setStudentMail: React.Dispatch<React.SetStateAction<string>>
    userType: string
    setUserType: React.Dispatch<React.SetStateAction<string>>
    login: (userMail: string, userName: string, userType: string) => void
    logout: (navigate: ReturnType<typeof useNavigate>) => void
    userDetails: UserDetails | null
    setUserDetails: (details: UserDetails | null) => void
}

interface UserDetails {
    ime: string
    prezime: string
    email: string
    tipUsera: string
    indeks?: string
    godinaStudija?: string
    smjerStudija?: string
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
    children: React.ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [status, setStatus] = useState<boolean>(false)
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
    const [studentName, setStudentName] = useState<string>('')
    const [studentMail, setStudentMail] = useState<string>('')
    const [userType, setUserType] = useState<string>('')
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    //useNavigate

    // check user if login
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

    // Function to login the user
    const login = (userMail: string, userName: string, userType: string) => {
        setStudentMail(userMail)
        setStudentName(userName)
        setUserType(userType)
        localStorage.setItem('student mail', userMail)
        localStorage.setItem('student name', userName)
        localStorage.setItem('userType', userType)
    }

    //fetching user details for dashboard
    useEffect(() => {
        const storedMail = localStorage.getItem('student mail')
        if (storedMail) {
            fetchUserDetails(storedMail)
        }
    }, [studentMail])

    const fetchUserDetails = async (email: string) => {
        try {
            const response = await fetch(`http://localhost:8080/user/${email}`)
            if (response.ok) {
                const details = await response.json()
                setUserDetails(details)
                console.log(details + 'details')
                localStorage.setItem('userDetails', JSON.stringify(details))
            }
        } catch (error) {
            console.error('Error fetching user details:', error)
        }
    }

    // Function to logout the user
    const logout = (nav: ReturnType<typeof useNavigate>) => {
        setStudentMail('')
        setStudentName('')
        setUserType('')
        localStorage.removeItem('student mail')
        localStorage.removeItem('student name')
        localStorage.removeItem('userType')
        nav('/')
    }
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
        }, 500000000) // 5000 milliseconds = 5 seconds

        // Cleanup function to clear interval when component is unmounted
        return () => {
            clearInterval(interval) // Clear interval when the component is unmounted
        }
    }, [status])

    return (
        <ChatContext.Provider
            value={{
                status,
                setStatus,
                isChatOpen,
                setIsChatOpen,
                studentName,
                setStudentName,
                login,
                studentMail,
                setStudentMail,
                logout,
                userType,
                setUserType,
                userDetails,
                setUserDetails,
            }}
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
