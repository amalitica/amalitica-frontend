import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { createBranch, updateBranch, getBranchById } from '@/api/branches';
import { getUsers } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GeographicSelector from '@/components/common/GeographicSelector';

const BranchForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(mode === 'edit');
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
      is_main: false,
      phone: '',
      email: '',
      whatsapp: '',
      street: '',
      exterior_number: '',
      interior_number: '',
      postal_code: '',
      state_id: null,
      municipality_id: null,
      settlement_id: null,
      manager_id: null,
      branch_type: 'estándar',
      has_lab: false,
    },
  });

  useEffect(() => {
    // Cargar usuarios para el selector de manager
    getUsers({ size: 100, management_roles: true })
      .then((response) => setUsers(response.items || []))
      .catch((err) => console.error('Error al cargar usuarios:', err));

    if (mode === 'edit' && id) {
      loadBranchData();
    }
  }, [mode, id]);

  const loadBranchData = async () => {
    try {
      setLoadingData(true);
      const response = await getBranchById(id);
      const branch = response.data || response;

      Object.keys(branch).forEach((key) => {
        if (key in watch()) {
          setValue(
            key,
            branch[key] || (key === 'is_main' || key === 'has_lab' ? false : '')
          );
        }
      });
    } catch (err) {
      console.error('Error al cargar sucursal:', err);
      setError('Error al cargar los datos de la sucursal');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await createBranch(data);
      } else {
        await updateBranch(id, data);
      }
      navigate('/branches');
    } catch (err) {
      console.error('Error al guardar sucursal:', err);
      setError(err.response?.data?.detail || 'Error al guardar la sucursal');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className='p-8 text-center'>Cargando datos...</div>;
  }

  return (
    <div className='space-y-6 max-w-4xl mx-auto pb-8'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' onClick={() => navigate('/branches')}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-2xl font-bold'>
            {mode === 'create' ? 'Nueva Sucursal' : 'Editar Sucursal'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Nombre de la Sucursal{' '}
                <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='name'
                {...register('name', { required: 'El nombre es obligatorio' })}
                placeholder='Ej. Sucursal Centro'
              />
              {errors.name && (
                <p className='text-xs text-destructive'>
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='code'>Código</Label>
              <Input id='code' {...register('code')} placeholder='Ej. SUC01' />
            </div>
            <div className='flex items-center space-x-2 pt-8'>
              <Checkbox
                id='is_main'
                checked={watch('is_main')}
                onCheckedChange={(checked) => setValue('is_main', checked)}
              />
              <Label htmlFor='is_main'>Es la sucursal principal</Label>
            </div>
            <div className='flex items-center space-x-2 pt-8'>
              <Checkbox
                id='has_lab'
                checked={watch('has_lab')}
                onCheckedChange={(checked) => setValue('has_lab', checked)}
              />
              <Label htmlFor='has_lab'>Tiene laboratorio propio</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <GeographicSelector
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
              required={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto y Operación de la Sucursal</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Teléfono</Label>
              <Input id='phone' {...register('phone')} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' {...register('email')} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='manager_id'>Gerente / Encargado</Label>
              <Select
                value={watch('manager_id')?.toString()}
                onValueChange={(val) => setValue('manager_id', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seleccionar gerente' />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.name} {u.paternal_surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {error && <p className='text-sm text-destructive'>{error}</p>}

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/branches')}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={loading}>
            <Save className='mr-2 h-4 w-4' />
            {loading ? 'Guardando...' : 'Guardar Sucursal'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BranchForm;
