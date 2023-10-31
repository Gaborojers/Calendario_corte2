import React, { useEffect, useState } from 'react';
import styles from '../styles/lista.module.css'; // Asegúrate de que la ruta del archivo CSS sea correcta
import Link from 'next/link';
import jsPDF from 'jspdf'; // Importa la biblioteca jsPDF
import { FaFilePdf } from 'react-icons/fa';

const VerCitas = () => {
  const [citas, setCitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Obtener las citas del almacenamiento local al cargar la página
    const storedCitas = JSON.parse(localStorage.getItem('appointments')) || [];

    // Ordenar las citas por fecha de inicio
    storedCitas.sort((a, b) => new Date(a.start) - new Date(b.start));

    setCitas(storedCitas);
  }, []);

  // Filtra las citas por nombre en función del término de búsqueda
  const filteredCitas = citas.filter(cita => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    const normalizedCitaName = cita.title.toLowerCase();
    return normalizedCitaName.includes(normalizedSearchTerm);
  });

  // Agrupar las citas por día
  const groupedCitas = groupCitasByFecha(filteredCitas);

  function groupCitasByFecha(citas) {
    const citasGrouped = {};

    citas.forEach((cita) => {
      const fechaKey = new Date(cita.start).toDateString();

      if (!citasGrouped[fechaKey]) {
        citasGrouped[fechaKey] = [];
      }

      citasGrouped[fechaKey].push(cita);
    });

    return citasGrouped;
  }

  // Función para generar y descargar el PDF para una cita específica
  // Función para generar y descargar el PDF para una cita específica
  const generatePdfForCita = (cita) => {
    // Crea un nuevo objeto PDF
    const pdf = new jsPDF('p', 'mm', 'letter'); // Configura el tamaño de página y orientación
  
    // Establece la fuente y el tamaño de texto
    pdf.setFont('times');
    pdf.setFontSize(14); // Tamaño de fuente para la mayoría de los campos
    const iconWidth = 60;
    const iconHeight = 50;
  
    // Agrega la imagen del calendario
    pdf.addImage(
      '/png-clipart-calendar-computer-icons-calendar-date-mount-olivet-lutheran-church-of-plymouth-time-calender-miscellaneous-calendar__1_-removebg-preview.png',
      'PNG',
      10,
      20,
      iconWidth,
      iconHeight
    );
  
    // Calcula la posición para el texto a la derecha del icono
    const textX = 10 + iconWidth + 10; // 10 pixels de espacio entre la imagen y el texto
  
    // Agrega el nombre de la cita al lado del icono
    pdf.text(`Nombre: ${cita.title}`, textX, 30);
  
    // Agrega la fecha
    pdf.text(`Fecha: ${new Date(cita.start).toDateString()}`, textX, 45);
  
    // Agrega la hora de inicio
    pdf.text(`Hora de inicio: ${new Date(cita.start).toLocaleTimeString()}`, textX, 60);
  
    // Agrega la hora de finalización
    pdf.text(`Hora de finalización: ${cita.end ? new Date(cita.end).toLocaleTimeString() : 'N/A'}`, textX, 75);
  
    // Agrega la descripción
    pdf.text(`Descripción: ${cita.notes || 'N/A'}`, textX, 90);
  
    // Dibuja una línea horizontal debajo de la cita
    pdf.line(10, 100, 200, 100);
  
    // Guarda el PDF con un nombre único basado en la cita
    // Genera un nombre único para el archivo PDF con la fecha y el nombre de la cita
    const formattedDate = new Date(cita.start).toISOString().split('T')[0];
    const pdfFileName = `${formattedDate}_${cita.title.replace(/\s+/g, '_')}.pdf`;

    pdf.save(pdfFileName);
  };
  

  return (
    <div className={styles.pagina}>
      <div className={styles.container}>
        <h1 className={styles.h1}>Lista de Citas</h1>
        <div className={styles.search_container}>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.search_input}
          />
          <i className={`${styles.fa} ${styles.fa_search} ${styles.search_icon}`} tabIndex="0"></i>
        </div>
        {Object.keys(groupedCitas).map((fechaKey) => (
          <div key={fechaKey} className={styles.fechaGroup}>
            <h2>{fechaKey}</h2>
            <ul className={styles.ul}>
              {groupedCitas[fechaKey].map((cita, index) => (
                <li key={index} className={styles.cita}>
                  <p className={styles.titulo}>Nombre: {cita.title}</p>
                  <p className={styles.p}>Hora de inicio: {new Date(cita.start).toLocaleTimeString()}</p>
                  <p className={styles.p}>Hora de finalización: {cita.end ? new Date(cita.end).toLocaleTimeString() : 'N/A'}</p>
                  <p className={styles.p}>Descripción: {cita.notes || 'N/A'}</p>
                  <Link href={`/CalendarioMensual?date=${cita.start}`}>Ver en el calendario</Link>
                  <button onClick={() => generatePdfForCita(cita)} className={styles.boton}>
                  <FaFilePdf className={styles.icono}/>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerCitas;
