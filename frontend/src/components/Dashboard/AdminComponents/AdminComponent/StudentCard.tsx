import { IconUserPlus } from '@tabler/icons-react'
import { useState } from 'react'
import StudentModal from './StudentModal'

interface StudentFormData {
    firstName: string
    lastName: string
    email: string
    indexNumber: string
    dateOfBirth: string
    majorId: string
    password: string
}

interface StudentCardProps {
    onSubmit: (formData: StudentFormData) => void
}

export default function StudentCard({ onSubmit }: StudentCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        indexNumber: '',
        dateOfBirth: '',
        majorId: '1',
        password: '',
    })

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        closeModal()
        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            indexNumber: '',
            dateOfBirth: '',
            majorId: '1',
            password: '',
        })
    }

    return (
        <>
            {/* Card */}
            <div
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 overflow-hidden"
                onClick={openModal}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <IconUserPlus className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Dodaj Studenta
                    </h3>
                    <p className="text-sm text-gray-600">
                        Kreiraj novi studentski nalog u sistemu
                    </p>
                </div>
                <div className="bg-blue-50 px-6 py-3">
                    <p className="text-xs text-blue-700 font-medium">
                        Click to add →
                    </p>
                </div>
            </div>

            {/* Modal */}
            <StudentModal
                isOpen={isOpen}
                onClose={closeModal}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </>
    )
}
