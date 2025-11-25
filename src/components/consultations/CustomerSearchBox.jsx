// src/components/consultations/CustomerSearchBox.jsx

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, ChevronsUpDown } from 'lucide-react';
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
import { searchCustomers } from '@/api/customers'; // Usamos la nueva función

export default function CustomerSearchBox({ mode }) {
  const { setValue, getValues } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Obtenemos el nombre y el ID iniciales del formulario
  const initialCustomerId = getValues('customer_id');
  const initialCustomerName = getValues('customer_name');

  // Estado para mostrar el nombre del cliente seleccionado
  const [selectedCustomerName, setSelectedCustomerName] = useState(
    initialCustomerName || ''
  );

  // 1. Lógica de Debounce (adaptada de tu CustomersList.jsx)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Lógica de Fetch (adaptada de tu CustomersList.jsx)
  useEffect(() => {
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
    setOpen(false);
  };

  // En modo edición, simplemente mostramos el nombre (no editable)
  if (mode === 'edit') {
    return (
      <p className='flex h-10 w-full items-center rounded-md border border-input bg-slate-100 px-3 py-2 text-sm'>
        {selectedCustomerName || 'Cargando cliente...'}
      </p>
    );
  }

  // En modo creación, mostramos el combobox de búsqueda
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-normal'
        >
          {selectedCustomerName || 'Seleccionar un cliente...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
        <Command>
          <CommandInput
            placeholder='Buscar por nombre o teléfono...'
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? 'Buscando...' : 'No se encontraron resultados.'}
            </CommandEmpty>
            <CommandGroup>
              {searchResults.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={`${customer.name} ${customer.paternal_surname}`}
                  onSelect={() => handleSelectCustomer(customer)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${initialCustomerId === customer.id
                        ? 'opacity-100'
                        : 'opacity-0'
                      }`}
                  />
                  <span>{`${customer.name} ${customer.paternal_surname}`}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
