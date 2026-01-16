import { useEffect, useState } from 'react';
import { Users, FileText, Calendar, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { getCustomers } from '@/api/customers';
import { getConsultations, getPendingDeliveries } from '@/api/consultations';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalConsultations: 0,
    consultationsToday: 0,
    consultationsThisMonth: 0,
  });
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          customersResponse,
          consultationsResponse,
          pendingDeliveriesResponse,
        ] = await Promise.all([
          getCustomers({ page: 1, size: 1 }),
          getConsultations({ page: 1, size: 100 }),
          getPendingDeliveries(),
        ]);

        const totalCustomers = customersResponse.data.total_count;
        const consultations = consultationsResponse.data.items;
        const totalConsultations = consultationsResponse.data.total_count;

        const today = new Date().toISOString().split('T')[0];
        const consultationsToday = consultations.filter((c) =>
          c.consultation_date?.startsWith(today)
        ).length;

        const currentMonth = new Date().toISOString().slice(0, 7);
        const consultationsThisMonth = consultations.filter((c) =>
          c.consultation_date?.startsWith(currentMonth)
        ).length;

        setStats({
          totalCustomers,
          totalConsultations,
          consultationsToday,
          consultationsThisMonth,
        });

        // Procesar entregas pendientes
        setPendingDeliveries(pendingDeliveriesResponse.data);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Función para calcular la fecha de entrega
  const calculateDeliveryDate = (creationDate, deliveryDays) => {
    const date = new Date(creationDate);
    date.setDate(date.getDate() + deliveryDays);
    return date;
  };

  // Función para calcular días restantes
  const calculateDaysRemaining = (creationDate, deliveryDays) => {
    const deliveryDate = calculateDeliveryDate(creationDate, deliveryDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deliveryDate.setHours(0, 0, 0, 0);
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para formatear el nombre completo del paciente
  const formatCustomerName = (customer) => {
    if (!customer) return 'Paciente sin nombre';
    const parts = [
      customer.name,
      customer.paternal_surname,
      customer.maternal_surname,
    ].filter(Boolean);
    return parts.join(' ') || 'Paciente sin nombre';
  };

  // Función para obtener el color del badge según días restantes
  const getDaysRemainingColor = (daysRemaining) => {
    if (daysRemaining < 0) return 'bg-red-100 text-red-800';
    if (daysRemaining === 0) return 'bg-orange-100 text-orange-800';
    if (daysRemaining <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Función para obtener el texto de días restantes
  const getDaysRemainingText = (daysRemaining) => {
    if (daysRemaining < 0)
      return `Vencido ${Math.abs(daysRemaining)} día${Math.abs(daysRemaining) !== 1 ? 's' : ''}`;
    if (daysRemaining === 0) return 'Hoy';
    if (daysRemaining === 1) return 'Mañana';
    return `${daysRemaining} días`;
  };

  const statsCards = [
    {
      title: 'Total Pacientes',
      value: stats.totalCustomers,
      description: 'Pacientes registrados',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Consultas',
      value: stats.totalConsultations,
      description: 'Consultas realizadas',
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: 'Consultas Hoy',
      value: stats.consultationsToday,
      description: 'Consultas de hoy',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Este Mes',
      value: stats.consultationsThisMonth,
      description: 'Consultas este mes',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
          Bienvenido, {user.name}
        </h1>
        <p className='text-sm text-gray-600'>Panel de control empresarial</p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4 md:px-6 md:pt-6'>
                <CardTitle className='text-xs sm:text-sm font-medium text-gray-600'>
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent className='px-4 pb-4 md:px-6 md:pb-6'>
                <div className='text-lg sm:text-2xl font-bold text-gray-900'>
                  {loading ? '...' : stat.value}
                </div>
                <p className='text-xs text-gray-500 mt-1'>{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Card de Entregas Pendientes */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Package className='h-5 w-5 text-blue-600' />
              <CardTitle>Entregas Pendientes</CardTitle>
            </div>
            <p className='text-sm text-gray-600'>
              Productos próximos a entregar
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className='text-gray-500 text-center py-4'>Cargando...</p>
            ) : pendingDeliveries.length === 0 ? (
              <p className='text-gray-500 text-center py-4'>
                No hay entregas pendientes
              </p>
            ) : (
              <div className='max-h-[145px] overflow-y-auto space-y-2 pr-2'>
                {pendingDeliveries.map((consultation) => {
                  const daysRemaining = calculateDaysRemaining(
                    consultation.creation_date,
                    consultation.delivery_days
                  );
                  const deliveryDate = calculateDeliveryDate(
                    consultation.creation_date,
                    consultation.delivery_days
                  );

                  return (
                    <div
                      key={consultation.id}
                      className='flex flex-col gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200'
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1 min-w-0'>
                          <p className='font-semibold text-gray-900 text-sm truncate'>
                            {formatCustomerName(consultation.customer)}
                          </p>
                          <p className='text-xs text-gray-600 mt-0.5'>
                            Folio: {consultation.folio || 'Sin folio'}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDaysRemainingColor(
                            daysRemaining
                          )}`}
                        >
                          {getDaysRemainingText(daysRemaining)}
                        </span>
                      </div>

                      <div className='flex items-center justify-between text-xs text-gray-600'>
                        <div className='flex flex-col gap-0.5'>
                          <span>
                            Creación:{' '}
                            {new Date(
                              consultation.creation_date
                            ).toLocaleDateString('es-MX')}
                          </span>
                          <span>
                            Entrega: {deliveryDate.toLocaleDateString('es-MX')}
                          </span>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() =>
                            navigate(`/consultations/${consultation.id}`)
                          }
                          className='h-7 text-xs'
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <p className='text-sm text-gray-600'>
              Accesos directos a las funciones más utilizadas
            </p>
          </CardHeader>
          <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/customers/new')}
            >
              <Users className='mr-2 h-4 w-4' />
              Registrar Paciente
            </Button>
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/consultations/new')}
            >
              <FileText className='mr-2 h-4 w-4' />
              Nueva Consulta
            </Button>
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/customers')}
            >
              <Users className='mr-2 h-4 w-4' />
              Ver Pacientes
            </Button>
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/consultations')}
            >
              <FileText className='mr-2 h-4 w-4' />
              Ver Consultas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
