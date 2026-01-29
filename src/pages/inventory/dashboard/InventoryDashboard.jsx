// src/pages/inventory/dashboard/InventoryDashboard.jsx
/**
 * Dashboard principal del módulo de Inventario.
 *
 * Muestra métricas generales, alertas de stock y accesos rápidos
 * a los submódulos de inventario (proveedores, marcas, productos).
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Tag,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Circle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  getInventoryDashboard,
  getSetupProgress,
} from '@/api/inventory';
import { formatPrice } from '@/api/products';
import { useAuthRole } from '@/hooks/useAuthRole';

const InventoryDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [setupProgress, setSetupProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuthRole();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardData, progressData] = await Promise.all([
        getInventoryDashboard(),
        getSetupProgress(),
      ]);
      setDashboard(dashboardData);
      setSetupProgress(progressData);
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
      setError('No se pudo cargar la información del dashboard. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={fetchData} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Módulos según el rol del usuario
  const allModules = [
    {
      icon: Building2,
      title: 'Proveedores',
      description: 'Gestiona tus proveedores de productos',
      path: '/inventory/suppliers',
      count: dashboard?.suppliers_count ?? 0,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      adminOnly: true,
    },
    {
      icon: Tag,
      title: 'Marcas',
      description: 'Administra las marcas de tus productos',
      path: '/inventory/brands',
      count: dashboard?.brands_count ?? 0,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      adminOnly: true,
    },
    {
      icon: Package,
      title: 'Productos y Stock',
      description: 'Catálogo de productos e inventario por sucursal',
      path: '/inventory/products',
      count: dashboard?.products_count ?? 0,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      adminOnly: false,
    },
  ];

  // Filtrar módulos según el rol
  const modules = allModules.filter((module) => isAdmin() || !module.adminOnly);

  // Alertas solo para administradores
  const alerts = [];
  if (isAdmin()) {
    if (dashboard?.low_stock_count > 0) {
      alerts.push({
        type: 'warning',
        message: `${dashboard.low_stock_count} producto(s) con stock bajo`,
        link: '/inventory/products?filter=low_stock',
      });
    }
    if (dashboard?.out_of_stock_count > 0) {
      alerts.push({
        type: 'error',
        message: `${dashboard.out_of_stock_count} producto(s) agotado(s)`,
        link: '/inventory/products?filter=out_of_stock',
      });
    }
    if (dashboard?.products_without_inventory > 0) {
      alerts.push({
        type: 'info',
        message: `${dashboard.products_without_inventory} producto(s) sin inventario configurado`,
        link: '/inventory/products',
      });
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Inventario</h1>
          <p className='mt-2 text-gray-600'>
            {isAdmin() 
              ? 'Gestiona proveedores, marcas, productos y stock de tu negocio'
              : 'Consulta productos y disponibilidad de stock'}
          </p>
        </div>
        <Button onClick={fetchData} variant='outline' size='sm'>
          <RefreshCw className='h-4 w-4 mr-2' />
          Actualizar
        </Button>
      </div>

      {/* Banner de configuración inicial - Solo para admins */}
      {isAdmin() && setupProgress && !setupProgress.setup_complete && (
        <Alert className='border-blue-200 bg-blue-50'>
          <AlertTriangle className='h-4 w-4 text-blue-600' />
          <AlertDescription>
            <div className='space-y-3'>
              <div>
                <p className='font-semibold text-blue-900'>
                  Configura tu inventario
                </p>
                <p className='text-sm text-blue-700 mt-1'>
                  Sigue estos pasos para comenzar a gestionar tu inventario.
                  Recomendamos completarlos en orden:
                </p>
              </div>

              {/* Progress bar */}
              <div>
                <div className='flex justify-between text-sm mb-2'>
                  <span className='text-blue-900 font-medium'>
                    Progreso: {setupProgress.completed_count} de{' '}
                    {setupProgress.total_steps}
                  </span>
                  <span className='text-blue-700'>
                    {Math.round(setupProgress.progress_percentage)}%
                  </span>
                </div>
                <Progress
                  value={setupProgress.progress_percentage}
                  className='h-2'
                />
              </div>

              {/* Checklist */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4'>
                {setupProgress.steps?.map((step) => (
                  <div
                    key={step.id}
                    className='flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100'
                  >
                    {step.completed ? (
                      <CheckCircle2 className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                    ) : (
                      <Circle className='h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5' />
                    )}
                    <div className='flex-1 min-w-0'>
                      <p
                        className={`text-sm font-medium ${
                          step.completed ? 'text-gray-500' : 'text-gray-900'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className='text-xs text-gray-600 mt-0.5'>
                        {step.description}
                      </p>
                      {!step.completed && (
                        <Link to={step.action_url}>
                          <Button
                            size='sm'
                            variant='link'
                            className='h-auto p-0 mt-1 text-blue-600'
                          >
                            {step.action_label} →
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas principales */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin() ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 lg:gap-6'`}>
        {isAdmin() && (
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Valor de Inventario
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatPrice(dashboard?.inventory_value ?? 0)}
              </div>
              <p className='text-xs text-gray-600 mt-1'>
                Valor total del stock
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Productos</CardTitle>
            <Package className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {dashboard?.products_count ?? 0}
            </div>
            <p className='text-xs text-gray-600 mt-1'>
              Productos activos
            </p>
          </CardContent>
        </Card>

        {isAdmin() && (
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Stock Bajo</CardTitle>
              <AlertTriangle className='h-4 w-4 text-yellow-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {dashboard?.low_stock_count ?? 0}
              </div>
              <p className='text-xs text-gray-600 mt-1'>
                Requieren reorden
              </p>
            </CardContent>
          </Card>
        )}

        {isAdmin() && (
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Agotados</CardTitle>
              <AlertTriangle className='h-4 w-4 text-red-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {dashboard?.out_of_stock_count ?? 0}
              </div>
              <p className='text-xs text-gray-600 mt-1'>
                Sin stock disponible
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className='space-y-3'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Alertas de Inventario
          </h2>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              className={
                alert.type === 'error'
                  ? 'border-red-200 bg-red-50'
                  : alert.type === 'warning'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-blue-200 bg-blue-50'
              }
            >
              <AlertTriangle
                className={`h-4 w-4 ${
                  alert.type === 'error'
                    ? 'text-red-600'
                    : alert.type === 'warning'
                    ? 'text-yellow-600'
                    : 'text-blue-600'
                }`}
              />
              <AlertDescription className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2'>
                <span
                  className={
                    alert.type === 'error'
                      ? 'text-red-900'
                      : alert.type === 'warning'
                      ? 'text-yellow-900'
                      : 'text-blue-900'
                  }
                >
                  {alert.message}
                </span>
                <Link to={alert.link}>
                  <Button size='sm' variant='ghost'>
                    Ver detalles
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Módulos de acceso rápido */}
      <div>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          {isAdmin() ? 'Módulos de Inventario' : 'Acceso a Inventario'}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6'>
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.path} to={module.path}>
                <Card className='hover:shadow-lg transition-shadow cursor-pointer h-full'>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div
                        className={`p-3 rounded-lg ${module.bgColor}`}
                      >
                        <Icon
                          className={`h-6 w-6 ${module.iconColor}`}
                        />
                      </div>
                      <span className='text-2xl font-bold text-gray-900'>
                        {module.count}
                      </span>
                    </div>
                    <CardTitle className='mt-4'>{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-600 mb-4'>
                      {module.description}
                    </p>
                    <Button variant='ghost' className='w-full justify-between'>
                      Gestionar
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
