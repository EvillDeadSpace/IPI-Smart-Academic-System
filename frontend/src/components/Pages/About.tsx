'use client'
import { motion } from 'framer-motion'
import type { FC } from 'react'
import Chat from '../Chat'
import StickyScroll from '../ui/sticky-scroll-reveal'

// ─── Content panel: Misija ────────────────────────────────────────────────────
const MissionPanel = () => (
    <div className="relative flex h-full w-full flex-col justify-between p-8 bg-gradient-to-br from-blue-700 to-blue-600 overflow-hidden">
        {/* Large decorative number */}
        <span className="absolute -top-4 -right-2 text-[140px] font-syne font-bold text-white/5 leading-none select-none">
            01
        </span>

        <div className="relative z-10">
            <div className="w-12 h-1 bg-blue-400 rounded-full mb-6" />
            <h3 className="text-2xl font-syne font-bold text-white mb-4 leading-snug">
                Obrazovanje<br />za budućnost
            </h3>
            <p className="text-blue-200 text-sm leading-relaxed">
                Formiramo stručnjake koji predvode digitalnu transformaciju
                — kroz znanje koje ima vrijednost van učionice.
            </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 mt-auto">
            {['Praktična nastava', 'Industrijsko znanje', 'Mentorstvo', 'Karijerna podrška'].map((item) => (
                <div
                    key={item}
                    className="bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-blue-100 font-medium"
                >
                    {item}
                </div>
            ))}
        </div>
    </div>
)

