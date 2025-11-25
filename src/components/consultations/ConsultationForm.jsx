// src/components/consultations/ConsultationForm.jsx
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  createConsultation,
  updateConsultation,
  getConsultationById,
} from '@/api/consultations';

// Importar las pestañas
import GeneralTab from './tabs/GeneralTab';
import PrescriptionTab from './tabs/PrescriptionTab';
import VisualAcuityTab from './tabs/VisualAcuityTab';
import MeasurementsTab from './tabs/MeasurementsTab';
import SymptomsTab from './tabs/SymptomsTab';
import ProductTab from './tabs/ProductTab';
import NotesTab from './tabs/NotesTab';

export default function ConsultationForm({
  consultationId,
  mode = 'create',
  initialData = {},
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  const methods = useForm({
    defaultValues: {
      // --- General ---
      customer_id: '',
      branch_id: '',
      optometrist_user_id: '',
      creation_date: new Date().toISOString().split('T')[0],
      folio: '',

      // --- RX Final - Ojo Derecho ---
      re_sph_final: null,
      re_cyl_final: null,
      re_axis_final: null,
      re_add_final: null,

      // --- RX Final - Ojo Izquierdo ---
      le_sph_final: null,
      le_cyl_final: null,
      le_axis_final: null,
      le_add_final: null,

      // --- RX Final - Mediciones Biométricas ---
      re_pd_final: null,
      le_pd_final: null,
      pd_final: null,
      re_seg_height_final: null,
      le_seg_height_final: null,
      seg_height_final: null,

      // --- Agudeza Visual Final ---
      va_final_re_distance: '',
      va_final_re_near: '',
      va_final_le_distance: '',
      va_final_le_near: '',
      va_final_both_distance: '',
      va_final_both_near: '',

      // --- Producto ---
      frame_brand: '',
      frame_model: '',
      frame_color: '',
      frame_size: '',
      lens_type: '',
      re_lens_type: '',
      le_lens_type: '',
      lens_material: '',
      lens_design: '',
      total_price: null,
      delivery_days: null,

      // --- Campos JSONB ---
      lensometry: {
        re: { sph: null, cyl: null, axis: null, add: null },
        le: { sph: null, cyl: null, axis: null, add: null },
      },
      retinoscopy: {
        re: { sph: null, cyl: null, axis: null, add: null },
        le: { sph: null, cyl: null, axis: null, add: null },
      },
      symptoms: {
        vision: {
          blurry_distance: false,
          blurry_near: false,
          blurry_letters: false,
          sun_sensitive: false,
          artificial_light_sensitive: false,
        },
        headache: {
          frontal: false,
          occipital: false,
          temporal: false,
        },
        eye_discomfort: {
          eye_pain: false,
          itching: false,
          burning: false,
          tearing: false,
          watery_eyes: false,
          irritation: false,
          dry_eye: false,
          fatigue: false,
        },
        health_conditions: {
          hypertension: false,
          diabetes: false,
          tired: false,
          screen_hours: null,
        },
        disease: '',
        takes_medication: '',
        observations: '',
      },

      // --- Notas ---
      retinoscopy_notes: '',
      additional_notes: '',

      // Para el customer_id
      ...initialData,
    },
  });

  const { handleSubmit, reset } = methods;

  // Cargar datos en modo edición
  useEffect(() => {
    if (mode === 'edit' && consultationId) {
      loadConsultation();
    }
  }, [consultationId, mode]);

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const response = await getConsultationById(consultationId);
      const consultationData = response.data;

      const initialData = {
        ...consultationData,
        customer_name: consultationData.customer
          ? `${consultationData.customer.name} ${consultationData.customer.paternal_surname}`
          : '',
      };

      // ✅ SIN TRANSFORMACIÓN: Los datos del backend ya tienen los nombres correctos
      console.log('Datos cargados del backend:', response.data);

      reset(initialData);
      reset(response.data);
    } catch (err) {
      setError('Error al cargar la consulta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const dataToSend = { ...data };
      delete dataToSend.customer_name;

      // ✅ SIN TRANSFORMACIÓN: Los datos del formulario ya tienen los nombres correctos
      console.log('Datos a enviar al backend:', dataToSend);

      if (mode === 'create') {
        await createConsultation(dataToSend);
      } else {
        await updateConsultation(consultationId, dataToSend);
      }

      navigate('/consultations');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar la consulta');
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === 'edit') {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-600'>Cargando consulta...</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>
            {mode === 'create' ? 'Nueva Consulta' : 'Editar Consulta'}
          </h1>
          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/consultations')}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Consulta'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-7'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='prescription'>Prescripción</TabsTrigger>
            <TabsTrigger value='acuity'>Agudeza Visual</TabsTrigger>
            <TabsTrigger value='measurements'>Mediciones</TabsTrigger>
            <TabsTrigger value='symptoms'>Síntomas</TabsTrigger>
            <TabsTrigger value='product'>Producto</TabsTrigger>
            <TabsTrigger value='notes'>Notas</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='mt-6'>
            <GeneralTab />
          </TabsContent>

          <TabsContent value='prescription' className='mt-6'>
            <PrescriptionTab />
          </TabsContent>

          <TabsContent value='acuity' className='mt-6'>
            <VisualAcuityTab />
          </TabsContent>

          <TabsContent value='measurements' className='mt-6'>
            <MeasurementsTab />
          </TabsContent>

          <TabsContent value='symptoms' className='mt-6'>
            <SymptomsTab />
          </TabsContent>

          <TabsContent value='product' className='mt-6'>
            <ProductTab />
          </TabsContent>

          <TabsContent value='notes' className='mt-6'>
            <NotesTab />
          </TabsContent>
        </Tabs>

        {/* Footer Buttons */}
        <div className='flex justify-end gap-3 pt-6 border-t'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/consultations')}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Consulta'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
