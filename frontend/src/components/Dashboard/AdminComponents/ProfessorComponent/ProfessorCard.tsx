import { IconUsers } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

function ProfessorCard() {
    const navigate = useNavigate()

    return (
        <div
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
            onClick={() => navigate('/admin/professors')}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                        <IconUsers className="w-6 h-6 text-green-600" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Upravljanje Profesorima
                </h3>
                <p className="text-sm text-gray-600">
                    Dodaj, izmijeni ili obriši profesore
                </p>
            </div>
            <div className="bg-green-50 px-6 py-3">
                <p className="text-xs text-green-700 font-medium">
                    Click to manage →
                </p>
            </div>
        </div>
    )
}

export default ProfessorCard
