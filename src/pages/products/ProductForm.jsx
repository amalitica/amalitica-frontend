// src/pages/products/ProductForm.jsx
/**
 * Formulario para crear y editar productos.
 * 
 * Incluye:
 * - Datos básicos del producto
 * - Detalles específicos según categoría (armazón, lente, lente de contacto)
 * - Inventario inicial por sucursal (solo en creación)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Info,
  DollarSign,
  Glasses,
  Eye,
  CircleDot,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import {
  getProduct,
  getProductEnums,
  createProduct,
  updateProduct,
} from '@/api/products';

// =============================================================================
// SCHEMAS DE VALIDACIÓN
// =============================================================================

const productSchema = z.object({
  // Datos básicos
  sku: z.string().min(1, 'El SKU es requerido').max(50),
  barcode: z.string().max(50).optional().nullable(),
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().optional().nullable(),
  category: z.string().min(1, 'La categoría es requerida'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  cost: z.coerce.number().min(0).optional().nullable(),
  price_tier: z.string().optional().nullable(),
  supplier_name: z.string().max(200).optional().nullable(),
  supplier_sku: z.string().max(50).optional().nullable(),
  season: z.string().optional().nullable(),
  lifecycle_stage: z.string().optional().nullable(),
  launch_date: z.string().optional().nullable(),
  discontinuation_date: z.string().optional().nullable(),
});

// =============================================================================
// COMPONENTES DE SECCIÓN
// =============================================================================

/**
 * Sección de datos básicos.
 */
