import { AnimatedTestimonials } from '../ui/animated-testimonials'

export function TestimonialComponent() {
    const testimonials = [
        {
            quote: 'Praktični pristup i podrška profesora omogućili su mi da brzo naučim i primijenim znanje u stvarnim projektima. IPI mi je pružio odličnu osnovu za karijeru u IT-u.',
            name: 'Amir Hadžić',
            designation: 'Student Informacionih tehnologija',
            src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            quote: 'Studij Tržišnih komunikacija mi je otvorio oči za svijet marketinga. Praksa u renomiranim agencijama bila je neprocjenjivo iskustvo.',
            name: 'Lejla Karić',
            designation: 'Student Tržišnih komunikacija',
            src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            quote: 'Kombinacija poslovnih i informatičkih vještina na smjeru Savremeno poslovanje i informatički menadžment savršeno odgovara mojim ambicijama. Preporučio bih svima koji žele biti lideri u IT svijetu.',
            name: 'Haris Džafić',
            designation:
                'Student Savremenog poslovanja i informatičkog menadžmenta',
            src: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            quote: 'Informatika i računarstvo na IPI-ju su mi pružili duboko znanje i vještine koje su mi potrebne za razvoj softverskih rješenja. Praktični projekti su mi omogućili da se istaknem na tržištu rada.',
            name: 'Emina Smajlović',
            designation: 'Student Informatike i računarstva',
            src: 'https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            quote: 'Računovodstvo i finansije na IPI-ju su mi omogućili da steknem sve potrebne certifikate i znanje za uspješnu karijeru u finansijskom sektoru. Praksa u renomiranim firmama bila je ogroman plus.',
            name: 'Adnan Kovačević',
            designation: 'Student Računovodstva i finansija',
            src: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    ]
    return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
}
