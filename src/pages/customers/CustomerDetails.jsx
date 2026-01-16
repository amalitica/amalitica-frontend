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
  Briefcase,
  GraduationCap,
  Gamepad2,
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

// Mapeo de claves de enum a valores en español
const ENUM_LABELS = {
  // Género
  gender: {
    MALE: 'Masculino',
    FEMALE: 'Femenino',
    NON_BINARY: 'No Binario',
    PREFER_NOT_TO_SAY: 'Prefiero no decir',
  },
  // Estado Civil
  marital_status: {
    SINGLE: 'Soltero/a',
    MARRIED: 'Casado/a',
    DIVORCED: 'Divorciado/a',
    WIDOWED: 'Viudo/a',
  },
  // Ocupación
  occupation: {
    DOCTOR: 'Médico/a',
    ENGINEER: 'Ingeniero/a',
    LAWYER: 'Abogado/a',
    ARCHITECT: 'Arquitecto/a',
    ACCOUNTANT: 'Contador/a',
    ECONOMIST: 'Economista',
    ADMINISTRATOR: 'Administrador/a',
    PSYCHOLOGIST: 'Psicólogo/a',
    DENTIST: 'Dentista',
    VETERINARIAN: 'Veterinario/a',
    OFFICE_WORKER: 'Oficinista',
    MANAGER: 'Gerente',
    EXECUTIVE: 'Ejecutivo/a',
    SECRETARY: 'Secretario/a',
    ASSISTANT: 'Asistente',
    ANALYST: 'Analista',
    TEACHER: 'Maestro/a',
    PROFESSOR: 'Profesor/a',
    STUDENT: 'Estudiante',
    RESEARCHER: 'Investigador/a',
    MERCHANT: 'Comerciante',
    SALESPERSON: 'Vendedor/a',
    CASHIER: 'Cajero/a',
    ENTREPRENEUR: 'Empresario/a',
    DRIVER: 'Chofer',
    WAITER: 'Mesero/a',
    CHEF: 'Cocinero/a',
    HAIRDRESSER: 'Estilista',
    SECURITY: 'Guardia de Seguridad',
    CLEANER: 'Personal de Limpieza',
    TECHNICIAN: 'Técnico/a',
    MECHANIC: 'Mecánico/a',
    ELECTRICIAN: 'Electricista',
    PLUMBER: 'Plomero/a',
    CARPENTER: 'Carpintero/a',
    NURSE: 'Enfermero/a',
    THERAPIST: 'Terapeuta',
    PHARMACIST: 'Farmacéutico/a',
    PARAMEDIC: 'Paramédico/a',
    ARTIST: 'Artista',
    DESIGNER: 'Diseñador/a',
    PHOTOGRAPHER: 'Fotógrafo/a',
    MUSICIAN: 'Músico/a',
    WRITER: 'Escritor/a',
    HOMEMAKER: 'Ama/o de Casa',
    RETIRED: 'Jubilado/a',
    UNEMPLOYED: 'Desempleado/a',
    OTHER: 'Otro',
  },
  // Nivel de Educación
  education_level: {
    PRIMARY: 'Primaria',
    SECONDARY: 'Secundaria',
    HIGH_SCHOOL: 'Preparatoria',
    TECHNICAL: 'Carrera Técnica',
    BACHELOR: 'Licenciatura',
    MASTER: 'Maestría',
    DOCTORATE: 'Doctorado',
    NO_FORMAL_EDUCATION: 'Sin Educación Formal',
  },
  // Fuente de Marketing
  marketing_source: {
    REFERRAL: 'Referido',
    MEDICAL_REFERRAL: 'Recomendación Médica',
    FACEBOOK: 'Facebook',
    INSTAGRAM: 'Instagram',
    GOOGLE: 'Google',
    GOOGLE_MAPS: 'Google Maps',
    TIKTOK: 'TikTok',
    OUTDOOR_ADVERTISING: 'Publicidad Exterior',
    WALK_BY: 'Ubicación',
    OTHER: 'Otro',
  },
};

// Función helper para obtener el label de un enum
const getEnumLabel = (enumType, value) => {
  if (!value) return 'No especificado';
  return ENUM_LABELS[enumType]?.[value] || value;
};

// Función helper para formatear diabetes/hipertensión con valor nullable
const formatMedicalCondition = (value) => {
  if (value === null || value === undefined) return 'Prefiere no decir';
  return value ? 'Sí' : 'No';
};

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

  // Formatear hobbies (ahora es un array)
  const formatHobbies = (hobbies) => {
    if (!hobbies || hobbies.length === 0) return null;
    // Si es un array, unirlo con comas
    if (Array.isArray(hobbies)) {
      return hobbies.join(', ');
    }
    // Si es string (legacy), devolverlo tal cual
    return hobbies;
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
  const hobbiesFormatted = formatHobbies(customer.hobbies);

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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
                Género
              </p>
              <p className='text-base mt-1'>
                {getEnumLabel('gender', customer.gender)}
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
                Estado Civil
              </p>
              <p className='text-base mt-1'>
                {getEnumLabel('marital_status', customer.marital_status)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Profesional y Educativa */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Briefcase className='h-5 w-5' />
            <CardTitle>Información Profesional</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Ocupación
              </p>
              <p className='text-base mt-1'>
                {getEnumLabel('occupation', customer.occupation)}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                <GraduationCap className='inline h-4 w-4 mr-1' />
                Nivel de Educación
              </p>
              <p className='text-base mt-1'>
                {getEnumLabel('education_level', customer.education_level)}
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
              <p className='text-sm font-medium text-muted-foreground'>
                <Mail className='inline h-4 w-4 mr-1' />
                Email
              </p>
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
                {customer.street && (
                  <p className='text-base'>
                    {customer.street} {customer.exterior_number}
                    {customer.interior_number && `, Int. ${customer.interior_number}`}
                  </p>
                )}
                {customer.settlement_name && (
                  <p className='text-base'>Col. {customer.settlement_name}</p>
                )}
                {customer.postal_code && (
                  <p className='text-base'>C.P. {customer.postal_code}</p>
                )}
                {customer.municipality_name && customer.state_name && (
                  <p className='text-base'>
                    {customer.municipality_name}, {customer.state_name}
                  </p>
                )}
                {!customer.street && !customer.postal_code && (
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <p className='text-sm font-medium text-muted-foreground mb-2'>
                  Diabetes
                </p>
                <Badge 
                  variant={
                    customer.diabetes === true ? 'destructive' : 
                    customer.diabetes === false ? 'secondary' : 
                    'outline'
                  }
                >
                  {formatMedicalCondition(customer.diabetes)}
                </Badge>
              </div>
              <div>
                <p className='text-sm font-medium text-muted-foreground mb-2'>
                  Hipertensión
                </p>
                <Badge 
                  variant={
                    customer.hypertension === true ? 'destructive' : 
                    customer.hypertension === false ? 'secondary' : 
                    'outline'
                  }
                >
                  {formatMedicalCondition(customer.hypertension)}
                </Badge>
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

      {/* Pasatiempos e Intereses */}
      {hobbiesFormatted && (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Gamepad2 className='h-5 w-5' />
              <CardTitle>Pasatiempos e Intereses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {Array.isArray(customer.hobbies) ? (
                customer.hobbies.map((hobby, index) => (
                  <Badge key={index} variant='secondary'>
                    {hobby}
                  </Badge>
                ))
              ) : (
                <p className='text-base'>{customer.hobbies}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
                {getEnumLabel('marketing_source', customer.marketing_source)}
              </p>
            </div>
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
              <p className='mt-1'>{formatDate(customer.update_date)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetails;
