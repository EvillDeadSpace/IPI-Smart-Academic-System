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

    // check user if login
    useEffect(() => {
        const storedMail = localStorage.getItem(STORAGE_KEYS.STUDENT_EMAIL)
        const storedName = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME)
        const storedUserType = localStorage.getItem(STORAGE_KEYS.STUDENT_TYPE)

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

        // This is from STORAGE KEYS hardcoded text
        localStorage.setItem(STORAGE_KEYS.STUDENT_EMAIL, userMail)
        localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, userName)
        localStorage.setItem(STORAGE_KEYS.STUDENT_TYPE, userType)
    }

    //fetching user details for dashboard
    useEffect(() => {
        const storedMail = localStorage.getItem(STORAGE_KEYS.STUDENT_EMAIL)
        if (storedMail) {
            fetchUserDetails(storedMail)
        }
    }, [studentMail])

    const fetchUserDetails = async (email: string) => {
        try {
            const response = await fetch(API_ENDPOINTS.USER_DETAILS(email))
            if (response.ok) {
                const details = await response.json()
                setUserDetails(details)
                console.log(details + 'details')
                localStorage.setItem(
                    STORAGE_KEYS.USER_DETAILS,
                    JSON.stringify(details)
                )
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
        localStorage.removeItem(STORAGE_KEYS.STUDENT_EMAIL)
        localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME)
        localStorage.removeItem(STORAGE_KEYS.STUDENT_TYPE)
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
