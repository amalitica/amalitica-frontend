// src/pages/inventory/AdjustInventoryModal.jsx
/**
 * Modal para ajustar el inventario de un producto.
 * 
 * Permite realizar ajustes manuales de entrada o salida de stock
 * con diferentes razones y notas explicativas.
 */

import { useState } from 'react';
import { Plus, Minus, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { adjustInventory } from '@/api/inventory';

// =============================================================================
// CONSTANTES
// =============================================================================

const ADJUSTMENT_REASONS = [
  { value: 'PURCHASE', label: 'Compra' },
  { value: 'SALE', label: 'Venta' },
  { value: 'ADJUSTMENT', label: 'Ajuste' },
  { value: 'DAMAGED', label: 'Dañado' },
  { value: 'RETURN', label: 'Devolución' },
  { value: 'INITIAL', label: 'Stock Inicial' },
  { value: 'OTHER', label: 'Otro' },
];

// =============================================================================
// COMPONENTE
// =============================================================================

export default function AdjustInventoryModal({
  open,
  onClose,
  inventory,
  onSuccess,
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState('in'); // 'in' o 'out'
  const [formData, setFormData] = useState({
    quantity: '',
    reason: '',
    notes: '',
  });

  /**
   * Maneja el cambio de campos del formulario.
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Valida el formulario.
   */
  const validateForm = () => {
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'La cantidad debe ser mayor a 0',
      });
      return false;
    }

    if (!formData.reason) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes seleccionar una razón',
      });
      return false;
    }

    // Validar que no se quede en negativo
    const quantity = parseInt(formData.quantity);
    const finalQuantity = adjustmentType === 'in' ? quantity : -quantity;
    const newStock = inventory.stock + finalQuantity;

    if (newStock < 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Stock insuficiente. Stock actual: ${inventory.stock}`,
      });
      return false;
    }

    return true;
  };

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const quantity = parseInt(formData.quantity);
      const finalQuantity = adjustmentType === 'in' ? quantity : -quantity;

      await adjustInventory({
        product_id: inventory.product_id,
        branch_id: inventory.branch_id,
        quantity: finalQuantity,
        reason: formData.reason,
        notes: formData.notes || null,
      });

      toast({
        title: 'Éxito',
        description: 'El inventario se ajustó correctamente',
      });

      // Resetear formulario
      setFormData({ quantity: '', reason: '', notes: '' });
      setAdjustmentType('in');

      // Llamar callback de éxito
      if (onSuccess) onSuccess();

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al ajustar inventario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo ajustar el inventario',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcula el nuevo stock después del ajuste.
   */
  const getNewStock = () => {
    if (!formData.quantity) return inventory.stock;
    const quantity = parseInt(formData.quantity);
    const finalQuantity = adjustmentType === 'in' ? quantity : -quantity;
    return inventory.stock + finalQuantity;
  };

  if (!inventory) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajustar Inventario</DialogTitle>
            <DialogDescription>
              Realiza un ajuste manual del inventario de este producto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Información del producto */}
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Producto:</span>
                <span className="text-sm font-medium">{inventory.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">SKU:</span>
                <span className="text-sm font-mono">{inventory.product_sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stock actual:</span>
                <span className="text-sm font-semibold">{inventory.stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sucursal:</span>
                <span className="text-sm font-medium">{inventory.branch_name}</span>
              </div>
            </div>

            {/* Tipo de ajuste */}
            <div className="space-y-2">
              <Label>Tipo de Ajuste</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={adjustmentType === 'in' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setAdjustmentType('in')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Entrada
                </Button>
                <Button
                  type="button"
                  variant={adjustmentType === 'out' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setAdjustmentType('out')}
                >
                  <Minus className="mr-2 h-4 w-4" />
                  Salida
                </Button>
              </div>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="Ingresa la cantidad"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
              />
            </div>

            {/* Razón */}
            <div className="space-y-2">
              <Label htmlFor="reason">Razón *</Label>
              <Select
                value={formData.reason}
                onValueChange={(value) => handleChange('reason', value)}
                required
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Selecciona una razón" />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Agrega notas adicionales..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Previsualización del nuevo stock */}
            {formData.quantity && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-900">
                    Nuevo stock:
                  </span>
                  <span className="text-lg font-bold text-blue-900">
                    {inventory.stock} → {getNewStock()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajustar Inventario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
