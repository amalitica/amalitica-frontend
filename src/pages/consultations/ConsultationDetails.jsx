// src/pages/consultations/ConsultationDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getConsultationById, deleteConsultation } from '@/api/consultations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConsultation();
  }, [id]);

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const response = await getConsultationById(id);
      setConsultation(response.data);
    } catch (err) {
      setError('Error al cargar la consulta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteConsultation(id);
      navigate('/consultations');
    } catch (err) {
      setError('Error al eliminar la consulta');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className='text-center py-10'>
        Cargando detalles de la consulta...
      </div>
    );
  }

  if (error) {
    return <div className='text-center py-10 text-red-600'>{error}</div>;
  }

  if (!consultation) {
    return <div className='text-center py-10'>No se encontró la consulta.</div>;
  }

  const DetailItem = ({ label, value }) => (
    <div>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className='text-sm font-medium'>{value || 'No especificado'}</p>
    </div>
  );

  const RxDetail = ({ eye, data }) => (
    <div>
      <h4 className='font-medium text-sm text-gray-700 uppercase mb-2'>
        {eye}
      </h4>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
        <p>
          <strong>SPH:</strong> {data?.sphere || 'N/A'}
        </p>
        <p>
          <strong>CYL:</strong> {data?.cylinder || 'N/A'}
        </p>
        <p>
          <strong>AXIS:</strong> {data?.axis || 'N/A'}
        </p>
        <p>
          <strong>ADD:</strong> {data?.addition || 'N/A'}
        </p>
      </div>
    </div>
  );

  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold'>Detalles de la Consulta</h1>
          <p className='text-gray-600'>Folio: {consultation.folio}</p>
        </div>
        <div className='flex gap-3'>
          <Button asChild variant='outline'>
            <Link to={`/consultations/${id}/edit`}>Editar</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>Eliminar</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se marcará la consulta como
                  eliminada.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* General Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <DetailItem
            label='Cliente'
            value={consultation.customer?.full_name}
          />
          <DetailItem
            label='Fecha de Consulta'
            value={new Date(consultation.consultation_date).toLocaleDateString(
              'es-MX'
            )}
          />
        </CardContent>
      </Card>

      {/* Prescription */}
      <Card>
        <CardHeader>
          <CardTitle>Prescripción Final (RX)</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <RxDetail eye='Ojo Derecho (OD)' data={consultation.final_rx_od} />
          <div className='border-t'></div>
          <RxDetail eye='Ojo Izquierdo (OS)' data={consultation.final_rx_os} />
        </CardContent>
      </Card>

      {/* Product & Commercial */}
      <Card>
        <CardHeader>
          <CardTitle>Información Comercial</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <DetailItem label='Marca Armazón' value={consultation.frame_brand} />
          <DetailItem label='Modelo Armazón' value={consultation.frame_model} />
          <DetailItem label='Tipo de Lente' value={consultation.lens_type} />
          <DetailItem
            label='Precio Total'
            value={`$${consultation.total_price?.toFixed(2)}`}
          />
          <DetailItem
            label='Anticipo'
            value={`$${consultation.advance_payment?.toFixed(2)}`}
          />
          <DetailItem
            label='Saldo'
            value={`$${consultation.balance?.toFixed(2)}`}
          />
          <DetailItem
            label='Método de Pago'
            value={consultation.payment_method}
          />
          <DetailItem
            label='Fecha de Entrega'
            value={
              consultation.delivery_date
                ? new Date(consultation.delivery_date).toLocaleDateString(
                  'es-MX'
                )
                : 'N/A'
            }
          />
        </CardContent>
      </Card>

      {/* Diagnosis & Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico y Notas</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <h4 className='font-medium text-sm mb-1'>Diagnóstico</h4>
            <p className='text-sm p-3 bg-gray-50 rounded-md'>
              {consultation.diagnosis || 'No especificado'}
            </p>
          </div>
          <div>
            <h4 className='font-medium text-sm mb-1'>Recomendaciones</h4>
            <p className='text-sm p-3 bg-gray-50 rounded-md'>
              {consultation.recommendations || 'No especificado'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
