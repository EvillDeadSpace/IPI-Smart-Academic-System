import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <header className="bg-blue-500 shadow-sm sticky top-0 z-50">
            <nav
                className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
                aria-label="Global"
            >
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">IPIA</span>
                        <img
                            className="h-14 w-auto"
                            src="../../../public/logo.png"
                            alt=""
                        />
                    </a>
                </div>
                <div className="flex lg:hidden">
                    <GiHamburgerMenu
                        color="white"
                        className="ml-auto m-4 block md:hidden"
                        onClick={toggleSidebar}
                    />
                </div>
                <div className="hidden lg:flex lg:gap-x-12  ">
                    <div className="relative">
                        <button
                            type="button"
                            className="flex text-sm/6 font-semibold text-white"
                            aria-expanded="false"
                        >
                            Pocetna
                            <svg
                                className="size-5 flex-none text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                            ></svg>
                        </button>
                    </div>
                    <a href="#" className="text-sm/6 font-semibold text-white">
                        O nama
                    </a>
                    <a href="#" className="text-sm/6 font-semibold text-white">
                        Studijski programi
                    </a>
                    <a href="#" className="text-sm/6 font-semibold text-white">
                        Novosti
                    </a>
                    <a href="#" className="text-sm/6 font-semibold text-white">
                        Kontakt
                    </a>
                </div>
                <div className="hidden sm:justify-end lg:flex lg:flex-1 lg:justify-end"></div>
            </nav>
            <div className="lg:hidden" role="dialog" aria-modal="true">
                {isSidebarOpen && (
                    <>
                        <div className="fixed inset-0 z-10"></div>
                        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">
                                        Your Company
                                    </span>
                                    <img
                                        className="h-8 w-auto"
                                        src="../../../public/logo.png"
                                        alt=""
                                    />
                                </a>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={toggleSidebar}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <svg
                                        className="size-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        <div className="-mx-3">
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                                aria-controls="disclosure-1"
                                                aria-expanded="false"
                                            >
                                                Pocetna
                                            </button>
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                                aria-controls="disclosure-1"
                                                aria-expanded="false"
                                            >
                                                O nama
                                            </button>
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                                aria-controls="disclosure-1"
                                                aria-expanded="false"
                                            >
                                                Studijski programi
                                            </button>
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                                aria-controls="disclosure-1"
                                                aria-expanded="false"
                                            >
                                                Novosti
                                            </button>
                                            <button
                                                type="button"
                                                className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                                aria-controls="disclosure-1"
                                                aria-expanded="false"
                                            >
                                                Kontakt
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
