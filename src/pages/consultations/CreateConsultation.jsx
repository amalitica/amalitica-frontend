// src/pages/consultations/CreateConsultation.jsx

import { useSearchParams } from 'react-router-dom';
import ConsultationForm from '@/components/consultations/ConsultationForm';

export default function CreateConsultation() {
  // 1. Usamos el hook para leer los parámetros de la URL
  const [searchParams] = useSearchParams();

  // 2. Extraemos el ID y el nombre del cliente
  const customerId = searchParams.get('customerId');
  const customerName = searchParams.get('customerName');

  // 3. Creamos un objeto con los datos iniciales para el formulario
  const initialData = {
    // Si customerId existe, lo convertimos a número. Si no, es null.
    customer_id: customerId ? Number(customerId) : null,
    // Si customerName existe, lo usamos. Si no, es una cadena vacía.
    customer_name: customerName || '',
  };

  return (
    <div className='container mx-auto px-4 py-6'>
      {/* 4. Pasamos los datos iniciales al formulario como una prop */}
      <ConsultationForm mode='create' initialData={initialData} />
    </div>
  );
}
