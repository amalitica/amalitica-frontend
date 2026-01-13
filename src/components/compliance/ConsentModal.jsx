// components/compliance/ConsentModal.jsx
/**
 * Modal de Consentimiento para cumplimiento LFPDPPP.
 * 
 * Este componente muestra el modal de consentimiento que debe presentarse
 * al registrar un nuevo cliente. Implementa el sistema de dos checkboxes:
 * - Consentimiento primario (obligatorio): Para finalidades primarias del servicio
 * - Consentimiento secundario (opt-out): Para finalidades secundarias (ML, estudios)
 * 
 * @example
 * <ConsentModal
 *   open={showConsentModal}
 *   onOpenChange={setShowConsentModal}
 *   onConsent={handleConsent}
 *   customerName="Juan Pérez"
 * />
 */

import { useState } from 'react';
import { ExternalLink, Shield, AlertTriangle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * @typedef {Object} ConsentData
 * @property {boolean} primaryConsent - Consentimiento para finalidades primarias
 * @property {boolean} secondaryConsent - Consentimiento para finalidades secundarias
 * @property {string} consentMethod - Método de obtención del consentimiento
 */

/**
 * Modal de consentimiento para cumplimiento LFPDPPP.
 * 
 * @param {Object} props
 * @param {boolean} props.open - Si el modal está abierto
 * @param {function} props.onOpenChange - Callback para cambiar el estado del modal
 * @param {function} props.onConsent - Callback cuando se acepta el consentimiento
 * @param {string} [props.customerName] - Nombre del cliente (opcional)
 * @param {boolean} [props.isLoading] - Si está procesando
 */
export function ConsentModal({
  open,
  onOpenChange,
  onConsent,
  customerName = '',
  isLoading = false,
}) {
  const [primaryConsent, setPrimaryConsent] = useState(false);
  const [secondaryConsent, setSecondaryConsent] = useState(true); // Opt-out por defecto
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = () => {
    if (!primaryConsent) {
      setShowWarning(true);
      return;
    }

    onConsent({
      primaryConsent,
      secondaryConsent,
      consentMethod: 'electronic_checkbox',
    });
  };

  const handleCancel = () => {
    // Resetear estado al cerrar
    setPrimaryConsent(false);
    setSecondaryConsent(true);
    setShowWarning(false);
    onOpenChange(false);
  };

  const handlePrimaryChange = (checked) => {
    setPrimaryConsent(checked);
    if (checked) {
      setShowWarning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Aviso de Privacidad y Consentimiento
          </DialogTitle>
          <DialogDescription>
            {customerName ? (
              <>Consentimiento para el tratamiento de datos personales de <strong>{customerName}</strong></>
            ) : (
              'Consentimiento para el tratamiento de datos personales'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Introducción */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              De conformidad con la Ley Federal de Protección de Datos Personales en Posesión 
              de los Particulares (LFPDPPP), le informamos sobre el tratamiento de sus datos 
              personales.
            </p>
            <p>
              <a 
                href="/aviso-de-privacidad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Consultar Aviso de Privacidad completo
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Alerta de advertencia */}
          {showWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                El consentimiento primario es obligatorio para poder prestar el servicio. 
                Sin este consentimiento no es posible registrar al paciente.
              </AlertDescription>
            </Alert>
          )}

          {/* Checkbox 1: Consentimiento Primario (Obligatorio) */}
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="primary-consent"
                checked={primaryConsent}
                onCheckedChange={handlePrimaryChange}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label 
                  htmlFor="primary-consent" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Consentimiento para Finalidades Primarias
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Acepto el tratamiento de mis datos personales, incluyendo datos de salud visual, 
                  para las siguientes finalidades:
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 ml-2">
                  <li>Prestación de servicios de salud visual</li>
                  <li>Elaboración y seguimiento de mi historial clínico</li>
                  <li>Gestión de citas y recordatorios</li>
                  <li>Comunicaciones relacionadas con mi atención</li>
                  <li>Cumplimiento de obligaciones legales</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span>Este consentimiento es obligatorio para poder prestar el servicio.</span>
            </div>
          </div>

          {/* Checkbox 2: Consentimiento Secundario (Opt-out) */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="secondary-consent"
                checked={secondaryConsent}
                onCheckedChange={setSecondaryConsent}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label 
                  htmlFor="secondary-consent" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Consentimiento para Finalidades Secundarias
                  <span className="text-muted-foreground ml-1">(opcional)</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Acepto que mis datos sean utilizados de forma anonimizada para:
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 ml-2">
                  <li>Estudios estadísticos sobre salud visual</li>
                  <li>Mejora de servicios mediante análisis de datos</li>
                  <li>Recomendaciones personalizadas de productos</li>
                  <li>Comunicaciones promocionales</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span>
                Este consentimiento es opcional. Puede modificar su preferencia en cualquier momento.
              </span>
            </div>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground space-y-2 border-t pt-4">
            <p>
              <strong>Sus derechos ARCO:</strong> Tiene derecho a Acceder, Rectificar, Cancelar 
              u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, 
              contacte a nuestro departamento de datos personales.
            </p>
            <p>
              Al hacer clic en "Aceptar y Continuar", confirma que ha leído y comprendido 
              el Aviso de Privacidad y otorga su consentimiento para el tratamiento de sus 
              datos personales según las finalidades seleccionadas.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !primaryConsent}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Procesando...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Aceptar y Continuar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConsentModal;
