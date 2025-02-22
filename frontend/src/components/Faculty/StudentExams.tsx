import type { FC } from 'react'

const StudentExams: FC = () => {
    return (
        <div className="flex flex-col items-center h-screen bg-background p-4">
            <h1 className="text-2xl font-bold mb-6 text-primary">
                Upcoming Exams
            </h1>

            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md w-full max-w-3xl">
                <h2 className="text-xl font-semibold mb-4">Exam Schedule</h2>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-secondary text-secondary-foreground p-4 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Mathematics 101
                            </h3>
                            <p className="text-sm">Date: October 15, 2023</p>
                            <p className="text-sm">Time: 10:00 AM - 12:00 PM</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                            Details
                        </button>
                    </div>
                    <div className="bg-secondary text-secondary-foreground p-4 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Physics 201
                            </h3>
                            <p className="text-sm">Date: October 20, 2023</p>
                            <p className="text-sm">Time: 1:00 PM - 3:00 PM</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                            Details
                        </button>
                    </div>
                    <div className="bg-secondary text-secondary-foreground p-4 rounded-lg shadow-md flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Chemistry 301
                            </h3>
                            <p className="text-sm">Date: October 25, 2023</p>
                            <p className="text-sm">Time: 9:00 AM - 11:00 AM</p>
                        </div>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                            Details
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md w-full max-w-3xl mt-6">
                <h2 className="text-xl font-semibold mb-4">Calendar</h2>
                <div className="grid grid-cols-7 gap-2">
                    <div className="text-center">Sun</div>
                    <div className="text-center">Mon</div>
                    <div className="text-center">Tue</div>
                    <div className="text-center">Wed</div>
                    <div className="text-center">Thu</div>
                    <div className="text-center">Fri</div>
                    <div className="text-center">Sat</div>
                </div>
            </div>
        </div>
    )
}
export default StudentExams
