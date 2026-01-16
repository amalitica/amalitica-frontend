import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
 * MultiSelect - Componente de selección múltiple con búsqueda
 * 
 * Permite seleccionar múltiples opciones de una lista con búsqueda.
 * Los items seleccionados se muestran como badges.
 * 
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - Opciones disponibles
 * @param {Array<string>} props.value - Array de valores seleccionados
 * @param {Function} props.onValueChange - Callback cuando cambia el array de valores
 * @param {string} props.placeholder - Texto del placeholder
 * @param {string} props.searchPlaceholder - Texto del placeholder de búsqueda
 * @param {string} props.emptyText - Texto cuando no hay resultados
 * @param {number} props.maxItems - Máximo de items seleccionables (opcional)
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.disabled - Si el multiselect está deshabilitado
 */
export function MultiSelect({
  options = [],
  value = [],
  onValueChange,
  placeholder = 'Selecciona opciones...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'No se encontraron resultados.',
  maxItems,
  className,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);

  // Encontrar las opciones seleccionadas
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  // Manejar selección/deselección
  const handleSelect = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onValueChange(newValue);
  };

  // Remover un item
  const handleRemove = (optionValue) => {
    onValueChange(value.filter((v) => v !== optionValue));
  };

  // Verificar si se alcanzó el máximo
  const isMaxReached = maxItems && value.length >= maxItems;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-full justify-start min-h-[40px] h-auto',
            className
          )}
          disabled={disabled}
        >
          <div className='flex flex-wrap gap-1 w-full'>
            {selectedOptions.length === 0 ? (
              <span className='text-muted-foreground'>{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant='secondary'
                  className='mr-1 mb-1'
                >
                  {option.label}
                  <button
                    className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRemove(option.value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleRemove(option.value)}
                  >
                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled = !isSelected && isMaxReached;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      if (!isDisabled) {
                        handleSelect(option.value);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <svg
                        className='h-4 w-4'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        viewBox='0 0 24 24'
                      >
                        <polyline points='20 6 9 17 4 12' />
                      </svg>
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
