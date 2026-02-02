import {
    IconCalendarEvent,
    IconCalendarTime,
    IconClipboardList,
    IconFileText,
    IconLayoutDashboard,
    IconPencilPlus,
    IconUserCircle,
} from '@tabler/icons-react'
import { ReactNode } from 'react'
import { CiFacebook, CiInstagram, CiLinkedin, CiYoutube } from 'react-icons/ci'

interface DashboardTypes {
    label: string
    to: string
    icon: ReactNode
}

export const links: DashboardTypes[] = [
    {
        label: 'Dashboard',
        to: '/dashboard/home',
        icon: (
            <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: 'Profile',
        to: '/dashboard/profile',
        icon: (
            <IconUserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: 'Upis na godinu',
        to: '/dashboard/settings',
        icon: (
            <IconClipboardList className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: 'Nadolazeci ispiti',
        to: '/dashboard/scheduleexam',
        icon: (
            <IconCalendarEvent className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: 'Raspored predavanja',
        to: '/dashboard/studentschedule',
        icon: (
            <IconCalendarTime className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: 'Papirologija',
        to: '/dashboard/papirologija',
        icon: (
            <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: 'Kalendar',
        to: '/dashboard/calendar',
        icon: (
            <IconCalendarEvent className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: 'Zadaca',
        to: '/dashboard/homework',
        icon: (
            <IconPencilPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
]

// Footer Links
export const socialLinks = [
    {
        icon: CiYoutube,
        href: 'https://www.youtube.com/@ipi-akademija',
        label: 'YouTube',
        color: 'hover:text-red-400',
    },
    {
        icon: CiFacebook,
        href: 'https://www.facebook.com/ipiakademija',
        label: 'Facebook',
        color: 'hover:text-blue-400',
    },
    {
        icon: CiLinkedin,
        href: 'https://www.linkedin.com/school/ipi-akademija',
        label: 'LinkedIn',
        color: 'hover:text-blue-300',
    },
    {
        icon: CiInstagram,
        href: 'https://www.instagram.com/ipiakademija',
        label: 'Instagram',
        color: 'hover:text-pink-400',
    },
]

export const quickLinks = [
    { text: 'O nama', href: '/about' },
    { text: 'Studijski programi', href: '/programs' },
    { text: 'Novosti', href: '/news' },
    { text: 'Kontakt', href: '/contact' },
    { text: 'Upis', href: '/login' },
    { text: 'Student portal', href: '/login' },
]
