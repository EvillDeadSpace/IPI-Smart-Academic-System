import { UserDetails } from './user'

export interface AuthContextType {
    studentName: string
    setStudentName: React.Dispatch<React.SetStateAction<string>>
    studentMail: string
    setStudentMail: React.Dispatch<React.SetStateAction<string>>
    userType: string
    setUserType: React.Dispatch<React.SetStateAction<string>>
    userDetails: UserDetails | null
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>
    isLoading: boolean
    login: (userMail: string, userName: string, userType: string) => void
    logout: () => void
}
