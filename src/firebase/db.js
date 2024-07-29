import { firestore } from './firebase';

const tasksCollection = (userId) => firestore.collection('users').doc(userId).collection('tasks');

// Add a new task
export const addTask = async (userId, task) => {
  try {
    await tasksCollection(userId).add(task);
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

// Fetch tasks
export const fetchTasks = async (userId) => {
  try {
    const snapshot = await tasksCollection(userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tasks: ", error);
  }
};

// Update a task
export const updateTask = async (userId, taskId, updatedTask) => {
  try {
    await tasksCollection(userId).doc(taskId).update(updatedTask);
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};

// Delete a task
export const deleteTask = async (userId, taskId) => {
  try {
    await tasksCollection(userId).doc(taskId).delete();
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};
