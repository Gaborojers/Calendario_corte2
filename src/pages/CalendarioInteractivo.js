import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/router"; // Importa useRouter de Next.js

const InteractiveCalendar = () => {
  const calendarRef = useRef(null);
  const router = useRouter();

  const handleDateClick = (arg) => {
    router.push(`/agendar-cita?date=${arg.dateStr}`);
  };

  return (
    <div>
      <div>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={[
            {
              title: "Evento 1",
              date: "2023-10-24",
            },
            {
              title: "Evento 2",
              date: "2023-10-28",
            },
            // Puedes agregar más eventos aquí
          ]}
        />
      </div>
    </div>
  );
};

export default InteractiveCalendar;
