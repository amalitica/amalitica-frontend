import { useEffect, useState } from 'react';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { getCustomers } from '@/api/customers';
import { getConsultations } from '@/api/consultations';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalConsultations: 0,
    consultationsToday: 0,
    consultationsThisMonth: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [customersResponse, consultationsResponse] = await Promise.all([
          getCustomers({ page: 1, size: 1 }),
          getConsultations({ page: 1, size: 100 }),
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

        const recent = consultations
          .sort(
            (a, b) =>
              new Date(b.consultation_date) - new Date(a.consultation_date)
          )
          .slice(0, 5);

        setStats({
          totalCustomers,
          totalConsultations,
          consultationsToday,
          consultationsThisMonth,
        });
        setRecentConsultations(recent);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: 'Total Clientes',
      value: stats.totalCustomers,
      description: 'Clientes registrados',
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
        {' '}
        {/* ✅ CAMBIO: 2 columnas en móvil */}
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1 px-4 pt-4 md:px-6 md:pt-6'>
                {' '}
                {/* ✅ CAMBIO: Padding responsive */}
                <CardTitle className='text-xs sm:text-sm font-medium text-gray-600'>
                  {' '}
                  {/* ✅ CAMBIO: Texto más pequeño en móvil */}
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />{' '}
                {/* ✅ CAMBIO: Icono más pequeño en móvil */}
              </CardHeader>
              <CardContent className='px-4 pb-4 md:px-6 md:pb-6'>
                <div className='text-lg sm:text-2xl font-bold text-gray-900'>
                  {' '}
                  {/* ✅ CAMBIO: Número más pequeño en móvil */}
                  {loading ? '...' : stat.value}
                </div>
                <p className='text-xs text-gray-500 mt-1'>{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Consultas Recientes</CardTitle>
            <p className='text-sm text-gray-600'>
              Últimas consultas realizadas
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className='text-gray-500 text-center py-4'>Cargando...</p>
            ) : recentConsultations.length === 0 ? (
              <p className='text-gray-500 text-center py-4'>
                No hay consultas recientes
              </p>
            ) : (
              <div className='space-y-2'>
                {recentConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className='flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                  >
                    <div>
                      <p className='font-medium text-gray-900 text-sm'>
                        {consultation.customer_name || 'Cliente sin nombre'}
                      </p>
                      <p className='text-xs text-gray-600'>
                        {new Date(
                          consultation.consultation_date
                        ).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        navigate(`/consultations/${consultation.id}`)
                      }
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <p className='text-sm text-gray-600'>
              Accesos directos a las funciones más utilizadas
            </p>
          </CardHeader>
          <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {' '}
            {/* ✅ CAMBIO: 2 columnas en pantallas sm+ */}
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/customers/new')}
            >
              <Users className='mr-2 h-4 w-4' />
              Registrar Cliente
            </Button>
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/consultations')}
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
              Ver Clientes
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
