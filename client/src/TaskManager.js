import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskCategory, setTaskCategory] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== '') {
      try {
        const response = await axios.post('/task', { task: newTask });
        setTasks([...tasks, response.data]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/tasks/${taskId}`);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const updateTask = async (taskId, updatedTitle, updatedDescription) => {
    try {
      await axios.put(`/tasks/${taskId}`, {
        title: updatedTitle,
        description: updatedDescription,
      });
  
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            title: updatedTitle,
            description: updatedDescription,
          };
        }
        return task;
      });
  
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleAddTask = async () => {
    if (taskTitle.trim() !== '') {
      try {
        const response = await axios.post('/tasks', {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          category: taskCategory,
        });
        setTasks([...tasks, response.data]);
        setTaskTitle('');
        setTaskDescription('');
        setTaskStatus('');
        setTaskCategory('');
        setShowModal(false);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  return (
    <div className="TaskManager container mt-5">
      <h1 className="mb-4">Task Manager</h1>
      <button className="btn btn-primary mb-3" onClick={handleModalShow}>
        Add Task
      </button>
      <table className="table table-editable table-nowrap align-middle table-edits" >
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.category}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => updateTask(task.id, task.title, task.description)}

                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
<div className="modal-content">
<div className="modal-header">
<h2 className="modal-title">Add Task</h2>
<button type="button" className="close" onClick={handleModalClose}>
<span>×</span>
</button>
</div>
<div className="modal-body">
<div className="form-group">
<label htmlFor="taskTitle">Title:</label>
<input
type="text"
id="taskTitle"
value={taskTitle}
onChange={(e) => setTaskTitle(e.target.value)}
className="form-control"
placeholder="Enter task title"
/>
</div>
<div className="form-group">
<label htmlFor="taskDescription">Description:</label>
<input
type="text"
id="taskDescription"
value={taskDescription}
onChange={(e) => setTaskDescription(e.target.value)}
className="form-control"
placeholder="Enter task description"
/>
</div>
<div className="form-group">
<label htmlFor="taskStatus">Status:</label>
<input
type="text"
id="taskStatus"
value={taskStatus}
onChange={(e) => setTaskStatus(e.target.value)}
className="form-control"
placeholder="Enter task status"
/>
</div>
<div className="form-group">
<label htmlFor="taskCategory">Category:</label>
<input
type="text"
id="taskCategory"
value={taskCategory}
onChange={(e) => setTaskCategory(e.target.value)}
className="form-control"
placeholder="Enter task category"
/>
</div>
</div>
<div className="modal-footer">
<button type="button" className="btn btn-primary" onClick={handleAddTask}>
Add
</button>
<button type="button" className="btn btn-secondary" onClick={handleModalClose}>
Cancel
</button>
</div>
</div>
</div>
</div>
)}
</div>
);
}

export default TaskManager;