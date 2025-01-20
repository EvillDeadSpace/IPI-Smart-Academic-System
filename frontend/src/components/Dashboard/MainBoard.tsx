import type { FC } from 'react'

const MainBoard: FC = () => {
    return (
        <>
            <h1 className="text-center mt-4 font-semibold text-4xl ">
                Dashboard za studenta
            </h1>
            <div className="flex justify-center items-center h-screen m-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                    <div className="bg-card text-card-foreground p-7 mb-5 rounded-lg shadow-md relative">
                        <img
                            src="https://www.moje-znanje.com/userfiles/jezicni%20savjetnik%2022-207_ispit%20ili%20test.jpg"
                            alt="User 2"
                            className="w-full h-full object-cover rounded-lg mb-4"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-white">
                                Upis ispita za studente
                            </h3>
                        </div>
                    </div>
                    <div className="bg-card text-card-foreground p-7 mb-5 rounded-lg shadow-md relative">
                        <img
                            src="https://cdn.create.microsoft.com/catalog-assets/en-us/78f3d7f2-0b23-4757-9ed6-de5f9512ff7d/thumbnails/1200/pastel-wall-calendar-3-1-DXIDDARGAY-8bcb72cce37d.webp"
                            alt="User 2"
                            className="w-full h-full object-cover rounded-lg mb-4"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-white">
                                Raspored predavanja za studenta
                            </h3>
                        </div>
                    </div>
                    <div className="bg-card text-card-foreground p-7 mb-5 rounded-lg shadow-md relative">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/771/771222.png"
                            alt="User 2"
                            className="w-full h-fit object-cover rounded-lg mb-4"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-white">
                                Broj bodova studenta
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MainBoard
