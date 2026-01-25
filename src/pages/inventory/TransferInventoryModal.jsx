// src/pages/inventory/TransferInventoryModal.jsx
/**
 * Modal para transferir inventario entre sucursales.
 * 
 * Permite mover stock de un producto de una sucursal a otra
 * con validación de stock disponible.
 */

import { useState, useEffect } from 'react';
import { ArrowRightLeft, Loader2 } from 'lucide-react';

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

import { transferInventory } from '@/api/inventory';
import { getAllBranches } from '@/api/branches';

// =============================================================================
// COMPONENTE
// =============================================================================

export default function TransferInventoryModal({
  open,
  onClose,
  inventory,
  onSuccess,
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    to_branch_id: '',
    quantity: '',
    notes: '',
  });

  /**
   * Cargar sucursales al abrir el modal.
   */
  useEffect(() => {
    if (open) {
      loadBranches();
    }
  }, [open]);

  /**
   * Carga las sucursales disponibles.
   */
  const loadBranches = async () => {
    try {
      const data = await getAllBranches();
      // Filtrar la sucursal actual
      const otherBranches = data.filter(b => b.id !== inventory?.branch_id);
      setBranches(otherBranches);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar las sucursales',
      });
    }
  };

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
    if (!formData.to_branch_id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Debes seleccionar una sucursal destino',
      });
      return false;
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'La cantidad debe ser mayor a 0',
      });
      return false;
    }

    const quantity = parseInt(formData.quantity);
    if (quantity > inventory.stock) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Stock insuficiente. Stock disponible: ${inventory.stock}`,
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
      await transferInventory({
        product_id: inventory.product_id,
        from_branch_id: inventory.branch_id,
        to_branch_id: parseInt(formData.to_branch_id),
        quantity: parseInt(formData.quantity),
        notes: formData.notes || null,
      });

      toast({
        title: 'Éxito',
        description: 'La transferencia se realizó correctamente',
      });

      // Resetear formulario
      setFormData({ to_branch_id: '', quantity: '', notes: '' });

      // Llamar callback de éxito
      if (onSuccess) onSuccess();

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al transferir inventario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo realizar la transferencia',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene el nombre de la sucursal destino.
   */
  const getDestinationBranchName = () => {
    if (!formData.to_branch_id) return '-';
    const branch = branches.find(b => b.id === parseInt(formData.to_branch_id));
    return branch?.name || '-';
  };

  if (!inventory) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Transferir Inventario</DialogTitle>
            <DialogDescription>
              Transfiere stock de este producto a otra sucursal
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
                <span className="text-sm text-muted-foreground">Stock disponible:</span>
                <span className="text-sm font-semibold">{inventory.stock}</span>
              </div>
            </div>

            {/* Sucursales */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Origen</div>
                  <div className="font-medium">{inventory.branch_name}</div>
                </div>
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1 text-right">
                  <div className="text-xs text-muted-foreground">Destino</div>
                  <div className="font-medium">{getDestinationBranchName()}</div>
                </div>
              </div>
            </div>

            {/* Sucursal destino */}
            <div className="space-y-2">
              <Label htmlFor="to_branch_id">Sucursal Destino *</Label>
              <Select
                value={formData.to_branch_id}
                onValueChange={(value) => handleChange('to_branch_id', value)}
                required
              >
                <SelectTrigger id="to_branch_id">
                  <SelectValue placeholder="Selecciona una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {branches.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No hay otras sucursales disponibles
                    </SelectItem>
                  ) : (
                    branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={inventory.stock}
                placeholder="Ingresa la cantidad a transferir"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Máximo: {inventory.stock} unidades
              </p>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Agrega notas sobre la transferencia..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            {/* Previsualización */}
            {formData.quantity && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
                <div className="text-sm font-medium text-blue-900">
                  Después de la transferencia:
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">{inventory.branch_name}:</span>
                  <span className="font-semibold text-blue-900">
                    {inventory.stock} → {inventory.stock - parseInt(formData.quantity || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">{getDestinationBranchName()}:</span>
                  <span className="font-semibold text-blue-900">
                    +{formData.quantity}
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
            <Button type="submit" disabled={loading || branches.length === 0}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Transferir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
