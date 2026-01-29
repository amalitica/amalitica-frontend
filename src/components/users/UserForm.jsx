// src/components/users/UserForm.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Calendar, Eye, EyeOff } from 'lucide-react';
import { createUser, updateUser, getUserById } from '@/api/users';
import { getAllBranches } from '@/api/branches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import PersonNameFields from '@/components/common/PersonNameFields';
import { formatValidationError } from '@/utils/errorHandler';

const UserForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(mode === 'edit');
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      paternal_surname: '',
      maternal_surname: '',
      email: '',
      phone: '',
      role: 'Empleado',
      password: '',
      password_confirmation: '',
      gender: null,
      birth_date: '',
      branch_id: null,
    },
  });

  useEffect(() => {
    getAllBranches()
      .then((data) => setBranches(data.items || data))
      .catch((err) => console.error('Error al cargar sucursales:', err));

    if (mode === 'edit' && id) {
      loadUserData();
    }
  }, [mode, id]);

  const loadUserData = async () => {
    try {
      setLoadingData(true);
      const user = await getUserById(id);

      // Setear todos los valores del usuario
      Object.keys(user).forEach((key) => {
        if (key === 'birth_date' && user[key]) {
          setValue(key, user[key].split('T')[0]);
        } else {
          setValue(key, user[key] ?? '');
        }
      });
    } catch (err) {
      console.error('Error al cargar usuario:', err);
      setError('Error al cargar los datos del usuario');
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const payload = { ...data };
      
      // Eliminar campos vacíos opcionales
      if (!payload.birth_date) delete payload.birth_date;
      if (!payload.gender) delete payload.gender;
      if (!payload.branch_id) delete payload.branch_id;

      if (mode === 'create') {
        await createUser(payload);
      } else {
        if (!payload.password) {
          delete payload.password;
          delete payload.password_confirmation;
        }
        await updateUser(id, payload);
      }
      navigate('/users');
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError(formatValidationError(err));
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
        <Button variant='ghost' size='sm' onClick={() => navigate('/users')}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-2xl font-bold'>
            {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Card de Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <PersonNameFields
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='email'>
                  Email <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email', {
                    required: 'El email es obligatorio',
                  })}
                />
                {errors.email && (
                  <p className='text-xs text-destructive'>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='phone'>
                  Teléfono <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='phone'
                  {...register('phone', {
                    required: 'El teléfono es obligatorio',
                  })}
                />
                {errors.phone && (
                  <p className='text-xs text-destructive'>
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='birth_date'>Fecha de Nacimiento</Label>
                <div className='relative'>
                  <Input
                    id='birth_date'
                    type='date'
                    className='pl-10'
                    {...register('birth_date')}
                  />
                  <Calendar className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Acceso y Rol del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Acceso y Rol del Sistema</CardTitle>
            <CardDescription>
              El rol del sistema define los permisos globales del usuario.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Primera fila: Campos de contraseña lado a lado */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='password'>
                  Contraseña{' '}
                  {mode === 'create' ? (
                    <span className='text-destructive'>*</span>
                  ) : (
                    '(dejar en blanco para no cambiar)'
                  )}
                </Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required:
                        mode === 'create' ? 'La contraseña es obligatoria' : false,
                    })}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password_confirmation'>
                  Confirmar Contraseña{' '}
                  {mode === 'create' ? (
                    <span className='text-destructive'>*</span>
                  ) : (
                    '(rellenar si cambias de contraseña)'
                  )}
                </Label>
                <div className='relative'>
                  <Input
                    id='password_confirmation'
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    {...register('password_confirmation', {
                      validate: (val) => {
                        if (watch('password') && val !== watch('password')) {
                          return 'Las contraseñas no coinciden';
                        }
                      },
                    })}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                {errors.password_confirmation && (
                  <p className='text-xs text-destructive'>
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>
            </div>
            {/* Segunda fila: Rol del Sistema */}
            <div className='space-y-2'>
              <Label htmlFor='role'>
                Rol del Sistema <span className='text-destructive'>*</span>
              </Label>
              <Select
                value={watch('role')}
                onValueChange={(val) => setValue('role', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seleccionar rol' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Admin'>Administrador</SelectItem>
                  <SelectItem value='Manager'>Gerente</SelectItem>
                  <SelectItem value='Empleado'>Empleado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Card de Asignación a Sucursal */}
        <Card>
          <CardHeader>
            <CardTitle>Asignación a Sucursal</CardTitle>
            <CardDescription>
              Selecciona la sucursal donde trabajará este usuario. 
              Los administradores pueden no tener sucursal asignada.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='branch_id'>Sucursal</Label>
              <Select
                value={watch('branch_id')?.toString() || 'null'}
                onValueChange={(val) => setValue('branch_id', val === 'null' ? null : parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Seleccionar sucursal (opcional)' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='null'>Sin sucursal (Usuario corporativo)</SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className='bg-destructive/10 border border-destructive/20 rounded-md p-4'>
            <p className='text-sm text-destructive font-medium mb-1'>Error al guardar:</p>
            <div className='text-sm text-destructive whitespace-pre-line'>
              {error}
            </div>
          </div>
        )}

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/users')}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={loading}>
            <Save className='mr-2 h-4 w-4' />
            {loading ? 'Guardando...' : 'Guardar Usuario'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
