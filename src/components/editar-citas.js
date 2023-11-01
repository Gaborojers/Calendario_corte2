import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/agendar.module.css';

const EditarCita = () => {
  const router = useRouter();
  const [appointment, setAppointment] = useState({
    start: '', // Inicializa con valores vacíos
    end: '',
  });

  useEffect(() => {
    const dateParam = router.query.date;

    if (dateParam) {
      const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const selectedAppointment = storedAppointments.find((a) => {
        return new Date(a.start).toISOString() === new Date(dateParam).toISOString();
      });

      if (selectedAppointment) {
        setAppointment(selectedAppointment);
      }
    }
  }, [router.query.date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Agrega console.log para depuración
    console.log('Input change:', name, value);
  
    setAppointment({
      ...appointment,
      [name]: value,
    });
  };
  
  const handleSave = () => {
    if (appointment) {
      // Agrega console.log para depuración
      console.log('Saving appointment:', appointment);
  
      const updatedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const updatedAppointmentsIndex = updatedAppointments.findIndex((a) => {
        return (
          new Date(a.start).getTime() === new Date(appointment.start).getTime() &&
          new Date(a.end).getTime() === new Date(appointment.end).getTime()
        );
      });
  
      // Agrega console.log para depuración
      console.log('Updated appointments array:', updatedAppointments);
  
      if (updatedAppointmentsIndex !== -1) {
        updatedAppointments[updatedAppointmentsIndex] = appointment;
  
        // Agrega console.log para depuración
        console.log('Updated appointment at index:', updatedAppointmentsIndex);
  
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

  if (!appointment) {
    return <div>Cita no encontrada</div>;
  }

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <h2>Editar Cita</h2>
        <label className={styles.label}>Nombre:</label>
        <input className={styles.input} type="text" name="title" value={appointment.title} onChange={handleInputChange} />
        <label className={styles.label}>Hora de inicio:</label>
        <input className={styles.inputTime} type="time" name="start" value={appointment.start} onChange={handleInputChange} />
        <label className={styles.label}>Hora de finalización:</label>
        <input className={styles.inputTime} type="time" name="end" value={appointment.end} onChange={handleInputChange} />
        <label className={styles.label}>Descripción:</label>
        <textarea className={styles.textarea} name="notes" value={appointment.notes} onChange={handleInputChange} />
        <button onClick={handleSave} className={styles.button}>Guardar</button>
      </div>
    </div>
  );
};

export default EditarCita;
