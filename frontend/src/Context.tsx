import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { STORAGE_KEYS, API_ENDPOINTS } from './constants/storage'
import { UserDetails } from './types/user'
import { AuthContextType } from './types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [studentName, setStudentName] = useState<string>('')
    const [studentMail, setStudentMail] = useState<string>('')
    const [userType, setUserType] = useState<string>('')
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true) // NEW: Loading state

    // Check if user is logged in on mount and restore session
    useEffect(() => {
        const storedMail = localStorage.getItem(STORAGE_KEYS.STUDENT_EMAIL)
        const storedName = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME)
        const storedUserType = localStorage.getItem(STORAGE_KEYS.STUDENT_TYPE)
        const storedDetails = localStorage.getItem(STORAGE_KEYS.USER_DETAILS)

        if (storedMail) {
            setStudentMail(storedMail)
            setStudentName(storedName || '')
            setUserType(storedUserType || '')

            // Try to restore user details from localStorage first (faster)
            if (storedDetails) {
                try {
                    setUserDetails(JSON.parse(storedDetails))
                } catch (e) {
                    console.error('Failed to parse stored user details:', e)
                }
            }

            // Fetch fresh details in background (updates if data changed)
            fetchUserDetails(storedMail)
        }
        
        // Set loading to false after initial check
        setIsLoading(false)
    }, []) // Only run once on mount

    // Function to login the user
    const login = (userMail: string, userName: string, userType: string) => {
        setStudentMail(userMail)
        setStudentName(userName)
        setUserType(userType)

        // Persist to localStorage
        localStorage.setItem(STORAGE_KEYS.STUDENT_EMAIL, userMail)
        localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, userName)
        localStorage.setItem(STORAGE_KEYS.STUDENT_TYPE, userType)

        // Fetch user details after login
        fetchUserDetails(userMail)
    }

    const fetchUserDetails = async (email: string) => {
        try {
            const response = await fetch(API_ENDPOINTS.USER_DETAILS(email))

            if (response.ok) {
                const details = await response.json()
                setUserDetails(details)

                // Cache in localStorage for faster restoration on next session
                localStorage.setItem(
                    STORAGE_KEYS.USER_DETAILS,
                    JSON.stringify(details)
                )
            } else if (response.status === 404) {
                console.warn(`User not found: ${email}`)
                setUserDetails(null)
            } else {
                console.error(
                    `Failed to fetch user details: ${response.status}`
                )
            }
        } catch (error) {
            console.error('Error fetching user details:', error)
            // Keep existing cached data if fetch fails
        }
    }

    // Function to logout the user
    const logout = (nav: ReturnType<typeof useNavigate>) => {
        setStudentMail('')
        setStudentName('')
        setUserType('')
        setUserDetails(null) // Reset user details
        localStorage.removeItem(STORAGE_KEYS.STUDENT_EMAIL)
        localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME)
        localStorage.removeItem(STORAGE_KEYS.STUDENT_TYPE)
        localStorage.removeItem(STORAGE_KEYS.USER_DETAILS) // Remove cached details
        nav('/')
    }

    return (
        <AuthContext.Provider
            value={{
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
                isLoading, // NEW: Expose loading state
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
