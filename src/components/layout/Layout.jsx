import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='lg:hidden bg-white border-b border-gray-200 p-2 flex items-center shrink-0'>
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
        <main className='flex-1 overflow-y-auto' id='main-scroll-container'>
          <div className='p-4 sm:p-6 lg:p-8 min-h-full'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
