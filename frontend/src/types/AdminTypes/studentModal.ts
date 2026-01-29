export interface StudentModalProps {
    isOpen: boolean
    onClose: () => void
    formData: {
        firstName: string
        lastName: string
        email: string
        indexNumber: string
        dateOfBirth: string
        majorId: string
        password: string
    }
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void
    handleSubmit: (e: React.FormEvent) => void
}
