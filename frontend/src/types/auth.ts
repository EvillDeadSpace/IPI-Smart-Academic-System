import { useNavigate } from 'react-router-dom'
import { UserDetails } from './user'

export interface AuthContextType {
    studentName: string
    setStudentName: React.Dispatch<React.SetStateAction<string>>
    studentMail: string
    setStudentMail: React.Dispatch<React.SetStateAction<string>>
    userType: string
    setUserType: React.Dispatch<React.SetStateAction<string>>
    login: (userMail: string, userName: string, userType: string) => void
    logout: (navigate: ReturnType<typeof useNavigate>) => void
    userDetails: UserDetails | null
    setUserDetails: (details: UserDetails | null) => void
}
