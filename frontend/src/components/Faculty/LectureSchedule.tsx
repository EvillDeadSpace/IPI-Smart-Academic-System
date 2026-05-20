import { IconCalendarTime, IconChalkboard, IconMapPin } from '@tabler/icons-react'
import type { FC } from 'react'
import { useLecturesByStudent } from '../../hooks/lectureHooks/useLectureHooks'
import { DAY_NAMES, Lecture } from '../../types/LectureTypes/lecture'

const LectureSchedule: FC = () => {
  const { lectures, loading, error } = useLecturesByStudent()

  if (loading) {
    return (
      <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
        <div className="text-neutral-600 dark:text-neutral-400">Učitavanje rasporeda...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900 items-center justify-center">
        <div className="text-red-600 dark:text-red-400">Greška: {error}</div>
      </div>
    )
  }

  const byDay: Record<number, Lecture[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  lectures.forEach((l) => {
    if (byDay[l.dayOfWeek] !== undefined) byDay[l.dayOfWeek].push(l)
  })

  Object.values(byDay).forEach((dayLectures) =>
    dayLectures.sort((a, b) => a.startTime.localeCompare(b.startTime)),
  )

  return (
    <div className="flex flex-1 h-screen bg-white dark:bg-neutral-900">
      <div className="flex flex-1 overflow-auto border-l border-neutral-200 dark:border-neutral-700">
        <div className="p-6 flex flex-col gap-6 flex-1 w-full min-h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <IconCalendarTime className="h-7 w-7" />
              <h1 className="text-2xl font-semibold">Sedmični raspored predavanja</h1>
            </div>
            <p className="opacity-90 text-sm">
              {lectures.length === 0
                ? 'Nema predavanja za ovaj tjedan'
                : `${lectures.length} predavanja sedmično`}
            </p>
          </div>

          {/* Weekly grid */}
          {lectures.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center text-neutral-500 dark:text-neutral-400">
                <IconCalendarTime className="h-16 w-16 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">Nema predavanja</p>
                <p className="text-sm">Raspored još nije unesen od strane administracije.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {DAY_NAMES.map((dayName, dayIndex) => {
                const dayLectures = byDay[dayIndex]
                if (dayLectures.length === 0) return null
                return (
                  <div
                    key={dayIndex}
                    className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700"
                  >
                    <div className="px-6 py-3 border-b border-neutral-200 dark:border-neutral-700">
                      <h2 className="font-semibold text-neutral-900 dark:text-white">
                        {dayName}
                      </h2>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      {dayLectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800"
                        >
                          {/* Vreme */}
                          <div className="min-w-[90px] text-center">
                            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                              {lecture.startTime}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {lecture.endTime}
                            </p>
                          </div>

                          <div className="w-px h-10 bg-indigo-200 dark:bg-indigo-700" />

                          {/* Predmet */}
                          <div className="flex-1">
                            <p className="font-semibold text-neutral-900 dark:text-white">
                              {lecture.subject?.name ?? `Predmet #${lecture.subjectId}`}
                            </p>
                            {lecture.professor && (
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {lecture.professor.title} {lecture.professor.firstName}{' '}
                                {lecture.professor.lastName}
                              </p>
                            )}
                          </div>

                          {/* Sala */}
                          <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <IconMapPin className="h-4 w-4" />
                            <span>{lecture.room}</span>
                          </div>

                          {/* Kod */}
                          {lecture.subject?.code && (
                            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                              <IconChalkboard className="h-3 w-3" />
                              <span>{lecture.subject.code}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LectureSchedule
