import { Carousel, Card } from '../../components/ui/apple-cards-carousel'

const ProgramContent = ({
    title,
    features,
    description,
    src,
}: {
    title: string
    features: string[]
    description: string
    src: string
}) => {
    return (
        <div className="relative w-full h-full">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={src}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-800/80 hover:from-blue-900/70 hover:to-blue-800/60 transition-all duration-500" />
            </div>

            {/* Content */}
            <div className="relative h-full w-full p-8 md:p-14 overflow-y-auto">
                <div className="max-w-3xl space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {title}
                    </h3>
                    <p className="text-white/90 text-base md:text-lg">
                        {description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 bg-white/10 backdrop-blur-md 
                                         p-4 rounded-xl border border-white/20 hover:bg-white/20 
                                         transition-colors duration-300"
                            >
                                <div className="h-2 w-2 rounded-full bg-blue-400" />
                                <span className="text-white/90">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const data = [
    {
        category: 'Trogodišnji studij (180 ECTS)',
        title: 'Informacione tehnologije',
        src: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1920&auto=format&fit=crop',
        content: (
            <ProgramContent
                title="Razvoj softvera i digitalna budućnost"
                description="Program koji vas priprema za uspješnu karijeru u IT sektoru. Steknite praktična znanja iz programiranja, razvoja softvera i najnovijih tehnologija."
                features={[
                    'Full-stack razvoj',
                    'Cloud tehnologije',
                    'Mobilni razvoj',
                    'DevOps prakse',
                    'Cyber sigurnost',
                    'UI/UX dizajn',
                ]}
                src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1920&auto=format&fit=crop"
            />
        ),
    },
    {
        category: 'Trogodišnji studij (180 ECTS)',
        title: 'Tržišne komunikacije',
        src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop',
        content: (
            <ProgramContent
                title="Marketing u digitalnom dobu"
                description="Savladajte vještine modernog marketinga i komunikacija. Program koji spaja tradicionalne marketinške principe s digitalnim inovacijama."
                features={[
                    'Digitalni marketing',
                    'Content strategije',
                    'SEO optimizacija',
                    'Social media',
                    'Brend menadžment',
                    'Marketing analitika',
                ]}
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1920&auto=format&fit=crop"
            />
        ),
    },
    {
        category: 'Četverogodišnji studij (240 ECTS)',
        title: 'Informatika i računarstvo',
        src: 'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1920&auto=format&fit=crop',
        content: (
            <ProgramContent
                title="Napredne računarske nauke"
                description="Steknite duboko razumijevanje računarskih sistema i softverskog inženjerstva. Budite spremni za izazove moderne tehnologije."
                features={[
                    'Algoritmi i strukture podataka',
                    'Vještačka inteligencija',
                    'Machine Learning',
                    'Big Data',
                    'Računarske mreže',
                    'Softverska arhitektura',
                ]}
                src="https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1920&auto=format&fit=crop"
            />
        ),
    },
    {
        category: 'Četverogodišnji studij (240 ECTS)',
        title: 'Računovodstvo i finansije',
        src: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1920&auto=format&fit=crop',
        content: (
            <ProgramContent
                title="Finansije budućnosti"
                description="Program koji vas priprema za dinamičan svijet finansija i računovodstva. Naučite upravljati finansijskim procesima u digitalnom dobu."
                features={[
                    'Finansijska analiza',
                    'Digitalno bankarstvo',
                    'FinTech rješenja',
                    'Risk menadžment',
                    'Investicijsko planiranje',
                    'Blockchain tehnologije',
                ]}
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1920&auto=format&fit=crop"
            />
        ),
    },
    {
        category: 'Trogodišnji studij (180 ECTS)',
        title: 'Savremeno poslovanje',
        src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop',
        content: (
            <ProgramContent
                title="Poslovanje u digitalnoj eri"
                description="Razvijte poslovne i menadžerske vještine potrebne za uspjeh u modernom poslovnom okruženju. Budite lider digitalne transformacije."
                features={[
                    'Digitalna transformacija',
                    'Projektni menadžment',
                    'Poslovna analitika',
                    'E-commerce',
                    'Startup menadžment',
                    'Poslovna strategija',
                ]}
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop"
            />
        ),
    },
]

export function AppleCardsCarousel() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ))

    return (
        <div className="w-full h-full py-20 bg-gradient-to-b from-blue-50 to-white ">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 text-blue-600 ">
                    Studijski programi
                </h2>
                <p className="text-center text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto mb-16">
                    Izaberite svoj put ka uspjehu kroz naše moderne i tržišno
                    orijentisane studijske programe
                </p>
                <Carousel items={cards} />
            </div>
        </div>
    )
}
