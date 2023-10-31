import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/agendar.module.css';

const EditarCita = () => {
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const dateParam = router.query.date;

    if (dateParam) {
      const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const selectedAppointment = storedAppointments.find((appointment) => {
        return new Date(appointment.start).toISOString() === new Date(dateParam).toISOString();
      });

      if (selectedAppointment) {
        setAppointment(selectedAppointment);
      }
    }
  }, [router.query.date]);

  const handleSave = () => {
    if (appointment) {
      const updatedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];

      // Find the index of the appointment to update in the list
      const updatedAppointmentsIndex = updatedAppointments.findIndex((a) => a.id === appointment.id);

      if (updatedAppointmentsIndex !== -1) {
        // Update the appointment properties
        updatedAppointments[updatedAppointmentsIndex] = appointment;

        try {
          localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
          console.log('Cita actualizada en el localStorage');
        } catch (error) {
          console.error('Error al actualizar en el localStorage:', error);
        }
      }
    }

    router.push('/CalendarioMensual');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the appointment properties based on the input field name
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };

  if (!appointment) {
    return <div>Cita no encontrada</div>;
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <h2>Editar Cita</h2>
        <label className={styles.label}>Nombre:</label>
        <input className={styles.input} type="text" name="title" value={appointment.title} onChange={handleInputChange} />
        
        <label className={styles.label}>Fecha:</label>
        <input className={styles.input} type="date" name="date" value={appointment.date} onChange={handleInputChange} />

        <label className={styles.label}>Hora de inicio:</label>
        <input className={styles.input} type="time" name="start" value={appointment.start} onChange={handleInputChange} />

        <label className={styles.label}>Hora de finalización:</label>
        <input className={styles.input} type="time" name="end" value={appointment.end} onChange={handleInputChange} />

        <label className={styles.label}>Descripción:</label>
        <textarea className={styles.textarea} name="notes" value={appointment.notes} onChange={handleInputChange} />
        <button onClick={handleSave} className={styles.button}>Guardar</button>
      </div>
    </div>
  );
};

export default EditarCita;
