import React from 'react'
import { IconBook2 } from '@tabler/icons-react'

interface Subject {
    id: number
    name: string
    ects: number
    isRequired: boolean
    year: number
}

interface SubjectListProps {
    title: string
    subjects: Subject[]
    isElective?: boolean
    selectedElectives?: number[]
    onElectiveChange?: (subjectId: number) => void
}

const SubjectList: React.FC<SubjectListProps> = ({
    title,
    subjects,
    isElective = false,
    selectedElectives = [],
    onElectiveChange,
}) => {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-4">
                <IconBook2 className="w-6 h-6 text-blue-500" />
                <h2 className="text-lg font-semibold dark:text-white">
                    {title}
                </h2>
            </div>

            {subjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
                    Nema dostupnih predmeta
                </div>
            ) : (
                <div className="space-y-2">
                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-100 dark:border-neutral-700"
                        >
                            <div className="flex items-center gap-3">
                                {isElective && onElectiveChange && (
                                    <input
                                        type="checkbox"
                                        checked={selectedElectives.includes(
                                            subject.id
                                        )}
                                        onChange={() =>
                                            onElectiveChange(subject.id)
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700"
                                    />
                                )}
                                <div>
                                    <h3 className="font-medium dark:text-white">
                                        {subject.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {subject.ects} ECTS bodova
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                    {subject.ects} ECTS
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SubjectList
