// src/components/Kanban.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDrop, useDrag } from 'react-dnd';
import './Kanban.css'

const ItemType = 'TASK';


const Header = ({ name, id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [taskName, setTaskName] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        setTaskName(name);
    }, [name]);

    const headerApi = `http://localhost:5000/frameworks/${id}`;
    const deleteApikanban = `http://localhost:5000/kanban/delete_framework/${id}`;
    const deleteApi = `http://localhost:5000/frameworks/${id}`;
    const handleEdit = () => {
        setIsEditing(true);
    };

    const updateHeaderName = async () => {

        try {
            await axios.put(headerApi, { name: taskName });
        } catch (error) {
            console.error('Error updating task name:', error);
        }

    }

    const handleSave = () => {
        updateHeaderName();
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setTaskName(e.target.value);
    };

    const handelDelete = async () => {
        try {
            await axios.delete(deleteApi);
            await axios.delete(deleteApikanban)
            navigate('/')

        } catch (error) {
            console.error('Error deleting Framework:', error);
        }

    }
    return (
        <div className='head1'>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={taskName}
                        onChange={handleChange}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                        }}
                    />
                </div>
            ) : (
                <div className='head1' onDoubleClick={handleEdit}>
                    <p>{taskName}</p>
                    <button onClick={() => handelDelete()}>Delete</button>
                </div>
            )}
        </div>
    )
}

const DraggableTask = ({ task, index, moveTask, updateTaskName, deleteTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [taskName, setTaskName] = useState(task.name);

    const [, ref] = useDrag({
        type: ItemType,
        item: { id: task.id, index },
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log("Blurred")
        updateTaskName(task.id, taskName);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setTaskName(e.target.value);
    };

    return (
        <div ref={ref} className="task">
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={taskName}
                        onChange={handleChange}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                        }}
                    />
                </div>
            ) : (
                <div className='name' onDoubleClick={handleEdit}>
                    <p>{task.name}</p>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
            )}

        </div>
    );
};

const DroppableColumn = ({ column, tasks, moveTask, updateTaskName, deleteTask }) => {
    const [, ref] = useDrop({
        accept: ItemType,
        drop: (item) => moveTask(item.id, column),
    });

    return (
        <div ref={ref} className="column">
            <h2>{column}</h2>
            {tasks.map((task, index) => (
                <DraggableTask
                    key={task.id}
                    task={task}
                    index={index}
                    moveTask={moveTask}
                    updateTaskName={updateTaskName}
                    deleteTask={deleteTask}
                />
            ))}
        </div>
    );
};

function TextInput({ textValue, setTextValue }) {
    return (

        <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Enter text"
        />
    );
}

const Kanban = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [columns, setColumns] = useState({
        'To-Do': [],
        'In Progress': [],
        'Done': []
    });
    const [frameworkName, setFramework] = useState('');
    const { id } = useParams();
    const apiUrl = `http://localhost:5000/kanban/${id}`;
    const putApi = `http://localhost:5000/kanban/status_update`;
    const updateNameApi = `http://localhost:5000/kanban/update_name`;
    const deleteApi = `http://localhost:5000/kanban/delete_task`;

    useEffect(() => {
        console.log(id);

        axios.get(apiUrl).then(response => {
            const tasksData = response.data.tasks;
            const frameworkName = response.data.name;
            setFramework(frameworkName)
            console.log('Fetched tasks:', tasksData);
            setTasks(tasksData);

            const columnTasks = {
                'To-Do': tasksData.filter(task => task.status === 'To-Do'),
                'In Progress': tasksData.filter(task => task.status === 'In Progress'),
                'Done': tasksData.filter(task => task.status === 'Done')
            };
            setColumns(columnTasks);
            console.log('Column tasks:', columnTasks);
        }).catch(error => {
            console.error('Error fetching tasks:', error);
        });
    }, [apiUrl, putApi, id, frameworkName]);

    const addTask = async () => {
        if (taskName) {
            const task = {
                fwid: id,
                name: taskName,
                status: 'To-Do', // Assuming new tasks are added to the "To-Do" column
            };
            const newTask = await postTask(task);
            if (newTask) {
                // Update tasks state
                setTasks(prevTasks => [...prevTasks, newTask]);

                // Update columns state
                setColumns(prevColumns => ({
                    ...prevColumns,
                    'To-Do': [...prevColumns['To-Do'], newTask]
                }));

                setTaskName('');
            }
        }
    };

    const postTask = async (task) => {
        try {
            const response = await axios.post(apiUrl, task);
            return response.data; // Return the newly created task
        } catch (error) {
            console.error('There was an error making the POST request!', error);
        }
    };

    const moveTask = async (taskId, toColumn) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, status: toColumn };
            }
            return task;
        });

        setTasks(updatedTasks);

        try {
            await axios.put(putApi, { id: taskId, status: toColumn });
        } catch (error) {
            console.error('Error updating task:', error);
        }

        const columnTasks = {
            'To-Do': updatedTasks.filter(task => task.status === 'To-Do'),
            'In Progress': updatedTasks.filter(task => task.status === 'In Progress'),
            'Done': updatedTasks.filter(task => task.status === 'Done')
        };
        setColumns(columnTasks);
        console.log(columnTasks);
    };

    const updateTaskName = async (taskId, newName) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, name: newName };
            }
            return task;
        });

        setTasks(updatedTasks);

        try {
            await axios.put(updateNameApi, { id: taskId, name: newName });
        } catch (error) {
            console.error('Error updating task name:', error);
        }

        const columnTasks = {
            'To-Do': updatedTasks.filter(task => task.status === 'To-Do'),
            'In Progress': updatedTasks.filter(task => task.status === 'In Progress'),
            'Done': updatedTasks.filter(task => task.status === 'Done')
        };
        setColumns(columnTasks);
        console.log(columnTasks);
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`${deleteApi}/${taskId}`);
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);

            const columnTasks = {
                'To-Do': updatedTasks.filter(task => task.status === 'To-Do'),
                'In Progress': updatedTasks.filter(task => task.status === 'In Progress'),
                'Done': updatedTasks.filter(task => task.status === 'Done')
            };
            setColumns(columnTasks);
            console.log(columnTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div>
            <Header name={frameworkName} id={id} />
            <div className='addTask'>
                <TextInput
                    textValue={taskName}
                    setTextValue={setTaskName}
                />
                <button onClick={addTask}>Add</button>
            </div>
            <div className='kanban-board'>
                {Object.keys(columns).map((column) => (
                    <DroppableColumn
                        key={column}
                        column={column}
                        tasks={columns[column]}
                        moveTask={moveTask}
                        updateTaskName={updateTaskName}
                        deleteTask={deleteTask}
                    />
                ))}
            </div>
        </div>
    );
};

export default Kanban;
