import * as React from 'react';
import { X, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
 * MultiSelect - Componente de selección múltiple con búsqueda
 * 
 * Implementación basada en Popover + input personalizado (como Combobox y GeographicSelector)
 * para garantizar que los clicks funcionen correctamente.
 * 
 * Características:
 * - Selección múltiple con checkboxes visuales
 * - Búsqueda sin acentos
 * - Badges removibles para items seleccionados
 * - Click funcional
 * - Límite máximo de selecciones (opcional)
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
  const [search, setSearch] = React.useState('');

  // Encontrar las opciones seleccionadas
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  // Filtrar opciones basado en búsqueda sin acentos
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    
    const normalizedSearch = normalizeText(search);
    return options.filter((option) =>
      normalizeText(option.label).includes(normalizedSearch)
    );
  }, [options, search]);

  // Manejar selección/deselección
  const handleSelect = (optionValue) => {
    const isSelected = value.includes(optionValue);
    const isMaxReached = maxItems && value.length >= maxItems;
    
    // Si ya está seleccionado, siempre permitir deseleccionar
    if (isSelected) {
      onValueChange(value.filter((v) => v !== optionValue));
      return;
    }
    
    // Si no está seleccionado, verificar límite
    if (!isMaxReached) {
      onValueChange([...value, optionValue]);
    }
  };

  // Remover un item desde el badge
  const handleRemove = (e, optionValue) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange(value.filter((v) => v !== optionValue));
  };

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
                    onClick={(e) => handleRemove(e, option.value)}
                    type='button'
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
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                const isMaxReached = maxItems && value.length >= maxItems;
                const isDisabled = !isSelected && isMaxReached;

                return (
                  <div
                    key={option.value}
                    className={cn(
                      'flex items-center px-2 py-2 cursor-pointer rounded hover:bg-accent',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => !isDisabled && handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50'
                      )}
                    >
                      {isSelected && (
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          viewBox='0 0 24 24'
                        >
                          <polyline points='20 6 9 17 4 12' />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
