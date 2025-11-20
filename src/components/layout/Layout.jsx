import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  UserPlus,
  FilePlus,
  ShoppingCart,
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      description: 'Resumen general',
    },
    {
      name: 'Clientes',
      icon: Users,
      path: '/customers',
      description: 'Gestionar clientes',
    },
    {
      name: 'Consultas',
      icon: FileText,
      path: '/consultations',
      description: 'Historial de consultas',
    },
    {
      name: 'Pedidos',
      icon: ShoppingCart,
      path: '/orders',
      description: 'Gestionar pedidos',
    },
  ];

  const quickActions = [
    {
      name: 'Nuevo Cliente',
      icon: UserPlus,
      path: '/customers/new',
      description: 'Registrar cliente',
    },
    {
      name: 'Nueva Consulta',
      icon: FilePlus,
      path: '/consultations',
      description: 'Crear consulta',
      action: 'openConsultationForm', // Esto podría disparar el modal
    },
  ];

  const isActivePath = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        >
          <div className='fixed inset-0 bg-gray-600 bg-opacity-75'></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>A</span>
              </div>
            </div>
            <div className='ml-3'>
              <h1 className='text-lg font-semibold text-gray-900'>Amalitica</h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <nav className='mt-6 px-3'>
          {/* Menu Principal */}
          <div className='space-y-1'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`}
                  />
                  <div className='text-left'>
                    <div>{item.name}</div>
                    <div className='text-xs text-gray-500'>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Acciones Rápidas */}
          <div className='mt-8'>
            <h3 className='px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Acciones Rápidas
            </h3>
            <div className='mt-2 space-y-1'>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => {
                      navigate(action.path);
                      setSidebarOpen(false);
                    }}
                    className='w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors'
                  >
                    <Icon className='mr-3 h-4 w-4 text-gray-400' />
                    <div className='text-left'>
                      <div>{action.name}</div>
                      <div className='text-xs text-gray-500'>
                        {action.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User info and logout */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200'>
          <div className='flex items-center mb-3'>
            <div className='flex-shrink-0'>
              <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                <span className='text-gray-600 font-medium text-sm'>
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className='ml-3 flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {user?.name || 'Usuario'}
              </p>
              <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant='outline'
            size='sm'
            className='w-full'
          >
            <LogOut className='h-4 w-4 mr-2' />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className='lg:pl-64'>
        {/* Top bar */}
        <div className='sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 lg:hidden'>
          <div className='flex items-center justify-between h-16 px-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            >
              <Menu className='h-6 w-6' />
            </button>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>A</span>
              </div>
              <span className='ml-2 text-lg font-semibold text-gray-900'>
                Amalitica
              </span>
            </div>
            <div className='w-10'></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className='flex-1'>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
