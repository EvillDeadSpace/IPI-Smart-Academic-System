import { IconCalendarTime } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function LectureCard() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer overflow-hidden h-full flex flex-col"
      onClick={() => navigate('/admin/lectures')}
      whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(99,102,241,0.15)' }}
      transition={{ duration: 0.25 }}
    >
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-400" />

      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <IconCalendarTime className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-3xl font-syne font-bold text-slate-100 select-none leading-none">05</span>
        </div>

        <h3 className="text-base font-nuni font-bold text-slate-800 mb-1.5">
          Raspored predavanja
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Kreiraj i upravljaj sedmičnim rasporedom predavanja za studente
        </p>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors duration-200">
        <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors duration-200">
          Upravljaj rasporedom
        </span>
        <svg
          className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  )
}

export default LectureCard
