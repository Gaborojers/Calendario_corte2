import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/agendar.module.css'; // Reemplaza con la ruta correcta
import { useRouter } from 'next/router';

let appointmentIdCounter = 1;

function AppointmentForm() {
  const router = useRouter();
  const { date } = router.query; // Obtén la fecha seleccionada de la URL

  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un objeto de cita que incluye la fecha seleccionada
    const appointment = {
      id: appointmentIdCounter++,
      title: name,
      start: `${date}T${startTime}`,
      end: `${date}T${endTime}`, 
      description: notes,
      date: date, // Agrega la fecha seleccionada
    };

    // Guardar la cita en el almacenamiento local
    const existingAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    existingAppointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(existingAppointments));

    // Mostrar una notificación de que se agendó la cita.
    toast.success('Cita agendada correctamente', { position: 'top-center' });

    // Redirigir al usuario de vuelta a la página del calendario
    router.push('/CalendarioMensual');
  }


  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <h1 className={styles.h1}>Agendar Cita</h1>
        <p>Fecha seleccionada: {date}</p>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            Nombre de la Cita:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            Hora de inicio:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className={styles.inputTime}
            />
          </label>
          <label className={styles.label}>
            Hora de finalización:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className={styles.inputTime}
            />
          </label>
          <label className={styles.label}>
            Descripción:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.textarea}
            />
          </label>
          <button type="submit" className={styles.button}>
            Agendar Cita
          </button>
        </form>
      </div>
    </div>
  );
}

export default AppointmentForm;
