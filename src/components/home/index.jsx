import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/authContext'
import { generateDate, months } from '../../util/calendar'
import cn from '../../util/cn'
import dayjs from "dayjs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const Home = () => {
    const { currentUser } = useAuth();
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const currentDate = dayjs();
    const [today, setToday] = useState(currentDate);
    const [selectDate, setSelectDate] = useState(currentDate);
    const [showModal, setShowModal] = useState(false);
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const handleAddTask = () => {
        setTasks([...tasks, { date: selectDate, task }]);
        setTask("");
        setShowModal(false);
    };

    const upcomingTasks = tasks.filter(t => t.date.isAfter(today));

    return (
        <div className="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center">
            <div className="flex w-3/4 divide-x-2 gap-10 h-auto items-start">
                <div className="w-96 h-96">
                    <h1 className="font-semibold text-gray-100">Upcoming Tasks</h1>
                    {upcomingTasks.length > 0 ? (
                        upcomingTasks.map((task, index) => (
                            <div key={index} className="text-gray-400">
                                <h2 className="font-semibold text-gray-300">{task.date.toDate().toDateString()}</h2>
                                <p>{task.task}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No upcoming tasks</p>
                    )}
                </div>
                <div className="w-96 h-96">
                    <div className="flex justify-between text-gray-100">
                        <h1 className="font-semibold">
                            {months[today.month()]}, {today.year()}
                        </h1>
                        <div className="flex items-center gap-5 cursor-pointer">
                            <GrFormPrevious className="w-5 h-5 cursor-pointer" onClick={() => {
                                setToday(today.month(today.month() - 1));
                            }}/>
                            <h1 className="cursor-pointer" onClick={() => {
                                setToday(currentDate);
                            }}>Today</h1>
                            <GrFormNext className="w-5 h-5 cursor-pointer" onClick={() => {
                                setToday(today.month(today.month() + 1));
                            }}/>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-7 text-gray-500">
                        {days.map((day, index) => {
                            return <h1 key={index} className="h-14 grid place-content-center text-sm">{day}</h1>
                        })}
                    </div>
                    <div className="w-full grid grid-cols-7">
                        {generateDate(today.month(), today.year()).map(({ date, currentMonth, today }, index) => {
                            return (
                                <div key={index} className="h-14 border-t border-gray-700 grid place-content-center text-sm">
                                    <h1
                                        className={cn(
                                            currentMonth ? "text-gray-100" : "text-gray-500",
                                            today ? "bg-red-500 text-white" : "",
                                            selectDate.toDate().toDateString() === date.toDate().toDateString() ? "bg-gray-700 text-white" : "",
                                            "h-10 w-10 rounded-full grid place-content-center hover:bg-gray-700 hover:text-white transition-all cursor-pointer"
                                        )}
                                        onClick={() => {
                                            setSelectDate(date);
                                        }}
                                    >
                                        {date.date()}
                                    </h1>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="h-96 w-96">
                    <h1 className="font-semibold text-gray-100">Schedule for {selectDate.toDate().toDateString()}</h1>
                    {tasks.filter(task => task.date.toDate().toDateString() === selectDate.toDate().toDateString()).length > 0 ? (
                        tasks.filter(task => task.date.toDate().toDateString() === selectDate.toDate().toDateString()).map((task, index) => (
                            <p key={index} className="text-gray-400">{task.task}</p>
                        ))
                    ) : (
                        <p className="text-gray-400">No meetings for today</p>
                    )}
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={() => setShowModal(true)}
                    >
                        Add Task
                    </button>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded shadow-lg text-gray-300">
                        <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
                        <input
                            type="text"
                            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                            placeholder="Task Description"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                onClick={handleAddTask}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
