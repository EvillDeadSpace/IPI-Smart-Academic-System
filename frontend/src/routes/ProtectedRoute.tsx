import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context'

interface Props {
    allowedRoles: string[]
    redirectTo?: string
    children: React.ReactNode
}

export default function ProtectedRoute({
    allowedRoles,
    redirectTo = '/login',
    children,
}: Props) {
    const { userType, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!userType || !allowedRoles.includes(userType)) {
        return <Navigate to={redirectTo} replace />
    }

    return <>{children}</>
}
