import './Calendar.css';
import Image3 from "../assets/image3.png";
function CalendarHero() {
  return (
    <div className="calendar-content">
      <img src={Image3} alt="Calendar Illustration" className="calendar-image" />
      <div className="cal-hero-content">
        <h1 className="calendar-header h">Plan Your Days,<br></br><span>Own Your Time</span> </h1>
        <p className="calendar-description h">
        Stay on top of your schedule with a clean, intuitive calendar designed to make your life easier. 
        </p>
      </div>


    </div>
  );
}
export default CalendarHero;