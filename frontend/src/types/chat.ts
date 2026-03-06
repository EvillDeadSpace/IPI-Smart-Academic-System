// Chat types and interface

export interface ChatContextType {
    status: boolean
    isChatOpen: boolean
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export interface ChatProviderProps {
    children: React.ReactNode
}
