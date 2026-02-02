import {
    IconBooks,
    IconCalendarTime,
    IconChalkboard,
    IconUserCircle,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import type { FC } from 'react'
import useFetchStudentData from '../../hooks/studentHooks/useStudentHooks'
import {
    fadeInUp,
    pageTransition,
    staggerContainer,
} from '../../lib/animations'
import {
    AnimatedCard,
    AnimatedCounter,
    AnimatedList,
    AnimatedListItem,
    FloatingElements,
} from '../ui'

const StudentSchedule: FC = () => {
    const { error, loading, scheduleData } = useFetchStudentData()

    if (loading) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        className="rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-600 mx-auto mb-4"
                    />
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Loading schedule...
                    </p>
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-2">
                        Error: {error}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        Check console for details
                    </p>
                </div>
            </div>
        )
    }

    if (!scheduleData) {
        return (
            <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
                <div className="text-neutral-600 dark:text-neutral-400">
                    No schedule data available
                </div>
            </div>
        )
    }

    // Group subjects by semester
    const semester1Subjects = scheduleData.subjects.filter(
        (s) => s.semester === 1
    )
    const semester2Subjects = scheduleData.subjects.filter(
        (s) => s.semester === 2
    )

    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-1 h-screen bg-white dark:bg-neutral-900 relative overflow-hidden"
        >
            <FloatingElements count={3} />
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700 relative z-10">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                    >
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-semibold mb-2"
                        >
                            📚 Raspored kurseva - Godina{' '}
                            {scheduleData.student.currentYear}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.9 }}
                            transition={{ delay: 0.3 }}
                        >
                            {scheduleData.student.majorName} -{' '}
                            {scheduleData.student.firstName}{' '}
                            {scheduleData.student.lastName}
                        </motion.p>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <AnimatedCard
                            delay={0.1}
                            className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg"
                                >
                                    <IconBooks className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </motion.div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Ukupno Predmeta
                                    </p>
                                    <AnimatedCounter
                                        value={scheduleData.totalSubjects}
                                        className="text-2xl font-semibold text-neutral-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard
                            delay={0.2}
                            className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg"
                                >
                                    <IconChalkboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </motion.div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Časova Sedmično
                                    </p>
                                    <AnimatedCounter
                                        value={scheduleData.requiredSubjects}
                                        className="text-2xl font-semibold text-neutral-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </AnimatedCard>
                        <AnimatedCard
                            delay={0.3}
                            className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg"
                                >
                                    <IconCalendarTime className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </motion.div>
                                <div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Izborni predmeti
                                    </p>
                                    <AnimatedCounter
                                        value={scheduleData.electiveSubjects}
                                        className="text-2xl font-semibold text-neutral-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </AnimatedCard>
                    </motion.div>

                    {/* Schedule Grid */}
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
                    >
                        <div className="p-6">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl font-semibold text-neutral-900 dark:text-white mb-4"
                            >
                                📅 Godišnji Raspored Predmeta
                            </motion.h2>
                            <div className="space-y-6">
                                {/* Semester 1 */}
                                {semester1Subjects.length > 0 && (
                                    <div className="space-y-3">
                                        <motion.h3
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-lg font-medium text-blue-600 dark:text-blue-400"
                                        >
                                            🌟 Semestar 1
                                        </motion.h3>
                                        <AnimatedList>
                                            {semester1Subjects.map(
                                                (subject, index) => (
                                                    <AnimatedListItem
                                                        key={subject.id}
                                                        index={index}
                                                    >
                                                        <AnimatedCard
                                                            delay={index * 0.05}
                                                            className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                                                        >
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                                            {
                                                                                subject.name
                                                                            }
                                                                        </h3>
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                                subject.isElective
                                                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                            }`}
                                                                        >
                                                                            {subject.isElective
                                                                                ? 'Izborni'
                                                                                : 'Obavezni'}
                                                                        </span>
                                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                            {
                                                                                subject.ects
                                                                            }{' '}
                                                                            ECTS
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <IconBooks className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    subject.code
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        {subject.professor && (
                                                                            <div className="flex items-center gap-2">
                                                                                <IconUserCircle className="h-4 w-4" />
                                                                                <span>
                                                                                    {
                                                                                        subject
                                                                                            .professor
                                                                                            .fullName
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AnimatedCard>
                                                    </AnimatedListItem>
                                                )
                                            )}
                                        </AnimatedList>
                                    </div>
                                )}

                                {/* Semester 2 */}
                                {semester2Subjects.length > 0 && (
                                    <div className="space-y-3">
                                        <motion.h3
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="text-lg font-medium text-blue-600 dark:text-blue-400"
                                        >
                                            ⭐ Semestar 2
                                        </motion.h3>
                                        <AnimatedList>
                                            {semester2Subjects.map(
                                                (subject, index) => (
                                                    <AnimatedListItem
                                                        key={subject.id}
                                                        index={index}
                                                    >
                                                        <AnimatedCard
                                                            delay={index * 0.05}
                                                            className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700"
                                                        >
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                                                            {
                                                                                subject.name
                                                                            }
                                                                        </h3>
                                                                        <span
                                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                                subject.isElective
                                                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                            }`}
                                                                        >
                                                                            {subject.isElective
                                                                                ? 'Izborni'
                                                                                : 'Obavezni'}
                                                                        </span>
                                                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                            {
                                                                                subject.ects
                                                                            }{' '}
                                                                            ECTS
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                                        <div className="flex items-center gap-2">
                                                                            <IconBooks className="h-4 w-4" />
                                                                            <span>
                                                                                {
                                                                                    subject.code
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        {subject.professor && (
                                                                            <div className="flex items-center gap-2">
                                                                                <IconUserCircle className="h-4 w-4" />
                                                                                <span>
                                                                                    {
                                                                                        subject
                                                                                            .professor
                                                                                            .fullName
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AnimatedCard>
                                                    </AnimatedListItem>
                                                )
                                            )}
                                        </AnimatedList>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default StudentSchedule
