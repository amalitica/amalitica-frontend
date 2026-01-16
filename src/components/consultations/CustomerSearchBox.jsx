// src/components/consultations/CustomerSearchBox.jsx

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, ChevronsUpDown, X, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { searchCustomers, getRecentCustomers } from '@/api/customers';

export default function CustomerSearchBox({ mode }) {
  const { setValue, getValues } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtenemos el nombre y el ID iniciales del formulario
  const initialCustomerId = getValues('customer_id');
  const customerData = getValues('customer'); // Obtenemos el objeto completo del paciente

  // Construir el nombre completo del paciente desde el objeto customer
  const initialCustomerName = customerData
    ? `${customerData.name} ${customerData.paternal_surname}`.trim()
    : '';

  // Estado para mostrar el nombre del paciente seleccionado
  const [selectedCustomerName, setSelectedCustomerName] = useState(
    initialCustomerName || ''
  );

  // Cargar pacientes recientes cuando se abre el popover
  useEffect(() => {
    if (open && mode === 'create' && recentCustomers.length === 0) {
      fetchRecentCustomers();
    }
  }, [open, mode]);

  const fetchRecentCustomers = async () => {
    try {
      const customers = await getRecentCustomers(5);
      setRecentCustomers(customers);
    } catch (error) {
      console.error('Error fetching recent customers:', error);
      setRecentCustomers([]);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Ejecutar búsqueda cuando cambia el debounced search
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await searchCustomers(debouncedSearch);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching customers:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch, mode]);

  const handleSelectCustomer = (customer) => {
    const fullName = `${customer.name} ${customer.paternal_surname}`;
    setValue('customer_id', customer.id, { shouldValidate: true });
    setSelectedCustomerName(fullName);
    setSearchQuery(''); // Limpiar la búsqueda
    setSearchResults([]); // Limpiar resultados
    setOpen(false);
  };

  const handleClearSelection = () => {
    setValue('customer_id', null);
    setSelectedCustomerName('');
    setSearchQuery('');
    setSearchResults([]);
    setOpen(true); // Abrir el popover para nueva búsqueda
  };

  // En modo edición, simplemente mostramos el nombre (no editable)
  if (mode === 'edit') {
    return (
      <p className='flex h-10 w-full items-center rounded-md border border-input bg-slate-100 px-3 py-2 text-sm'>
        {selectedCustomerName || 'Cargando paciente...'}
      </p>
    );
  }

  // En modo creación, si ya hay un paciente seleccionado, mostramos su nombre con opción de cambiar
  if (selectedCustomerName) {
    return (
      <div className='flex items-center gap-2'>
        <div className='flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm'>
          {selectedCustomerName}
        </div>
        <Button
          type='button'
          variant='outline'
          size='icon'
          onClick={handleClearSelection}
          title='Cambiar paciente'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    );
  }

  // Determinar qué lista mostrar
  const displayList = searchQuery.length >= 2 ? searchResults : recentCustomers;
  const isShowingRecent = searchQuery.length < 2 && recentCustomers.length > 0;

  // En modo creación sin paciente seleccionado, mostramos el combobox de búsqueda
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-normal'
        >
          Seleccionar un paciente...
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0'
        align='start'
      >
        <div className='flex flex-col'>
          {/* Input de búsqueda */}
          <div className='flex items-center border-b px-3 py-2'>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <Input
              placeholder='Buscar por nombre o teléfono...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>

          {/* Lista de resultados */}
          <div className='max-h-[300px] overflow-y-auto overflow-x-hidden'>
            {/* Encabezado si mostramos pacientes recientes */}
            {isShowingRecent && (
              <div className='flex items-center gap-2 px-3 py-2 text-xs text-gray-500'>
                <Clock className='h-3 w-3' />
                <span>Pacientes recientes</span>
              </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {displayList.length === 0 && (
              <div className='py-6 text-center text-sm text-gray-500'>
                {loading
                  ? 'Buscando...'
                  : searchQuery.length >= 2
                    ? 'No se encontraron resultados.'
                    : 'Escribe al menos 2 caracteres para buscar'}
              </div>
            )}

            {/* Lista de pacientes */}
            {displayList.length > 0 && (
              <div className='p-1'>
                {displayList.map((customer) => {
                  const fullName = `${customer.name} ${customer.paternal_surname}`;
                  const isSelected = initialCustomerId === customer.id;

                  return (
                    <div
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors'
                    >
                      <Check
                        className={`mr-2 h-4 w-4 flex-shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'
                          }`}
                      />
                      <div className='flex flex-col flex-1 min-w-0'>
                        <span className='font-medium truncate'>{fullName}</span>
                        {customer.phone && (
                          <span className='text-xs text-gray-500 truncate'>
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
