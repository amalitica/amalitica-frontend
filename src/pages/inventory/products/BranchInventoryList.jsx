// src/pages/inventory/BranchInventoryList.jsx
/**
 * Página de inventario por sucursal.
 * 
 * Muestra una tabla paginada del inventario de una sucursal con:
 * - Selector de sucursal
 * - Búsqueda por nombre o SKU de producto
 * - Filtros por categoría y estado de stock
 * - Acciones de ajustar inventario y transferir
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  ArrowRightLeft,
  Building2,
  MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

import {
  getBranchInventory,
} from '@/api/inventory';
import { getAllBranches } from '@/api/branches';
import { getProductEnums } from '@/api/products';
import AdjustInventoryModal from './AdjustInventoryModal';
import TransferInventoryModal from './TransferInventoryModal';

// =============================================================================
// CONSTANTES
// =============================================================================

const CATEGORY_COLORS = {
  FRAME: 'bg-blue-100 text-blue-800',
  LENS: 'bg-green-100 text-green-800',
  CONTACT_LENS: 'bg-purple-100 text-purple-800',
  ACCESSORY: 'bg-yellow-100 text-yellow-800',
  SOLUTION: 'bg-pink-100 text-pink-800',
  CASE: 'bg-orange-100 text-orange-800',
};

const CATEGORY_LABELS = {
  FRAME: 'Armazón',
  LENS: 'Lente Oftálmico',
  CONTACT_LENS: 'Lente de Contacto',
  ACCESSORY: 'Accesorio',
  SOLUTION: 'Solución',
  CASE: 'Estuche',
};

// =============================================================================
// COMPONENTES AUXILIARES
// =============================================================================

/**
 * Badge de estado de stock.
 */
const StockStatusBadge = ({ inventory }) => {
  if (inventory.is_out_of_stock) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Agotado
      </Badge>
    );
  }
  
  if (inventory.is_low_stock) {
    return (
      <Badge variant="warning" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
        <AlertTriangle className="h-3 w-3" />
        Stock Bajo
      </Badge>
    );
  }
  
  return (
    <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800">
      <Package className="h-3 w-3" />
      Normal
    </Badge>
  );
};

/**
 * Skeleton de la tabla.
 */
