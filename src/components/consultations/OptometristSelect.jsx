// src/components/consultations/OptometristSelect.jsx

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { getUsers, getCurrentUser } from '@/api/users';

export default function OptometristSelect({ mode }) {
  const { setValue, getValues } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]); // Lista inicial de usuarios
  const [loading, setLoading] = useState(false);

  // Obtenemos el ID y el objeto del optometrista del formulario
  const initialOptometristId = getValues('optometrist_user_id');
  const createdByData = getValues('created_by');

  // Construir el nombre del optometrista
  const initialOptometristName = createdByData ? createdByData.name : '';

  // Estado para mostrar el nombre del optometrista seleccionado
  const [selectedOptometristName, setSelectedOptometristName] = useState(
    initialOptometristName || ''
  );

  // Efecto para seleccionar automáticamente al usuario logueado en modo creación
  useEffect(() => {
    if (mode === 'create' && !initialOptometristId) {
      const loadCurrentUser = async () => {
        try {
          const currentUser = await getCurrentUser();
          setValue('optometrist_user_id', currentUser.id, {
            shouldValidate: true,
          });
          setSelectedOptometristName(currentUser.name);
        } catch (error) {
          console.error('Error loading current user:', error);
        }
      };
      loadCurrentUser();
    }
  }, [mode, initialOptometristId, setValue]);

  // Cargar usuarios disponibles cuando se abre el popover
  useEffect(() => {
    if (open && mode === 'create' && availableUsers.length === 0) {
      fetchAvailableUsers();
    }
  }, [open, mode]);

  const fetchAvailableUsers = async () => {
    try {
      const response = await getUsers({ size: 5 });
      setAvailableUsers(response.items || []);
    } catch (error) {
      console.error('Error fetching available users:', error);
      setAvailableUsers([]);
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
        const response = await getUsers({ q: debouncedSearch, size: 5 });
        const results = response.items || response || [];
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching optometrists:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  const handleSelectOptometrist = (optometrist) => {
    setValue('optometrist_user_id', optometrist.id, { shouldValidate: true });
    setSelectedOptometristName(optometrist.name);
    setSearchQuery(''); // Limpiar la búsqueda
    setSearchResults([]); // Limpiar resultados
    setOpen(false);
  };

  // En modo edición, simplemente mostramos el nombre (no editable)
  if (mode === 'edit') {
    return (
      <p className='flex h-10 w-full items-center rounded-md border border-input bg-slate-100 px-3 py-2 text-sm'>
        {selectedOptometristName || 'Cargando optometrista...'}
      </p>
    );
  }

  // Determinar qué lista mostrar (igual que CustomerSearchBox)
  const displayList = searchQuery.length >= 2 ? searchResults : availableUsers;

  // Determinar qué nombre mostrar
  const displayName = selectedOptometristName || 'Seleccionar optometrista...';

  // En modo creación
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-normal'
        >
          {displayName}
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
              placeholder='Buscar optometrista...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='border-0 p-0 h-8 focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>

          {/* Lista de resultados */}
          <div className='max-h-[300px] overflow-y-auto overflow-x-hidden'>
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

            {/* Lista de optometristas */}
            {displayList.length > 0 && (
              <div className='p-1'>
                {displayList.map((optometrist) => {
                  const isSelected =
                    getValues('optometrist_user_id') === optometrist.id;

                  return (
                    <div
                      key={optometrist.id}
                      onClick={() => handleSelectOptometrist(optometrist)}
                      className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors'
                    >
                      <Check
                        className={`mr-2 h-4 w-4 flex-shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'
                          }`}
                      />
                      <div className='flex flex-col flex-1 min-w-0'>
                        <span className='font-medium truncate'>
                          {optometrist.name}
                        </span>
                        {optometrist.email && (
                          <span className='text-xs text-gray-500 truncate'>
                            {optometrist.email}
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
