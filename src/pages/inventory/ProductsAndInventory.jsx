import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import { getProducts, deleteProduct } from '@/api/products';
import { getProductInventoryAllBranches } from '@/api/inventory';
import { AdjustInventoryModal } from './AdjustInventoryModal';
import { TransferInventoryModal } from './TransferInventoryModal';

const ProductsAndInventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventoryForProduct = async (productId) => {
    if (inventoryData[productId]) {
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
      setInventoryData((prev) => {
        const newData = { ...prev };
        delete newData[selectedInventory.product_id];
        return newData;
      });
      fetchInventoryForProduct(selectedInventory.product_id);
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
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStockStatus = (inventory) => {
    if (inventory.current_stock === 0) {
      return { label: 'Agotado', color: 'text-red-600', icon: AlertTriangle };
    }
    if (inventory.current_stock <= inventory.reorder_level) {
      return { label: 'Stock bajo', color: 'text-yellow-600', icon: AlertTriangle };
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
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Productos y Stock</h1>
          <p className='mt-2 text-gray-600'>
            Gestiona tu catálogo de productos e inventario por sucursal
          </p>
        </div>
        <Link to='/inventory/products/new'>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Nuevo Producto
          </Button>
        </Link>
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tabla de productos con inventario expandible */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'></TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className='text-right'>Precio</TableHead>
              <TableHead className='text-right'>Stock Total</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center py-12'>
                  <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600 font-medium'>No hay productos</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    Comienza agregando tu primer producto
                  </p>
                  <Link to='/inventory/products/new'>
                    <Button className='mt-4'>
                      <Plus className='mr-2 h-4 w-4' />
                      Agregar Producto
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isExpanded = expandedRows.has(product.id);
                const inventory = inventoryData[product.id] || [];
                const totalStock = inventory.reduce(
                  (sum, inv) => sum + inv.current_stock,
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
                      <TableCell className='font-medium'>{product.name}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadge(product.category)}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.supplier_name || 'N/A'}</TableCell>
                      <TableCell className='text-right'>
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className='text-right'>
                        {inventory.length > 0 ? (
                          <span className='font-medium'>{totalStock}</span>
                        ) : (
                          <span className='text-gray-400'>-</span>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div
                          className='flex justify-end gap-2'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link to={`/inventory/products/${product.id}/edit`}>
                            <Button variant='ghost' size='sm'>
                              <Edit className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className='h-4 w-4 text-red-600' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Fila expandida con inventario por sucursal */}
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={8} className='bg-gray-50 p-0'>
                          <div className='p-6'>
                            {loadingInventory[product.id] ? (
                              <div className='text-center py-8'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                                <p className='mt-2 text-sm text-gray-600'>
                                  Cargando inventario...
                                </p>
                              </div>
                            ) : inventory.length === 0 ? (
                              <div className='text-center py-8'>
                                <Package className='h-10 w-10 text-gray-400 mx-auto mb-3' />
                                <p className='text-gray-600 font-medium'>
                                  Sin inventario configurado
                                </p>
                                <p className='text-sm text-gray-500 mt-1'>
                                  Este producto no tiene stock en ninguna sucursal
                                </p>
                              </div>
                            ) : (
                              <div>
                                <h4 className='text-sm font-semibold text-gray-900 mb-4'>
                                  Inventario por Sucursal
                                </h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                  {inventory.map((inv) => {
                                    const status = getStockStatus(inv);
                                    const StatusIcon = status.icon;

                                    return (
                                      <Card key={inv.id} className='p-4'>
                                        <div className='flex justify-between items-start mb-3'>
                                          <div>
                                            <h5 className='font-semibold text-gray-900'>
                                              {inv.branch_name}
                                            </h5>
                                            <p className='text-xs text-gray-500 mt-0.5'>
                                              {inv.location || 'Sin ubicación'}
                                            </p>
                                          </div>
                                          <StatusIcon
                                            className={`h-5 w-5 ${status.color}`}
                                          />
                                        </div>

                                        <div className='space-y-2 mb-4'>
                                          <div className='flex justify-between text-sm'>
                                            <span className='text-gray-600'>
                                              Stock actual:
                                            </span>
                                            <span className='font-semibold'>
                                              {inv.current_stock}
                                            </span>
                                          </div>
                                          <div className='flex justify-between text-sm'>
                                            <span className='text-gray-600'>
                                              Nivel de reorden:
                                            </span>
                                            <span>{inv.reorder_level}</span>
                                          </div>
                                          <div className='flex justify-between text-sm'>
                                            <span className='text-gray-600'>
                                              Stock de seguridad:
                                            </span>
                                            <span>{inv.safety_stock}</span>
                                          </div>
                                        </div>

                                        <div className='flex gap-2'>
                                          <Button
                                            size='sm'
                                            variant='outline'
                                            className='flex-1'
                                            onClick={() => handleAdjustInventory(inv)}
                                          >
                                            <Settings className='h-3 w-3 mr-1' />
                                            Ajustar
                                          </Button>
                                          <Button
                                            size='sm'
                                            variant='outline'
                                            className='flex-1'
                                            onClick={() => handleTransferInventory(inv)}
                                          >
                                            <ArrowLeftRight className='h-3 w-3 mr-1' />
                                            Transferir
                                          </Button>
                                        </div>
                                      </Card>
                                    );
                                  })}
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
