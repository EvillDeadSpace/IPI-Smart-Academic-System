import { IconBook2, IconSchool } from '@tabler/icons-react'
import { useCallback } from 'react'
import { useAuth } from '../../../Context'
import {
    useEnrollmentForm,
    useEnrollStudent,
    useFetchMajors,
    useFilteredSubjects,
} from '../../../hooks/profileHooks/profileHooks'
import SubjectList from './SubjectList'

const EnrollmentForTheYear = () => {
    const { studentMail } = useAuth()

    // Form state management
    const {
        selectedElectives,
        selectedMajor,
        selectedYear,
        handleMajorChange,
        handleYearChange,
        handleElectiveChange,
    } = useEnrollmentForm()

    // Fetch majors data
    const { error, isLoading, majors } = useFetchMajors()

    // Filter subjects based on selection
    const { requiredSubjects, electiveSubjects } = useFilteredSubjects({
        majors,
        selectedMajor,
        selectedYear,
    })

    // Enrollment logic
    const {
        enrollStudent,
        isSubmitting,
        error: enrollError,
        setError: setEnrollError,
    } = useEnrollStudent()

    const handleSignup = useCallback(async () => {
        if (!selectedMajor || !selectedYear || selectedElectives.length === 0) {
            setEnrollError(
                'Molimo odaberite smjer, godinu i bar jedan izborni predmet'
            )
            return
        }

        const selectedMajorName = majors.find(
            (m) => m.id.toString() === selectedMajor
        )?.name

        const allSelectedSubjects = [
            ...requiredSubjects.map((subject) => subject.id),
            ...selectedElectives,
        ]

        await enrollStudent({
            email: studentMail,
            majorName: selectedMajorName,
            year: parseInt(selectedYear),
            subjects: allSelectedSubjects,
        })
    }, [
        selectedMajor,
        selectedYear,
        selectedElectives,
        requiredSubjects,
        majors,
        studentMail,
        enrollStudent,
        setEnrollError,
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
                        <>
                            {enrollError && (
                                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                                    {enrollError}
                                </div>
                            )}
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
                                            <option value="">
                                                Odaberi smjer
                                            </option>
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
                                            <option value="">
                                                Odaberi godinu
                                            </option>
                                            <option value="1">
                                                Prva godina
                                            </option>
                                            <option value="2">
                                                Druga godina
                                            </option>
                                            <option value="3">
                                                Treća godina
                                            </option>
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
                                            subjects={requiredSubjects.map(
                                                (s) => ({
                                                    id: s.id,
                                                    name: s.name,
                                                    ects: s.ects,
                                                    year: s.year,
                                                    isRequired: !s.isElective,
                                                })
                                            )}
                                        />
                                        <SubjectList
                                            title="Izborni predmeti"
                                            subjects={electiveSubjects.map(
                                                (s) => ({
                                                    id: s.id,
                                                    name: s.name,
                                                    ects: s.ects,
                                                    year: s.year,
                                                    isRequired: !s.isElective,
                                                })
                                            )}
                                            isElective={true}
                                            selectedElectives={
                                                selectedElectives
                                            }
                                            onElectiveChange={
                                                handleElectiveChange
                                            }
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
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EnrollmentForTheYear
