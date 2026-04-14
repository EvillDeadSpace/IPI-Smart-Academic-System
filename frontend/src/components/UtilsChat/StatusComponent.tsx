import { FC } from 'react'
import { IoIosClose } from 'react-icons/io'
import { RiRobot2Line } from 'react-icons/ri'

interface ChatHeaderProps {
    status: boolean
    onClose: () => void
}

const ChatHeader: FC<ChatHeaderProps> = ({ status, onClose }) => {
    return (
        <div
            className="flex items-center px-5 pt-4 pb-3 border-b border-blue-100"
            style={{ background: 'linear-gradient(90deg, rgba(239,246,255,0.9) 0%, rgba(248,251,255,0.8) 100%)' }}
        >
            {/* Robot avatar */}
            <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mr-3 flex-shrink-0"
                style={{
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(29,78,216,0.08) 100%)',
                    border: '1px solid rgba(59,130,246,0.2)',
                }}
            >
                <RiRobot2Line color="#2563eb" size={20} />
            </div>

            {/* Name + status */}
            <div className="flex flex-col min-w-0">
                <p className="text-blue-900 font-semibold text-sm leading-tight font-syne">IPI AI Chat</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={status ? { boxShadow: '0 0 5px rgba(16,185,129,0.7)' } : {}}
                    />
                    <span className={`text-xs font-medium ${status ? 'text-emerald-600' : 'text-red-500'}`}>
                        {status ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Close */}
            <button
                className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200 flex-shrink-0"
                onClick={onClose}
            >
                <IoIosClose size={20} />
            </button>
        </div>
    )
}

export default ChatHeader
