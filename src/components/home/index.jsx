import React, { useEffect, useState } from "react";
import { useAuth } from '../../contexts/authContext';
import { generateDate, months } from '../../util/calendar';
import cn from '../../util/cn';
import dayjs from "dayjs";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import FocusMode from './FocusMode';
import TaskModal from './TaskModal';
import { firestore } from '../../firebase/firebase';
import { collection, doc, query, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import Sidebar from '../HomeNotes/Sidebar';
import NoteContainer from '../HomeNotes/NoteContainer';
import "../pomodoro/index.css";  // Add this for custom styling

const Home = () => {
  const { currentUser } = useAuth();
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);
  const [showModal, setShowModal] = useState(false);
  const [initialTaskValues, setInitialTaskValues] = useState({});
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(selectDate.format('YYYY-MM-DD'));
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchTasks = async () => {
        try {
          const userDoc = doc(firestore, "users", currentUser.email);
          const tasksCollection = collection(userDoc, "tasks");
          const tasksQuery = query(tasksCollection);
          const querySnapshot = await getDocs(tasksQuery);
          const tasksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setTasks(tasksData);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const fetchNotes = async () => {
        try {
          const userDoc = doc(firestore, "users", currentUser.email);
          const notesCollection = collection(userDoc, "notes");
          const notesQuery = query(notesCollection);
          const querySnapshot = await getDocs(notesQuery);
          const notesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setNotes(notesData);
        } catch (error) {
          console.error('Error fetching notes:', error);
        }
      };

      fetchNotes();
    }
  }, [currentUser]);

  const handleAddTask = async () => {
    if (currentUser) {
      try {
        const userDoc = doc(firestore, "users", currentUser.email);
        const tasksCollection = collection(userDoc, "tasks");
        const newTaskRef = await addDoc(tasksCollection, {
          name: taskName,
          description: description,
          priority: priority,
          due_date: dueDate,
          status: 'Not Started'
        });
        const newTask = { name: taskName, description, priority, due_date: dueDate, status: 'Not Started', id: newTaskRef.id };
        setTasks([...tasks, newTask]);
        setTaskName("");
        setDescription("");
        setPriority("Medium");
        setDueDate(selectDate.format('YYYY-MM-DD'));
        setShowModal(false);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const userDoc = doc(firestore, "users", currentUser.email);
      const taskDoc = doc(userDoc, "tasks", taskId);
      await deleteDoc(taskDoc);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateText = async (text, id) => {
    try {
      const userDoc = doc(firestore, "users", currentUser.email);
      const noteDoc = doc(userDoc, "notes", id);
      await updateDoc(noteDoc, { text });
      setNotes(notes.map(note => (note.id === id ? { ...note, text } : note)));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const addNote = async (color) => {
    if (currentUser) {
      try {
        const userDoc = doc(firestore, "users", currentUser.email);
        const notesCollection = collection(userDoc, "notes");
        const newNoteRef = await addDoc(notesCollection, {
          text: "",
          time: Date.now(),
          color,
        });
        const newNote = { id: newNoteRef.id, text: "", time: Date.now(), color };
        setNotes([...notes, newNote]);
      } catch (error) {
        console.error('Error adding note:', error);
      }
    }
  };

  const deleteNote = async (id) => {
    try {
      const userDoc = doc(firestore, "users", currentUser.email);
      const noteDoc = doc(userDoc, "notes", id);
      await deleteDoc(noteDoc);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'High':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const upcomingTasks = tasks.filter(t => dayjs(t.due_date).isAfter(currentDate))
    .sort((a, b) => dayjs(a.due_date).diff(dayjs(b.due_date)))
    .slice(0, 5);

  const tasksForSelectedDate = tasks.filter(t => dayjs(t.due_date).isSame(selectDate, 'day'));

  const openModalWithDate = (date) => {
    setShowModal(true);
    setInitialTaskValues({
      taskName: '',
      description: '',
      priority: 'Medium',
      dueDate: date.format('YYYY-MM-DD')
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col items-center">
      <div className="flex-1 flex flex-col pt-16 w-full max-w-7xl">
        <div className="flex w-full gap-10 h-auto items-start mt-12">
          <div className="w-2/3 h-auto">
            <h1 className="font-semibold text-gray-100">Upcoming Tasks</h1>
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, index) => (
                <div key={index} className="p-4 mb-4 bg-gray-800 rounded-lg cursor-pointer" onClick={() => setSelectedTask(task)}>
                  <h2 className="font-semibold text-gray-300">{task.name}</h2>
                  <p>{task.description}</p>
                  <p>{dayjs(task.due_date).toDate().toDateString()}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No upcoming tasks</p>
            )}
          </div>
          <div className="w-1/3 h-auto">
            <div className="flex justify-between text-gray-100">
              <h1 className="font-semibold">
                {months[today.month()]}, {today.year()}
              </h1>
              <div className="flex items-center gap-5 cursor-pointer">
                <GrFormPrevious className="w-5 h-5 cursor-pointer" onClick={() => {
                  setToday(today.subtract(1, 'month'));
                }} />
                <h1 className="cursor-pointer" onClick={() => {
                  setToday(currentDate);
                }}>Today</h1>
                <GrFormNext className="w-5 h-5 cursor-pointer" onClick={() => {
                  setToday(today.add(1, 'month'));
                }} />
              </div>
            </div>
            <div className="w-full grid grid-cols-7 text-gray-500">
              {days.map((day, index) => {
                return <h1 key={index} className="h-14 grid place-content-center text-sm">{day}</h1>
              })}
            </div>
            <div className="w-full grid grid-cols-7">
              {generateDate(today.month(), today.year()).map(({ date, currentMonth, today }, index) => {
                const tasksForDate = tasks.filter(t => dayjs(t.due_date).isSame(date, 'day'));
                return (
                  <div key={index} className="h-14 border-t border-gray-700 grid place-content-center text-sm relative">
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
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {tasksForDate.map((task, taskIndex) => (
                        <div key={taskIndex} className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <h1 className="font-semibold text-gray-100">Tasks for {selectDate.toDate().toDateString()}</h1>
              <div className="h-32 overflow-y-scroll">
                {tasksForSelectedDate.length > 0 ? (
                  tasksForSelectedDate.map((task, index) => (
                    <div key={index} className="p-4 mb-4 bg-gray-800 rounded-lg cursor-pointer" onClick={() => setSelectedTask(task)}>
                      <h2 className="font-semibold text-gray-300">{task.name}</h2>
                      <p>{task.description}</p>
                      <p>{dayjs(task.due_date).toDate().toDateString()}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No tasks for today</p>
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => openModalWithDate(selectDate)}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded shadow-lg text-gray-300">
              <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
              <input
                type="text"
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                placeholder="Task Name"
                value={initialTaskValues.taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                placeholder="Task Description"
                value={initialTaskValues.description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <select
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                value={initialTaskValues.priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <input
                type="date"
                className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                value={initialTaskValues.dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
        {selectedTask && (
          <TaskModal
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            task={selectedTask}
            currentUser={currentUser}
            onTaskDelete={handleTaskDelete}
          />
        )}
        <FocusMode isOpen={showFocusMode} onClose={() => setShowFocusMode(false)} />
        <div className="notes-section mt-12 flex w-full">
          <Sidebar addNote={addNote} />
          <NoteContainer notes={notes} deleteNote={deleteNote} updateText={updateText} />
        </div>
      </div>
    </div>
  );
};

export default Home;
