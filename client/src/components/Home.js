import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Home.css'


function Dropdown({ selectedOption, setSelectedOption }) {
    const options = ["Kanban"]
    return (
        <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}

        >
            <option value="" disabled>Select an Option</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))
            }
        </select>

    )
}

function TaskList({ tasks }) {

    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    <Link to={`/${task.FrameWork}/${task.id}`}>{task.name}</Link></li>
            ))}
        </ul>
    )
}

function TextInput({ textValue, setTextValue }) {
    return (
        <div className='inp'>
            <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter text"
            />
        </div>
    );
}


const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');

    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/frameworks')
            .then(response => {
                console.log(response.data)
                setTasks(response.data);
                console.log(tasks)
            })
            .catch(error => {
                console.error('There was an error fetching the tasks!', error);
            });
    }, []);

    const addTask = () => {
        if (selectedOption && taskName) {

            const task = {
                Framework: selectedOption,
                name: taskName,
            }
            postTask(task)
            setSelectedOption('');
            setTaskName('');
        }

    }

    const postTask = async (task) => {
        try {
            const response = await axios.post('http://localhost:5000/frameworks', task)

            setTasks(tasks => [...tasks, response.data])

        } catch (error) {
            console.error('There was an error making the POST request!', error);
        }
    }
    return (
        <div>
            <Dropdown
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
            />
            <TextInput
                textValue={taskName}
                setTextValue={setTaskName}
            />
            <button className='but' onClick={addTask}>Add</button>

            <TaskList tasks={tasks} />
        </div>
    );
};

export default Home;
