/**
 * Formulario para crear y editar marcas.
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
  Tag,
  Building2,
  Globe,
  FileText,
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
import { useToast } from '@/hooks/use-toast';

import { getBrand, createBrand, updateBrand } from '@/api/brands';
import { getSuppliersSimple } from '@/api/suppliers';
import { CATEGORY_LABELS } from '@/api/products';

// =============================================================================
// SCHEMA DE VALIDACIÓN
// =============================================================================

const brandSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  category: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => 
        val === null || 
        val === 'Armazón' || 
        val === 'Lente Oftálmico' || 
        val === 'Lente de Contacto' || 
        val === 'Accesorio' || 
        val === 'Solución' || 
        val === 'Estuche' ||
        val === 'Limpieza' ||
        val === 'Otro',
      {
        message: "Categoría inválida. Debe ser 'Armazón', 'Lente Oftálmico', 'Lente de Contacto', 'Accesorio', 'Solución', 'Estuche', 'Limpieza' o 'Otro'",
      }
    ),
  is_luxury: z.boolean().default(false),
  is_house_brand: z.boolean().default(false),
  supplier_id: z.coerce.number().optional().nullable(),
  manufacturer: z.string().max(100).optional().nullable(),
  country_of_origin: z.string().max(100).optional().nullable(),
  website: z
    .string()
    .url('URL inválida')
    .optional()
    .nullable()
    .or(z.literal('')),
  notes: z.string().optional().nullable(),
});

// =============================================================================
// COMPONENTES DE SECCIÓN
// =============================================================================

/**
 * Sección de información básica.
 */
