import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandYoutube,
    IconClock,
    IconMail,
    IconMapPin,
    IconPhone,
} from '@tabler/icons-react'

export const contactInfo = [
    {
        icon: <IconMapPin className="w-6 h-6" />,
        title: 'Adresa',
        info: 'Kulina bana br. 2',
        subInfo: '75000 Tuzla, BiH',
        color: 'from-blue-600 to-cyan-500',
    },
    {
        icon: <IconPhone className="w-6 h-6" />,
        title: 'Telefon',
        info: '+387 35 258 454',
        subInfo: 'Pon-Pet: 08:00 - 16:00h',
        color: 'from-purple-600 to-pink-500',
    },
    {
        icon: <IconMail className="w-6 h-6" />,
        title: 'Email',
        info: 'info@ipi-akademija.ba',
        subInfo: 'studentska@ipi-akademija.ba',
        color: 'from-orange-600 to-red-500',
    },
    {
        icon: <IconClock className="w-6 h-6" />,
        title: 'Radno vrijeme',
        info: 'Ponedjeljak - Petak',
        subInfo: '08:00 - 16:00h',
        color: 'from-green-600 to-teal-500',
    },
]

export const departments = [
    {
        name: 'Studentska služba',
        email: 'studentska@ipi-akademija.ba',
        phone: '+387 35 258 454',
        description: 'Za sve upite vezane za upis, dokumente i student servis',
    },
    {
        name: 'Dekanat',
        email: 'dekanat@ipi-akademija.ba',
        phone: '+387 35 258 455',
        description: 'Za akademska pitanja i saradnju',
    },
    {
        name: 'IT podrška',
        email: 'it@ipi-akademija.ba',
        phone: '+387 35 258 456',
        description: 'Tehnička podrška za student portal i sisteme',
    },
    {
        name: 'Marketing',
        email: 'marketing@ipi-akademija.ba',
        phone: '+387 35 258 457',
        description: 'Za saradnju, promociju i medijske upite',
    },
]

export const socialLinks = [
    {
        icon: <IconBrandFacebook />,
        url: 'https://www.facebook.com/ipiakademija',
        label: 'Facebook',
        color: 'hover:text-blue-600',
    },
    {
        icon: <IconBrandInstagram />,
        url: 'https://www.instagram.com/ipiakademija',
        label: 'Instagram',
        color: 'hover:text-pink-600',
    },
    {
        icon: <IconBrandLinkedin />,
        url: 'https://www.linkedin.com/school/ipi-akademija',
        label: 'LinkedIn',
        color: 'hover:text-blue-700',
    },
    {
        icon: <IconBrandYoutube />,
        url: 'https://www.youtube.com/@ipi-akademija',
        label: 'YouTube',
        color: 'hover:text-red-600',
    },
]
