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
    console.log(studentMail + 'student mail')
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
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Prijava na godinu</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Godina studija
                    </label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                    >
                        <option value="">Odaberite godinu</option>
                        <option value="1">Prva godina</option>
                        <option value="2">Druga godina</option>
                        <option value="3">Treća godina</option>
                        <option value="4">Četvrta godina</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Smjer
                    </label>
                    <select
                        value={selectedMajor}
                        onChange={handleMajorChange}
                        className="w-full p-2 border rounded-md"
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

                {selectedMajor && (
                    <div>
                        <h3 className="text-lg font-medium mb-3">Predmeti</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-md font-medium mb-2">
                                    Obavezni predmeti:
                                </h4>
                                <ul className="list-disc pl-5">
                                    {majors
                                        .find(
                                            (m) =>
                                                m.id === Number(selectedMajor)
                                        )
                                        ?.subjects.filter((s) => s.isRequired)
                                        .map((subject) => (
                                            <li key={subject.id}>
                                                {subject.name} ({subject.ects}{' '}
                                                ECTS)
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-md font-medium mb-2">
                                    Izborni predmeti (odaberite 2):
                                </h4>
                                <div className="space-y-2">
                                    {majors
                                        .find(
                                            (m) =>
                                                m.id === Number(selectedMajor)
                                        )
                                        ?.subjects.filter((s) => !s.isRequired)
                                        .map((subject) => (
                                            <label
                                                key={subject.id}
                                                className="flex items-center"
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
                                                    className="mr-2"
                                                />
                                                {subject.name} ({subject.ects}{' '}
                                                ECTS)
                                            </label>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={
                        !selectedMajor ||
                        !selectedYear ||
                        selectedElectives.length !== 2
                    }
                >
                    Prijavi se na godinu
                </button>
            </form>
        </div>
    )
}

export default Settings
