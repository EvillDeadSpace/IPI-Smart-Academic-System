import type { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarDemo } from './Sidebar/Sidebar'

const MainBoard: FC = () => {
    return (
        <div className="h-screen w-screen bg-slate-50">
            <SidebarDemo>
                <Outlet />
            </SidebarDemo>
        </div>
    )
}
export default MainBoard
