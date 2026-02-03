import React, { createContext, useContext } from 'react'
import useContextsHooks from './hooks/contextHooks/useContextHooks'
import { AuthContextType } from './types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Use custom hook to manage auth state and actions
    const {
        isLoading,
        studentMail,
        setStudentMail,
        studentName,
        setStudentName,
        userDetails,
        setUserDetails,
        userType,
        setUserType,
        login,
        logout,
    } = useContextsHooks()
    return (
        <AuthContext.Provider
            value={{
                studentName,
                setStudentName,
                studentMail,
                setStudentMail,
                userType,
                setUserType,
                userDetails,
                setUserDetails,
                isLoading,
                login,
                logout,
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
