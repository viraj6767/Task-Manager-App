require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))

const User = mongoose.model("User", {
  email: String,
  password: String
})

const Task = mongoose.model("Task", {
  title: String,
  userId: String
})

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.post("/register", async (req,res)=>{
  const hash = await bcrypt.hash(req.body.password,10)
  await User.create({email:req.body.email,password:hash})
  res.send("User registered")
})

app.post("/login", async (req,res)=>{
  const user = await User.findOne({email:req.body.email})
  if(!user || !await bcrypt.compare(req.body.password,user.password))
    return res.status(401).send("Invalid")

  const token = jwt.sign({id:user._id}, "secret")
  res.json({token})
})

app.post("/task", async(req,res)=>{
  const decoded = jwt.verify(req.headers.authorization,"secret")
  await Task.create({title:req.body.title,userId:decoded.id})
  res.send("Task added")
})

app.get("/tasks", async(req,res)=>{
  const decoded = jwt.verify(req.headers.authorization,"secret")
  const tasks = await Task.find({userId:decoded.id})
  res.json(tasks)
})

app.listen(5000, ()=>console.log("Backend running on 5000"))
