/**
 * Formulario para crear y editar proveedores.
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
  Building2,
  User,
  CreditCard,
  FileText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import { getSupplier, createSupplier, updateSupplier } from '@/api/suppliers';

// =============================================================================
// SCHEMA DE VALIDACIÓN
// =============================================================================

const supplierSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  legal_name: z.string().max(200).optional().nullable(),
  rfc: z.string().max(13).optional().nullable(),
  contact_name: z.string().max(100).optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  phone: z.string().max(20).optional().nullable(),
  website: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  payment_terms_days: z.coerce.number().min(0).max(365).optional().nullable(),
  default_lead_time_days: z.coerce.number().min(0).max(365).optional().nullable(),
  minimum_order_amount: z.coerce.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
});

// =============================================================================
// COMPONENTES DE SECCIÓN
// =============================================================================

/**
 * Sección de información básica.
 */
const BasicInfoSection = ({ control, errors }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        Información Básica
      </CardTitle>
      <CardDescription>
        Datos generales del proveedor
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre comercial *</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="name"
              placeholder="Ej: Luxottica México"
              className={errors.name ? 'border-red-500' : ''}
            />
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="legal_name">Razón social</Label>
        <Controller
          name="legal_name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="legal_name"
              placeholder="Ej: Luxottica México S.A. de C.V."
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rfc">RFC</Label>
        <Controller
          name="rfc"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="rfc"
              placeholder="Ej: LME123456ABC"
              maxLength={13}
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Sitio web</Label>
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="website"
              type="url"
              placeholder="https://www.ejemplo.com"
              value={field.value || ''}
            />
          )}
        />
        {errors.website && (
          <p className="text-sm text-red-500">{errors.website.message}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de contacto.
 */
const ContactSection = ({ control, errors }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Información de Contacto
      </CardTitle>
      <CardDescription>
        Datos del contacto principal
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="contact_name">Nombre del contacto</Label>
        <Controller
          name="contact_name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="contact_name"
              placeholder="Ej: Juan Pérez"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="contacto@proveedor.com"
              value={field.value || ''}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="phone"
              placeholder="Ej: 55 1234 5678"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Dirección</Label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="address"
              placeholder="Calle, número, colonia..."
              rows={2}
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="city"
              placeholder="Ej: Ciudad de México"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="state"
              placeholder="Ej: CDMX"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">País</Label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="country"
              placeholder="Ej: México"
              value={field.value || ''}
            />
          )}
        />
      </div>
    </CardContent>
  </Card>
);

/**
 * Sección de términos comerciales.
 */
const CommercialSection = ({ control, errors }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Términos Comerciales
      </CardTitle>
      <CardDescription>
        Condiciones de pago y entrega
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="payment_terms_days">Días de crédito</Label>
        <Controller
          name="payment_terms_days"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="payment_terms_days"
              type="number"
              min="0"
              max="365"
              placeholder="Ej: 30"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="default_lead_time_days">Tiempo de entrega (días)</Label>
        <Controller
          name="default_lead_time_days"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="default_lead_time_days"
              type="number"
              min="0"
              max="365"
              placeholder="Ej: 7"
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="minimum_order_amount">Pedido mínimo (MXN)</Label>
        <Controller
          name="minimum_order_amount"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="minimum_order_amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ej: 5000.00"
              value={field.value || ''}
            />
          )}
        />
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
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Notas
      </CardTitle>
      <CardDescription>
        Información adicional sobre el proveedor
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Notas internas sobre el proveedor..."
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

const SupplierForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  // Estado
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Formulario
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      legal_name: '',
      rfc: '',
      contact_name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      country: 'México',
      payment_terms_days: '',
      default_lead_time_days: '',
      minimum_order_amount: '',
      notes: '',
    },
  });

  // Cargar proveedor si estamos editando
  useEffect(() => {
    if (isEditing) {
      const loadSupplier = async () => {
        setLoading(true);
        try {
          const data = await getSupplier(id);
          reset({
            name: data.name,
            legal_name: data.legal_name || '',
            rfc: data.rfc || '',
            contact_name: data.contact_name || '',
            email: data.email || '',
            phone: data.phone || '',
            website: data.website || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || 'México',
            payment_terms_days: data.payment_terms_days || '',
            default_lead_time_days: data.default_lead_time_days || '',
            minimum_order_amount: data.minimum_order_amount || '',
            notes: data.notes || '',
          });
        } catch (error) {
          console.error('Error al cargar proveedor:', error);
          toast({
            title: 'Error',
            description: 'No se pudo cargar el proveedor',
            variant: 'destructive',
          });
          navigate('/suppliers');
        } finally {
          setLoading(false);
        }
      };
      loadSupplier();
    }
  }, [id, isEditing, reset, navigate, toast]);

  // Handler de envío
  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Limpiar campos vacíos
      const supplierData = {
        ...data,
        legal_name: data.legal_name || null,
        rfc: data.rfc || null,
        contact_name: data.contact_name || null,
        email: data.email || null,
        phone: data.phone || null,
        website: data.website || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || null,
        payment_terms_days: data.payment_terms_days || null,
        default_lead_time_days: data.default_lead_time_days || null,
        minimum_order_amount: data.minimum_order_amount || null,
        notes: data.notes || null,
      };

      if (isEditing) {
        await updateSupplier(id, supplierData);
        toast({
          title: 'Proveedor actualizado',
          description: 'Los cambios se han guardado correctamente',
        });
      } else {
        await createSupplier(supplierData);
        toast({
          title: 'Proveedor creado',
          description: 'El proveedor se ha creado correctamente',
        });
      }

      navigate('/suppliers');
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'No se pudo guardar el proveedor',
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
            onClick={() => navigate('/suppliers')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? 'Modifica los datos del proveedor'
                : 'Completa la información del nuevo proveedor'}
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
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="commercial">Términos Comerciales</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfoSection control={control} errors={errors} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactSection control={control} errors={errors} />
        </TabsContent>

        <TabsContent value="commercial">
          <CommercialSection control={control} errors={errors} />
        </TabsContent>

        <TabsContent value="notes">
          <NotesSection control={control} />
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default SupplierForm;
