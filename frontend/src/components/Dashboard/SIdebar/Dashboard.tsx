import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Profile from '../Profile/Profile'
import Settings from '../Profile/ProfileSettings'
import { useAuth } from '../../../Context'
import { BACKEND_URL } from '../../../constants/storage'
import {
    IconBook2,
    IconCalendarEvent,
    IconCertificate,
    IconChartBar,
} from '@tabler/icons-react'
import StudentExams from '../../Faculty/StudentExams'
import StudentSchedule from '../../Faculty/StudentSchedule'
import Papirologija from '../../Faculty/Papirologija'

type ProgressShape = {
    progress: {
        passedSubjects: number
        totalSubjects: number
        totalECTSEarned: number
        enrolledECTS: number
    }
}

type GradeShape = { grade: number }

const Dashboard = ({ currentRoute }: { currentRoute: string }) => {
    const navigate = useNavigate()
    const { studentMail } = useAuth()

    const [progress, setProgress] = useState<ProgressShape | null>(null)
    const [grades, setGrades] = useState<GradeShape[]>([])

    useEffect(() => {
        if (!studentMail) return

        const fetchData = async () => {
            try {
                const p = await fetch(
                    `${BACKEND_URL}/api/student/progress/${studentMail}`
                )
                if (p.ok) setProgress((await p.json()) as ProgressShape)
                const g = await fetch(
                    `${BACKEND_URL}/api/student/grades/${studentMail}`
                )
                if (g.ok) setGrades((await g.json()) as GradeShape[])
            } catch (e) {
                console.error('Dashboard fetch error', e)
            }
        }

        fetchData()
    }, [studentMail])

    if (currentRoute === '/dashboard/settings') {
        return <Settings />
    }

    if (currentRoute === '/dashboard/profile') {
        return <Profile />
    }

    if (currentRoute === '/dashboard/scheduleexam') {
        return <StudentExams />
    }

    if (currentRoute === '/dashboard/studentschedule') {
        return <StudentSchedule />
    }

    if (currentRoute === '/dashboard/papirologija') {
        return <Papirologija />
    }

    return (
        // Outer container with background
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            {/* Scrollable container with border */}
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                {/* Content container with padding */}
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            Dobrodošli na Studentski Portal
                        </h1>
                        <p className="opacity-90">
                            Pristupite svim važnim informacijama na jednom
                            mjestu
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            {
                                title: 'Položeni predmeti',
                                value: progress
                                    ? `${progress.progress.passedSubjects}/${progress.progress.totalSubjects}`
                                    : '—',
                                icon: <IconBook2 className="h-6 w-6" />,
                                color: 'bg-green-100 text-green-600 dark:bg-green-900/30',
                            },
                            {
                                title: 'Prosjek ocjena',
                                value:
                                    grades && grades.length
                                        ? (
                                              grades.reduce(
                                                  (s, g) => s + (g.grade || 0),
                                                  0
                                              ) / grades.length
                                          ).toFixed(2)
                                        : '—',
                                icon: <IconChartBar className="h-6 w-6" />,
                                color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
                            },
                            {
                                title: 'ECTS bodovi',
                                value: progress
                                    ? `${progress.progress.totalECTSEarned}/${progress.progress.enrolledECTS}`
                                    : '—',
                                icon: <IconCertificate className="h-6 w-6" />,
                                color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
                            },
                            {
                                title: 'Sljedeći ispit',
                                value: 'Provjerite raspored',
                                icon: <IconCalendarEvent className="h-6 w-6" />,
                                color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-md border border-neutral-200 dark:border-neutral-700 transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300"
                            >
                                <div
                                    className={`rounded-lg w-12 h-12 flex items-center justify-center mb-4 ${stat.color}`}
                                >
                                    {stat.icon}
                                </div>
                                <h3 className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                                    {stat.title}
                                </h3>
                                <p className="text-2xl font-semibold mt-1 text-neutral-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Main Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            onClick={() => navigate('/dashboard/scheduleexam')}
                            className="group cursor-pointer relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 aspect-[16/9] bg-white dark:bg-neutral-800"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Upis Ispita"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end p-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Upis Ispita
                                    </h3>
                                    <p className="text-neutral-200 text-sm">
                                        Prijavite ispite za naredni ispitni rok
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() =>
                                navigate('/dashboard/studentschedule')
                            }
                            className="group cursor-pointer relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 aspect-[16/9] bg-white dark:bg-neutral-800"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Raspored Predavanja"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end p-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        Raspored Predavanja
                                    </h3>
                                    <p className="text-neutral-200 text-sm">
                                        Pregledajte raspored predavanja i
                                        konsultacija
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                            Nedavne Aktivnosti
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    title: 'Položen ispit: Matematika 2',
                                    date: 'Prije 2 dana',
                                    grade: '9',
                                },
                                {
                                    title: 'Prijavljen ispit: Programiranje 3',
                                    date: 'Prije 5 dana',
                                    status: 'Na čekanju',
                                },
                                {
                                    title: 'Ovjeren semestar',
                                    date: 'Prije 7 dana',
                                    semester: 'Ljetni 2023/24',
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                                >
                                    <div>
                                        <p className="text-neutral-900 dark:text-white font-medium">
                                            {activity.title}
                                        </p>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {activity.date}
                                        </p>
                                    </div>
                                    {activity.grade && (
                                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                            Ocjena: {activity.grade}
                                        </span>
                                    )}
                                    {activity.status && (
                                        <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                                            {activity.status}
                                        </span>
                                    )}
                                    {activity.semester && (
                                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                                            {activity.semester}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