const BasicInfoSection = ({ control, errors, enums }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        Información Básica
      </CardTitle>
      <CardDescription>
        Datos generales del producto
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="sku">SKU *</Label>
        <Controller
          name="sku"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="sku"
              placeholder="Ej: ARM-RB-001"
              className={errors.sku ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.sku && (
          <p className="text-sm text-red-500">{errors.sku.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode">Código de barras</Label>
        <Controller
          name="barcode"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="barcode"
              placeholder="Ej: 7501234567890"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="name">Nombre del producto *</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="name"
              placeholder="Ej: Ray-Ban Wayfarer Classic Negro"
              className={errors.name ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="description">Descripción</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              placeholder="Descripción detallada del producto..."
              rows={3}
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría *</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {enums?.categories?.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier_name">Proveedor</Label>
        <Controller
          name="supplier_name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="supplier_name"
              placeholder="Ej: Luxottica"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier_sku">SKU del proveedor</Label>
        <Controller
          name="supplier_sku"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="supplier_sku"
              placeholder="SKU en el catálogo del proveedor"
              value={field.value || ''}
            />
          )}
        />
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de precios.
 */
const PricingSection = ({ control, errors, enums }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Precios
      </CardTitle>
      <CardDescription>
        Precio de venta y costo de adquisición
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="price">Precio de venta (MXN) *</Label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className={errors.price ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Costo de adquisición (MXN)</Label>
        <Controller
          name="cost"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_tier">Segmento de precio</Label>
        <Controller
          name="price_tier"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin especificar</SelectItem>
                {enums?.price_tiers?.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de ciclo de vida.
 */
const LifecycleSection = ({ control, enums }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Info className="h-5 w-5" />
        Ciclo de Vida
      </CardTitle>
      <CardDescription>
        Información para análisis y predicción de demanda
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="season">Temporada</Label>
        <Controller
          name="season"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una temporada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin especificar</SelectItem>
                {enums?.seasons?.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lifecycle_stage">Etapa del ciclo de vida</Label>
        <Controller
          name="lifecycle_stage"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin especificar</SelectItem>
                {enums?.lifecycle_stages?.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="launch_date">Fecha de lanzamiento</Label>
        <Controller
          name="launch_date"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="launch_date"
              type="date"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="discontinuation_date">Fecha de descontinuación</Label>
        <Controller
          name="discontinuation_date"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="discontinuation_date"
              type="date"
              value={field.value || ''}
            />
          )}
        />
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de detalles de armazón.
 */
const FrameDetailsSection = ({ frameDetails, setFrameDetails, enums }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Glasses className="h-5 w-5" />
        Detalles del Armazón
      </CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Marca *</Label>
        <Input
          value={frameDetails.brand || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, brand: e.target.value })}
          placeholder="Ej: Ray-Ban"
        />
      </div>

      <div className="space-y-2">
        <Label>Modelo *</Label>
        <Input
          value={frameDetails.model || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, model: e.target.value })}
          placeholder="Ej: Wayfarer"
        />
      </div>

      <div className="space-y-2">
        <Label>Colección</Label>
        <Input
          value={frameDetails.collection || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, collection: e.target.value })}
          placeholder="Ej: Classic"
        />
      </div>

      <div className="space-y-2">
        <Label>Color *</Label>
        <Input
          value={frameDetails.color || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, color: e.target.value })}
          placeholder="Ej: Negro brillante"
        />
      </div>

      <div className="space-y-2">
        <Label>Material *</Label>
        <Select
          value={frameDetails.material || ''}
          onValueChange={(value) => setFrameDetails({ ...frameDetails, material: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona material" />
          </SelectTrigger>
          <SelectContent>
            {enums?.frame_materials?.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Estilo *</Label>
        <Select
          value={frameDetails.style || ''}
          onValueChange={(value) => setFrameDetails({ ...frameDetails, style: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona estilo" />
          </SelectTrigger>
          <SelectContent>
            {enums?.frame_styles?.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Forma</Label>
        <Select
          value={frameDetails.shape || ''}
          onValueChange={(value) => setFrameDetails({ ...frameDetails, shape: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona forma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Sin especificar</SelectItem>
            {enums?.frame_shapes?.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Género *</Label>
        <Select
          value={frameDetails.gender || ''}
          onValueChange={(value) => setFrameDetails({ ...frameDetails, gender: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona género" />
          </SelectTrigger>
          <SelectContent>
            {enums?.genders?.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="md:col-span-2" />

      <div className="space-y-2">
        <Label>Ancho del lente (mm)</Label>
        <Input
          type="number"
          value={frameDetails.lens_width || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, lens_width: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="Ej: 52"
        />
      </div>

      <div className="space-y-2">
        <Label>Ancho del puente (mm)</Label>
        <Input
          type="number"
          value={frameDetails.bridge_width || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, bridge_width: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="Ej: 18"
        />
      </div>

      <div className="space-y-2">
        <Label>Largo de varilla (mm)</Label>
        <Input
          type="number"
          value={frameDetails.temple_length || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, temple_length: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="Ej: 140"
        />
      </div>

      <div className="space-y-2">
        <Label>Peso (gramos)</Label>
        <Input
          type="number"
          value={frameDetails.weight_grams || ''}
          onChange={(e) => setFrameDetails({ ...frameDetails, weight_grams: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="Ej: 30"
        />
      </div>

      <Separator className="md:col-span-2" />

      <div className="flex items-center space-x-2">
        <Switch
          checked={frameDetails.is_prescription_ready ?? true}
          onCheckedChange={(checked) => setFrameDetails({ ...frameDetails, is_prescription_ready: checked })}
        />
        <Label>Apto para graduación</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={frameDetails.is_sunglasses ?? false}
          onCheckedChange={(checked) => setFrameDetails({ ...frameDetails, is_sunglasses: checked })}
        />
        <Label>Es para lentes de sol</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={frameDetails.has_spring_hinges ?? false}
          onCheckedChange={(checked) => setFrameDetails({ ...frameDetails, has_spring_hinges: checked })}
        />
        <Label>Tiene bisagras flexibles</Label>
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de detalles de lente oftálmico.
 */
const LensDetailsSection = ({ lensDetails, setLensDetails, enums }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Eye className="h-5 w-5" />
        Detalles del Lente Oftálmico
      </CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Marca *</Label>
        <Input
          value={lensDetails.brand || ''}
          onChange={(e) => setLensDetails({ ...lensDetails, brand: e.target.value })}
          placeholder="Ej: Essilor"
        />
      </div>

      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input
          value={lensDetails.model || ''}
          onChange={(e) => setLensDetails({ ...lensDetails, model: e.target.value })}
          placeholder="Ej: Varilux"
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo de lente *</Label>
        <Select
          value={lensDetails.lens_type || ''}
          onValueChange={(value) => setLensDetails({ ...lensDetails, lens_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
          <SelectContent>
            {enums?.lens_types?.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Material *</Label>
        <Select
          value={lensDetails.material || ''}
          onValueChange={(value) => setLensDetails({ ...lensDetails, material: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona material" />
          </SelectTrigger>
          <SelectContent>
            {enums?.lens_materials?.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tratamiento *</Label>
        <Select
          value={lensDetails.treatment || ''}
          onValueChange={(value) => setLensDetails({ ...lensDetails, treatment: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tratamiento" />
          </SelectTrigger>
          <SelectContent>
            {enums?.lens_treatments?.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Índice de refracción</Label>
        <Input
          type="number"
          step="0.01"
          value={lensDetails.refractive_index || ''}
          onChange={(e) => setLensDetails({ ...lensDetails, refractive_index: e.target.value ? parseFloat(e.target.value) : null })}
          placeholder="Ej: 1.67"
        />
      </div>

      <Separator className="md:col-span-2" />

      <div className="flex items-center space-x-2">
        <Switch
          checked={lensDetails.has_anti_reflective ?? false}
          onCheckedChange={(checked) => setLensDetails({ ...lensDetails, has_anti_reflective: checked })}
        />
        <Label>Antirreflejante</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={lensDetails.has_blue_light_filter ?? false}
          onCheckedChange={(checked) => setLensDetails({ ...lensDetails, has_blue_light_filter: checked })}
        />
        <Label>Filtro de luz azul</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={lensDetails.has_uv_protection ?? true}
          onCheckedChange={(checked) => setLensDetails({ ...lensDetails, has_uv_protection: checked })}
        />
        <Label>Protección UV</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={lensDetails.is_photochromic ?? false}
          onCheckedChange={(checked) => setLensDetails({ ...lensDetails, is_photochromic: checked })}
        />
        <Label>Fotocromático</Label>
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de detalles de lente de contacto.
 */
const ContactLensDetailsSection = ({ contactDetails, setContactDetails, enums }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CircleDot className="h-5 w-5" />
        Detalles del Lente de Contacto
      </CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Marca *</Label>
        <Input
          value={contactDetails.brand || ''}
          onChange={(e) => setContactDetails({ ...contactDetails, brand: e.target.value })}
          placeholder="Ej: Acuvue"
        />
      </div>

      <div className="space-y-2">
        <Label>Modelo *</Label>
        <Input
          value={contactDetails.model || ''}
          onChange={(e) => setContactDetails({ ...contactDetails, model: e.target.value })}
          placeholder="Ej: Oasys"
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo *</Label>
        <Select
          value={contactDetails.lens_type || ''}
          onValueChange={(value) => setContactDetails({ ...contactDetails, lens_type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
          <SelectContent>
            {enums?.contact_lens_types?.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Diseño *</Label>
        <Select
          value={contactDetails.design || ''}
          onValueChange={(value) => setContactDetails({ ...contactDetails, design: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona diseño" />
          </SelectTrigger>
          <SelectContent>
            {enums?.contact_lens_designs?.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Frecuencia de reemplazo *</Label>
        <Select
          value={contactDetails.replacement_frequency || ''}
          onValueChange={(value) => setContactDetails({ ...contactDetails, replacement_frequency: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona frecuencia" />
          </SelectTrigger>
          <SelectContent>
            {enums?.contact_lens_frequencies?.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Lentes por caja</Label>
        <Input
          type="number"
          value={contactDetails.lenses_per_box || ''}
          onChange={(e) => setContactDetails({ ...contactDetails, lenses_per_box: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="Ej: 30"
        />
      </div>

      <Separator className="md:col-span-2" />

      <div className="flex items-center space-x-2">
        <Switch
          checked={contactDetails.has_uv_protection ?? false}
          onCheckedChange={(checked) => setContactDetails({ ...contactDetails, has_uv_protection: checked })}
        />
        <Label>Protección UV</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={contactDetails.is_colored ?? false}
          onCheckedChange={(checked) => setContactDetails({ ...contactDetails, is_colored: checked })}
        />
        <Label>Es de color</Label>
      </div>
    </CardContent>
  </Card>
);

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  // Estado
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enums, setEnums] = useState(null);
  const [frameDetails, setFrameDetails] = useState({
    is_prescription_ready: true,
    is_sunglasses: false,
    has_spring_hinges: false,
  });
  const [lensDetails, setLensDetails] = useState({
    has_anti_reflective: false,
    has_blue_light_filter: false,
    has_uv_protection: true,
    has_scratch_resistant: true,
    is_photochromic: false,
    is_polarized: false,
  });
  const [contactDetails, setContactDetails] = useState({
    has_cylinder: false,
    has_multifocal: false,
    has_uv_protection: false,
    is_colored: false,
  });

  // Formulario
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: '',
      barcode: '',
      name: '',
      description: '',
      category: '',
      price: '',
      cost: '',
      price_tier: '',
      supplier_name: '',
      supplier_sku: '',
      season: '',
      lifecycle_stage: '',
      launch_date: '',
      discontinuation_date: '',
    },
  });

  const category = watch('category');

  // Cargar enums
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

  // Cargar producto si estamos editando
  useEffect(() => {
    if (isEditing) {
      const loadProduct = async () => {
        setLoading(true);
        try {
          const data = await getProduct(id);
          reset({
            sku: data.sku,
            barcode: data.barcode || '',
            name: data.name,
            description: data.description || '',
            category: data.category,
            price: data.price,
            cost: data.cost || '',
            price_tier: data.price_tier || '',
            supplier_name: data.supplier_name || '',
            supplier_sku: data.supplier_sku || '',
            season: data.season || '',
            lifecycle_stage: data.lifecycle_stage || '',
            launch_date: data.launch_date || '',
            discontinuation_date: data.discontinuation_date || '',
          });

          if (data.frame_details) {
            setFrameDetails(data.frame_details);
          }
          if (data.lens_details) {
            setLensDetails(data.lens_details);
          }
          if (data.contact_lens_details) {
            setContactDetails(data.contact_lens_details);
          }
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
    }
  }, [id, isEditing, reset, navigate, toast]);

  // Handler de envío
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Preparar datos según categoría
      const productData = {
        ...data,
        cost: data.cost || null,
        price_tier: data.price_tier || null,
        season: data.season || null,
        lifecycle_stage: data.lifecycle_stage || null,
        launch_date: data.launch_date || null,
        discontinuation_date: data.discontinuation_date || null,
      };

      // Agregar detalles específicos según categoría
      if (data.category === 'FRAME') {
        productData.frame_details = frameDetails;
      } else if (data.category === 'LENS') {
        productData.lens_details = lensDetails;
      } else if (data.category === 'CONTACT_LENS') {
        productData.contact_lens_details = contactDetails;
      }

      if (isEditing) {
        await updateProduct(id, productData);
        toast({
          title: 'Producto actualizado',
          description: 'Los cambios se han guardado correctamente',
        });
      } else {
        await createProduct(productData);
        toast({
          title: 'Producto creado',
          description: 'El producto se ha creado correctamente',
        });
      }

      navigate('/products');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo guardar el producto',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? 'Modifica los datos del producto'
                : 'Completa la información del nuevo producto'}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </>
          )}
        </Button>
      </div>

      {/* Tabs de secciones */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="pricing">Precios</TabsTrigger>
          <TabsTrigger value="lifecycle">Ciclo de Vida</TabsTrigger>
          {category && ['FRAME', 'LENS', 'CONTACT_LENS'].includes(category) && (
            <TabsTrigger value="details">Detalles Específicos</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoSection control={control} errors={errors} enums={enums} />
        </TabsContent>

        <TabsContent value="pricing">
          <PricingSection control={control} errors={errors} enums={enums} />
        </TabsContent>

        <TabsContent value="lifecycle">
          <LifecycleSection control={control} enums={enums} />
        </TabsContent>

        <TabsContent value="details">
          {category === 'FRAME' && (
            <FrameDetailsSection
              frameDetails={frameDetails}
              setFrameDetails={setFrameDetails}
              enums={enums}
            />
          )}
          {category === 'LENS' && (
            <LensDetailsSection
              lensDetails={lensDetails}
              setLensDetails={setLensDetails}
              enums={enums}
            />
          )}
          {category === 'CONTACT_LENS' && (
            <ContactLensDetailsSection
              contactDetails={contactDetails}
              setContactDetails={setContactDetails}
              enums={enums}
            />
          )}
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default ProductForm;
