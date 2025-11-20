import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuth from '@/hooks/useAuth';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Resumen general',
      path: '/dashboard',
    },
    {
      icon: Users,
      label: 'Clientes',
      description: 'Gestionar clientes',
      path: '/customers',
    },
    {
      icon: FileText,
      label: 'Consultas',
      description: 'Historial de consultas',
      path: '/consultations',
    },
  ];

  const quickActions = [
    {
      label: 'Nuevo Cliente',
      description: 'Registrar cliente',
      path: '/customers/new',
    },
    {
      label: 'Nueva Consulta',
      description: 'Crear consulta',
      path: '/consultations',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <aside className='w-64 bg-white border-r border-gray-200 flex flex-col'>
        {/* Logo */}
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10 bg-blue-600'>
              <AvatarFallback className='bg-blue-600 text-white font-bold'>
                A
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>Amalitica</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 space-y-1'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className='h-5 w-5' />
                <div className='flex-1 text-left'>
                  <p className='font-medium text-sm'>{item.label}</p>
                  <p className='text-xs text-gray-500'>{item.description}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className='p-4 border-t border-gray-200'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>
            Acciones Rápidas
          </p>
          <div className='space-y-2'>
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <p className='font-medium'>{action.label}</p>
                <p className='text-xs text-gray-500'>{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className='p-4 border-t border-gray-200'>
          <div className='flex items-center gap-3 mb-3'>
            <Avatar className='h-10 w-10 bg-gray-300'>
              <AvatarFallback className='bg-gray-300 text-gray-700 font-semibold'>
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {user?.name || 'Administrador Proyecta'}
              </p>
              <p className='text-xs text-gray-500 truncate'>
                {user?.email || 'admin@proyecta.com'}
              </p>
            </div>
          </div>
          <Button
            variant='outline'
            className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
            onClick={handleLogout}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>
        <div className='p-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