const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-8 w-32" /></TableCell>
      </TableRow>
    ))}
  </>
);

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function BranchInventoryList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Estado
  const [loading, setLoading] = useState(true);
  const [inventories, setInventories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
    pages: 0,
  });

  // Filtros
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  // Modales
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  // =============================================================================
  // EFECTOS
  // =============================================================================

  /**
   * Cargar sucursales y enums al montar.
   */
  useEffect(() => {
    loadBranches();
    loadEnums();
  }, []);

  /**
   * Cargar inventario cuando cambian los filtros.
   */
  useEffect(() => {
    if (selectedBranch) {
      loadInventory();
    }
  }, [selectedBranch, pagination.page, searchTerm, categoryFilter, stockFilter]);

  /**
   * Sincronizar con URL params.
   */
  useEffect(() => {
    const branchId = searchParams.get('branch');
    if (branchId && branches.length > 0) {
      const branch = branches.find(b => b.id === parseInt(branchId));
      if (branch) {
        setSelectedBranch(branch);
      }
    }
  }, [searchParams, branches]);

  // =============================================================================
  // FUNCIONES DE CARGA
  // =============================================================================

  /**
   * Carga las sucursales disponibles.
   */
  const loadBranches = async () => {
    try {
      const data = await getAllBranches();
      setBranches(data);
      
      // Seleccionar la primera sucursal por defecto
      if (data.length > 0 && !selectedBranch) {
        setSelectedBranch(data[0]);
      }
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
   * Carga los enums de categorías.
   */
  const loadEnums = async () => {
    try {
      const enums = await getProductEnums();
      setCategories(enums.categories || []);
    } catch (error) {
      console.error('Error al cargar enums:', error);
    }
  };

  /**
   * Carga el inventario de la sucursal seleccionada.
   */
  const loadInventory = async () => {
    if (!selectedBranch) return;

    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.page_size,
      };

      if (searchTerm) params.search = searchTerm;
      if (categoryFilter) params.category = categoryFilter;
      if (stockFilter === 'low') params.low_stock = true;
      if (stockFilter === 'out') params.out_of_stock = true;

      const data = await getBranchInventory(selectedBranch.id, params);
      
      setInventories(data.items);
      setPagination({
        page: data.page,
        page_size: data.page_size,
        total: data.total,
        pages: data.pages,
      });
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar el inventario',
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // HANDLERS
  // =============================================================================

  /**
   * Cambia la sucursal seleccionada.
   */
  const handleBranchChange = (branchId) => {
    const branch = branches.find(b => b.id === parseInt(branchId));
    if (branch) {
      setSelectedBranch(branch);
      setSearchParams({ branch: branchId });
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  /**
   * Maneja el cambio de búsqueda con debounce.
   */
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Maneja el cambio de filtro de categoría.
   */
  const handleCategoryChange = (value) => {
    setCategoryFilter(value === 'all' ? '' : value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  /**
   * Maneja el cambio de filtro de stock.
   */
  const handleStockFilterChange = (value) => {
    setStockFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  /**
   * Abre el modal de ajuste de inventario.
   */
  const handleAdjust = (inventory) => {
    setSelectedInventory(inventory);
    setShowAdjustModal(true);
  };

  /**
   * Abre el modal de transferencia.
   */
  const handleTransfer = (inventory) => {
    setSelectedInventory(inventory);
    setShowTransferModal(true);
  };

  /**
   * Cambia de página.
   */
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  /**
   * Formatea el precio.
   */
  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario por Sucursal</h1>
          <p className="text-muted-foreground">
            Gestiona el stock de productos en cada sucursal
          </p>
        </div>
        <Button onClick={() => navigate('/inventory/dashboard')}>
          <Package className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </div>

      {/* Selector de sucursal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Sucursal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedBranch?.id?.toString()}
            onValueChange={handleBranchChange}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Selecciona una sucursal" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por SKU o nombre..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro de categoría */}
            <Select value={categoryFilter || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro de stock */}
            <Select value={stockFilter} onValueChange={handleStockFilterChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado de stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="out">Agotados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de inventario */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Reorden</TableHead>
                  <TableHead className="text-right">Seguridad</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeleton />
                ) : inventories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron productos en el inventario
                    </TableCell>
                  </TableRow>
                ) : (
                  inventories.map((inventory) => (
                    <TableRow key={inventory.id}>
                      <TableCell className="font-mono text-sm">
                        {inventory.product_sku}
                      </TableCell>
                      <TableCell className="font-medium">
                        {inventory.product_name}
                      </TableCell>
                      <TableCell>
                        {inventory.product_category && (
                          <Badge className={CATEGORY_COLORS[inventory.product_category]}>
                            {CATEGORY_LABELS[inventory.product_category]}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {inventory.stock}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {inventory.reorder_level}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {inventory.safety_stock}
                      </TableCell>
                      <TableCell>
                        {inventory.location ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {inventory.location}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StockStatusBadge inventory={inventory} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdjust(inventory)}
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Ajustar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTransfer(inventory)}
                          >
                            <ArrowRightLeft className="h-3 w-3 mr-1" />
                            Transferir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {!loading && inventories.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {(pagination.page - 1) * pagination.page_size + 1} a{' '}
                {Math.min(pagination.page * pagination.page_size, pagination.total)} de{' '}
                {pagination.total} productos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="text-sm">
                  Página {pagination.page} de {pagination.pages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <AdjustInventoryModal
        open={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        inventory={selectedInventory}
        onSuccess={loadInventory}
      />
      <TransferInventoryModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        inventory={selectedInventory}
        onSuccess={loadInventory}
      />
    </div>
  );
}
