import type { FC } from 'react'

import { SidebarDemo } from './SIdebar/Sidebar'

const MainBoard: FC = () => {
    return (
        <div className="h-screen w-screen bg-gray-50">
            <SidebarDemo />
        </div>
    )
}
export default MainBoard
