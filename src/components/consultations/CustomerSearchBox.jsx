// src/components/consultations/CustomerSearchBox.jsx

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, ChevronsUpDown, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const customerData = getValues('customer'); // Obtenemos el objeto completo del cliente

  // Construir el nombre completo del cliente desde el objeto customer
  const initialCustomerName = customerData
    ? `${customerData.name} ${customerData.paternal_surname}`.trim()
    : '';

  // Estado para mostrar el nombre del cliente seleccionado
  const [selectedCustomerName, setSelectedCustomerName] = useState(
    initialCustomerName || ''
  );

  // Cargar clientes recientes cuando se abre el popover
  useEffect(() => {
    if (open && mode === 'create' && recentCustomers.length === 0) {
      fetchRecentCustomers();
    }
  }, [open, mode]);

  const fetchRecentCustomers = async () => {
    try {
      setLoading(true);
      const customers = await getRecentCustomers(10);
      setRecentCustomers(customers);
    } catch (error) {
      console.error('Error loading recent customers:', error);
      setRecentCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Debounce (optimizada)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Lógica de Fetch para búsqueda
  useEffect(() => {
    // Solo buscar si estamos en modo creación y hay al menos 2 caracteres
    if (mode !== 'create' || debouncedSearch.length < 2) {
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
        {selectedCustomerName || 'Cargando cliente...'}
      </p>
    );
  }

  // En modo creación, si ya hay un cliente seleccionado, mostramos su nombre con opción de cambiar
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
          title='Cambiar cliente'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    );
  }

  // Determinar qué lista mostrar
  const displayList = searchQuery.length >= 2 ? searchResults : recentCustomers;
  const isShowingRecent = searchQuery.length < 2 && recentCustomers.length > 0;

  // En modo creación sin cliente seleccionado, mostramos el combobox de búsqueda
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-normal'
        >
          Seleccionar un cliente...
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder='Buscar por nombre o teléfono...'
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading
                ? 'Buscando...'
                : searchQuery.length >= 2
                  ? 'No se encontraron resultados.'
                  : 'Escribe al menos 2 caracteres para buscar'}
            </CommandEmpty>
            {displayList.length > 0 && (
              <CommandGroup
                heading={
                  isShowingRecent ? (
                    <div className='flex items-center gap-2 text-xs text-gray-500'>
                      <Clock className='h-3 w-3' />
                      <span>Clientes recientes</span>
                    </div>
                  ) : undefined
                }
              >
                {displayList.map((customer) => {
                  const fullName = `${customer.name} ${customer.paternal_surname}`;
                  return (
                    <CommandItem
                      key={customer.id}
                      value={fullName}
                      onSelect={() => handleSelectCustomer(customer)}
                      className='cursor-pointer'
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${initialCustomerId === customer.id
                            ? 'opacity-100'
                            : 'opacity-0'
                          }`}
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>{fullName}</span>
                        {customer.phone && (
                          <span className='text-xs text-gray-500'>
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
