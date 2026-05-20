import {
  IconArrowLeft,
  IconCalendarTime,
  IconCheck,
  IconMapPin,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context'
import { BACKEND_URL } from '../../constants/storage'
import { useAllLectures } from '../../hooks/lectureHooks/useLectureHooks'
import useFetchProfessorsData from '../../hooks/professorHooks/useFetchProfessorsData'
import { toastError, toastSuccess } from '../../lib/toast'
import { DAY_NAMES, LectureFormData } from '../../types/LectureTypes/lecture'

const EMPTY_FORM: LectureFormData = {
  subjectId: '',
  professorId: '',
  dayOfWeek: '',
  startTime: '',
  endTime: '',
  room: '',
}

const AdminLectureManagement: React.FC = () => {
  const navigate = useNavigate()
  const { studentName } = useAuth()
  const { professors, allSubjects, isLoading } = useFetchProfessorsData()
  const { lectures, loading: loadingLectures, refetch } = useAllLectures()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<LectureFormData>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const openModal = () => {
    setFormData(EMPTY_FORM)
    setIsModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/lecture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId: Number(formData.subjectId),
          professorId: Number(formData.professorId),
          dayOfWeek: Number(formData.dayOfWeek),
          startTime: formData.startTime,
          endTime: formData.endTime,
          room: formData.room,
        }),
      })

      if (response.ok) {
        toastSuccess('Predavanje uspješno kreirano!')
        setIsModalOpen(false)
        await refetch()
      } else {
        const err = await response.json()
        toastError(`Greška: ${err.error || 'Unknown error'}`)
      }
    } catch {
      toastError('Greška pri kreiranju predavanja')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Da li ste sigurni da želite obrisati ovo predavanje? Ova akcija je nepovratna.'))
      return

    try {
      const response = await fetch(`${BACKEND_URL}/api/lecture/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toastSuccess('Predavanje obrisano!')
        await refetch()
      } else {
        toastError('Greška pri brisanju predavanja')
      }
    } catch {
      toastError('Greška pri brisanju predavanja')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const byDay: Record<number, typeof lectures> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  lectures.forEach((l) => {
    if (byDay[l.dayOfWeek] !== undefined) byDay[l.dayOfWeek].push(l)
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-white/15 rounded-lg transition-colors"
                title="Nazad na Admin Panel"
              >
                <IconArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <IconCalendarTime className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-syne font-bold text-white leading-tight">
                  Upravljanje Rasporedom
                </h1>
                <p className="text-xs text-blue-100">{studentName || 'System Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white mb-8"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -right-8 -top-8 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs font-syne font-semibold tracking-widest uppercase text-blue-200 mb-2">
                IPI Akademija · Raspored
              </p>
              <h1 className="text-2xl font-syne font-bold mb-1">Upravljanje Predavanjima</h1>
              <p className="text-blue-100 text-sm opacity-90">
                Kreirajte i upravljajte sedmičnim rasporedom predavanja
              </p>
            </div>
            <motion.button
              onClick={openModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-semibold text-sm shadow-md hover:bg-blue-50 transition-colors duration-200 flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <IconPlus className="w-4 h-4" />
              Dodaj Predavanje
            </motion.button>
          </div>
        </motion.div>

        {/* Lectures Grid */}
        {loadingLectures ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : lectures.length > 0 ? (
          <div className="flex flex-col gap-5">
            {DAY_NAMES.map((dayName, dayIndex) => {
              const dayLectures = byDay[dayIndex].sort((a, b) =>
                a.startTime.localeCompare(b.startTime),
              )
              if (dayLectures.length === 0) return null
              return (
                <div key={dayIndex}>
                  <p className="text-xs font-syne font-semibold tracking-widest uppercase text-slate-400 mb-3">
                    {dayName}
                  </p>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.07 } },
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {dayLectures.map((lecture) => (
                      <motion.div
                        key={lecture.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                          },
                        }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                      >
                        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />

                        <div className="p-6 border-b border-slate-100 bg-blue-50/40">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <IconCalendarTime className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-3 min-w-0">
                              <h3 className="text-sm font-nuni font-bold text-slate-800">
                                {lecture.subject?.name ?? `Predmet #${lecture.subjectId}`}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {lecture.startTime} – {lecture.endTime}
                              </p>
                              {lecture.professor && (
                                <p className="text-xs text-blue-600 font-medium">
                                  {lecture.professor.title} {lecture.professor.firstName}{' '}
                                  {lecture.professor.lastName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-5 flex-1">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <IconMapPin className="w-4 h-4 text-slate-400" />
                            <span>{lecture.room}</span>
                          </div>
                          {lecture.subject?.code && (
                            <span className="inline-block mt-3 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100">
                              {lecture.subject.code}
                            </span>
                          )}
                        </div>

                        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                          <button
                            onClick={() => handleDelete(lecture.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-lg transition-colors duration-200"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                            Obriši
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
              <IconCalendarTime className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-nuni font-bold text-slate-600 mb-1">Nema predavanja</h3>
            <p className="text-sm text-slate-400 mb-6">
              Dodajte prvo predavanje klikom na dugme iznad.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-8 w-full max-w-lg border border-gray-200 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dodaj Novo Predavanje</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Popunite informacije o terminu predavanja
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
              >
                <IconX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Predmet */}
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Predmet *</label>
                  <select
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  >
                    <option value="">Odaberi predmet...</option>
                    {allSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profesor */}
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Profesor *</label>
                  <select
                    name="professorId"
                    value={formData.professorId}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  >
                    <option value="">Odaberi profesora...</option>
                    {professors.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} {p.firstName} {p.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dan */}
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Dan *</label>
                  <select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleChange}
                    required
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  >
                    <option value="">Odaberi dan...</option>
                    {DAY_NAMES.map((day, i) => (
                      <option key={i} value={i}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Početak */}
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Početak *</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    step="300"
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {['08:00','09:30','11:00','12:30','14:00','15:30','17:00','18:30','20:00'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, startTime: t }))}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          formData.startTime === t
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kraj */}
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium text-sm">Kraj *</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    step="300"
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all mb-2"
                  />
                  <div className="flex gap-1.5">
                    {[
                      { label: '1h', minutes: 60 },
                      { label: '1h 30min', minutes: 90 },
                      { label: '2h', minutes: 120 },
                      { label: '2h 30min', minutes: 150 },
                    ].map(({ label, minutes }) => (
                      <button
                        key={label}
                        type="button"
                        disabled={!formData.startTime}
                        onClick={() => {
                          if (!formData.startTime) return;
                          const [h, m] = formData.startTime.split(':').map(Number);
                          const total = h * 60 + m + minutes;
                          const endH = Math.floor(total / 60) % 24;
                          const endM = total % 60;
                          const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
                          setFormData((prev) => ({ ...prev, endTime }));
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        +{label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview termina */}
                {formData.startTime && formData.endTime && (
                  <div className="col-span-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-700">
                      {formData.startTime} – {formData.endTime}
                    </span>
                    <span className="text-xs text-blue-500">
                      {(() => {
                        const [sh, sm] = String(formData.startTime).split(':').map(Number);
                        const [eh, em] = String(formData.endTime).split(':').map(Number);
                        const diff = eh * 60 + em - (sh * 60 + sm);
                        if (diff <= 0) return '—';
                        const h = Math.floor(diff / 60);
                        const m = diff % 60;
                        return h > 0 && m > 0 ? `${h}h ${m}min` : h > 0 ? `${h}h` : `${m}min`;
                      })()}
                    </span>
                  </div>
                )}

                {/* Sala */}
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium text-sm">
                    Sala / Prostorija *
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    required
                    placeholder="npr. A101"
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg p-3 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 font-medium transition-all rounded-lg border border-gray-300"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  <IconCheck className="w-5 h-5" />
                  {submitting ? 'Kreiranje...' : 'Kreiraj'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminLectureManagement
