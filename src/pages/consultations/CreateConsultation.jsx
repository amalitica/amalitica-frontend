// src/pages/consultations/CreateConsultation.jsx
import ConsultationForm from '@/components/consultations/ConsultationForm';

export default function CreateConsultation() {
  return (
    <div className='container mx-auto px-4 py-6'>
      <ConsultationForm mode='create' />
    </div>
  );
}
