// src/pages/products/ProductDetail.jsx
/**
 * Página de detalle de producto.
 * 
 * Muestra información completa del producto incluyendo:
 * - Datos básicos y detalles específicos por categoría
 * - Inventario por sucursal
 * - Métricas de ventas enriquecidas
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Building2,
  BarChart3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import {
  getProduct,
  deleteProduct,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  PRICE_TIER_COLORS,
  LIFECYCLE_COLORS,
  formatPrice,
  formatPercent,
  formatDate,
} from '@/api/products';

// =============================================================================
// COMPONENTES AUXILIARES
// =============================================================================

/**
 * Card de métrica individual.
 */
const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
    </CardContent>
  </Card>
);

/**
 * Fila de información.
 */
const InfoRow = ({ label, value, badge }) => (
  <div className="flex justify-between py-2">
    <span className="text-muted-foreground">{label}</span>
    {badge ? (
      <Badge className={badge.color}>{badge.label}</Badge>
    ) : (
      <span className="font-medium">{value || '-'}</span>
    )}
  </div>
);

/**
 * Sección de detalles de armazón.
 */
const FrameDetailsSection = ({ details }) => {
  if (!details) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detalles del Armazón</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <InfoRow label="Marca" value={details.brand} />
          <InfoRow label="Modelo" value={details.model} />
          <InfoRow label="Colección" value={details.collection} />
          <InfoRow label="Color" value={details.color} />
          <InfoRow label="Material" value={details.material} />
          <InfoRow label="Estilo" value={details.style} />
          <InfoRow label="Forma" value={details.shape} />
        </div>
        <div>
          <InfoRow label="Calibre" value={details.full_size} />
          <InfoRow label="Ancho del lente" value={details.lens_width ? `${details.lens_width} mm` : null} />
          <InfoRow label="Ancho del puente" value={details.bridge_width ? `${details.bridge_width} mm` : null} />
          <InfoRow label="Largo de varilla" value={details.temple_length ? `${details.temple_length} mm` : null} />
          <InfoRow label="Género" value={details.gender} />
          <InfoRow label="Grupo de edad" value={details.age_group} />
          <InfoRow label="Peso" value={details.weight_grams ? `${details.weight_grams} g` : null} />
        </div>
        <div className="md:col-span-2 flex gap-4">
          {details.is_prescription_ready && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Apto para graduación
            </Badge>
          )}
          {details.is_sunglasses && (
            <Badge variant="outline" className="flex items-center gap-1">
              Lentes de sol
            </Badge>
          )}
          {details.has_spring_hinges && (
            <Badge variant="outline" className="flex items-center gap-1">
              Bisagras flexibles
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Sección de detalles de lente oftálmico.
 */
const LensDetailsSection = ({ details }) => {
  if (!details) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detalles del Lente</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <InfoRow label="Marca" value={details.brand} />
          <InfoRow label="Modelo" value={details.model} />
          <InfoRow label="Tipo" value={details.lens_type} />
          <InfoRow label="Diseño" value={details.design} />
          <InfoRow label="Material" value={details.material} />
          <InfoRow label="Índice de refracción" value={details.refractive_index} />
          <InfoRow label="Valor Abbe" value={details.abbe_value} />
        </div>
        <div>
          <InfoRow label="Tratamiento" value={details.treatment} />
          <InfoRow label="Esfera mínima" value={details.min_sphere} />
          <InfoRow label="Esfera máxima" value={details.max_sphere} />
          <InfoRow label="Cilindro máximo" value={details.max_cylinder} />
          <InfoRow label="Grosor centro" value={details.thickness_center_mm ? `${details.thickness_center_mm} mm` : null} />
          <InfoRow label="Garantía" value={details.warranty_months ? `${details.warranty_months} meses` : null} />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {details.has_anti_reflective && (
            <Badge variant="outline">Antirreflejante</Badge>
          )}
          {details.has_blue_light_filter && (
            <Badge variant="outline">Filtro luz azul</Badge>
          )}
          {details.has_uv_protection && (
            <Badge variant="outline">Protección UV</Badge>
          )}
          {details.has_scratch_resistant && (
            <Badge variant="outline">Anti-rayadura</Badge>
          )}
          {details.is_photochromic && (
            <Badge variant="outline">Fotocromático</Badge>
          )}
          {details.is_polarized && (
            <Badge variant="outline">Polarizado</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Sección de detalles de lente de contacto.
 */
const ContactLensDetailsSection = ({ details }) => {
  if (!details) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detalles del Lente de Contacto</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <InfoRow label="Marca" value={details.brand} />
          <InfoRow label="Modelo" value={details.model} />
          <InfoRow label="Tipo" value={details.lens_type} />
          <InfoRow label="Diseño" value={details.design} />
          <InfoRow label="Frecuencia de reemplazo" value={details.replacement_frequency} />
          <InfoRow label="Material" value={details.material_name} />
        </div>
        <div>
          <InfoRow label="Contenido de agua" value={details.water_content_percent ? `${details.water_content_percent}%` : null} />
          <InfoRow label="Permeabilidad O₂" value={details.oxygen_permeability ? `${details.oxygen_permeability} Dk/t` : null} />
          <InfoRow label="Curva base" value={details.base_curve ? `${details.base_curve} mm` : null} />
          <InfoRow label="Diámetro" value={details.diameter ? `${details.diameter} mm` : null} />
          <InfoRow label="Lentes por caja" value={details.lenses_per_box} />
          {details.is_colored && <InfoRow label="Color" value={details.color} />}
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          {details.has_cylinder && (
            <Badge variant="outline">Disponible con cilindro</Badge>
          )}
          {details.has_multifocal && (
            <Badge variant="outline">Disponible multifocal</Badge>
          )}
          {details.has_uv_protection && (
            <Badge variant="outline">Protección UV</Badge>
          )}
          {details.is_colored && (
            <Badge variant="outline">Lente de color</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Cargar producto
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el producto',
          variant: 'destructive',
        });
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate, toast]);

  // Handler de eliminación
  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      toast({
        title: 'Producto eliminado',
        description: `El producto "${product.name}" ha sido eliminado`,
      });
      navigate('/products');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el producto',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const metrics = product.sales_metrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {product.name}
              </h1>
              <Badge className={CATEGORY_COLORS[product.category]}>
                {CATEGORY_LABELS[product.category]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              SKU: {product.sku}
              {product.barcode && ` • Código de barras: ${product.barcode}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/products/${id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Métricas de ventas */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Unidades Vendidas"
          value={metrics?.total_units_sold || 0}
          subtitle="Total histórico"
          icon={Package}
          color="text-blue-600"
        />
        <MetricCard
          title="Ingresos Totales"
          value={formatPrice(metrics?.total_revenue || 0)}
          subtitle="Total histórico"
          icon={DollarSign}
          color="text-green-600"
        />
        <MetricCard
          title="Ganancia Total"
          value={formatPrice(metrics?.total_profit || 0)}
          subtitle={`Margen: ${formatPercent(metrics?.avg_margin_percent || 0)}`}
          icon={TrendingUp}
          color="text-purple-600"
        />
        <MetricCard
          title="Ventas Diarias (30d)"
          value={metrics?.avg_daily_sales_30d?.toFixed(1) || '0'}
          subtitle={
            metrics?.last_sale_date
              ? `Última venta: ${formatDate(metrics.last_sale_date)}`
              : 'Sin ventas registradas'
          }
          icon={BarChart3}
          color="text-amber-600"
        />
      </div>

      {/* Información básica y precios */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow label="Nombre" value={product.name} />
            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Código de barras" value={product.barcode} />
            <InfoRow
              label="Categoría"
              badge={{
                label: CATEGORY_LABELS[product.category],
                color: CATEGORY_COLORS[product.category],
              }}
            />
            <InfoRow label="Proveedor" value={product.supplier_name} />
            <InfoRow label="SKU del proveedor" value={product.supplier_sku} />
            {product.price_tier && (
              <InfoRow
                label="Segmento de precio"
                badge={{
                  label: product.price_tier,
                  color: PRICE_TIER_COLORS[product.price_tier],
                }}
              />
            )}
            {product.lifecycle_stage && (
              <InfoRow
                label="Etapa del ciclo de vida"
                badge={{
                  label: product.lifecycle_stage,
                  color: LIFECYCLE_COLORS[product.lifecycle_stage],
                }}
              />
            )}
            <InfoRow label="Fecha de lanzamiento" value={formatDate(product.launch_date)} />
            <Separator className="my-2" />
            <InfoRow label="Creado" value={formatDate(product.creation_date)} />
            <InfoRow label="Actualizado" value={formatDate(product.update_date)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Precios y Márgenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Precio de venta</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Costo de adquisición</span>
                <span className="text-xl font-semibold">
                  {formatPrice(product.cost)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Ganancia por unidad</span>
                <span className="text-xl font-semibold text-purple-600">
                  {product.cost
                    ? formatPrice(product.price - product.cost)
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Margen de ganancia</span>
                <span
                  className={`text-xl font-semibold ${
                    product.profit_margin >= 30
                      ? 'text-green-600'
                      : product.profit_margin >= 15
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatPercent(product.profit_margin)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descripción */}
      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Detalles específicos por categoría */}
      {product.frame_details && (
        <FrameDetailsSection details={product.frame_details} />
      )}
      {product.lens_details && (
        <LensDetailsSection details={product.lens_details} />
      )}
      {product.contact_lens_details && (
        <ContactLensDetailsSection details={product.contact_lens_details} />
      )}

      {/* Inventario por sucursal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Inventario por Sucursal
          </CardTitle>
          <CardDescription>
            Stock total: {product.total_stock} unidades
            {product.is_low_stock && (
              <Badge variant="warning" className="ml-2 bg-amber-100 text-amber-800">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Stock bajo en alguna sucursal
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sucursal</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Nivel de reorden</TableHead>
                <TableHead className="text-right">Stock de seguridad</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última venta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.branch_inventories?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No hay inventario registrado
                  </TableCell>
                </TableRow>
              ) : (
                product.branch_inventories?.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">
                      {inv.branch_name || `Sucursal ${inv.branch_id}`}
                    </TableCell>
                    <TableCell>
                      {inv.location ? (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {inv.location}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {inv.stock}
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.reorder_level}
                    </TableCell>
                    <TableCell className="text-right">
                      {inv.safety_stock}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(inv.inventory_value)}
                    </TableCell>
                    <TableCell>
                      {inv.is_out_of_stock ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <XCircle className="h-3 w-3" />
                          Agotado
                        </Badge>
                      ) : inv.is_low_stock ? (
                        <Badge className="flex items-center gap-1 w-fit bg-amber-100 text-amber-800">
                          <AlertTriangle className="h-3 w-3" />
                          Stock bajo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {inv.last_sale_date ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(inv.last_sale_date)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ventas por sucursal */}
      {metrics?.sales_by_branch?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ventas por Sucursal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="text-right">Unidades vendidas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.sales_by_branch.map((branch) => (
                  <TableRow key={branch.branch_id}>
                    <TableCell className="font-medium">
                      {branch.branch_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {branch.units_sold}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(branch.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Dialogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto "{product.name}".
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

export default ProductDetail;
