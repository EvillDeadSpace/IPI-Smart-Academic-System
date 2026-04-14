import { IconUsers } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function ProfessorCard() {
    const navigate = useNavigate()

    return (
        <motion.div
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm cursor-pointer overflow-hidden h-full flex flex-col"
            onClick={() => navigate('/admin/professors')}
            whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(37,99,235,0.15)' }}
            transition={{ duration: 0.25 }}
        >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400" />

            <div className="p-6 flex-1">
                {/* Icon + number */}
                <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <IconUsers className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-3xl font-syne font-bold text-slate-100 select-none leading-none">02</span>
                </div>

                <h3 className="text-base font-syne font-bold text-slate-800 mb-1.5">
                    Upravljanje Profesorima
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Dodaj, izmijeni ili obriši profesore iz sistema
                </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-200">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors duration-200">
                    Upravljaj profesorima
                </span>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </motion.div>
    )
}

export default ProfessorCard