// ─── Content panel: Istorija ─────────────────────────────────────────────────
const HistoryPanel = () => (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
        <img
            src="/ipizgrada.jpg"
            alt="IPI Akademija zgrada"
            className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/90 via-blue-700/60 to-blue-600/30" />

        <div className="relative z-10 flex flex-col justify-end h-full p-8">
            <div className="w-10 h-1 bg-blue-400 rounded-full mb-4" />
            <div className="flex items-end gap-4 mb-3">
                <span className="text-6xl font-syne font-bold text-white leading-snug">
                    2014
                </span>
                <span className="text-blue-300 text-sm mb-2 leading-snug">
                    Godina<br />osnivanja
                </span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
                Od skromnih početaka do vodećeg centra za IT obrazovanje
                u regionu — decenija posvećenosti kvalitetu.
            </p>

            <div className="flex gap-4 mt-5">
                {[
                    { n: '10+', l: 'Godina' },
                    { n: '1000+', l: 'Studenata' },
                    { n: '50+', l: 'Partnera' },
                ].map((s) => (
                    <div key={s.l} className="text-center">
                        <p className="text-xl font-syne font-bold text-white">{s.n}</p>
                        <p className="text-xs text-blue-300">{s.l}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// ─── Content panel: Vrijednosti ──────────────────────────────────────────────
const ValuesPanel = () => (
    <div className="relative flex h-full w-full flex-col justify-center p-8 bg-gradient-to-br from-blue-600 to-blue-500 overflow-hidden">
        <span className="absolute -top-4 -right-2 text-[140px] font-syne font-bold text-white/5 leading-none select-none">
            03
        </span>

        <div className="relative z-10">
            <div className="w-12 h-1 bg-blue-400 rounded-full mb-6" />
            <h3 className="text-2xl font-syne font-bold text-white mb-6">
                Što nas pokreće
            </h3>
        </div>

        <div className="relative z-10 space-y-3">
            {[
                { label: 'Inovacija', desc: 'Uvijek korak ispred', pct: '90' },
                { label: 'Kvaliteta', desc: 'Bez kompromisa', pct: '95' },
                { label: 'Integritet', desc: 'Povjerenje studenata', pct: '100' },
                { label: 'Izvrsnost', desc: 'Kontinuirani rast', pct: '88' },
            ].map((v) => (
                <div key={v.label}>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-semibold text-white">{v.label}</span>
                        <span className="text-xs text-blue-300">{v.desc}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${v.pct}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            ))}
        </div>
    </div>
)

// ─── Content panel: Statistike ───────────────────────────────────────────────
const StatsPanel = () => (
    <div className="relative flex h-full w-full flex-col justify-center p-8 bg-gradient-to-br from-blue-700 to-blue-600 overflow-hidden">
        <span className="absolute -top-4 -right-2 text-[140px] font-syne font-bold text-white/5 leading-none select-none">
            04
        </span>

        <div className="relative z-10 mb-6">
            <div className="w-12 h-1 bg-blue-400 rounded-full mb-4" />
            <h3 className="text-2xl font-syne font-bold text-white">
                Brojke koje<br />govore same
            </h3>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
            {[
                { value: '2000+', label: 'Diplomiranih studenata' },
                { value: '95%', label: 'Stopa zapošljavanja' },
                { value: '50+', label: 'Kompanija partnera' },
                { value: '15+', label: 'Godina iskustva' },
            ].map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white/6 border border-white/10 rounded-2xl p-4"
                >
                    <p className="text-3xl font-syne font-bold text-white leading-snug mb-1">
                        {stat.value}
                    </p>
                    <p className="text-xs text-blue-300 leading-snug">{stat.label}</p>
                </div>
            ))}
        </div>
    </div>
)

// ─── Content panel: Tim ──────────────────────────────────────────────────────
const TeamPanel = () => (
    <div className="relative flex h-full w-full flex-col justify-between p-8 bg-gradient-to-br from-blue-600 to-blue-500 overflow-hidden">
        <span className="absolute -top-4 -right-2 text-[140px] font-syne font-bold text-white/5 leading-none select-none">
            05
        </span>

        <div className="relative z-10">
            <div className="w-12 h-1 bg-white/60 rounded-full mb-6" />
            <h3 className="text-2xl font-syne font-bold text-white mb-2">
                Iskusni tim
            </h3>
            <p className="text-blue-100 text-sm">
                Akademsko znanje + industrijska praksa
            </p>
        </div>

        <div className="relative z-10 space-y-3 mt-auto">
            {[
                { role: 'Doktori nauka', count: '12', desc: 'Akademska ekspertiza' },
                { role: 'IT stručnjaci', count: '18', desc: 'Certifikovani praktičari' },
                { role: 'Industrijski mentori', count: '25+', desc: 'Direktna veza sa tržištem' },
            ].map((m) => (
                <div
                    key={m.role}
                    className="flex items-center gap-4 bg-white/10 border border-white/15 rounded-xl px-4 py-3"
                >
                    <span className="text-xl font-syne font-bold text-white min-w-[2.5rem]">
                        {m.count}
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-white leading-none mb-0.5">
                            {m.role}
                        </p>
                        <p className="text-xs text-blue-200">{m.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

// ─── Sections config ─────────────────────────────────────────────────────────
const content = [
    {
        title: 'Naša Misija',
        description:
            'Formirati stručnjake koji će biti lideri u digitalnoj transformaciji društva. Kroz inovativne studijske programe i praktičnu nastavu, pripremamo buduće eksperte koji će doprinijeti razvoju Bosne i Hercegovine i regiona.',
        content: <MissionPanel />,
        bg: 'from-blue-950 to-blue-900',
    },
    {
        title: 'Naša Istorija',
        description:
            'Osnovan 2014. godine, IPI se razvio od male privatne škole do vodećeg centra za informacione tehnologije. Tradicija kvalitetnog obrazovanja i partnerstva sa industrijskim liderima čine nas jedinstvenim na regionalnom nivou.',
        content: <HistoryPanel />,
        bg: 'from-blue-900 to-blue-800',
    },
    {
        title: 'Naše Vrijednosti',
        description:
            'Inovacija, kvaliteta i integritet su temelji našeg rada. Vjerujemo u praktičan pristup učenju, kontinuirano usavršavanje i etičko ponašanje. Naši studenti su u centru svega što radimo.',
        content: <ValuesPanel />,
        bg: 'from-blue-900 to-blue-700',
    },
    {
        title: 'Statistike i Uspjesi',
        description:
            'Preko 2.000 diplomiranih studenata, 95% stopa zapošljavanja u IT sektoru, partnerstva sa više od 50 kompanija. Rezultati koji govore o kvaliteti obrazovanja i uspjehu naših apsolventa.',
        content: <StatsPanel />,
        bg: 'from-blue-950 to-slate-900',
    },
    {
        title: 'Naš Tim',
        description:
            'Iskusni profesori koji kombinuju akademsko znanje sa praktičnim iskustvom iz industrije. Naš tim čine doktori nauka, certificirani IT stručnjaci i uspješni preduzetnici koji aktivno učestvuju u razvoju IT scene.',
        content: <TeamPanel />,
        bg: 'from-blue-800 to-blue-700',
    },
]

// ─── About page ──────────────────────────────────────────────────────────────
const About: FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
        >
            <div className="fixed bottom-4 right-4 z-50">
                <Chat />
            </div>

            {/* ── Intro Hero — h-dvh full screen ─────────────────────── */}
            <section className="relative h-dvh flex flex-col bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 overflow-hidden pt-20">
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
                {/* Radial light */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(96,165,250,0.12),transparent)]" />

                {/* ── Large watermark in center ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="text-[18vw] font-syne font-bold text-white/[0.03] leading-none tracking-tight whitespace-nowrap">
                        IPI
                    </span>
                </div>

                {/* ── Top label — below fixed header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 container mx-auto px-6 lg:px-16 pt-10"
                >
                    <span className="text-xs font-syne font-semibold tracking-widest uppercase text-blue-400">
                        Internacionalna poslovno-informaciona akademija · Tuzla
                    </span>
                </motion.div>

                {/* ── Main content — vertically centered ── */}
                <div className="flex-1 flex items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="container mx-auto px-6 lg:px-16"
                    >
                        <div className="w-14 h-1 bg-blue-400 rounded-full mb-6" />
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-syne font-bold text-white leading-[1.15] mb-6">
                            O nama
                        </h1>
                        <p className="text-lg md:text-xl text-blue-200 max-w-2xl leading-relaxed">
                            Više od decenije gradimo mostove između znanja i
                            industrije — kroz obrazovanje koje priprema studente
                            za stvarne izazove digitalnog svijeta.
                        </p>
                    </motion.div>
                </div>

                {/* ── Stats + scroll indicator — pinned to bottom ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="relative z-10 container mx-auto px-6 lg:px-16 pb-10"
                >
                    <div className="flex flex-wrap gap-10 mb-8 border-t border-white/10 pt-6">
                        {[
                            { value: '2014', label: 'Osnivanje' },
                            { value: '1000+', label: 'Aktivnih studenata' },
                            { value: '95%', label: 'Stopa zaposlenja' },
                            { value: '5', label: 'Studijskih programa' },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="text-2xl font-syne font-bold text-white">{s.value}</p>
                                <p className="text-xs text-blue-400 mt-0.5 tracking-wide">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Scroll indicator */}
                    <div className="flex items-center gap-3 text-blue-400">
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                            className="w-5 h-8 rounded-full border border-blue-400/50 flex items-start justify-center pt-1.5"
                        >
                            <div className="w-1 h-1.5 bg-blue-400 rounded-full" />
                        </motion.div>
                        <span className="text-xs font-syne tracking-widest uppercase">Skrolaj dolje</span>
                    </div>
                </motion.div>

                {/* Bottom bleed */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-blue-700" />
            </section>

            {/* ── Sticky scroll sections ──────────────────────────────────── */}
            <section className="relative w-full">
                <StickyScroll content={content} />
            </section>
        </motion.div>
    )
}

export default About
