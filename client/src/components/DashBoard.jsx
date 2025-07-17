import { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faClock,
  faCalendarDays,
  faGear,
  faTrash,
  faPenSquare,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../App.css";


import { motion, AnimatePresence } from "framer-motion";
function DashBoard() {
  // You may need to define your state and handlers here, e.g.:
  // const [showModal, setShowModal] = useState(false);
  // const [showeditBar, setShowEditBar] = useState(false);
  // ...other state and handlers...
const [tasks, settasks] = useState([]);

  const [newtask, setnewtask] = useState("");
  const [successMsg, setMsg] = useState("");
  const [currentTime, setcurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [diffTag, setdiffTag] = useState(null);
  const [difficulty, setDifficulty] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  // For Editing
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showeditBar, setShowEditBar] = useState(false);
  const [editDifficulty, setEditDifficulty] = useState("");

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const done = tasks.filter((t) => t.status === "done");

  const changeColor = (buttonNumber, mode = "add") => {
    let selectedDifficulty = "";

    if (mode === "edit") {
      selectedDifficulty = editDifficulty;
    } else {
      if (diffTag === 1) selectedDifficulty = "Easy";
      else if (diffTag === 2) selectedDifficulty = "Medium";
      else if (diffTag === 3) selectedDifficulty = "High";
    }

    let color = "rgb(221, 221, 221)";
    let color2 = "black";

    if (
      (buttonNumber === 1 && selectedDifficulty === "Easy") ||
      (buttonNumber === 2 && selectedDifficulty === "Medium") ||
      (buttonNumber === 3 && selectedDifficulty === "High")
    ) {
      if (buttonNumber === 1) {
        color = "rgb(123, 255, 134)";
        color2 = "rgb(0, 90, 0)";
      } else if (buttonNumber === 2) {
        color = "rgb(239, 252, 93)";
        color2 = "rgb(93, 102, 0)";
      } else if (buttonNumber === 3) {
        color = "rgb(255, 86, 86)";
        color2 = "rgb(123, 0, 0)";
      }
    }

    return {
      backgroundColor: color,
      color: color2,
    };
  };
  // Fetch All tasks

  const fetchAlltasks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`);
      if (Array.isArray(res.data)) {
        settasks(res.data);
      } else {
        settasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      settasks([]);
    }
  };

  // Add New task
  const handleAddtask = async (e) => {
    e.preventDefault();
    if (!newtask.trim()) return alert("⚠️ Task cannot be empty !");
    if (!difficulty) return alert("⚠️ Please select a difficulty level !");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        title: newtask.trim(),
        difficulty: difficulty,
        status: "todo",
      });
      settasks((prev) => [res.data, ...prev]);
      setnewtask("");
      setMsg("✅ Task Added Successfully");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.error("❌ Failed to Add Task", err);
    }
  };

  // Delete task
  const handleDeletetask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      settasks((prev) => prev.filter((task) => task._id !== id));
      setMsg(" Task Deleted❗");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      console.error("❌ Failed to Delete Task", err);
    }
  };

  // Start Editing
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditText(task.title);
    setEditDifficulty(task.difficulty);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
    setEditDifficulty("");
  };

  // Update task
  const handleUpdatetask = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      console.log("🛠️ Updating", editingId, "with text:", editText);
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${editingId}`, {
        title: editText.trim(),
        difficulty: editDifficulty,
      });
      settasks((prev) => prev.map((q) => (q._id === editingId ? res.data : q)));
      setnewtask("");
      setDifficulty("");
      setMsg("✏️ Task Updated");
      setTimeout(() => setMsg(""), 2000);
      cancelEditing();
    } catch (err) {
      console.error("❌ Failed to Update Task", err);
    }
  };

  const timeString = currentTime.toLocaleTimeString("en-In", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }); // e.g., "12:04:15 PM"
  const dateString = currentTime.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dayString = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
  });

  useEffect(() => {
    fetchAlltasks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-wrapper")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setcurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === id);
      if (!taskToUpdate) return;

      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
        title: taskToUpdate.title,
        difficulty: taskToUpdate.difficulty,
        status: newStatus,
      });

      settasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );
      setMsg("🔁 Status updated!");
      setTimeout(() => setMsg(""), 1500);
      setOpenMenuId(null); // Close dropdown after update
    } catch (err) {
      console.error("❌ Failed to change status", err);
    }
  };

  return (
    <>
      <h1 className="header">DASHBOARD</h1>
      {/* -----------------------------------------Modal-Overlay----------------------------------------------------------- */}
      {showModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0, y: -30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
              minWidth: "300px",
            }}
          >
            <h2>Add New task</h2>
            <input
              type="text"
              value={newtask}
              onChange={(e) => setnewtask(e.target.value)}
              placeholder="Type something.."
            />
            <div className="modal-buttons">
              <div className="modalbtn-left">
                <button
                  style={changeColor(1)}
                  onClick={() => {
                    setdiffTag(1);
                    setDifficulty("Easy");
                  }}
                >
                  Easy
                </button>
                <button
                  style={changeColor(2)}
                  onClick={() => {
                    setdiffTag(2);
                    setDifficulty("Medium");
                  }}
                >
                  Medium
                </button>
                <button
                  style={changeColor(3)}
                  onClick={() => {
                    setdiffTag(3);
                    setDifficulty("High");
                  }}
                >
                  High
                </button>
              </div>
              <div className="modalbtn-right">
                <button className="Popbtn-add" onClick={handleAddtask}>
                  Add task
                </button>
                <button
                  className="Popbtn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    setdiffTag(null);
                  }}
                >
                  Cancel
                </button>
                <AnimatePresence>
                  {successMsg && (
                    <motion.p
                      key="success"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        color: "rgb(31, 93, 0)",
                        backgroundColor: "rgb(134, 255, 109)",
                        padding: "8px",
                        borderRadius: "14px",
                        marginTop: "10px",
                      }}
                    >
                      {successMsg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      <div className="Main-2nd">
        <div className="Sub-Right">
          <div className="Sub-Right part1">
            <div className="functions p">
              <h3>TODAY'S DATE</h3>
              <h2>{dateString}</h2>
            </div>
            <div className="functions">
              <h3>DAY</h3>
              <h2>{dayString}</h2>
            </div>
            <div className="functions h">
              <h3>TIME</h3>
              <h2>{timeString}</h2>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="create-button"
            >
              + Create task
            </button>
          </div>
          <div className="Sub-Right part2">
            {/* Todo */}
            <div className="Todo column">
              <h2>To Do</h2>
              <AnimatePresence mode="popLayout">
                {todo.map((task) => (
                  <motion.li
                    className="task-card only-card"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    key={task._id}
                    style={{
                      position: "relative",
                      borderRadius: "12px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      height: "21rem",
                      width: "17.6rem",
                      minWidth: "60%",
                      maxWidth: "85%",
                      marginBottom: "1rem",
                      transition: "transform 0.2s ease",
                      fontFamily: "Poppins",
                      paddingRight: "18px",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        padding: "3px 15px",
                        fontSize: "13px",
                        borderRadius: "12px",
                        fontWeight: "450",
                        color:
                          task.difficulty === "Easy"
                            ? "rgb(0, 102, 0)"
                            : task.difficulty === "Medium"
                            ? "rgb(93, 102, 0)"
                            : task.difficulty === "High"
                            ? "rgb(123, 0, 0)"
                            : "#95a5a6",
                        backgroundColor:
                          task.difficulty === "Easy"
                            ? "#2ecc71"
                            : task.difficulty === "Medium"
                            ? "rgb(234, 214, 89)"
                            : task.difficulty === "High"
                            ? "rgb(235, 105, 105)"
                            : "#95a5a6",
                      }}
                    >
                      {task.difficulty}
                    </span>
                    <span
                      style={{
                        paddingLeft: "10px",
                        position: "absolute",
                        top: "20%",
                        fontSize: "18px",
                        left: "3%",
                        fontWeight: "400",
                        color: "white",
                        paddingRight: "20px",
                      }}
                    >
                      {task.title}
                    </span>
                    {/* -----------------------------------------Dropdown--------------------------------------------- */}
                    <div className="dropdown-wrapper">
                      <button
                        onClick={() =>
                          setOpenMenuId((prevId) =>
                            prevId === task._id ? null : task._id
                          )
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === task._id && (
                        <div className="dropdown-menu">
                          {task.status !== "todo" && (
                            <button
                              onClick={() =>
                                handleStatusChange(task._id, "todo")
                              }
                            >
                              ✒️ To Do
                            </button>
                          )}
                          {task.status !== "in-progress" && (
                            <button
                              className="firstbtn"
                              onClick={() =>
                                handleStatusChange(task._id, "in-progress")
                              }
                            >
                              ℹ️ In Progress
                            </button>
                          )}
                          {task.status !== "done" && (
                            <button
                              className="secbtn"
                              onClick={() =>
                                handleStatusChange(task._id, "done")
                              }
                            >
                              ✅ Done
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* -----------------------------------------Dropdown--------------------------------------------- */}
                    <div style={{ float: "right" }}>
                      <button
                        onClick={() => {
                          startEditing(task);
                          setShowEditBar(true);
                        }}
                        style={{
                          marginRight: "0.5rem",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "rgb(79, 63, 184)",
                          color: "white",
                          padding: "5px 10px",
                          position: "absolute",
                          bottom: "10px",
                          right: "40px",
                          fontSize: "1rem",
                        }}
                      >
                        <FontAwesomeIcon icon={faPenSquare} />
                      </button>
                      <button
                        onClick={() => handleDeletetask(task._id)}
                        style={{
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#e74c3c",
                          color: "white",
                          padding: "5px 10px",
                          position: "absolute",
                          bottom: "10px",
                          right: "5px",
                          fontSize: "1rem",
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </div>

            <div className="InProgress column">
              <h2>In Progress</h2>
              {inProgress.map((task) => (
                <motion.li
                  className="task-card"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key={task._id}
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    height: "21rem",
                    width: "17rem",
                    marginBottom: "1rem",
                    transition: "transform 0.2s ease",
                    fontFamily: "Poppins",
                    paddingRight: "18px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      padding: "3px 15px",
                      fontSize: "13px",
                      borderRadius: "12px",
                      fontWeight: "450",
                      color:
                        task.difficulty === "Easy"
                          ? "rgb(0, 102, 0)"
                          : task.difficulty === "Medium"
                          ? "rgb(93, 102, 0)"
                          : task.difficulty === "High"
                          ? "rgb(123, 0, 0)"
                          : "#95a5a6",
                      backgroundColor:
                        task.difficulty === "Easy"
                          ? "#2ecc71"
                          : task.difficulty === "Medium"
                          ? "rgb(234, 214, 89)"
                          : task.difficulty === "High"
                          ? "rgb(235, 105, 105)"
                          : "#95a5a6",
                    }}
                  >
                    {task.difficulty}
                  </span>
                  <span
                    style={{
                      paddingLeft: "10px",
                      position: "absolute",
                      top: "20%",
                      fontSize: "18px",
                      left: "3%",
                      fontWeight: "400",
                      color: "white",
                      paddingRight: "20px",
                    }}
                  >
                    {task.title}
                  </span>
                  {/* ----------------------------------------------Dropdown---------------------------------------------------- */}
                  <div className="dropdown-wrapper">
                    <button
                      onClick={() =>
                        setOpenMenuId((prevId) =>
                          prevId === task._id ? null : task._id
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openMenuId === task._id && (
                      <div className="dropdown-menu">
                        {task.status !== "todo" && (
                          <button
                            className="firstbtn"
                            onClick={() =>
                              handleStatusChange(task._id, "todo")
                            }
                          >
                            ✒️ To Do
                          </button>
                        )}

                        {task.status !== "done" && (
                          <button
                            className="secbtn"
                            onClick={() =>
                              handleStatusChange(task._id, "done")
                            }
                          >
                            ✅ Done
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ float: "right" }}>
                    <button
                      onClick={() => {
                        startEditing(task);
                        setShowEditBar(true);
                      }}
                      style={{
                        marginRight: "0.5rem",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "rgb(79, 63, 184)",
                        color: "white",
                        padding: "5px 10px",
                        position: "absolute",
                        bottom: "10px",
                        right: "40px",
                        fontSize: "1rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faPenSquare} />
                    </button>
                    <button
                      onClick={() => handleDeletetask(task._id)}
                      style={{
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        padding: "5px 10px",
                        position: "absolute",
                        bottom: "10px",
                        right: "5px",
                        fontSize: "1rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </div>

            {/* -----------------------------------------------DoneColumn------------------------------------------------------- */}
            <div className="Done column">
              <h2>Done</h2>
              {done.map((task) => (
                <motion.li
                  className="task-card"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key={task._id}
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    height: "21rem",
                    width: "17rem",
                    marginBottom: "1rem",
                    transition: "transform 0.2s ease",
                    fontFamily: "Poppins",
                    paddingRight: "18px",
                  }}
                >
                  {/* Difficulty Label */}
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      padding: "3px 15px",
                      fontSize: "13px",
                      borderRadius: "12px",
                      fontWeight: "450",
                      color:
                        task.difficulty === "Easy"
                          ? "rgb(0, 102, 0)"
                          : task.difficulty === "Medium"
                          ? "rgb(93, 102, 0)"
                          : task.difficulty === "High"
                          ? "rgb(123, 0, 0)"
                          : "#95a5a6",
                      backgroundColor:
                        task.difficulty === "Easy"
                          ? "#2ecc71"
                          : task.difficulty === "Medium"
                          ? "rgb(234, 214, 89)"
                          : task.difficulty === "High"
                          ? "rgb(235, 105, 105)"
                          : "#95a5a6",
                    }}
                  >
                    {task.difficulty}
                  </span>

                  {/* Dropdown */}
                  <div className="dropdown-wrapper">
                    <button
                      onClick={() =>
                        setOpenMenuId((prevId) =>
                          prevId === task._id ? null : task._id
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openMenuId === task._id && (
                      <div className="dropdown-menu">
                        {task.status !== "todo" && (
                          <button
                            className="firstbtn"
                            onClick={() =>
                              handleStatusChange(task._id, "todo")
                            }
                          >
                            ✒️ To Do
                          </button>
                        )}
                        {task.status !== "in-progress" && (
                          <button
                            className="secbtn"
                            onClick={() =>
                              handleStatusChange(task._id, "in-progress")
                            }
                          >
                            ℹ️ In Progress
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Task Title */}
                  <span
                    style={{
                      paddingLeft: "10px",
                      position: "absolute",
                      top: "20%",
                      fontSize: "18px",
                      left: "3%",
                      fontWeight: "400",
                      color: "white",
                      paddingRight: "20px",
                    }}
                  >
                    {task.title}
                  </span>

                  {/* Edit & Delete Buttons */}
                  <div style={{ float: "right" }}>
                    <button
                      onClick={() => {
                        startEditing(task);
                        setShowEditBar(true);
                      }}
                      style={{
                        marginRight: "0.5rem",
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "rgb(79, 63, 184)",
                        color: "white",
                        padding: "5px 10px",
                        position: "absolute",
                        bottom: "10px",
                        right: "40px",
                        fontSize: "1rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faPenSquare} />
                    </button>
                    <button
                      onClick={() => handleDeletetask(task._id)}
                      style={{
                        border: "none",
                        borderRadius: "8px",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        padding: "5px 10px",
                        position: "absolute",
                        bottom: "10px",
                        right: "5px",
                        fontSize: "1rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showeditBar && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
                minWidth: "300px",
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
                alignItems: "center",
                height: "auto",
                minHeight: "230px",
              }}
            >
              <h2 className="editTab">Edit Tab</h2>
              <form onSubmit={handleUpdatetask}>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    padding: "0.7em 0px 0.7rem 1.4rem",
                    transform: "translateX(0)",
                    fontSize: "1rem",
                    fontweight: "500",
                  }}
                />
                <div
                  className="modal-buttons"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={changeColor(1, "edit")}
                      onClick={(e) => {
                        e.preventDefault();
                        setEditDifficulty("Easy");
                        setdiffTag(null);
                      }}
                    >
                      Easy
                    </button>
                    <button
                      style={changeColor(2, "edit")}
                      onClick={(e) => {
                        e.preventDefault();
                        setEditDifficulty("Medium");
                        setdiffTag(null);
                      }}
                    >
                      Medium
                    </button>
                    <button
                      style={changeColor(3, "edit")}
                      onClick={(e) => {
                        e.preventDefault();
                        setEditDifficulty("High");
                        setdiffTag(null);
                      }}
                    >
                      High
                    </button>
                  </div>
                  <div>
                    <button
                      className="Popbtn-add"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowEditBar(false);
                        handleUpdatetask(e);
                      }}
                      style={{
                        backgroundColor: "#2ecc71",

                        padding: "9px 13px",
                        border: "none",
                        borderRadius: "13px",
                        marginLeft: "13rem",
                        fontSize: "0.9rem",
                        color: "rgb(6, 60, 0)",
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cancelEditing();
                        setShowEditBar(false);
                      }}
                      style={{
                        backgroundColor: "red",
                        color: "rgb(66, 0, 0)",
                        padding: "9px 10px",
                        border: "none",
                        borderRadius: "13px",
                        marginLeft: "0.5rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}export default DashBoard;