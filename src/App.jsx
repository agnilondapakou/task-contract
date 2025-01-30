import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../abi.json';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function App() {
  const [taskText, setTaskText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [taskId, setTaskId] = useState(0);
  const [message, setMessage] = useState("");
  const [task, setTask] = useState([]);
  const contractAddress = "0x34e01672CBE852658c4727f52358992C9FD30a0c";

  async function requestAcount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function addTask() {
    if(typeof window.ethereum !== "undefined") {
      await requestAcount();
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transaction = await contract.addTask(taskText, taskTitle, isDeleted);
      const receipt = await transaction.wait();
      setMessage("Transaction confirmed in block " + receipt)
    } catch (e) {
      setMessage("Error adding task: " + e)
    }
  }

  async function getMyTask() {
    if(typeof window.ethereum !== "undefined") {
      await requestAcount();
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const myContract = new ethers.Contract(contractAddress, abi, provider);

    try {
      const task = await myContract.getMyTask({fron : provider.getSigner()});
      setTask(task);
      setMessage("Task has been fetched", task);
    } catch (e) {
      setMessage("Error fetching task: " + e.message);
    }
  }
  

  return (
    <div className="App">
      <h1>Task List</h1>
      <input type="text" placeholder="Task Title" onChange={(e) => setTaskTitle(e.target.value)} />
      <input type="text" placeholder="Task Text" onChange={(e) => setTaskText(e.target.value)} />
      <select onChange={(e) => setIsDeleted(e.target.value)}>
        <option value="false">Not Deleted</option>
        <option value="true">Deleted</option>
      </select>
      <button onClick={addTask}>Add task</button>
      <button onClick={getMyTask}>Show my task</button>
      <p>Output : {message}</p>
    </div>
  );
}

export default App;
