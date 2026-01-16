import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
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
 * Ideal para listas largas de opciones (20-100 items) donde el usuario
 * necesita buscar escribiendo.
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
  const handleSelect = React.useCallback((selectedValue) => {
    onValueChange(selectedValue === value ? '' : selectedValue);
    setOpen(false);
    setSearch('');
  }, [value, onValueChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
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
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
