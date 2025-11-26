// Chat types and interface

export interface ChatContextType {
    status: boolean
    setStatus: React.Dispatch<React.SetStateAction<boolean>>
    isChatOpen: boolean
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>
}
