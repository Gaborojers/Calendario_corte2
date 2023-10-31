import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from '../styles/Calendario.module.css';

const CalendarioMensual = () => {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pdfMenuOpen, setPdfMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [validRange, setValidRange] = useState({
    start: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    console.log('Citas almacenadas:', storedAppointments);
    setAppointments(storedAppointments);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCurrentDate = new Date();
      const newCurrentDateISO = newCurrentDate.toISOString().split('T')[0];
      setValidRange({ start: newCurrentDateISO });
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDateClick = (arg) => {
    const selectedDate = arg.dateStr;
    router.push(`/agendar-cita?date=${selectedDate}`);
  };

  const handleEventClick = (arg) => {
    setSelectedAppointment(arg.event);
    const rect = arg.jsEvent.currentTarget.getBoundingClientRect();
    setAnchorEl({
      top: rect.top + window.scrollY + rect.height,
      left: rect.left + window.scrollX,
    });
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditAppointment = () => {
    if (selectedAppointment) {
      const formattedDate = selectedAppointment.start.toISOString();
      router.push(`/editar-cita?date=${formattedDate}`);
    }
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      const selectedStartDate = new Date(selectedAppointment.start);
      const selectedEndDate = new Date(selectedAppointment.end);

      const updatedAppointments = appointments.filter((appointment) => {
        const appointmentStartDate = new Date(appointment.start);
        const appointmentEndDate = new Date(appointment.end);

        return (
          appointmentStartDate.toISOString() !== selectedStartDate.toISOString() ||
          appointmentEndDate.toISOString() !== selectedEndDate.toISOString()
        );
      });

      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      handleCloseMenu();
    }
  };

  const changeView = (viewType) => {
    setCurrentView(viewType);
    calendarRef.current.getApi().changeView(viewType);
  };

  return (
    <div>
      <div className={styles.botones}>
        <button onClick={() => changeView('dayGridMonth')} className={styles.mes}>
          Mes
        </button>
        <button onClick={() => changeView('timeGridWeek')} className={styles.semana}>
          Semana
        </button>
        <button onClick={() => changeView('timeGridDay')} className={styles.dia}>
          Día
        </button>
        <button className={styles.verCitas}>
          <Link href="/ver-citas">
            Ver Citas
          </Link>
        </button>
      </div>
      <div className={styles.calendarioContainer}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          dateClick={handleDateClick}
          events={appointments}
          eventClick={handleEventClick}
          validRange={validRange}
          contentClassNames={[styles.customContent]}
          dayCellClassNames={[styles.customDayCell]}
          eventClassNames={[styles.customEvent]}
        />
      </div>
      <Menu
        anchorReference="anchorPosition"
        anchorPosition={{
          top: anchorEl && anchorEl.top ? anchorEl.top : 0,
          left: anchorEl && anchorEl.left ? anchorEl.left : 0,
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            maxWidth: '400px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
          },
        }}
      >
        <div style={{ padding: '16px'}}>
          <p style={{ fontWeight: 'bold' }}>Nombre: {selectedAppointment ? selectedAppointment.title : ''}</p>
          <p>Fecha: {selectedAppointment ? selectedAppointment.start.toDateString() : ''}</p>
          <p>Hora de inicio: {selectedAppointment ? selectedAppointment.start.toLocaleTimeString() : ''}</p>
          <p>Hora de finalización: {selectedAppointment ? selectedAppointment.end?.toLocaleTimeString() : ''}</p>
          <p>Descripción: {selectedAppointment ? selectedAppointment.notes : ''}</p>
        </div>
        <MenuItem onClick={handleEditAppointment}>Editar</MenuItem>
        <MenuItem onClick={handleDeleteAppointment}>Eliminar</MenuItem>
      </Menu>
    </div>
  );
};

export default CalendarioMensual;
