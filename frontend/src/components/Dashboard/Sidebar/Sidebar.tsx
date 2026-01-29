import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { links } from '../../../constants/links'
import { useAuth } from '../../../Context'
import { cn } from '../../../lib/utils'
import { Sidebar, SidebarBody, SidebarLink } from '../../ui/sidebar'
export const Logo = () => {
    const { studentMail } = useAuth()
    return (
        <Link
            to="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                {studentMail}
            </motion.span>
        </Link>
    )
}

export function SidebarDemo({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const { studentName } = useAuth()

    return (
        <div
            className={cn(
                ' flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden',
                'h-screen w-screen' // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <Sidebar open={open} setOpen={setOpen} animate={true}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <>
                            <Logo />
                        </>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, index) => (
                                <SidebarLink key={index} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: studentName,
                                to: '#',
                                icon: (
                                    <img
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            {children}
        </div>
    )
}
