
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../components/Calendar.css"; // Ensure you have the correct path to your CSS file
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [];

const CalendarPage = () => {
  return (
    <div className="calendar-wrapper">
      <h1 className="calendar-title">CALENDAR</h1>
      <Calendar
        selectable
        onSelectSlot={() => {}}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        style={{ height: '40rem' }}
      />
    </div>
  );
};

export default CalendarPage;