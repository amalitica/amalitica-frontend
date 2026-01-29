// src/pages/inventory/ProductsAndInventory.jsx
/**
 * Página de Productos y Stock.
 *
 * Vista unificada que muestra el catálogo de productos con su inventario
 * por sucursal de forma expandible.
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  ArrowLeftRight,
  Settings,
  ArrowLeft,
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
import { Card } from '@/components/ui/card';
import {
  getProducts,
  deleteProduct,
  formatPrice,
  CATEGORY_LABELS,
} from '@/api/products';
import { getProductInventoryAllBranches } from '@/api/inventory';
import AdjustInventoryModal from './AdjustInventoryModal';
import TransferInventoryModal from './TransferInventoryModal';
import { useAuthRole } from '@/hooks/useAuthRole';

const ProductsAndInventory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuthRole();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [inventoryData, setInventoryData] = useState({});
  const [loadingInventory, setLoadingInventory] = useState({});

  // Modales
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  useEffect(() => {
    fetchProducts();

    // Aplicar filtros desde URL
    const filter = searchParams.get('filter');
    if (filter === 'low_stock' || filter === 'out_of_stock') {
      // Aquí podrías aplicar el filtro automáticamente
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({
        search: searchTerm,
        category: categoryFilter || undefined,
      });
      setProducts(data.items || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryForProduct = async (productId, force = false) => {
    if (!force && inventoryData[productId]) {
      // Ya tenemos los datos, no volver a cargar
      return;
    }

    try {
      setLoadingInventory((prev) => ({ ...prev, [productId]: true }));
      const data = await getProductInventoryAllBranches(productId);
      setInventoryData((prev) => ({ ...prev, [productId]: data }));
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    } finally {
      setLoadingInventory((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const toggleRow = async (productId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
      // Cargar inventario al expandir
      await fetchInventoryForProduct(productId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSearch = () => {
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleAdjustInventory = (inventory) => {
    setSelectedInventory(inventory);
    setAdjustModalOpen(true);
  };

  const handleTransferInventory = (inventory) => {
    setSelectedInventory(inventory);
    setTransferModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Recargar inventario del producto afectado
    if (selectedInventory?.product_id) {
      // Limpiar datos antiguos y forzar recarga
      setInventoryData((prev) => {
        const newData = { ...prev };
        delete newData[selectedInventory.product_id];
        return newData;
      });
      // Usar setTimeout para esperar a que React actualice el estado
      setTimeout(() => {
        fetchInventoryForProduct(selectedInventory.product_id, true);
      }, 0);
    }
  };

  const getCategoryBadge = (category) => {
    const colors = {
      FRAME: 'bg-blue-100 text-blue-800',
      LENS: 'bg-green-100 text-green-800',
      CONTACT_LENS: 'bg-purple-100 text-purple-800',
      ACCESSORY: 'bg-yellow-100 text-yellow-800',
      SOLUTION: 'bg-pink-100 text-pink-800',
      CASE: 'bg-gray-100 text-gray-800',
      CLEANING: 'bg-orange-100 text-orange-800',
      OTHER: 'bg-slate-100 text-slate-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = (inventory) => {
    if (inventory.stock === 0) {
      return { label: 'Agotado', color: 'text-red-600', icon: AlertTriangle };
    }
    if (inventory.stock <= inventory.reorder_level) {
      return {
        label: 'Stock bajo',
        color: 'text-yellow-600',
        icon: AlertTriangle,
      };
    }
    return { label: 'Disponible', color: 'text-green-600', icon: Package };
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate('/inventory')}
            className='h-10 w-10'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Productos y Stock
            </h1>
            <p className='mt-2 text-gray-600'>
              Gestiona tu catálogo de productos e inventario por sucursal
            </p>
          </div>
        </div>
        {isAdmin() && (
          <Link to='/inventory/products/new'>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Nuevo Producto
            </Button>
          </Link>
        )}
      </div>

      {/* Filtros */}
      <Card className='p-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='md:col-span-2'>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Buscar por SKU o nombre...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className='pl-10'
                />
              </div>
              <Button onClick={handleSearch}>Buscar</Button>
            </div>
          </div>
          <div>
            <Select
              value={categoryFilter || 'all'}
              onValueChange={(value) => {
                setCategoryFilter(value === 'all' ? '' : value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Todas las categorías' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las categorías</SelectItem>
                <SelectItem value='FRAME'>Armazones</SelectItem>
                <SelectItem value='LENS'>Lentes</SelectItem>
                <SelectItem value='CONTACT_LENS'>Lentes de Contacto</SelectItem>
                <SelectItem value='ACCESSORY'>Accesorios</SelectItem>
                <SelectItem value='SOLUTION'>Soluciones</SelectItem>
                <SelectItem value='CASE'>Estuches</SelectItem>
                <SelectItem value='CLEANING'>Limpieza</SelectItem>
                <SelectItem value='OTHER'>Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabla de productos con inventario expandible */}
      <Card className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'></TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              {isAdmin() && <TableHead>Proveedor</TableHead>}
              <TableHead className='text-right'>Precio</TableHead>
              {isAdmin() && <TableHead className='text-right'>Stock Total</TableHead>}
              {!isAdmin() && <TableHead className='text-center'>Disponible</TableHead>}
              {isAdmin() && <TableHead className='text-right'>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin() ? 8 : 6} className='text-center py-12'>
                  <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600 font-medium'>No hay productos</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    {isAdmin() ? 'Comienza agregando tu primer producto' : 'No se encontraron productos'}
                  </p>
                  {isAdmin() && (
                    <Link to='/inventory/products/new'>
                      <Button className='mt-4'>
                        <Plus className='mr-2 h-4 w-4' />
                        Agregar Producto
                      </Button>
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isExpanded = expandedRows.has(product.id);
                const inventory = inventoryData[product.id] || [];
                const totalStock = inventory.reduce(
                  (sum, inv) => sum + (inv.stock || 0),
                  0
                );

                return (
                  <>
                    {/* Fila principal del producto */}
                    <TableRow
                      key={product.id}
                      className='hover:bg-gray-50 cursor-pointer'
                      onClick={() => toggleRow(product.id)}
                    >
                      <TableCell>
                        {isExpanded ? (
                          <ChevronDown className='h-4 w-4 text-gray-600' />
                        ) : (
                          <ChevronRight className='h-4 w-4 text-gray-600' />
                        )}
                      </TableCell>
                      <TableCell className='font-mono text-sm'>
                        {product.sku}
                      </TableCell>
                      <TableCell className='font-medium'>
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadge(product.category)}>
                          {CATEGORY_LABELS[product.category] ||
                            product.category}
                        </Badge>
                      </TableCell>
                      {isAdmin() && (
                        <TableCell>{product.supplier_name || 'N/A'}</TableCell>
                      )}
                      <TableCell className='text-right'>
                        {formatPrice(product.price)}
                      </TableCell>
                      {isAdmin() ? (
                        <TableCell className='text-right'>
                          {inventory.length > 0 ? (
                            <span className='font-medium'>{totalStock}</span>
                          ) : product.total_stock !== undefined ? (
                            <span className='font-medium'>
                              {product.total_stock}
                            </span>
                          ) : (
                            <span className='text-gray-400'>-</span>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell className='text-center'>
                          {product.is_available || (product.total_stock > 0) ? (
                            <Badge className='bg-green-100 text-green-800'>
                              Sí
                            </Badge>
                          ) : (
                            <Badge variant='destructive'>No</Badge>
                          )}
                        </TableCell>
                      )}
                      {isAdmin() && (
                        <TableCell className='text-right'>
                          <div
                            className='flex justify-end gap-2'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button 
                              variant='ghost' 
                              size='sm'
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/inventory/products/${product.id}/edit`);
                              }}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product.id);
                              }}
                            >
                              <Trash2 className='h-4 w-4 text-red-600' />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Fila expandida con inventario por sucursal - Tabla compacta */}
                    {isExpanded && (
                      <TableRow key={`${product.id}-expanded`}>
                        <TableCell colSpan={isAdmin() ? 8 : 6} className='bg-gray-50 p-0'>
                          <div className='p-4'>
                            {loadingInventory[product.id] ? (
                              <div className='text-center py-6'>
                                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto'></div>
                                <p className='mt-2 text-sm text-gray-600'>
                                  Cargando inventario...
                                </p>
                              </div>
                            ) : inventory.length === 0 ? (
                              <div className='text-center py-6'>
                                <Package className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                                <p className='text-gray-600 font-medium text-sm'>
                                  Sin inventario configurado
                                </p>
                                <p className='text-xs text-gray-500 mt-1'>
                                  Este producto no tiene stock en ninguna sucursal
                                </p>
                              </div>
                            ) : (
                              <div>
                                <div className='flex justify-between items-center mb-3'>
                                  <div className='flex items-center gap-4'>
                                    <h4 className='text-sm font-semibold text-gray-900'>
                                      Inventario por Sucursal
                                    </h4>
                                    <span className='text-sm text-gray-600'>
                                      Precio: <span className='font-semibold text-gray-900'>{formatPrice(product.price)}</span>
                                    </span>
                                  </div>
                                  <span className='text-xs text-gray-500'>
                                    {inventory.length} sucursal{inventory.length !== 1 ? 'es' : ''}
                                  </span>
                                </div>
                                <div className='border rounded-md overflow-hidden'>
                                  <Table>
                                    <TableHeader>
                                      <TableRow className='bg-gray-100 hover:bg-gray-100'>
                                        <TableHead className='text-xs py-2'>Sucursal</TableHead>
                                        <TableHead className='text-xs py-2'>Ubicación</TableHead>
                                        {isAdmin() && (
                                          <>
                                            <TableHead className='text-xs py-2 text-right'>Stock</TableHead>
                                            <TableHead className='text-xs py-2 text-right'>Mínimo</TableHead>
                                            <TableHead className='text-xs py-2 text-right'>Seguridad</TableHead>
                                          </>
                                        )}
                                        <TableHead className='text-xs py-2 text-center'>Estado</TableHead>
                                        {isAdmin() && <TableHead className='text-xs py-2 text-right'>Acciones</TableHead>}
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {inventory.map((inv) => {
                                        const status = getStockStatus(inv);
                                        const StatusIcon = status.icon;

                                        return (
                                          <TableRow key={inv.id} className='hover:bg-white'>
                                            <TableCell className='py-2'>
                                              <span className='font-medium text-sm'>{inv.branch_name}</span>
                                            </TableCell>
                                            <TableCell className='py-2'>
                                              <span className='text-xs text-gray-500'>
                                                {inv.location || '-'}
                                              </span>
                                            </TableCell>
                                            {isAdmin() && (
                                              <>
                                                <TableCell className='py-2 text-right'>
                                                  <span className='font-semibold text-sm'>{inv.stock}</span>
                                                </TableCell>
                                                <TableCell className='py-2 text-right text-xs text-gray-500'>
                                                  {inv.reorder_level}
                                                </TableCell>
                                                <TableCell className='py-2 text-right text-xs text-gray-500'>
                                                  {inv.safety_stock}
                                                </TableCell>
                                              </>
                                            )}
                                            <TableCell className='py-2 text-center'>
                                              <div className='flex items-center justify-center gap-1'>
                                                <StatusIcon className={`h-4 w-4 ${status.color}`} />
                                                <span className={`text-xs ${status.color}`}>
                                                  {status.label}
                                                </span>
                                              </div>
                                            </TableCell>
                                            {isAdmin() && (
                                              <TableCell className='py-2 text-right'>
                                                <div className='flex justify-end gap-1'>
                                                  <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    className='h-7 px-2 text-xs'
                                                    onClick={() => handleAdjustInventory(inv)}
                                                  >
                                                    <Settings className='h-3 w-3 mr-1' />
                                                    Ajustar
                                                  </Button>
                                                  <Button
                                                    size='sm'
                                                    variant='ghost'
                                                    className='h-7 px-2 text-xs'
                                                    onClick={() => handleTransferInventory(inv)}
                                                  >
                                                    <ArrowLeftRight className='h-3 w-3 mr-1' />
                                                    Transferir
                                                  </Button>
                                                </div>
                                              </TableCell>
                                            )}
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modales */}
      <AdjustInventoryModal
        open={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        inventory={selectedInventory}
        onSuccess={handleModalSuccess}
      />
      <TransferInventoryModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        inventory={selectedInventory}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ProductsAndInventory;
