import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS, STORAGE_KEYS } from '../../constants/storage'
import { toastError, toastSuccess } from '../../lib/toast'
import { UserDetails } from '../../types/user'

export default function useContextsHooks() {
    const navigate = useNavigate()
    const [studentName, setStudentName] = useState<string>('')
    const [studentMail, setStudentMail] = useState<string>('')
    const [userType, setUserType] = useState<string>('')
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

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
                } catch {
                    toastError('Failed to parse cached user details.')
                }
            }

            // Fetch fresh details in background (updates if data changed)
            fetchUserDetails(storedMail)
        }

        // Set loading to false after initial check
        setIsLoading(false)
    }, []) // Only run once on mount

    const fetchUserDetails = useCallback(async (email: string) => {
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
                setUserDetails(null)
            }
        } catch {
            toastError('Failed to fetch user details from the server.')
        }
    }, [])

    const login = useCallback(
        (userMail: string, userName: string, userType: string) => {
            setStudentMail(userMail)
            setStudentName(userName)
            setUserType(userType)

            // Persist to localStorage
            localStorage.setItem(STORAGE_KEYS.STUDENT_EMAIL, userMail)
            localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, userName)
            localStorage.setItem(STORAGE_KEYS.STUDENT_TYPE, userType)

            // Fetch user details after login
            fetchUserDetails(userMail)
        },
        [fetchUserDetails]
    )

    // Function to logout the user
    const logout = useCallback(() => {
        setStudentMail('')
        setStudentName('')
        setUserType('')
        setUserDetails(null)
        localStorage.removeItem(STORAGE_KEYS.STUDENT_EMAIL)
        localStorage.removeItem(STORAGE_KEYS.STUDENT_NAME)
        localStorage.removeItem(STORAGE_KEYS.STUDENT_TYPE)
        localStorage.removeItem(STORAGE_KEYS.USER_DETAILS)
        setTimeout(() => {
            toastSuccess('Successfully logged out.')
            navigate('/')
        }, 1000)
    }, [navigate])

    return {
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
    }
}
