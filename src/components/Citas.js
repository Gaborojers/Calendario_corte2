import React from 'react';
import Link from 'next/link'; // Importa Link desde Next.js

const CitasPage = ({ appointments }) => {
  appointments = appointments || [];
  return (
    <div>
      <h1>Listado de Citas</h1>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            {/* Enlace que redirige a la vista de CalendarioMensual con la fecha de la cita en la URL */}
            <Link href={`/CalendarioMensual?date=${appointment.start}`}>
              <a>{`Fecha: ${appointment.start}, Nombre: ${appointment.title}, Descripción: ${appointment.notes}`}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
  

CitasPage.getInitialProps = ({ query }) => {
    // Obtener las citas ordenadas de los parámetros de consulta
    const appointments = JSON.parse(query.appointments) || [];
    return { appointments };
  };  

export default CitasPage;
