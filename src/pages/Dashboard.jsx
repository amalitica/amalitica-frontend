import { useEffect, useState } from 'react';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/axios';

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas de clientes
        const customersResponse = await apiClient.get('/customers/');
        const totalCustomers = customersResponse.data.length;

        // Obtener estadísticas de consultas
        const consultationsResponse = await apiClient.get('/consultations/');
        const consultations = consultationsResponse.data;
        
        const totalConsultations = consultations.length;
        
        // Calcular consultas de hoy
        const today = new Date().toISOString().split('T')[0];
        const consultationsToday = consultations.filter(
          (c) => c.consultation_date?.startsWith(today)
        ).length;

        // Calcular consultas de este mes
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const consultationsThisMonth = consultations.filter(
          (c) => c.consultation_date?.startsWith(currentMonth)
        ).length;

        // Obtener las últimas 5 consultas
        const recent = consultations
          .sort((a, b) => new Date(b.consultation_date) - new Date(a.consultation_date))
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
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-600 mt-1'>Panel de control empresarial</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold text-gray-900'>
                  {loading ? '...' : stat.value}
                </div>
                <p className='text-xs text-gray-500 mt-1'>{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Consultations and Quick Actions */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas Recientes</CardTitle>
            <p className='text-sm text-gray-600'>Últimas consultas realizadas</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className='text-gray-500 text-center py-4'>Cargando...</p>
            ) : recentConsultations.length === 0 ? (
              <p className='text-gray-500 text-center py-4'>
                No hay consultas recientes
              </p>
            ) : (
              <div className='space-y-3'>
                {recentConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                  >
                    <div>
                      <p className='font-medium text-gray-900'>
                        {consultation.customer_name || 'Cliente sin nombre'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {new Date(consultation.consultation_date).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => navigate(`/consultations/${consultation.id}`)}
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <p className='text-sm text-gray-600'>
              Accesos directos a las funciones más utilizadas
            </p>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/customers/new')}
            >
              <Users className='mr-2 h-4 w-4' />
              Registrar Nuevo Cliente
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
              Ver Todos los Clientes
            </Button>
            <Button
              className='w-full justify-start'
              variant='outline'
              onClick={() => navigate('/consultations')}
            >
              <FileText className='mr-2 h-4 w-4' />
              Ver Todas las Consultas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
