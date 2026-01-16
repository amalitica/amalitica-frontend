import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/**
 * Normaliza texto removiendo acentos para búsqueda
 */
const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

/**
 * Combobox - Componente de selección con búsqueda
 * 
 * Implementación basada en Popover + input personalizado (como GeographicSelector)
 * en lugar de Command, para garantizar que los clicks funcionen correctamente.
 * 
 * Características:
 * - Búsqueda sin acentos (buscar "medico" encuentra "Médico/a")
 * - Click funcional en todas las opciones
 * - Teclado navegable
 * 
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - Opciones disponibles
 * @param {string} props.value - Valor seleccionado actual
 * @param {Function} props.onValueChange - Callback cuando cambia el valor
 * @param {string} props.placeholder - Texto del placeholder
 * @param {string} props.searchPlaceholder - Texto del placeholder de búsqueda
 * @param {string} props.emptyText - Texto cuando no hay resultados
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.disabled - Si el combobox está deshabilitado
 */
export function Combobox({
  options = [],
  value,
  onValueChange,
  placeholder = 'Selecciona una opción...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'No se encontraron resultados.',
  className,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // Encontrar el label del valor seleccionado
  const selectedOption = options.find((option) => option.value === value);

  // Filtrar opciones basado en búsqueda sin acentos
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    
    const normalizedSearch = normalizeText(search);
    return options.filter((option) =>
      normalizeText(option.label).includes(normalizedSearch)
    );
  }, [options, search]);

  // Handler para selección
  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue === value ? '' : selectedValue);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <div className='p-2'>
          {/* Campo de búsqueda */}
          <div className='flex items-center border-b px-2 pb-2'>
            <Search className='h-4 w-4 mr-2 opacity-50' />
            <input
              className='flex-1 bg-transparent outline-none text-sm'
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Lista de opciones */}
          <div className='max-h-60 overflow-y-auto mt-2'>
            {filteredOptions.length === 0 ? (
              <div className='px-2 py-6 text-center text-sm text-muted-foreground'>
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                    value === option.value && 'bg-accent'
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
