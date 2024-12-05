import React, { FC } from 'react'
import { IoIosClose } from 'react-icons/io'
import { LuDot } from 'react-icons/lu'
import { RiRobot2Line } from 'react-icons/ri'

interface ChatHeaderProps {
    status: boolean
    onClose: () => void
}

const ChatHeader: FC<ChatHeaderProps> = ({ status, onClose }) => {
    return (
        <div className="flex items-center">
            <RiRobot2Line color="blue" size={46} className="m-2" />
            <div className="flex flex-col ml-2">
                <p className="text-blue-800 font-medium">IPI AI Chat</p>
                {!status ? (
                    <p className="text-red-700 flex items-center">
                        <LuDot size={24} className="ml-[-10px]" /> Offline
                    </p>
                ) : (
                    <p className="text-green-700 flex items-center">
                        <LuDot size={24} className="ml-[-10px]" /> Online
                    </p>
                )}
            </div>
            <IoIosClose
                size={38}
                className="ml-auto cursor-pointer"
                onClick={onClose}
            />
            <hr className="border-t-2 border-black-100 my-1" />
        </div>
    )
}

export default ChatHeader
