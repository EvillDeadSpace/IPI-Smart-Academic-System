import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import HeroSite from '../components/HeroSite'
import Login from '../components/Auth/Login'
import NotFound from '../components/Auth/NotFound'
import About from '../components/Pages/About'
import Programs from '../components/Pages/Programs'
import News from '../components/Pages/News'
import Contact from '../components/Pages/Contact'
import Profile from '../components/Dashboard/Profile/Profile'
import Settings from '../components/Dashboard/Profile/ProfileSettings'
import Calendar from '../components/Pages/Calendar'

// lazy load heavy dashboard parts
const MainBoard = lazy(() => import('../components/Dashboard/MainBoard'))
const Papirologija = lazy(() => import('../components/Faculty/Papirologija'))
const StudentExams = lazy(() => import('../components/Faculty/StudentExams'))
const StudentSchedule = lazy(
    () => import('../components/Faculty/StudentSchedule')
)
const ProfessorBoard = lazy(
    () => import('../components/Dashboard/ProfessorBoard')
)
const AdminPanel = lazy(() => import('../components/Dashboard/AdminBoard'))
const AdminProfessorManagement = lazy(
    () => import('../components/Dashboard/AdminProfessorManagement')
)

export default function AppRoutes() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    Loading...
                </div>
            }
        >
            <Routes>
                <Route path="/" element={<HeroSite />} />
                <Route path="/about" element={<About />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/news" element={<News />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />

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
                    <Route path="papirologija" element={<Papirologija />} />
                    <Route path="calendar" element={<Calendar />} />
                </Route>

                <Route
                    path="/profesor"
                    element={
                        <ProtectedRoute allowedRoles={['PROFESSOR']}>
                            <ProfessorBoard />
                        </ProtectedRoute>
                    }
                />
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
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    )
}
