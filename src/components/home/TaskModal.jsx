// src/components/home/TaskModal.jsx
import React from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import dayjs from "dayjs";

const TaskModal = ({ isOpen, onClose, task, currentUser, onTaskDelete }) => {
  if (!isOpen) return null;

  const handleStatusChange = async (status) => {
    try {
      const taskDoc = doc(firestore, "users", currentUser.email, "tasks", task.id);
      await updateDoc(taskDoc, { status });
      onClose();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const taskDoc = doc(firestore, "users", currentUser.email, "tasks", task.id);
      await deleteDoc(taskDoc);
      onTaskDelete(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded shadow-lg text-gray-300">
        <h2 className="text-lg font-semibold mb-4">{task.name}</h2>
        <p className="mb-4">{task.description}</p>
        <p className="mb-4">{dayjs(task.due_date).toDate().toDateString()}</p>
        <div className="flex gap-4 mb-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => handleStatusChange('Completed')}
          >
            Mark as Completed
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
            onClick={() => handleStatusChange('In Progress')}
          >
            Mark as In Progress
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            onClick={() => handleStatusChange('Not Started')}
          >
            Mark as Not Started
          </button>
        </div>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete Task
        </button>
        <button
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
