import { useState } from 'react'
import './App.css'
import abi from '../abi.json'
import { ethers } from 'ethers'
import { BrowserProvider } from 'ethers'

const contractAddress = "0x34e01672CBE852658c4727f52358992C9FD30a0c"

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [message, setMessage] = useState("");

  async function requestAccounts() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchTasks() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const taskCount = await contract.taskCount();
      const tasks = [];
      for (let i = 0; i < taskCount; i++) {
        const task = await contract.tasks(i);
        tasks.push({
          title: task.title,
          text: task.text,
          completed: task.completed
        });
      }
      setTasks(tasks);
    } catch (error) {
      setMessage("Error fetching tasks");
    }
  }

  async function createTask() {
    try {
      await contract.createTask(taskTitle, taskText);
      fetchTasks();
    } catch (error) {
      setMessage("Error creating task");
  }

  async function toggleTaskCompleted(taskId) {
    try {
      await contract.toggleTaskCompleted(taskId);
      fetchTasks();
    } catch (error) {
      setMessage("Error toggling task completed");
    }
  }

  async function deleteTask(taskId) {
    try {
      await contract.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      setMessage("Error deleting task");
    }
  }

  return (
    <div className="App">
      <h1>Task List</h1>
      <button onClick={requestAccounts}>Connect</button>
      <button onClick={fetchTasks}>Fetch Tasks</button>
      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Task Text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <button onClick={createTask}>Create Task</button>
      <p>{message}</p>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompleted(index)}
            />
            <span>{task.title}</span>
            <span>{task.text}</span>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
}

export default App
