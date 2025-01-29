import React, { useEffect, useState } from 'react';
import './Task_Dashboard.css';
import { FaCheck, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const Task_Dashboard = () => {
    // Default list of tasks
    const defaultTasks = [
        {
            id: 1,
            title: 'Buy Groceries',
            description: 'Milk, Bread, Butter, Eggs, Cheese, Fruits, Vegetables, Snacks, Drinks, and Frozen Foods.',
            status: 'Pending',
        },
        {
            id: 2,
            title: 'Complete React Assignment',
            description: 'Finish React JS project by implementing routing, state management, and API integration.',
            status: 'Pending',
        }
    ];

    // State management
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [taskToEdit, setTaskToEdit] = useState(null);

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            setTasks(storedTasks);
        } else {
            setTasks(defaultTasks);
            localStorage.setItem('tasks', JSON.stringify(defaultTasks));
        }
    }, []);

    // Update localStorage whenever tasks change
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    // Add or update a task
    const addOrUpdateTask = () => {
        if (title && description) {
            if (taskToEdit) {
                // Update existing task and reset status to "Pending"
                const updatedTasks = tasks.map((task) =>
                    task.id === taskToEdit.id
                        ? { ...task, title, description, status: 'Pending' }  // Reset status
                        : task
                );
                setTasks(updatedTasks);
            } else {
                // Add new task
                const newTask = { title, description, status: 'Pending', id: Date.now() };
                setTasks([newTask, ...tasks]);
            }
            // Reset modal fields
            setTitle('');
            setDescription('');
            setIsModalOpen(false);
            setTaskToEdit(null);
        }
    };
    

    // Delete a task
    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    };

    // Edit a task
    const editTask = (task) => {
        setTaskToEdit(task);
        setTitle(task.title);
        setDescription(task.description);
        setIsModalOpen(true);
    };

    // Toggle task status between Pending and Completed
    const toggleStatus = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id && task.status === 'Pending'
                ? { ...task, status: 'Completed' }
                : task
        );
        setTasks(updatedTasks);
    };

    // Filter tasks based on search term
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Open modal for adding new task
    const openAddTaskModal = () => {
        setTaskToEdit(null);
        setTitle('');
        setDescription('');
        setIsModalOpen(true);
    };

    return (
        <div className="task-management">
            <header className="header">
                <h1>Task Management</h1>
            </header>
            
            {/* Search and Add Task section */}
            <div className="search-add-container">
                <h2 className='task-list-header'>Tasks List</h2>
                <div className='search-add-container-Inner-div'>
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search tasks"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="add-btn" onClick={openAddTaskModal}>
                        Add Task
                    </button>
                </div>
            </div>

            {/* Modal for Adding/Editing Tasks */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{taskToEdit ? 'Edit Task' : 'Add New Task'}</h2>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            className="input-field"
                            required
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            className="input-field"
                            rows="5"
                            required
                        ></textarea>
                        <div className='model-btn-container'>
                            <button onClick={() => setIsModalOpen(false)} className="close-btn">Close</button>
                            <button onClick={addOrUpdateTask} className="add-task-btn">
                                {taskToEdit ? 'Update Task' : 'Add Task'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Task List */}
            <div className="task-list">
                {filteredTasks.map((task) => (
                    <div key={task.id} className="task-card">
                        <h3>{task.title}</h3>
                        <p className='task-description'>{task.description}</p>
                        <div className="status">
                            <span className={task.status === 'Completed' ? 'completed-status' : 'pending-status'}>
                                {task.status}
                            </span>
                        </div>
                        <div className="button-group">
                            <button onClick={() => editTask(task)} className="edit-btn">
                                <FaEdit /> Edit
                            </button>
                            {task.status === 'Pending' && (
                                <button onClick={() => toggleStatus(task.id)} className="completed-btn">
                                    <FaCheck /> Mark as Completed
                                </button>
                            )}
                            <button onClick={() => deleteTask(task.id)} className="delete-btn">
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Task_Dashboard;