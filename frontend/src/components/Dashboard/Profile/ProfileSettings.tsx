import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useAuth } from '../../../Context'
import { BACKEND_URL } from '../../../constants/storage'
import SubjectList from './SubjectList'
import { IconBook2, IconSchool } from '@tabler/icons-react'
import { toastError, toastSuccess } from '../../../lib/toast'

interface Subject {
    id: number
    name: string
    code: string
    ects: number
    isElective: boolean
    year: number
    semester: number
}

interface Major {
    id: number
    name: string
    subjects: Subject[]
}

const Settings = () => {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [majors, setMajors] = useState<Major[]>([])
    const [selectedElectives, setSelectedElectives] = useState<number[]>([])
    const [selectedMajor, setSelectedMajor] = useState<string>('')
    const [selectedYear, setSelectedYear] = useState<string>('')
    const { studentMail } = useAuth()

    // Fetch majors and subjects from the backend
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_URL}/api/majors/with-subjects`
                )
                if (!response.ok) {
                    toastError('Neuspjelo dohvaćanje smjerova')
                    throw new Error('Neuspjelo dohvaćanje smjerova')
                }
                const data = await response.json()
                setMajors(data)
            } catch {
                setError('Neuspjelo učitavanje smjerova i predmeta')
                toastError('Neuspjelo učitavanje smjerova i predmeta')
            } finally {
                setIsLoading(false)
            }
        }

        fetchMajors()
    }, [])

    // Memoize the filtered subjects to avoid recalculation on every render
    const { requiredSubjects, electiveSubjects } = useMemo(() => {
        const major = majors.find((m) => m.id.toString() === selectedMajor)
        if (!major || !selectedYear)
            return { requiredSubjects: [], electiveSubjects: [] }

        const yearNum = parseInt(selectedYear)
        return {
            requiredSubjects: major.subjects.filter(
                (s) => !s.isElective && s.year === yearNum
            ),
            electiveSubjects: major.subjects.filter(
                (s) => s.isElective && s.year === yearNum
            ),
        }
    }, [selectedMajor, selectedYear, majors])

    const handleMajorChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedMajor(e.target.value)
            setSelectedElectives([]) // Reset electives when major changes
        },
        []
    )

    const handleYearChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedYear(e.target.value)
            setSelectedElectives([]) // Reset electives when year changes
        },
        []
    )

    const handleElectiveChange = useCallback((subjectId: number) => {
        setSelectedElectives((prev) => {
            // If already selected, remove it
            if (prev.includes(subjectId)) {
                return prev.filter((id) => id !== subjectId)
            }

            // If less than 2 subjects selected, add new one
            if (prev.length < 2) {
                return [...prev, subjectId]
            }

            // If already 2 subjects selected, replace the first one
            return [prev[1], subjectId]
        })
    }, [])

    const handleSignup = useCallback(async () => {
        if (!selectedMajor || !selectedYear || selectedElectives.length === 0) {
            setError(
                'Molimo odaberite smjer, godinu i bar jedan izborni predmet'
            )
            return
        }

        setIsSubmitting(true)
        setError(null)

        // Get the major name instead of ID
        const selectedMajorName = majors.find(
            (m) => m.id.toString() === selectedMajor
        )?.name

        // Combine required and selected elective subjects
        const allSelectedSubjects = [
            ...requiredSubjects.map((subject) => subject.id),
            ...selectedElectives,
        ]

        const requestData = {
            email: studentMail,
            majorName: selectedMajorName,
            year: parseInt(selectedYear),
            subjects: allSelectedSubjects,
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/student/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            })

            if (response.ok) {
                const result = await response.json()
                toastSuccess(`Upis uspješan! Ukupno ECTS: ${result.totalECTS}`)
                window.location.reload()
            } else {
                const errorData = await response.json()
                throw toastError(errorData.error || 'Neuspješan upis')
            }
        } catch (error) {
            if (error instanceof Error) {
                toastError(
                    error.message || 'Neuspješan upis. Pokušajte ponovo.'
                )
                setError(error.message || 'Neuspješan upis. Pokušajte ponovo.')
            } else {
                toastError('Neuspješan upis. Pokušajte ponovo.')
                setError('Neuspješan upis. Pokušajte ponovo.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }, [
        selectedMajor,
        selectedYear,
        selectedElectives,
        requiredSubjects,
        majors,
        studentMail,
    ])

    return (
        <div className="flex flex-1 h-screen dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            Upis u akademsku godinu
                        </h1>
                        <p className="opacity-90">
                            Odaberite svoj smjer i predmete za narednu godinu
                            studija
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Selection Cards Container */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Major Selection Card */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <IconSchool className="w-6 h-6 text-blue-500" />
                                        <h2 className="text-lg font-semibold dark:text-white">
                                            Odaberi smjer
                                        </h2>
                                    </div>
                                    <select
                                        value={selectedMajor}
                                        onChange={handleMajorChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Odaberi smjer</option>
                                        {majors.map((major) => (
                                            <option
                                                key={major.id}
                                                value={major.id}
                                            >
                                                {major.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year Selection Card */}
                                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <IconBook2 className="w-6 h-6 text-blue-500" />
                                        <h2 className="text-lg font-semibold dark:text-white">
                                            Odaberi godinu
                                        </h2>
                                    </div>
                                    <select
                                        value={selectedYear}
                                        onChange={handleYearChange}
                                        className="w-full p-3 bg-gray-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">Odaberi godinu</option>
                                        <option value="1">Prva godina</option>
                                        <option value="2">Druga godina</option>
                                        <option value="3">Treća godina</option>
                                        <option value="4">
                                            Četvrta godina
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Subjects Section */}
                            {selectedYear && selectedMajor && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SubjectList
                                        title="Obavezni predmeti"
                                        subjects={requiredSubjects.map((s) => ({
                                            id: s.id,
                                            name: s.name,
                                            ects: s.ects,
                                            year: s.year,
                                            isRequired: !s.isElective,
                                        }))}
                                    />
                                    <SubjectList
                                        title="Izborni predmeti"
                                        subjects={electiveSubjects.map((s) => ({
                                            id: s.id,
                                            name: s.name,
                                            ects: s.ects,
                                            year: s.year,
                                            isRequired: !s.isElective,
                                        }))}
                                        isElective={true}
                                        selectedElectives={selectedElectives}
                                        onElectiveChange={handleElectiveChange}
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            {selectedYear && selectedMajor && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleSignup}
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-400 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-blue-500/25"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Obrađuje se...</span>
                                            </div>
                                        ) : (
                                            'Potvrdi upis'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
