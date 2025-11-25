import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  Tag,
  FileText,
} from 'lucide-react';
import { getCustomerById, deleteCustomer } from '@/api/customers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCustomerById(id);
      setCustomer(response.data);
    } catch (err) {
      console.error('Error al cargar cliente:', err);
      setError('Error al cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar a ${customer.name} ${customer.paternal_surname}?`
      )
    ) {
      return;
    }

    try {
      await deleteCustomer(id);
      navigate('/customers');
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      alert('Error al eliminar el cliente. Verifica tus permisos.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-muted-foreground'>Cargando datos del cliente...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold'>Error</h1>
        </div>
        <Card className='border-destructive'>
          <CardContent className='pt-6'>
            <p className='text-destructive'>
              {error || 'Cliente no encontrado'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = calculateAge(customer.birth_date);

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      {/* Header con acciones */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold'>
              {customer.name} {customer.paternal_surname}{' '}
              {customer.maternal_surname || ''}
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Cliente desde {formatDate(customer.creation_date)}
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() => navigate(`/customers/${id}/edit`)}
            variant='outline'
          >
            <Edit className='mr-2 h-4 w-4' />
            Editar
          </Button>
          <Button onClick={handleDelete} variant='destructive'>
            <Trash2 className='mr-2 h-4 w-4' />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información Personal */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            <CardTitle>Información Personal</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Nombre Completo
              </p>
              <p className='text-base mt-1'>
                {customer.name} {customer.paternal_surname}{' '}
                {customer.maternal_surname || ''}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Fecha de Nacimiento
              </p>
              <p className='text-base mt-1'>
                {customer.birth_date ? (
                  <>
                    {formatDate(customer.birth_date)}
                    {age && (
                      <span className='text-muted-foreground ml-2'>
                        ({age} años)
                      </span>
                    )}
                  </>
                ) : (
                  'No especificado'
                )}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Ocupación
              </p>
              <p className='text-base mt-1'>
                {customer.occupation || 'No especificado'}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Estado Civil
              </p>
              <p className='text-base mt-1'>
                {customer.marital_status || 'No especificado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Contacto */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Phone className='h-5 w-5' />
            <CardTitle>Información de Contacto</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Teléfono
              </p>
              <p className='text-base mt-1 font-mono'>{customer.phone}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Email</p>
              <p className='text-base mt-1'>
                {customer.email || 'No especificado'}
              </p>
            </div>
            <div className='md:col-span-2'>
              <p className='text-sm font-medium text-muted-foreground mb-2'>
                <MapPin className='inline h-4 w-4 mr-1' />
                Dirección
              </p>
              <div className='space-y-1'>
                {customer.colony && (
                  <p className='text-base'>Colonia: {customer.colony}</p>
                )}
                {customer.postal_code && (
                  <p className='text-base'>
                    Código Postal: {customer.postal_code}
                  </p>
                )}
                {!customer.colony && !customer.postal_code && (
                  <p className='text-base text-muted-foreground'>
                    No especificado
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Salud */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Heart className='h-5 w-5' />
            <CardTitle>Información de Salud</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground mb-2'>
                Condiciones
              </p>
              <div className='flex flex-wrap gap-2'>
                {customer.diabetes && (
                  <Badge variant='secondary'>Diabetes</Badge>
                )}
                {customer.hypertension && (
                  <Badge variant='secondary'>Hipertensión</Badge>
                )}
                {!customer.diabetes && !customer.hypertension && (
                  <p className='text-sm text-muted-foreground'>
                    Sin condiciones registradas
                  </p>
                )}
              </div>
            </div>
            {customer.medical_conditions && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Otras Condiciones Médicas
                </p>
                <p className='text-base mt-1 whitespace-pre-wrap'>
                  {customer.medical_conditions}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marketing y Notas */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Tag className='h-5 w-5' />
            <CardTitle>Marketing y Notas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                ¿Cómo nos conoció?
              </p>
              <p className='text-base mt-1'>
                {customer.marketing_source || 'No especificado'}
              </p>
            </div>
            {customer.hobbies && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Pasatiempos e Intereses
                </p>
                <p className='text-base mt-1 whitespace-pre-wrap'>
                  {customer.hobbies}
                </p>
              </div>
            )}
            {customer.additional_notes && (
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  <FileText className='inline h-4 w-4 mr-1' />
                  Notas Adicionales
                </p>
                <p className='text-base mt-1 whitespace-pre-wrap bg-muted p-4 rounded-md'>
                  {customer.additional_notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card className='border-muted'>
        <CardHeader>
          <CardTitle className='text-sm'>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
            <div>
              <p className='text-muted-foreground'>ID</p>
              <p className='font-mono mt-1'>{customer.id}</p>
            </div>
            <div>
              <p className='text-muted-foreground'>Fecha de Creación</p>
              <p className='mt-1'>{formatDate(customer.creation_date)}</p>
            </div>
            <div>
              <p className='text-muted-foreground'>Última Modificación</p>
              <p className='mt-1'>{formatDate(customer.modification_date)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetails;
