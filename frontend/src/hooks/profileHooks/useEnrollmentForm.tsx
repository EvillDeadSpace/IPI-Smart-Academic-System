import { useCallback, useState } from 'react'

export function useEnrollmentForm() {
    const [selectedElectives, setSelectedElectives] = useState<number[]>([])
    const [selectedMajor, setSelectedMajor] = useState<string>('')
    const [selectedYear, setSelectedYear] = useState<string>('')

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

    return {
        selectedElectives,
        selectedMajor,
        selectedYear,
        handleMajorChange,
        handleYearChange,
        handleElectiveChange,
    }
}
