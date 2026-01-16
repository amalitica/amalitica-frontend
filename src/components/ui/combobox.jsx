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
 * Combobox - Componente de selección con búsqueda
 * 
 * Ideal para listas largas de opciones (20-100 items) donde el usuario
 * necesita buscar escribiendo.
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

  // Encontrar el label del valor seleccionado
  const selectedOption = options.find((option) => option.value === value);

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
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
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
