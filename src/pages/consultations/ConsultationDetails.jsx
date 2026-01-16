// src/pages/consultations/ConsultationDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  User,
  Calendar,
  FileText,
  Printer,
} from 'lucide-react';
import { getConsultationById, deleteConsultation } from '@/api/consultations';
import { downloadConsultationTicket, downloadLabOrder } from '@/api/documents';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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

  const handlePrintTicket = async () => {
    try {
      await downloadConsultationTicket(consultation.id);
      toast.success('Ticket descargado correctamente');
    } catch (error) {
      toast.error('Error al descargar el ticket');
    }
  };

  const handlePrintLabOrder = async () => {
    try {
      await downloadLabOrder(consultation.id);
      toast.success('Orden de laboratorio descargada correctamente');
    } catch (error) {
      toast.error('Error al descargar la orden de laboratorio');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Cargando detalles de la consulta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <Button onClick={() => navigate('/consultations')}>
            Volver a Consultas
          </Button>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-gray-600 mb-4'>No se encontró la consulta.</p>
          <Button onClick={() => navigate('/consultations')}>
            Volver a Consultas
          </Button>
        </div>
      </div>
    );
  }

  // Componentes auxiliares para mostrar información
  const DetailItem = ({ label, value, className = '' }) => (
    <div className={className}>
      <p className='text-xs text-gray-500 mb-1'>{label}</p>
      <p className='text-sm font-medium text-gray-900'>
        {value !== null && value !== undefined && value !== ''
          ? value
          : 'No especificado'}
      </p>
    </div>
  );

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className='flex items-center gap-2 mb-4'>
      {Icon && <Icon className='h-5 w-5 text-gray-600' />}
      <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
    </div>
  );

  const RxTable = ({ title, data }) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div>
          <h4 className='font-medium text-sm text-gray-700 mb-2'>{title}</h4>
          <p className='text-sm text-gray-500'>No especificado</p>
        </div>
      );
    }

    return (
      <div>
        <h4 className='font-medium text-sm text-gray-700 mb-3'>{title}</h4>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          <DetailItem label='Esfera (SPH)' value={data.sph} />
          <DetailItem label='Cilindro (CYL)' value={data.cyl} />
          <DetailItem label='Eje (AXIS)' value={data.axis} />
          <DetailItem label='Adición (ADD)' value={data.add} />
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const BooleanBadge = ({ value, trueLabel = 'Sí', falseLabel = 'No' }) => {
    if (value === null || value === undefined)
      return <span className='text-gray-400'>-</span>;
    return (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? trueLabel : falseLabel}
      </Badge>
    );
  };

  return (
    <div className='container mx-auto px-4 py-6 max-w-7xl space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/consultations')}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
              Detalles de Consulta
            </h1>
            <p className='text-sm text-gray-600 mt-1'>
              Folio:{' '}
              <span className='font-medium'>
                {consultation.folio || `#${consultation.id}`}
              </span>
            </p>
          </div>
        </div>
        <div className='flex gap-3'>
          <Button
            onClick={handlePrintTicket}
            variant='outline'
            className='flex items-center gap-2'
          >
            <Printer className='h-4 w-4' />
            Imprimir Ticket
          </Button>

          <Button
            onClick={handlePrintLabOrder}
            variant='outline'
            className='flex items-center gap-2'
          >
            <FileText className='h-4 w-4' />
            Orden de Laboratorio
          </Button>

          <Button asChild variant='outline'>
            <Link to={`/consultations/${id}/edit`}>
              <Edit className='mr-2 h-4 w-4' />
              Editar
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <Trash2 className='mr-2 h-4 w-4' />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La consulta se marcará como
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

      {/* Información General */}
      <Card>
        <CardHeader>
          <SectionTitle icon={User} title='Información General' />
        </CardHeader>
        <CardContent className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <DetailItem
            label='Paciente'
            value={
              consultation.customer
                ? `${consultation.customer.name} ${consultation.customer.paternal_surname}`
                : 'No especificado'
            }
          />
          <DetailItem
            label='Fecha de Consulta'
            value={formatDate(consultation.creation_date)}
          />
          {/*<DetailItem label='Sucursal' value={consultation.branch_id} />*/}
          <DetailItem
            label='Optometrista'
            value={
              consultation.optometrist
                ? consultation.optometrist.name
                : consultation.created_by.name
            }
          />
        </CardContent>
      </Card>

      {/* Prescripción Final (RX) */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Eye} title='Prescripción Final (RX)' />
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Ojo Derecho */}
          <div>
            <h4 className='font-semibold text-gray-800 mb-3'>
              Ojo Derecho (OD/RE)
            </h4>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg'>
              <DetailItem
                label='Esfera (SPH)'
                value={consultation.re_sph_final}
              />
              <DetailItem
                label='Cilindro (CYL)'
                value={consultation.re_cyl_final}
              />
              <DetailItem
                label='Eje (AXIS)'
                value={consultation.re_axis_final}
              />
              <DetailItem
                label='Adición (ADD)'
                value={consultation.re_add_final}
              />
              <DetailItem label='DP' value={consultation.re_pd_final} />
              <DetailItem
                label='Altura Seg.'
                value={consultation.re_seg_height_final}
              />
            </div>
          </div>

          {/* Ojo Izquierdo */}
          <div>
            <h4 className='font-semibold text-gray-800 mb-3'>
              Ojo Izquierdo (OS/LE)
            </h4>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg'>
              <DetailItem
                label='Esfera (SPH)'
                value={consultation.le_sph_final}
              />
              <DetailItem
                label='Cilindro (CYL)'
                value={consultation.le_cyl_final}
              />
              <DetailItem
                label='Eje (AXIS)'
                value={consultation.le_axis_final}
              />
              <DetailItem
                label='Adición (ADD)'
                value={consultation.le_add_final}
              />
              <DetailItem label='DP' value={consultation.le_pd_final} />
              <DetailItem
                label='Altura Seg.'
                value={consultation.le_seg_height_final}
              />
            </div>
          </div>

          {/* Mediciones Binoculares */}
          {(consultation.pd_final || consultation.seg_height_final) && (
            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>
                Mediciones Binoculares
              </h4>
              <div className='grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg'>
                <DetailItem
                  label='DP Binocular'
                  value={consultation.pd_final}
                />
                <DetailItem
                  label='Altura Seg. Binocular'
                  value={consultation.seg_height_final}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agudeza Visual */}
      <Card>
        <CardHeader>
          <SectionTitle icon={Eye} title='Agudeza Visual Final' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>
                Ojo Derecho (OD)
              </h4>
              <div className='space-y-2'>
                <DetailItem
                  label='Lejos'
                  value={consultation.va_final_re_distance}
                />
                <DetailItem
                  label='Cerca'
                  value={consultation.va_final_re_near}
                />
              </div>
            </div>
            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>
                Ojo Izquierdo (OS)
              </h4>
              <div className='space-y-2'>
                <DetailItem
                  label='Lejos'
                  value={consultation.va_final_le_distance}
                />
                <DetailItem
                  label='Cerca'
                  value={consultation.va_final_le_near}
                />
              </div>
            </div>
            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>
                Ambos Ojos (OU)
              </h4>
              <div className='space-y-2'>
                <DetailItem
                  label='Lejos'
                  value={consultation.va_final_both_distance}
                />
                <DetailItem
                  label='Cerca'
                  value={consultation.va_final_both_near}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mediciones (Lensometría y Retinoscopía) */}
      {(consultation.lensometry || consultation.retinoscopy) && (
        <Card>
          <CardHeader>
            <SectionTitle title='Mediciones Clínicas' />
          </CardHeader>
          <CardContent className='space-y-6'>
            {consultation.lensometry && (
              <div>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Lensometría
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <RxTable
                    title='Ojo Derecho (RE)'
                    data={consultation.lensometry?.re}
                  />
                  <RxTable
                    title='Ojo Izquierdo (LE)'
                    data={consultation.lensometry?.le}
                  />
                </div>
              </div>
            )}

            {consultation.retinoscopy && (
              <div>
                <h3 className='font-semibold text-gray-900 mb-4'>
                  Retinoscopía
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <RxTable
                    title='Ojo Derecho (RE)'
                    data={consultation.retinoscopy?.re}
                  />
                  <RxTable
                    title='Ojo Izquierdo (LE)'
                    data={consultation.retinoscopy?.le}
                  />
                </div>
                {consultation.retinoscopy_notes && (
                  <div className='mt-4'>
                    <DetailItem
                      label='Notas de Retinoscopía'
                      value={consultation.retinoscopy_notes}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Síntomas */}
      {consultation.symptoms && (
        <Card>
          <CardHeader>
            <SectionTitle title='Síntomas y Condiciones' />
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Síntomas Visuales */}
            {consultation.symptoms.vision && (
              <div>
                <h4 className='font-semibold text-gray-800 mb-3'>
                  Síntomas Visuales
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>
                      Visión borrosa de lejos
                    </p>
                    <BooleanBadge
                      value={consultation.symptoms.vision.blurry_distance}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>
                      Visión borrosa de cerca
                    </p>
                    <BooleanBadge
                      value={consultation.symptoms.vision.blurry_near}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>
                      Letras se mueven
                    </p>
                    <BooleanBadge
                      value={consultation.symptoms.vision.blurry_letters}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>
                      Sensible al sol
                    </p>
                    <BooleanBadge
                      value={consultation.symptoms.vision.sun_sensitive}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>
                      Sensible a luz artificial
                    </p>
                    <BooleanBadge
                      value={
                        consultation.symptoms.vision.artificial_light_sensitive
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cefalea */}
            {consultation.symptoms.headache && (
              <div>
                <h4 className='font-semibold text-gray-800 mb-3'>Cefalea</h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Frontal</p>
                    <BooleanBadge
                      value={consultation.symptoms.headache.frontal}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Occipital</p>
                    <BooleanBadge
                      value={consultation.symptoms.headache.occipital}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Temporal</p>
                    <BooleanBadge
                      value={consultation.symptoms.headache.temporal}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Molestias Oculares */}
            {consultation.symptoms.eye_discomfort && (
              <div>
                <h4 className='font-semibold text-gray-800 mb-3'>
                  Molestias Oculares
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3'>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Dolor ocular</p>
                    <BooleanBadge
                      value={consultation.symptoms.eye_discomfort.eye_pain}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Comezón</p>
                    <BooleanBadge
                      value={consultation.symptoms.eye_discomfort.itching}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Ardor</p>
                    <BooleanBadge
                      value={consultation.symptoms.eye_discomfort.burning}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Lagrimeo</p>
                    <BooleanBadge
                      value={consultation.symptoms.eye_discomfort.watery_eyes}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Irritación</p>
                    <BooleanBadge
                      value={consultation.symptoms.eye_discomfort.irritation}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Ojo seco</p>
                    <BooleanBadge
                      value={consultation.symptoms.eye_discomfort.dry_eye}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Cansancio</p>
                    <BooleanBadge
                      value={consultation.symptoms.eye_discomfort.fatigue}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Condiciones de Salud */}
            {consultation.symptoms.health_conditions && (
              <div>
                <h4 className='font-semibold text-gray-800 mb-3'>
                  Condiciones de Salud
                </h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Hipertensión</p>
                    <BooleanBadge
                      value={
                        consultation.symptoms.health_conditions.hypertension
                      }
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>Diabetes</p>
                    <BooleanBadge
                      value={consultation.symptoms.health_conditions.diabetes}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 mb-1'>
                      Cansancio general
                    </p>
                    <BooleanBadge
                      value={consultation.symptoms.health_conditions.tired}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Información Adicional */}
            {(consultation.symptoms.disease ||
              consultation.symptoms.takes_medication ||
              consultation.symptoms.observations) && (
                <div className='space-y-3 p-4 bg-gray-50 rounded-lg'>
                  {consultation.symptoms.disease && (
                    <DetailItem
                      label='Enfermedades'
                      value={consultation.symptoms.disease}
                    />
                  )}
                  {consultation.symptoms.takes_medication && (
                    <DetailItem
                      label='Medicamentos'
                      value={consultation.symptoms.takes_medication}
                    />
                  )}
                  {consultation.symptoms.observations && (
                    <DetailItem
                      label='Observaciones'
                      value={consultation.symptoms.observations}
                    />
                  )}
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Producto y Comercial */}
      <Card>
        <CardHeader>
          <SectionTitle icon={FileText} title='Información del Producto' />
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Armazón */}
          <div>
            <h4 className='font-semibold text-gray-800 mb-3'>Armazón</h4>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              <DetailItem label='Marca' value={consultation.frame_brand} />
              <DetailItem label='Modelo' value={consultation.frame_model} />
              <DetailItem label='Color' value={consultation.frame_color} />
              <DetailItem label='Tamaño' value={consultation.frame_size} />
            </div>
          </div>

          {/* Lentes */}
          <div>
            <h4 className='font-semibold text-gray-800 mb-3'>Lentes</h4>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              <DetailItem
                label='Tipo de Lente'
                value={consultation.lens_type}
              />
              <DetailItem label='Material' value={consultation.lens_material} />
              <DetailItem label='Diseño' value={consultation.lens_design} />
              <DetailItem label='Tipo OD' value={consultation.re_lens_type} />
              <DetailItem label='Tipo OS' value={consultation.le_lens_type} />
            </div>
          </div>

          {/* Información Comercial */}
          {(consultation.total_price || consultation.delivery_days) && (
            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>
                Información Comercial
              </h4>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg'>
                <DetailItem
                  label='Precio Total'
                  value={formatPrice(consultation.total_price)}
                />
                <DetailItem
                  label='Días de Entrega'
                  value={consultation.delivery_days}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notas Adicionales */}
      {consultation.additional_notes && (
        <Card>
          <CardHeader>
            <SectionTitle icon={FileText} title='Notas Adicionales' />
          </CardHeader>
          <CardContent>
            <p className='text-sm text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg'>
              {consultation.additional_notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
