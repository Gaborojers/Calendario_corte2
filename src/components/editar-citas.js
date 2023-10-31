import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/agendar.module.css'

const EditarCita = () => {
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // Obtén la fecha de la URL para identificar la cita a editar
    const dateParam = router.query.date;

    if (dateParam) {
      // Busca la cita en el localStorage por la fecha de inicio y fin
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
      // Realiza los cambios en la cita y actualiza el localStorage
      const updatedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const updatedAppointmentsIndex = updatedAppointments.findIndex((a) => {
        return (
          new Date(a.start).getTime() === new Date(appointment.start).getTime() &&
          new Date(a.end).getTime() === new Date(appointment.end).getTime()
        );
      });

      if (updatedAppointmentsIndex !== -1) {
        updatedAppointments[updatedAppointmentsIndex] = appointment;
        try {
          localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
          console.log('Cita actualizada en el localStorage');
        } catch (error) {
          console.error('Error al actualizar en el localStorage:', error);
        }
      }
    }

    // Redirige de nuevo al calendario
    router.push('/CalendarioMensual');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'start' || name === 'end') {
      // Si se modifica "start" o "end", actualiza solo la hora correspondiente
      const updatedAppointment = {
        ...appointment,
        [name]: value,
      };
  
      setAppointment(updatedAppointment);
    } else {
      // Si se modifica otro campo, mantén los valores existentes
      setAppointment({
        ...appointment,
        [name]: value,
      });
    }
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
      <label className={styles.label}>Fecha de inicio:</label>
      <input className={styles.inputTime} type="datetime-local" name="start" value={appointment.start} onChange={handleInputChange} />
      <label className={styles.label}>Fecha de fin:</label>
      <input className={styles.inputTime} type="datetime-local" name="end" value={appointment.end} onChange={handleInputChange} />
      <label className={styles.label}>Descripción:</label>
      <textarea className={styles.textarea} name="notes" value={appointment.notes} onChange={handleInputChange} />
      <button onClick={handleSave} className={styles.button}>Guardar</button>
      </div>
    </div>
  );
};

export default EditarCita;
