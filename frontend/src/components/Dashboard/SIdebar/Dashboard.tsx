import { i } from 'motion/react-client'
import { useNavigate } from 'react-router-dom'
import Profile from '../Profile/Profile'
import Settings from '../Profile/ProfileSettings'

const Dashboard = ({ currentRoute }: { currentRoute: string }) => {
    const navigate = useNavigate()

    // Render different content based on the current route
    if (currentRoute === '/dashboard/settings') {
        return <Settings />
    }

    if (currentRoute === '/dashboard/profile') {
        return <Profile />
    }
    return (
        <div className="flex flex-1 ">
            <div className="p-2 md:p-5 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white flex flex-col gap-2 flex-1 w-full h-full">
                <div className="flex gap-2">
                    {[...new Array(4)].map((i) => (
                        <div
                            key={'first' + i}
                            className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800"
                        >
                            p
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 flex-1">
                    <div
                        key={'second' + i}
                        className=" w-full rounded-lg bg-gray-100 dark:bg-neutral-800 relative"
                    >
                        <img
                            src="https://www.moje-znanje.com/userfiles/jezicni%20savjetnik%2022-207_ispit%20ili%20test.jpg"
                            alt="User 2"
                            className="w-full h-full object-cover rounded-lg"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                            <h3 className="text-4xl font-semibold text-white">
                                Upis ispita za studente
                            </h3>
                        </div>
                    </div>
                    <div
                        key={'second' + i}
                        onClick={() => navigate('/studentexams')}
                        className=" w-full rounded-lg bg-gray-100 dark:bg-neutral-800 relative"
                    >
                        <img
                            src="https://cdn.create.microsoft.com/catalog-assets/en-us/78f3d7f2-0b23-4757-9ed6-de5f9512ff7d/thumbnails/1200/pastel-wall-calendar-3-1-DXIDDARGAY-8bcb72cce37d.webp"
                            alt="User 2"
                            className="object-cover rounded-lg w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                            <h3 className="text-4xl font-semibold text-white">
                                Raspored predavanja za studenta
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 flex-1 ">
                    <div
                        key={'second' + i}
                        className=" w-full rounded-lg bg-gray-100 dark:bg-neutral-800 relative"
                    >
                        <img
                            src="https://www.moje-znanje.com/userfiles/jezicni%20savjetnik%2022-207_ispit%20ili%20test.jpg"
                            alt="User 2"
                            className="w-full h-full object-cover rounded-lg"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                            <h3 className="text-4xl font-semibold text-white">
                                Upis ispita za studente
                            </h3>
                        </div>
                    </div>
                    <div
                        key={'second' + i}
                        onClick={() => navigate('/studentexams')}
                        className=" w-full rounded-lg bg-gray-100 dark:bg-neutral-800 relative"
                    >
                        <img
                            src="https://cdn.create.microsoft.com/catalog-assets/en-us/78f3d7f2-0b23-4757-9ed6-de5f9512ff7d/thumbnails/1200/pastel-wall-calendar-3-1-DXIDDARGAY-8bcb72cce37d.webp"
                            alt="User 2"
                            className="object-cover rounded-lg w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                            <h3 className="text-4xl font-semibold text-white">
                                Raspored predavanja za studenta
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
