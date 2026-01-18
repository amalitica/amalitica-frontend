import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {' '}
      {/* ✅ overflow-hidden aquí */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      {/* Contenedor que crecerá y tendrá scroll */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {' '}
        {/* ✅ Sin h-screen aquí */}
        <header className='lg:hidden bg-white border-b border-gray-200 p-2 flex items-center shrink-0'>
          {' '}
          {/* ✅ shrink-0 */}
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
        {/* Área de contenido con scroll */}
        <div className='flex-1 overflow-y-auto'>
          {' '}
          {/* ✅ Solo este div tiene scroll */}
          <div className='p-4 sm:p-6 lg:p-8 min-h-full'>
            {' '}
            {/* ✅ min-h-full */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
