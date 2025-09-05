import './App.css'
import { AuthProvider, useAuth } from './Context'
import { ChatProvider } from './contexts/ChatContext'
import HeroSite from './components/HeroSite'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom'
import NotFound from './components/Auth/NotFound'
import MainBoard from './components/Dashboard/MainBoard'
import Login from './components/Auth/Login'
import Header from './components/Header/Header'
import AdminPanel from './components/Dashboard/AdminBoard'
import ProfessorBoard from './components/Dashboard/ProfessorBoard'
import StudentExams from './components/Faculty/StudentExams'
import Profile from './components/Dashboard/Profile/Profile'
import Settings from './components/Dashboard/Profile/ProfileSettings'
import { useState, useEffect } from 'react'
import StudentSchedule from './components/Faculty/StudentSchedule'

// Create a protected route component
const ProtectedProfessorRoute = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const { userType } = useAuth()

    if (userType !== 'PROFESOR') {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

function App() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate initial loading time
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000) // Adjust time as needed

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="grid place-items-center">
                    <svg
                        className="w-16 h-16 animate-spin text-gray-900/50"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                    >
                        <path
                            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                        <path
                            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-900"
                        ></path>
                    </svg>
                    <p className="mt-4 text-xl font-semibold text-gray-700">
                        Loading...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-x-hidden hide-scrollbar">
            <AuthProvider>
                <ChatProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </ChatProvider>
            </AuthProvider>
        </div>
    )
}

function AppContent() {
    const location = useLocation()
    const hideHeaderPaths = [
        '/dashboard',
        '/profesor',
        '/dashboard/profile',
        '/dashboard/settings',
        '/dashboard/scheduleexam',
        '/dashboard/studentschedule',
    ]

    const shouldRenderHeader = !hideHeaderPaths.includes(location.pathname)

    return (
        <div className="min-h-screen flex flex-col">
            {shouldRenderHeader && <Header />}
            <main className="flex-1">
                <Routes>
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route
                        path="/profesor"
                        element={
                            <ProtectedProfessorRoute>
                                <ProfessorBoard />
                            </ProtectedProfessorRoute>
                        }
                    />
                    <Route path="/" element={<HeroSite />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/dashboard" element={<MainBoard />}>
                        <Route path="settings" element={<Settings />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="scheduleexam" element={<StudentExams />} />
                        <Route
                            path="studentschedule"
                            element={<StudentSchedule />}
                        />
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
