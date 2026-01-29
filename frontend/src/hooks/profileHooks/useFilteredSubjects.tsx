import { useMemo } from 'react'
import { Major } from '../../types/SubjectTypes/ProfileSettings'

interface UseFilteredSubjectsParams {
    majors: Major[]
    selectedMajor: string
    selectedYear: string
}

export function useFilteredSubjects({
    majors,
    selectedMajor,
    selectedYear,
}: UseFilteredSubjectsParams) {
    return useMemo(() => {
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
}
