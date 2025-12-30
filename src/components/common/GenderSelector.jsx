// src/components/common/GenderSelector.jsx
/**
 * Componente de selección de género con inferencia automática.
 * 
 * Este componente permite:
 * 1. Inferir automáticamente el género a partir del nombre
 * 2. Mostrar el género inferido con indicador de confianza
 * 3. Permitir corrección manual por el usuario
 * 
 * @example
 * <GenderSelector
 *   name={watchedName}
 *   value={watchedGender}
 *   onChange={(gender, inferred, confidence, method) => {
 *     setValue('gender', gender);
 *     setValue('gender_inferred', inferred);
 *     setValue('gender_confidence', confidence);
 *     setValue('gender_inference_method', method);
 *   }}
 * />
 */

import { useState, useEffect, useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, User, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inferGender } from '@/api/users';

// Mapeo de valores del backend a valores del frontend
const GENDER_MAP = {
  'male': 'MALE',
  'female': 'FEMALE',
  'unknown': null,
};

// Mapeo de valores del frontend a etiquetas en español
const GENDER_LABELS = {
  'MALE': 'Masculino',
  'FEMALE': 'Femenino',
  'NON_BINARY': 'No Binario',
  'PREFER_NOT_TO_SAY': 'Prefiero no decir',
};

// Colores para los badges de confianza
const getConfidenceBadgeColor = (confidence) => {
  if (confidence >= 0.9) return 'bg-green-100 text-green-800 border-green-200';
  if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-orange-100 text-orange-800 border-orange-200';
};

const GenderSelector = ({
  name,
  value,
  onChange,
  disabled = false,
  showOtherOption = true,
  className,
}) => {
  const [inferring, setInferring] = useState(false);
  const [inferredGender, setInferredGender] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [method, setMethod] = useState(null);
  const [nameUsed, setNameUsed] = useState('');
  const [error, setError] = useState(null);
  const [isManuallySet, setIsManuallySet] = useState(false);
  const [otherGenderText, setOtherGenderText] = useState('');

  // Debounce para la inferencia
  const [debouncedName, setDebouncedName] = useState(name);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(name);
    }, 500); // 500ms de debounce

    return () => clearTimeout(timer);
  }, [name]);

  // Inferir género cuando cambia el nombre (con debounce)
  useEffect(() => {
    const doInference = async () => {
      // Solo inferir si hay un nombre válido y no se ha establecido manualmente
      if (!debouncedName || debouncedName.trim().length < 2 || isManuallySet) {
        return;
      }

      setInferring(true);
      setError(null);

      try {
        const result = await inferGender(debouncedName);
        
        setInferredGender(result.gender);
        setConfidence(result.confidence);
        setMethod(result.method);
        setNameUsed(result.name_used);

        // Mapear el género inferido al valor del enum
        const mappedGender = GENDER_MAP[result.gender];
        
        // Solo actualizar si se obtuvo un género válido
        if (mappedGender) {
          onChange(mappedGender, true, result.confidence, result.method);
        }
      } catch (err) {
        console.error('Error al inferir género:', err);
        setError('No se pudo inferir el género');
      } finally {
        setInferring(false);
      }
    };

    doInference();
  }, [debouncedName, isManuallySet]);

  // Manejar cambio manual de género
  const handleGenderChange = useCallback((newValue) => {
    setIsManuallySet(true);
    setInferredGender(null);
    setConfidence(null);
    
    if (newValue === 'OTHER') {
      // Si selecciona "Otro", no enviamos el valor todavía
      onChange(null, false, null, 'manual');
    } else {
      onChange(newValue, false, null, 'manual');
    }
  }, [onChange]);

  // Manejar cambio en el campo de texto "Otro"
  const handleOtherTextChange = (e) => {
    const text = e.target.value;
    setOtherGenderText(text);
    // Aquí podrías enviar el texto personalizado si tu backend lo soporta
    // Por ahora, solo actualizamos el estado local
  };

  // Resetear cuando cambia el nombre y se había establecido manualmente
  useEffect(() => {
    if (name !== debouncedName && isManuallySet) {
      // El usuario está escribiendo un nuevo nombre, podemos ofrecer re-inferir
    }
  }, [name, debouncedName, isManuallySet]);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Indicador de inferencia */}
      {inferring && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Detectando género...</span>
        </div>
      )}

      {/* Badge de género inferido */}
      {!inferring && inferredGender && confidence && !isManuallySet && (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant="outline" 
            className={cn(
              'flex items-center gap-1',
              getConfidenceBadgeColor(confidence)
            )}
          >
            <Sparkles className="h-3 w-3" />
            <span>
              Detectado: {GENDER_LABELS[GENDER_MAP[inferredGender]] || 'Desconocido'}
            </span>
            <span className="text-xs opacity-75">
              ({Math.round(confidence * 100)}%)
            </span>
          </Badge>
          {nameUsed && (
            <span className="text-xs text-muted-foreground">
              basado en "{nameUsed}"
            </span>
          )}
        </div>
      )}

      {/* Error de inferencia */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-orange-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Selector de género */}
      <RadioGroup
        value={value || ''}
        onValueChange={handleGenderChange}
        disabled={disabled || inferring}
        className="flex flex-wrap gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="MALE" id="gender-male" />
          <Label 
            htmlFor="gender-male" 
            className={cn(
              'cursor-pointer',
              value === 'MALE' && !isManuallySet && inferredGender === 'male' && 'font-medium'
            )}
          >
            Masculino
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="FEMALE" id="gender-female" />
          <Label 
            htmlFor="gender-female"
            className={cn(
              'cursor-pointer',
              value === 'FEMALE' && !isManuallySet && inferredGender === 'female' && 'font-medium'
            )}
          >
            Femenino
          </Label>
        </div>

        {showOtherOption && (
          <>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NON_BINARY" id="gender-non-binary" />
              <Label htmlFor="gender-non-binary" className="cursor-pointer">
                No Binario
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PREFER_NOT_TO_SAY" id="gender-prefer-not" />
              <Label htmlFor="gender-prefer-not" className="cursor-pointer">
                Prefiero no decir
              </Label>
            </div>
          </>
        )}
      </RadioGroup>

      {/* Indicador de selección manual */}
      {isManuallySet && value && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>Seleccionado manualmente</span>
          <button
            type="button"
            onClick={() => {
              setIsManuallySet(false);
              // Re-inferir si hay nombre
              if (debouncedName && debouncedName.trim().length >= 2) {
                setDebouncedName(debouncedName + ' '); // Forzar re-inferencia
                setTimeout(() => setDebouncedName(debouncedName), 10);
              }
            }}
            className="text-primary hover:underline"
          >
            Detectar automáticamente
          </button>
        </div>
      )}
    </div>
  );
};

export default GenderSelector;
