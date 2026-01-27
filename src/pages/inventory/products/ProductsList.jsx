// src/pages/products/ProductsList.jsx
/**
 * Página de listado de productos.
 * 
 * Muestra una tabla paginada de productos con:
 * - Búsqueda por nombre, SKU o código de barras
 * - Filtros por categoría, proveedor, estado de stock
 * - Estadísticas resumidas
 * - Acciones de crear, editar, ver y eliminar
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
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Download,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

import {
  getProducts,
  getProductEnums,
  getProductsStatsSummary,
  deleteProduct,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatPrice,
  formatPercent,
} from '@/api/products';

// =============================================================================
// COMPONENTES AUXILIARES
// =============================================================================

/**
 * Card de estadística individual.
 */
const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

/**
 * Badge de categoría con color.
 */
const CategoryBadge = ({ category }) => (
  <Badge className={CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER}>
    {CATEGORY_LABELS[category] || category}
  </Badge>
);

/**
 * Badge de estado de stock.
 */
const StockBadge = ({ stock, isLowStock, isOutOfStock }) => {
  if (isOutOfStock || stock === 0) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Agotado
      </Badge>
    );
  }
  if (isLowStock) {
    return (
      <Badge variant="warning" className="flex items-center gap-1 bg-amber-100 text-amber-800">
        <AlertTriangle className="h-3 w-3" />
        Stock bajo
      </Badge>
    );
  }
  return <span className="text-sm">{stock} unidades</span>;
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const ProductsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Estado
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [enums, setEnums] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  // Filtros
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [stockFilter, setStockFilter] = useState(searchParams.get('stock') || 'all');

  // Dialogo de confirmación de eliminación
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    product: null,
  });

  // Cargar enums al montar
  useEffect(() => {
    const loadEnums = async () => {
      try {
        const data = await getProductEnums();
        setEnums(data);
      } catch (error) {
        console.error('Error al cargar enums:', error);
      }
    };
    loadEnums();
  }, []);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const data = await getProductsStatsSummary();
        setStats(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  // Cargar productos
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
      };

      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;
      if (stockFilter === 'low') params.low_stock = true;
      if (stockFilter === 'out') params.out_of_stock = true;

      const data = await getProducts(params);
      setProducts(data.items);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.total_pages,
      }));
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los productos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, search, category, stockFilter, toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Actualizar URL con filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    if (stockFilter && stockFilter !== 'all') params.set('stock', stockFilter);
    setSearchParams(params);
  }, [search, category, stockFilter, setSearchParams]);

  // Handlers
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStockFilterChange = (value) => {
    setStockFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleDelete = async () => {
    if (!deleteDialog.product) return;

    try {
      await deleteProduct(deleteDialog.product.id);
      toast({
        title: 'Producto eliminado',
        description: `El producto "${deleteDialog.product.name}" ha sido eliminado`,
      });
      loadProducts();
      // Recargar estadísticas
      const statsData = await getProductsStatsSummary();
      setStats(statsData);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos de tu óptica
          </p>
        </div>
        <Button onClick={() => navigate('/products/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total de Productos"
          value={stats?.total_products || 0}
          icon={Package}
          color="text-blue-600"
          loading={statsLoading}
        />
        <StatCard
          title="Productos Activos"
          value={stats?.active_products || 0}
          icon={Package}
          color="text-green-600"
          loading={statsLoading}
        />
        <StatCard
          title="Stock Bajo"
          value={stats?.low_stock_products || 0}
          icon={AlertTriangle}
          color="text-amber-600"
          loading={statsLoading}
        />
        <StatCard
          title="Agotados"
          value={stats?.out_of_stock_products || 0}
          icon={XCircle}
          color="text-red-600"
          loading={statsLoading}
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, SKU o código de barras..."
                value={search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>

            {/* Filtro de categoría */}
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {enums?.categories?.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro de stock */}
            <Select value={stockFilter} onValueChange={handleStockFilterChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado de stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el stock</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="out">Agotados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Margen</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton de carga
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="mb-2 h-8 w-8" />
                      <p>No se encontraron productos</p>
                      {search && (
                        <p className="text-sm">
                          Intenta con otros términos de búsqueda
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.supplier_name && (
                          <div className="text-sm text-muted-foreground">
                            {product.supplier_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>
                      <CategoryBadge category={product.category} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(product.cost)}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.profit_margin !== null ? (
                        <span
                          className={
                            product.profit_margin >= 30
                              ? 'text-green-600'
                              : product.profit_margin >= 15
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }
                        >
                          {formatPercent(product.profit_margin)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <StockBadge
                        stock={product.total_stock}
                        isLowStock={product.is_low_stock}
                        isOutOfStock={product.total_stock === 0}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/${product.id}`);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products/${product.id}/edit`);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({ open: true, product });
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Paginación */}
        {!loading && products.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {(pagination.page - 1) * pagination.pageSize + 1} a{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)}{' '}
              de {pagination.total} productos
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
              <span className="text-sm">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Dialogo de confirmación de eliminación */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, product: open ? deleteDialog.product : null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto "{deleteDialog.product?.name}".
              El producto no se eliminará permanentemente, pero dejará de estar
              disponible en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsList;
