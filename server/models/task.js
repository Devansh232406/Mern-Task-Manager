const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "High"],
  },
  status:{
    type:String,
    enum:["todo","in-progress","done"],
    default:"todo",
  }
});
module.exports = mongoose.model("Task", taskSchema);
