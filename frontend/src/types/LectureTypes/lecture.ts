export type LectureType = 'LECTURE' | 'EXERCISE'

export const LECTURE_TYPE_LABEL: Record<LectureType, string> = {
  LECTURE: 'Predavanje',
  EXERCISE: 'Vježbe',
}

export interface Lecture {
  id: number
  dayOfWeek: number
  type?: LectureType
  startDate?: string | null // ISO date (UTC midnight)
  endDate?: string | null
  plannedClasses?: number | null
  startTime: string
  endTime: string
  room: string
  createAt: string
  subjectId: number
  professorId: number
  subject?: {
    id: number
    name: string
    code: string
  }
  professor?: {
    id: number
    firstName: string
    lastName: string
    title: string
  }
}

export interface LectureFormData {
  subjectId: number | ''
  professorId: number | ''
  dayOfWeek: number | ''
  startTime: string
  endTime: string
  room: string
  type: LectureType
  startDate: string // YYYY-MM-DD, '' = not set
  endDate: string
}

export const DAY_NAMES = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']
