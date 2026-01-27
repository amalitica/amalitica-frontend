import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Store,
  UserCog,
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuth from '@/hooks/useAuth';
import { useEffect, useRef } from 'react';

import logoAmalitica from '@/assets/images/amalitica_logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const sidebarRef = useRef(null);

  // 🔥 CRÍTICO: Prevenir propagación del scroll
  useEffect(() => {
    const handleWheel = (e) => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      // Verificar si el scroll está en los extremos
      const isAtTop = sidebar.scrollTop === 0;
      const isAtBottom =
        sidebar.scrollHeight - sidebar.scrollTop <= sidebar.clientHeight + 1;

      // Si está en el tope y scrolleas hacia arriba, prevenir
      if (isAtTop && e.deltaY < 0) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      // Si está en el fondo y scrolleas hacia abajo, prevenir
      if (isAtBottom && e.deltaY > 0) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      // Usar { passive: false } para poder llamar preventDefault()
      sidebar.addEventListener('wheel', handleWheel, { passive: false });
      return () => sidebar.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Pacientes', path: '/customers' },
    { icon: FileText, label: 'Consultas', path: '/consultations' },
    { icon: Package, label: 'Inventario', path: '/inventory' },
  ];

  const adminItems = [
    { icon: Store, label: 'Sucursales', path: '/branches' },
    { icon: UserCog, label: 'Usuarios', path: '/users' },
  ];

  const SidebarContent = () => (
    <div
      className='flex flex-col h-full overscroll-contain'
      ref={sidebarRef}
    >
      {/* Header con logo */}
      <div className='p-2 border-b border-gray-200 flex items-center justify-between shrink-0'>
        <div className='flex items-center gap-3'>
          <img src={logoAmalitica} alt='Logo de Amalitica' className='h-16' />
        </div>
        {/* Botón para cerrar en móvil */}
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden'
          onClick={() => setIsOpen(false)}
        >
          <X className='h-6 w-6' />
        </Button>
      </div>

      {/* Navegación */}
      <nav className='flex-1 p-4 space-y-1 overflow-y-auto min-h-0'>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className='h-5 w-5' />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {/* Sección de Administración */}
        {(user?.role === 'Admin' || user?.role === 'SuperAdmin') && (
          <div className='pt-4'>
            <p className='px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
              Administración
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className='h-5 w-5' />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Sección de Usuario */}
      <div className='p-4 border-t border-gray-200 shrink-0'>
        <div className='flex items-center gap-3 mb-3'>
          <Avatar className='h-9 w-9 bg-gray-300'>
            <AvatarFallback className='bg-gray-300 text-gray-700 font-semibold'>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate'>
              {user?.name || 'Administrador'}
            </p>
            <p className='text-xs text-gray-500 truncate'>
              {user?.email || 'admin@amalitica.com'}
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
    </div>
  );

  return (
    <>
      {/* Sidebar para pantallas grandes */}
      <aside className='w-64 h-full bg-white border-r border-gray-200 flex-col hidden lg:flex overflow-hidden'>
        <SidebarContent />
      </aside>

      {/* Overlay y Sidebar para pantallas pequeñas */}
      {isOpen && (
        <div className='lg:hidden fixed inset-0 z-40'>
          <div
            className='absolute inset-0 bg-black/60'
            onClick={() => setIsOpen(false)}
          ></div>
          <aside className='fixed top-0 left-0 h-screen w-64 bg-white z-50 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300'>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