const BasicInfoSection = ({ control, errors, suppliers }) => (
  <Card>
    <CardHeader>
      <CardTitle className='flex items-center gap-2'>
        <Tag className='h-5 w-5' />
        Información Básica
      </CardTitle>
      <CardDescription>Datos generales de la marca</CardDescription>
    </CardHeader>
    <CardContent className='grid gap-4 md:grid-cols-2'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Nombre de la marca *</Label>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id='name'
              placeholder='Ej: Ray-Ban'
              className={errors.name ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='category'>Categoría de productos</Label>
        <Controller
          name='category'
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(value || null)}
              value={field.value || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder='Todas las categorías' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas las categorías</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <p className='text-xs text-muted-foreground'>
          Si no seleccionas una categoría, la marca estará disponible para todos
          los tipos de productos
        </p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='supplier_id'>Proveedor principal</Label>
        <Controller
          name='supplier_id'
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) =>
                field.onChange(value ? parseInt(value) : null)
              }
              value={field.value?.toString() || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un proveedor' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='out'>Sin proveedor</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Controller
            name='is_luxury'
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Marca de lujo</Label>
        </div>
        <p className='text-xs text-muted-foreground'>
          Activa esta opción si es una marca premium o de alta gama
        </p>

        <div className='flex items-center space-x-2'>
          <Controller
            name='is_house_brand'
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Marca propia</Label>
        </div>
        <p className='text-xs text-muted-foreground'>
          Activa esta opción si es una marca exclusiva de tu óptica
        </p>
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de información del fabricante.
 */
const ManufacturerSection = ({ control, errors }) => (
  <Card>
    <CardHeader>
      <CardTitle className='flex items-center gap-2'>
        <Building2 className='h-5 w-5' />
        Fabricante
      </CardTitle>
      <CardDescription>
        Información sobre el fabricante de la marca
      </CardDescription>
    </CardHeader>
    <CardContent className='grid gap-4 md:grid-cols-2'>
      <div className='space-y-2'>
        <Label htmlFor='manufacturer'>Nombre del fabricante</Label>
        <Controller
          name='manufacturer'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id='manufacturer'
              placeholder='Ej: Luxottica Group'
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='country_of_origin'>País de origen</Label>
        <Controller
          name='country_of_origin'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id='country_of_origin'
              placeholder='Ej: Italia'
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className='space-y-2 md:col-span-2'>
        <Label htmlFor='website'>Sitio web de la marca</Label>
        <Controller
          name='website'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id='website'
              type='url'
              placeholder='https://www.marca.com'
              value={field.value || ''}
            />
          )}
        />
        {errors.website && (
          <p className='text-sm text-red-500'>{errors.website.message}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de notas.
 */
const NotesSection = ({ control }) => (
  <Card>
    <CardHeader>
      <CardTitle className='flex items-center gap-2'>
        <FileText className='h-5 w-5' />
        Notas
      </CardTitle>
      <CardDescription>Información adicional sobre la marca</CardDescription>
    </CardHeader>
    <CardContent>
      <Controller
        name='notes'
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder='Notas internas sobre la marca...'
            rows={4}
            value={field.value || ''}
          />
        )}
      />
    </CardContent>
  </Card>
);

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const BrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  // Estado
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  // Formulario
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: '',
      category: null,
      is_luxury: false,
      is_house_brand: false,
      supplier_id: null,
      manufacturer: '',
      country_of_origin: '',
      website: '',
      notes: '',
    },
  });

  // Cargar proveedores
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await getSuppliersSimple();
        setSuppliers(data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      }
    };
    loadSuppliers();
  }, []);

  // Cargar marca si estamos editando
  useEffect(() => {
    if (isEditing) {
      const loadBrand = async () => {
        setLoading(true);
        try {
          const data = await getBrand(id);
          reset({
            name: data.name,
            category: data.category || null,
            is_luxury: data.is_luxury || false,
            is_house_brand: data.is_house_brand || false,
            supplier_id: data.supplier_id || null,
            manufacturer: data.manufacturer || '',
            country_of_origin: data.country_of_origin || '',
            website: data.website || '',
            notes: data.notes || '',
          });
        } catch (error) {
          console.error('Error al cargar marca:', error);
          toast({
            title: 'Error',
            description: 'No se pudo cargar la marca',
            variant: 'destructive',
          });
          navigate('/brands');
        } finally {
          setLoading(false);
        }
      };
      loadBrand();
    }
  }, [id, isEditing, reset, navigate, toast]);

  // Handler de envío
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Limpiar campos vacíos
      const brandData = {
        ...data,
        category: data.category || null,
        supplier_id: data.supplier_id || null,
        manufacturer: data.manufacturer || null,
        country_of_origin: data.country_of_origin || null,
        website: data.website || null,
        notes: data.notes || null,
      };

      if (isEditing) {
        await updateBrand(id, brandData);
        toast({
          title: 'Marca actualizada',
          description: 'Los cambios se han guardado correctamente',
        });
      } else {
        await createBrand(brandData);
        toast({
          title: 'Marca creada',
          description: 'La marca se ha creado correctamente',
        });
      }

      navigate('/brands');
} catch (error) {
        console.error('Error al guardar marca:', error);
        // Extract error message properly
        let errorMessage = 'No se pudo guardar la marca';
        if (error.response?.data?.detail) {
          if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          } else if (typeof error.response.data.detail === 'object' && error.response.data.detail.msg) {
            errorMessage = error.response.data.detail.msg;
          } else if (Array.isArray(error.response.data.detail) && error.response.data.detail.length > 0) {
            const firstError = error.response.data.detail[0];
            if (firstError.msg) {
              errorMessage = firstError.msg;
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            }
          }
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => navigate('/brands')}
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {isEditing ? 'Editar Marca' : 'Nueva Marca'}
            </h1>
            <p className='text-muted-foreground'>
              {isEditing
                ? 'Modifica los datos de la marca'
                : 'Completa la información de la nueva marca'}
            </p>
          </div>
        </div>
        <Button type='submit' disabled={saving}>
          {saving ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Guardando...
            </>
          ) : (
            <>
              <Save className='mr-2 h-4 w-4' />
              Guardar
            </>
          )}
        </Button>
      </div>

      {/* Tabs de secciones */}
      <Tabs defaultValue='basic' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='basic'>Información Básica</TabsTrigger>
          <TabsTrigger value='manufacturer'>Fabricante</TabsTrigger>
          <TabsTrigger value='notes'>Notas</TabsTrigger>
        </TabsList>

        <TabsContent value='basic'>
          <BasicInfoSection
            control={control}
            errors={errors}
            suppliers={suppliers}
          />
        </TabsContent>

        <TabsContent value='manufacturer'>
          <ManufacturerSection control={control} errors={errors} />
        </TabsContent>

        <TabsContent value='notes'>
          <NotesSection control={control} />
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default BrandForm;
