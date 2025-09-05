// Animation for header

export const headerVariants = {
    initial: { y: -100 },
    animate: {
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
}

export const dropdownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 400, damping: 30 },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 },
    },
}

export const sidebarVariants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
        x: '100%',
        transition: { duration: 0.3 },
    },
}

// Text for header

export const navLinks = [
    { to: '/', text: 'Početna' },
    { to: '/about', text: 'O nama' },
    { to: '/programs', text: 'Studijski programi' },
    { to: '/news', text: 'Novosti' },
    { to: '/contact', text: 'Kontakt' },
]
