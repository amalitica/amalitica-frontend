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

export default function ConsultationForm({ consultationId, mode = 'create' }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  const methods = useForm({
    defaultValues: {
      // Datos Generales
      customer_id: '',
      consultation_date: new Date().toISOString().split('T')[0],
      folio: '',

      // Prescripción Final
      final_rx_od: {},
      final_rx_os: {},

      // Prescripción Subjetiva
      subjective_rx_od: {},
      subjective_rx_os: {},

      // Prescripción Objetiva
      objective_rx_od: {},
      objective_rx_os: {},

      // Agudeza Visual
      visual_acuity_od: {},
      visual_acuity_os: {},
      visual_acuity_ou: {},
      visual_acuity_notes: '',

      // Mediciones (JSONB)
      lensometry: { od: {}, os: {} },
      retinoscopy: { od: {}, os: {} },
      keratometry: { od: {}, os: {} },
      measurements_notes: '',

      // Síntomas (JSONB)
      symptoms: {
        vision_symptoms: {},
        headache_symptoms: {},
        eye_discomfort_symptoms: {},
        health_conditions: {},
      },
      additional_symptoms: '',

      // Producto
      frame_brand: '',
      frame_model: '',
      frame_color: '',
      frame_price: null,
      lens_type: '',
      lens_material: '',
      lens_treatment: '',
      lens_price: null,

      // Comercial
      total_price: null,
      discount: null,
      advance_payment: null,
      balance: null,
      payment_method: '',
      delivery_date: '',
      sales_notes: '',

      // Notas
      diagnosis: '',
      notes: '',
      recommendations: '',
      follow_up: '',
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

      // Limpiar campos vacíos
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => {
          if (v === null || v === undefined || v === '') return false;
          if (typeof v === 'object' && Object.keys(v).length === 0)
            return false;
          return true;
        })
      );

      if (mode === 'create') {
        await createConsultation(cleanData);
      } else {
        await updateConsultation(consultationId, cleanData);
      }

      navigate('/consultations');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar la consulta');
      console.error(err);
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
