import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConsultations } from '@/api/consultations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, Search, Calendar, User, FileText } from 'lucide-react';
import ConsultationForm from './ConsultationForm';

const ConsultationList = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [consultationsFiltradas, setConsultationsFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    filtrarConsultations();
  }, [busqueda, filtroFecha, consultations]);

  const fetchConsultations = async () => {
    try {
      const response = await getConsultations({ page: 1, size: 100 });
      // El backend devuelve { items: [...], total_count: ..., page: ..., size: ... }
      setConsultations(response.data.items || []);
      setConsultationsFiltradas(response.data.items || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setError('Error al cargar las consultas. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarConsultations = () => {
    let filtradas = [...consultations];

    // Filtro por búsqueda de texto
    if (busqueda.trim()) {
      filtradas = filtradas.filter(
        (consultation) =>
          consultation.customer?.name
            ?.toLowerCase()
            .includes(busqueda.toLowerCase()) ||
          consultation.folio?.toLowerCase().includes(busqueda.toLowerCase()) ||
          consultation.additional_notes
            ?.toLowerCase()
            .includes(busqueda.toLowerCase())
      );
    }

    // Filtro por fecha
    if (filtroFecha) {
      const fechaFiltro = new Date(filtroFecha);
      filtradas = filtradas.filter((consultation) => {
        const fechaConsultation = new Date(consultation.consultation_date);
        return fechaConsultation.toDateString() === fechaFiltro.toDateString();
      });
    }

    setConsultationsFiltradas(filtradas);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatearFechaCorta = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const formatearPrescripcion = (esfera, cilindro, eje) => {
    const partes = [];
    if (esfera) partes.push(`Esf: ${esfera}`);
    if (cilindro) partes.push(`Cil: ${cilindro}`);
    if (eje) partes.push(`Eje: ${eje}°`);
    return partes.length > 0 ? partes.join(' | ') : 'No especificado';
  };

  const handleConsultationCreated = () => {
    setIsFormOpen(false);
    fetchConsultations(); // Recargar la lista
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-2'>Cargando consultas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
              <FileText className='h-8 w-8' />
              Consultas Oftalmológicas
            </h1>
            <p className='text-gray-600'>Historial de consultas y exámenes</p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className='w-full sm:w-auto'
          >
            <PlusCircle className='h-4 w-4 mr-2' />
            Nueva Consulta
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant='destructive' className='mb-6'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Formulario Modal */}
        <ConsultationForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleConsultationCreated}
        />

        {/* Búsqueda y Filtros */}
        <Card className='mb-6'>
          <CardContent className='pt-6'>
            <div className='flex flex-col lg:flex-row gap-4'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Buscar por nombre del cliente, folio o notas...'
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className='pl-10'
                />
              </div>
              <div className='flex flex-col sm:flex-row gap-4 lg:w-auto'>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    type='date'
                    placeholder='Filtrar por fecha'
                    value={filtroFecha}
                    onChange={(e) => setFiltroFecha(e.target.value)}
                    className='pl-10 w-full sm:w-48'
                  />
                </div>
                {filtroFecha && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setFiltroFecha('')}
                  >
                    Limpiar Filtro
                  </Button>
                )}
              </div>
            </div>
            <div className='flex items-center justify-between mt-4 text-sm text-gray-600'>
              <span>
                Total: {consultationsFiltradas.length} consulta
                {consultationsFiltradas.length !== 1 ? 's' : ''}
              </span>
              {(busqueda || filtroFecha) && (
                <span>Mostrando resultados filtrados</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Consultas */}
        {consultationsFiltradas.length === 0 ? (
          <Card>
            <CardContent className='text-center py-12'>
              <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {busqueda || filtroFecha
                  ? 'No se encontraron consultas'
                  : 'No hay consultas registradas'}
              </h3>
              <p className='text-gray-600 mb-4'>
                {busqueda || filtroFecha
                  ? 'Intenta con otros términos de búsqueda o ajusta los filtros'
                  : 'Comienza registrando la primera consulta'}
              </p>
              {!busqueda && !filtroFecha && (
                <Button onClick={() => setIsFormOpen(true)}>
                  <PlusCircle className='h-4 w-4 mr-2' />
                  Registrar Primera Consulta
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4'>
            {consultationsFiltradas.map((consultation) => (
              <Card
                key={consultation.id}
                className='hover:shadow-md transition-shadow'
              >
                <CardContent className='p-6'>
                  <div className='flex flex-col lg:flex-row lg:items-start justify-between gap-4'>
                    {/* Información Principal */}
                    <div className='flex-1'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-3'>
                        <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
                          <User className='h-4 w-4' />
                          {consultation.customer?.name ||
                            'Cliente no especificado'}{' '}
                          {consultation.customer?.paternal_surname || ''}
                        </h3>
                        <Badge variant='outline' className='w-fit'>
                          {formatearFechaCorta(consultation.consultation_date)}
                        </Badge>
                        {consultation.folio && (
                          <Badge variant='secondary' className='w-fit'>
                            {consultation.folio}
                          </Badge>
                        )}
                      </div>

                      {/* Prescripción */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                        {/* Ojo Derecho */}
                        <div className='bg-gray-50 p-3 rounded-lg'>
                          <h4 className='font-medium text-sm text-gray-700 mb-2'>
                            Ojo Derecho (OD)
                          </h4>
                          <div className='text-sm text-gray-600'>
                            <div className='mb-1'>
                              <span className='font-medium'>RX:</span>{' '}
                              {formatearPrescripcion(
                                consultation.re_sph_final,
                                consultation.re_cyl_final,
                                consultation.re_axis_final
                              )}
                            </div>
                            {consultation.re_add_final && (
                              <div className='mb-1'>
                                <span className='font-medium'>Add:</span>{' '}
                                {consultation.re_add_final}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ojo Izquierdo */}
                        <div className='bg-gray-50 p-3 rounded-lg'>
                          <h4 className='font-medium text-sm text-gray-700 mb-2'>
                            Ojo Izquierdo (OI)
                          </h4>
                          <div className='text-sm text-gray-600'>
                            <div className='mb-1'>
                              <span className='font-medium'>RX:</span>{' '}
                              {formatearPrescripcion(
                                consultation.le_sph_final,
                                consultation.le_cyl_final,
                                consultation.le_axis_final
                              )}
                            </div>
                            {consultation.le_add_final && (
                              <div className='mb-1'>
                                <span className='font-medium'>Add:</span>{' '}
                                {consultation.le_add_final}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Información Adicional */}
                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4'>
                        {consultation.re_pd_final && (
                          <div>
                            <span className='font-medium'>DIP OD:</span>{' '}
                            {consultation.re_pd_final} mm
                          </div>
                        )}
                        {consultation.le_pd_final && (
                          <div>
                            <span className='font-medium'>DIP OI:</span>{' '}
                            {consultation.le_pd_final} mm
                          </div>
                        )}
                        {consultation.created_by && (
                          <div>
                            <span className='font-medium'>Optometrista:</span>{' '}
                            {consultation.created_by.name}
                          </div>
                        )}
                      </div>

                      {/* Notas Adicionales */}
                      {consultation.additional_notes && (
                        <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
                          <p className='text-sm text-gray-700'>
                            <span className='font-medium'>Notas:</span>{' '}
                            {consultation.additional_notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className='flex flex-row lg:flex-col gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          navigate(`/consultations/${consultation.id}`)
                        }
                      >
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationList;
