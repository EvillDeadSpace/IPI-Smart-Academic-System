import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_ENDPOINTS, STORAGE_KEYS } from '../../constants/storage'
import { toastSuccess } from '../../lib/toast'

export default function useContextsHooks() {
    const navigate = useNavigate()
    const [studentName, setStudentName] = useState<string>('')
    const [studentMail, setStudentMail] = useState<string>('')
    const [userType, setUserType] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // Check if user is logged in on mount and restore session
    useEffect(() => {
        const storedMail = localStorage.getItem(STORAGE_KEYS.STUDENT_EMAIL)
        const storedName = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME)
        const storedUserType = localStorage.getItem(STORAGE_KEYS.STUDENT_TYPE)

        if (storedMail) {
            setStudentMail(storedMail)
            setStudentName(storedName || '')
            setUserType(storedUserType || '')
        }

        setIsLoading(false)
    }, [])

    // Fetch user details with useQuery
    const { data: userDetails = null } = useQuery({
        queryKey: ['userDetails', studentMail],
        queryFn: async () => {
            const response = await fetch(
                API_ENDPOINTS.USER_DETAILS(studentMail)
            )

            if (response.ok) {
                const details = await response.json()
                localStorage.setItem(
                    STORAGE_KEYS.USER_DETAILS,
                    JSON.stringify(details)
                )
                return details
            }

            if (response.status === 404) return null

            throw new Error('Failed to fetch user details')
        },
        enabled: !!studentMail,
        staleTime: 5 * 60 * 1000,
        initialData: () => {
            const cached = localStorage.getItem(STORAGE_KEYS.USER_DETAILS)
            return cached ? JSON.parse(cached) : null
        },
    })

    const login = useCallback(
        (userMail: string, userName: string, userType: string) => {
            setStudentMail(userMail)
            setStudentName(userName)
            setUserType(userType)

            localStorage.setItem(STORAGE_KEYS.STUDENT_EMAIL, userMail)
            localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, userName)
            localStorage.setItem(STORAGE_KEYS.STUDENT_TYPE, userType)
        },
        []
    )

    const logout = useCallback(() => {
        setStudentMail('')
        setStudentName('')
        setUserType('')
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
        isLoading,
        login,
        logout,
    }
}
