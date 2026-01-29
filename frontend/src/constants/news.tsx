import {
    IconBriefcase,
    IconCalendar,
    IconCalendarEvent,
    IconTrophy,
    IconUsers,
} from '@tabler/icons-react'

// Category definitions with background images
export const categories = [
    {
        id: 'all',
        name: 'Sve',
        icon: IconCalendar,
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=85',
    },
    {
        id: 'achievements',
        name: 'Postignuća',
        icon: IconTrophy,
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=85',
    },
    {
        id: 'announcements',
        name: 'Obavještenja',
        icon: IconUsers,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85',
    },
    {
        id: 'partnerships',
        name: 'Partnerstva',
        icon: IconBriefcase,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85',
    },
    {
        id: 'events',
        name: 'Događaji',
        icon: IconCalendarEvent,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85',
    },
]
