import axios from 'axios'
import { useState } from 'react'

const API = "http://YOUR_EC2_IP:5000"

function App() {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [token,setToken] = useState("")
  const [task,setTask] = useState("")
  const [tasks,setTasks] = useState([])

  const login = async()=>{
    const res = await axios.post(API+"/login",{email,password})
    setToken(res.data.token)
  }

  const addTask = async()=>{
    await axios.post(API+"/task",{title:task},{headers:{Authorization:token}})
  }

  const load = async()=>{
    const res = await axios.get(API+"/tasks",{headers:{Authorization:token}})
    setTasks(res.data)
  }

  return (
    <div>
      <h2>Login</h2>
      <input onChange={e=>setEmail(e.target.value)} />
      <input type="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={login}>Login</button>

      <h2>Add Task</h2>
      <input onChange={e=>setTask(e.target.value)} />
      <button onClick={addTask}>Add</button>

      <button onClick={load}>Load Tasks</button>
      {tasks.map(t=><div key={t._id}>{t.title}</div>)}
    </div>
  )
}

export default App
