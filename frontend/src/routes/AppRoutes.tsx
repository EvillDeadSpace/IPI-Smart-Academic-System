import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/Auth/Login'
import NotFound from '../components/Auth/NotFound'
import HeroSite from '../components/HeroSite'
import About from '../components/Pages/About'
import Contact from '../components/Pages/Contact'
import News from '../components/Pages/News'
import Programs from '../components/Pages/Programs'
import ProtectedRoute from './ProtectedRoute'

// Lazy load dashboard components
const MainBoard = lazy(() => import('../components/Dashboard/MainBoard'))
const ProfessorBoard = lazy(
    () => import('../components/Dashboard/ProfessorBoard')
)
const AdminPanel = lazy(() => import('../components/Dashboard/AdminBoard'))
const AdminProfessorManagement = lazy(
    () => import('../components/Dashboard/AdminProfessorManagement')
)

// Lazy load student dashboard pages
const DashboardHome = lazy(
    () => import('../components/Dashboard/Sidebar/Dashboard')
)
const Profile = lazy(() => import('../components/Dashboard/Profile/Profile'))
const Settings = lazy(
    () => import('../components/Dashboard/Profile/ProfileSettings')
)
const StudentExams = lazy(() => import('../components/Faculty/StudentExams'))
const StudentSchedule = lazy(
    () => import('../components/Faculty/StudentSchedule')
)
const Papirologija = lazy(() => import('../components/Faculty/Papirologija'))
const Calendar = lazy(() => import('../components/Pages/Calendar'))
const Homework = lazy(() => import('../components/Pages/Homework'))

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
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="scheduleexam" element={<StudentExams />} />
                    <Route
                        path="studentschedule"
                        element={<StudentSchedule />}
                    />
                    <Route path="papirologija" element={<Papirologija />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="homework" element={<Homework />} />
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
