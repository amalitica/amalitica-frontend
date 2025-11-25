import axios from './axios';

/**
 * Descarga el ticket de una consulta en formato PDF
 * @param {number} consultationId - ID de la consulta
 */
export const downloadConsultationTicket = async (consultationId) => {
  try {
    const response = await axios.get(
      `/documents/consultations/${consultationId}/ticket`,
      {
        responseType: 'blob', // Importante para archivos binarios
      }
    );

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Extraer el nombre del archivo del header Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `ticket_${consultationId}.pdf`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Limpiar
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error downloading ticket:', error);
    throw error;
  }
};

/**
 * Descarga la orden de laboratorio de una consulta en formato PDF
 * @param {number} consultationId - ID de la consulta
 */
export const downloadLabOrder = async (consultationId) => {
  try {
    const response = await axios.get(
      `/documents/consultations/${consultationId}/lab-order`,
      {
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `orden_laboratorio_${consultationId}.pdf`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('Error downloading lab order:', error);
    throw error;
  }
};

/**
 * Abre el ticket público en una nueva pestaña (sin autenticación)
 * @param {string} folio - Folio de la consulta
 */
export const openPublicTicket = (folio) => {
  const url = `${import.meta.env.VITE_API_URL}/documents/public/tickets/${folio}`;
  window.open(url, '_blank');
};
