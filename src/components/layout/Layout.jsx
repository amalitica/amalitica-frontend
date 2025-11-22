import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // ✅ CAMBIO: Importamos el nuevo Sidebar
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = () => {
  // NUEVO: Estado para controlar la visibilidad del sidebar en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* --- Sidebar --- */}
      {/* CAMBIO: Renderizamos el nuevo componente Sidebar y le pasamos el estado */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* --- Contenido Principal --- */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/*  NUEVO: Header para el contenido principal, visible en todas las pantallas */}
        <header className='lg:hidden bg-white border-b border-gray-200 p-2 flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className='h-6 w-6' />
          </Button>
          <div className='flex-1 text-center'>
            <h1 className='text-lg font-bold'>Óptica</h1>
          </div>
        </header>

        {/* --- Outlet (donde se renderizan las páginas) --- */}
        <main className='flex-1 overflow-auto'>
          {/* ✅ CAMBIO: Padding más consistente y responsive */}
          <div className='p-4 sm:p-6 lg:p-8'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
