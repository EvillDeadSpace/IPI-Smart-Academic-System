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
import AdminProfessorManagement from './components/Dashboard/AdminProfessorManagement'
import ProfessorBoard from './components/Dashboard/ProfessorBoard'
import StudentExams from './components/Faculty/StudentExams'
import Profile from './components/Dashboard/Profile/Profile'
import Settings from './components/Dashboard/Profile/ProfileSettings'
import StudentSchedule from './components/Faculty/StudentSchedule'
import About from './components/Pages/About'

// Protected Route Component - Reusable for different user types
interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles: string[]
    redirectTo?: string
}

const ProtectedRoute = ({
    children,
    allowedRoles,
    redirectTo = '/login',
}: ProtectedRouteProps) => {
    const { userType, isLoading } = useAuth()

    // Show loading while checking authentication
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

function App() {
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

    // Paths where header should be hidden (authenticated dashboards)
    const DASHBOARD_PATHS = ['/dashboard', '/profesor', '/admin']

    const shouldHideHeader = DASHBOARD_PATHS.some((path) =>
        location.pathname.startsWith(path)
    )

    return (
        <div className="min-h-screen flex flex-col">
            {!shouldHideHeader && <Header />}
            <main className="flex-1">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HeroSite />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />

                    {/* Student Dashboard - Protected */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['STUDENT']}>
                                <MainBoard />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="scheduleexam" element={<StudentExams />} />
                        <Route
                            path="studentschedule"
                            element={<StudentSchedule />}
                        />
                    </Route>

                    {/* Professor Dashboard - Protected */}
                    <Route
                        path="/profesor"
                        element={
                            <ProtectedRoute allowedRoles={['PROFESSOR']}>
                                <ProfessorBoard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Panel - Protected */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/professors"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminProfessorManagement />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
