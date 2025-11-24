// src/pages/consultations/EditConsultation.jsx
import { useParams } from 'react-router-dom';
import ConsultationForm from '@/components/consultations/ConsultationForm';

export default function EditConsultation() {
  const { id } = useParams();

  return (
    <div className='container mx-auto px-4 py-6'>
      <ConsultationForm consultationId={id} mode='edit' />
    </div>
  );
}
