
const express = require("express");
const app = express();
//----------------Casuals UP------------------------------
const cors = require("cors");                            //For making request handles across multiple Domains possible
const mongoose = require("mongoose");                    // Gotta need it to connect to MongoDB
require("dotenv").config();                              // ?
const Task = require("./models/task");                 // Importing 

app.use(cors());                                         // Enables Express to use cors
app.use(express.json());                                 // Enables Express to work with Json files

const startServer = async () => {                        // Creating a server which will become active after 'npm start'
  try {
    await mongoose.connect(process.env.MONGO_URI);       // Waits till we get connected to Mongo's URI
    console.log("✅ Connected to MongoDB");              // Tells that we are finally connected !
    
  //--------------------------PORT Listening---------------------------------------------
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `✅ Server running at http://localhost:${process.env.PORT || 5000}`       
      );
    });
  //--------------------------PORT Listening----------------------------------------------  
  }
  

  //--------------------------Error Listening---------------------------------------------
  catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);                                              // stop app if DB fails
  }
  //--------------------------Error Listening---------------------------------------------
};

startServer();
// Get random task
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

//Add a task
app.post('/api/tasks',async(req,res)=>{
  const {title,difficulty} = req.body;
  const newTask = new Task({title,difficulty});
  await newTask.save(); 
  res.status(201).json(newTask);
})
// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

app.put("/api/tasks/:id", async (req, res) => {
  const { title,difficulty } = req.body;
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title,
      difficulty: req.body.difficulty,
      status: req.body.status},
    { new: true }
  );
  res.json(updated);
});