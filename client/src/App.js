import { Routes, Route, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import {
  faHome,
  faClock,
  faCalendarDays,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import CalendarHero from "./components/CalendarHero";
import CalendarPage from "./components/CalendarPage";
import Dashboard from "./components/DashBoard";
// import Stopwatch from "./components/Stopwatch";
// import Settings from "./components/Settings";
import "./App.css";

import heroImg2 from "../src/assets/image2.png";
function App() {
  const location = useLocation();
  console.log("CURRENT PATH:", location.pathname);
  return (
    <>
      <div className="hero-div">
        <nav className="hero-nav">
          <h1 className="logo">
            FlowLine<span>.</span>
          </h1>

          <nav className="navbar bar">
            <NavLink id="id1" to="/" end>
              <FontAwesomeIcon icon={faHome} /> DASHBOARD
            </NavLink>
            <NavLink id="id2" to="/calendar">
              <FontAwesomeIcon icon={faCalendarDays} /> CALENDER
            </NavLink>
            {/* <NavLink id="id3" to="/stopwatch">
              <FontAwesomeIcon icon={faClock} /> STOPWATCH
            </NavLink>
            <NavLink id="id4" to="/settings">
              <FontAwesomeIcon icon={faGear} /> SETTINGS
            </NavLink> */}
          </nav>
        </nav>
        {/* --------------------------------Dynamic----------------------------------------- */}
        {location.pathname === "/calendar" && <CalendarHero />}
        {/* {location.pathname === "/settings" && <Settings />} */}{" "}
        {location.pathname === "/" && (
          <div className="hero-section">
            <div className="left-hero">
              <div className="hero-content">
                <h1 className="hero-text t">
                  Pathway to<br></br>
                  <span>Productivity</span>
                </h1>
                <p className="hero-subtext t">
                  Stay organized, focused and in control with <br></br>a useful
                  task manager buillt for effiency<br></br>
                  Plan your work, track progress -- all in one clean<br></br>{" "}
                  intuitive interface
                </p>
              </div>
            </div>
            <div className="right-hero">
              <img
                src={heroImg2}
                alt="Task Management"
                className="hero-image"
              />
            </div>
          </div>
        )}
        {/* --------------------------------Dynamic----------------------------------------- */}
        <svg
          className="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#6927db"
            fill-opacity="1"
            d="M0,160L48,160C96,160,192,160,288,138.7C384,117,480,75,576,64C672,53,768,75,864,117.3C960,160,1056,224,1152,229.3C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      {/* ---------------------------------------------HeroDiv----------------------------------------------------------- */}

      {/* ---------------------------------------------Container----------------------------------------------------------- */}

      <container className="container">
       
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          {/* <Route path="/stopwatch" element={<Stopwatch />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Routes>
        <svg
          className="svg2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#220649"
            fill-opacity="1"
            d="M0,160L34.3,165.3C68.6,171,137,181,206,160C274.3,139,343,85,411,85.3C480,85,549,139,617,176C685.7,213,754,235,823,218.7C891.4,203,960,149,1029,117.3C1097.1,85,1166,75,1234,80C1302.9,85,1371,107,1406,117.3L1440,128L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
          ></path>
        </svg>
      </container>
      <div className="footer">
        <div className="footer-part1">
          <div className="footer-content f2">
            <h5>Quick Links</h5>

            <li>Dashboard</li>
            <li>Calender</li>
            <li>Stopwatch</li>
            <li>Settings</li>
          </div>
          <div className="footer-content f3">
            <h5>Services</h5>

            <li>React.Js</li>
            <li>Express.Js</li>
            <li>Node.Js</li>
            <li>MongoDB</li>
            <li>Python</li>
            <li>C++</li>
          </div>
        </div>

        <div className="footer-part2">
          <p>&copy; 2025 | Made By Devansh Joshi | All Rights Reserved </p>
        </div>
      </div>
    </>
  );
}

export default App;
