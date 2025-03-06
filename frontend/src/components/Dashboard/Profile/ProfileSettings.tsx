import React, { useState } from 'react'
import { useChat } from '../../../Context' // Adjust path as needed

interface Subject {
    id: number
    name: string
    ects: number
    isRequired: boolean
}

interface Major {
    id: number
    name: string
    subjects: Subject[]
}

const Settings = () => {
    const { studentMail } = useChat()
    const [selectedMajor, setSelectedMajor] = useState<string>('')
    const [selectedYear, setSelectedYear] = useState<string>('')
    const [selectedElectives, setSelectedElectives] = useState<number[]>([])
    const [majors] = useState<Major[]>([
        {
            id: 1,
            name: 'Računarstvo i informatika',
            subjects: [
                { id: 1, name: 'Programiranje I', ects: 6, isRequired: true },
                { id: 2, name: 'Matematika I', ects: 6, isRequired: true },
                { id: 3, name: 'Digitalna Logika', ects: 6, isRequired: true },
                {
                    id: 4,
                    name: 'Web Programiranje',
                    ects: 5,
                    isRequired: false,
                },
                { id: 5, name: 'Računarske Mreže', ects: 5, isRequired: false },
            ],
        },
        {
            id: 2,
            name: 'Elektroenergetika',
            subjects: [
                { id: 6, name: 'Elektrotehnika I', ects: 6, isRequired: true },
                { id: 7, name: 'Fizika', ects: 6, isRequired: true },
                { id: 8, name: 'Matematika I', ects: 6, isRequired: true },
                {
                    id: 9,
                    name: 'Energetska Elektronika',
                    ects: 5,
                    isRequired: false,
                },
                {
                    id: 10,
                    name: 'Električne Mašine',
                    ects: 5,
                    isRequired: false,
                },
            ],
        },
        {
            id: 3,
            name: 'Automatika i elektronika',
            subjects: [
                { id: 11, name: 'Elektronika I', ects: 6, isRequired: true },
                {
                    id: 12,
                    name: 'Signali i Sistemi',
                    ects: 6,
                    isRequired: true,
                },
                { id: 13, name: 'Matematika I', ects: 6, isRequired: true },
                {
                    id: 14,
                    name: 'Mikroprocesorski Sistemi',
                    ects: 5,
                    isRequired: false,
                },
                { id: 15, name: 'Senzori', ects: 5, isRequired: false },
            ],
        },
    ])

    const handleMajorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMajor(e.target.value)
        setSelectedElectives([]) // Reset electives when major changes
    }

    const handleElectiveChange = (subjectId: number) => {
        setSelectedElectives((prev) => {
            if (prev.includes(subjectId)) {
                return prev.filter((id) => id !== subjectId)
            }
            if (prev.length < 2) {
                return [...prev, subjectId]
            }
            return prev
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch(
                'http://localhost:8080/api/student/enroll',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: studentMail,
                        majorId: selectedMajor,
                        year: selectedYear,
                        electiveSubjects: selectedElectives,
                    }),
                }
            )

            if (response.ok) {
                alert('Uspješno ste se prijavili na godinu!')
            } else {
                throw new Error('Greška prilikom prijave')
            }
        } catch (error) {
            alert('Došlo je do greške prilikom prijave na godinu.')
            console.error(error)
        }
    }

    return (
        <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
            <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
                <div className="p-6 pb-6 flex flex-col gap-6 flex-1 w-full min-h-full">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <h1 className="text-2xl font-semibold mb-2">
                            Upis na godinu studija
                        </h1>
                        <p className="opacity-90">
                            Odaberite željenu godinu studija i smjer
                        </p>
                    </div>

                    {/* Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Year Selection Card */}
                        <div className="bg-white rounded-xl p-6 border border-neutral-200">
                            <h2 className="text-lg font-semibold mb-4 text-neutral-900">
                                Godina studija
                            </h2>
                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            >
                                <option value="">Odaberite godinu</option>
                                <option value="1">Prva godina</option>
                                <option value="2">Druga godina</option>
                                <option value="3">Treća godina</option>
                                <option value="4">Četvrta godina</option>
                            </select>
                        </div>

                        {/* Major Selection Card */}
                        <div className="bg-white rounded-xl p-6 border border-neutral-200">
                            <h2 className="text-lg font-semibold mb-4 text-neutral-900">
                                Smjer
                            </h2>
                            <select
                                value={selectedMajor}
                                onChange={handleMajorChange}
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                required
                            >
                                <option value="">Odaberite smjer</option>
                                {majors.map((major) => (
                                    <option key={major.id} value={major.id}>
                                        {major.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subjects Section */}
                    {selectedMajor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Required Subjects Card */}
                            <div className="bg-white rounded-xl p-6 border border-neutral-200">
                                <h2 className="text-lg font-semibold mb-4 text-neutral-900 flex items-center">
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm mr-2">
                                        Obavezno
                                    </span>
                                    Obavezni predmeti
                                </h2>
                                <div className="space-y-3">
                                    {majors
                                        .find(
                                            (m) =>
                                                m.id === Number(selectedMajor)
                                        )
                                        ?.subjects.filter((s) => s.isRequired)
                                        .map((subject) => (
                                            <div
                                                key={subject.id}
                                                className="flex items-center p-4 rounded-xl bg-neutral-50 border border-neutral-200"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-neutral-900">
                                                        {subject.name}
                                                    </h3>
                                                    <span className="text-sm text-neutral-500">
                                                        {subject.ects} ECTS
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Elective Subjects Card */}
                            <div className="bg-white rounded-xl p-6 border border-neutral-200">
                                <h2 className="text-lg font-semibold mb-4 text-neutral-900 flex items-center">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mr-2">
                                        Izborno
                                    </span>
                                    Izborni predmeti (odaberite 2)
                                </h2>
                                <div className="space-y-3">
                                    {majors
                                        .find(
                                            (m) =>
                                                m.id === Number(selectedMajor)
                                        )
                                        ?.subjects.filter((s) => !s.isRequired)
                                        .map((subject) => (
                                            <label
                                                key={subject.id}
                                                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                                    selectedElectives.includes(
                                                        subject.id
                                                    )
                                                        ? 'bg-blue-50 border-2 border-blue-500'
                                                        : 'bg-neutral-50 border border-neutral-200'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedElectives.includes(
                                                        subject.id
                                                    )}
                                                    onChange={() =>
                                                        handleElectiveChange(
                                                            subject.id
                                                        )
                                                    }
                                                    disabled={
                                                        !selectedElectives.includes(
                                                            subject.id
                                                        ) &&
                                                        selectedElectives.length >=
                                                            2
                                                    }
                                                    className="w-5 h-5 text-blue-600 rounded-md border-neutral-300"
                                                />
                                                <div className="ml-4 flex-1">
                                                    <h3 className="font-medium text-neutral-900">
                                                        {subject.name}
                                                    </h3>
                                                    <span className="text-sm text-neutral-500">
                                                        {subject.ects} ECTS
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                                !selectedMajor ||
                                !selectedYear ||
                                selectedElectives.length !== 2
                            }
                        >
                            Prijavi se na godinu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
