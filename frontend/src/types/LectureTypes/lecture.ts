export interface Lecture {
  id: number
  dayOfWeek: number
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
}

export const DAY_NAMES = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']
