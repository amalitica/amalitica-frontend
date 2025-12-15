import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Eye, EyeOff, Loader2, CheckCircle2, Building2, User, MapPin } from 'lucide-react';
import logoAmalitica from '@/assets/images/amalitica_logo.png';
import { registerTenant } from '@/api/tenants';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Datos del negocio
    business_name: '',
    business_email: '',
    business_phone: '',
    // Datos de la sucursal
    branch_code: 'MTZ',
    branch_name: 'Matriz',
    branch_address: '',
    branch_city: '',
    branch_state: '',
    branch_postal_code: '',
    // Datos del administrador
    admin_name: '',
    admin_email: '',
    admin_phone: '',
    admin_password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.business_name.trim()) {
      setError('El nombre del negocio es requerido');
      return false;
    }
    if (!formData.business_email.trim()) {
      setError('El correo del negocio es requerido');
      return false;
    }
    if (!formData.business_phone.trim()) {
      setError('El teléfono del negocio es requerido');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.branch_address.trim()) {
      setError('La dirección de la sucursal es requerida');
      return false;
    }
    if (!formData.branch_city.trim()) {
      setError('La ciudad es requerida');
      return false;
    }
    if (!formData.branch_state.trim()) {
      setError('El estado es requerido');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.admin_name.trim()) {
      setError('Tu nombre es requerido');
      return false;
    }
    if (!formData.admin_email.trim()) {
      setError('Tu correo electrónico es requerido');
      return false;
    }
    if (!formData.admin_password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (formData.admin_password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (formData.admin_password !== formData.confirm_password) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setError('');

    try {
      const response = await registerTenant({
        business_name: formData.business_name,
        business_email: formData.business_email,
        business_phone: formData.business_phone,
        branch_code: formData.branch_code,
        branch_name: formData.branch_name,
        branch_address: formData.branch_address,
        branch_city: formData.branch_city,
        branch_state: formData.branch_state,
        branch_postal_code: formData.branch_postal_code || null,
        admin_name: formData.admin_name,
        admin_email: formData.admin_email,
        admin_phone: formData.admin_phone || null,
        admin_password: formData.admin_password,
      });

      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);

      setSuccess(true);

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        'Error al registrar. Por favor, intenta de nuevo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Negocio', icon: Building2 },
    { number: 2, title: 'Sucursal', icon: MapPin },
    { number: 3, title: 'Cuenta', icon: User },
  ];

  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
        <Card className='w-full max-w-md text-center'>
          <CardContent className='pt-6'>
            <CheckCircle2 className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>
              ¡Registro Exitoso!
            </h2>
            <p className='text-muted-foreground mb-4'>
              Tu cuenta ha sido creada. Serás redirigido al panel de control en
              unos segundos...
            </p>
            <Loader2 className='w-6 h-6 animate-spin mx-auto text-primary' />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-lg'>
        {/* Header */}
        <div className='text-center mb-6'>
          <img
            src={logoAmalitica}
            alt='Logo de Amalitica'
            className='w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2'
          />
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Amalitica
          </h1>
          <p className='text-sm text-muted-foreground'>
            Plataforma de Gestión para Ópticas
          </p>
        </div>

        {/* Progress Steps */}
        <div className='flex justify-center mb-6'>
          {steps.map((step, index) => (
            <div key={step.number} className='flex items-center'>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.number
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <step.icon className='w-5 h-5' />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-16 h-1 mx-1 transition-colors ${
                    currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <Card className='sm:border sm:shadow-sm border-none shadow-none'>
          <CardHeader className='px-4 sm:px-6'>
            <CardTitle className='text-xl sm:text-2xl'>
              {currentStep === 1 && 'Datos del Negocio'}
              {currentStep === 2 && 'Sucursal Principal'}
              {currentStep === 3 && 'Tu Cuenta'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 &&
                'Ingresa la información básica de tu óptica.'}
              {currentStep === 2 &&
                'Configura tu primera sucursal (puedes agregar más después).'}
              {currentStep === 3 &&
                'Crea tu cuenta de administrador para acceder al sistema.'}
            </CardDescription>
          </CardHeader>

          <CardContent className='px-4 sm:px-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
                  <p>{error}</p>
                </div>
              )}

              {/* Step 1: Datos del Negocio */}
              {currentStep === 1 && (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='business_name'>
                      Nombre del Negocio <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='business_name'
                      name='business_name'
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder='Óptica Visión Clara'
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='business_email'>
                      Correo del Negocio <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='business_email'
                      name='business_email'
                      type='email'
                      value={formData.business_email}
                      onChange={handleChange}
                      placeholder='contacto@tuoptica.com'
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='business_phone'>
                      Teléfono del Negocio <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='business_phone'
                      name='business_phone'
                      type='tel'
                      value={formData.business_phone}
                      onChange={handleChange}
                      placeholder='5512345678'
                      required
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* Step 2: Datos de la Sucursal */}
              {currentStep === 2 && (
                <>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='branch_code'>Código</Label>
                      <Input
                        id='branch_code'
                        name='branch_code'
                        value={formData.branch_code}
                        onChange={handleChange}
                        placeholder='MTZ'
                        maxLength={10}
                        disabled={loading}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='branch_name'>Nombre</Label>
                      <Input
                        id='branch_name'
                        name='branch_name'
                        value={formData.branch_name}
                        onChange={handleChange}
                        placeholder='Matriz'
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='branch_address'>
                      Dirección <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='branch_address'
                      name='branch_address'
                      value={formData.branch_address}
                      onChange={handleChange}
                      placeholder='Av. Principal #123, Col. Centro'
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='branch_city'>
                        Ciudad <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='branch_city'
                        name='branch_city'
                        value={formData.branch_city}
                        onChange={handleChange}
                        placeholder='Ciudad de México'
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='branch_state'>
                        Estado <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='branch_state'
                        name='branch_state'
                        value={formData.branch_state}
                        onChange={handleChange}
                        placeholder='CDMX'
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='branch_postal_code'>Código Postal</Label>
                    <Input
                      id='branch_postal_code'
                      name='branch_postal_code'
                      value={formData.branch_postal_code}
                      onChange={handleChange}
                      placeholder='06600'
                      maxLength={10}
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* Step 3: Datos del Administrador */}
              {currentStep === 3 && (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_name'>
                      Tu Nombre Completo <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='admin_name'
                      name='admin_name'
                      value={formData.admin_name}
                      onChange={handleChange}
                      placeholder='Juan Pérez García'
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_email'>
                      Tu Correo Electrónico{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='admin_email'
                      name='admin_email'
                      type='email'
                      value={formData.admin_email}
                      onChange={handleChange}
                      placeholder='tu@email.com'
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_phone'>Tu Teléfono</Label>
                    <Input
                      id='admin_phone'
                      name='admin_phone'
                      type='tel'
                      value={formData.admin_phone}
                      onChange={handleChange}
                      placeholder='5512345678'
                      disabled={loading}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='admin_password'>
                      Contraseña <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='admin_password'
                        name='admin_password'
                        type={showPassword ? 'text' : 'password'}
                        value={formData.admin_password}
                        onChange={handleChange}
                        placeholder='Mínimo 8 caracteres'
                        required
                        disabled={loading}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
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
                    <Label htmlFor='confirm_password'>
                      Confirmar Contraseña{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='confirm_password'
                        name='confirm_password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirm_password}
                        onChange={handleChange}
                        placeholder='Repite tu contraseña'
                        required
                        disabled={loading}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className='flex gap-3 pt-2'>
                {currentStep > 1 && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={prevStep}
                    disabled={loading}
                    className='flex-1'
                  >
                    Anterior
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type='button'
                    onClick={nextStep}
                    disabled={loading}
                    className='flex-1'
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button type='submit' disabled={loading} className='flex-1'>
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Registrando...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Link to Login */}
            <div className='mt-6 text-center text-sm'>
              <span className='text-muted-foreground'>
                ¿Ya tienes una cuenta?{' '}
              </span>
              <Link
                to='/login'
                className='text-primary hover:underline font-medium'
              >
                Inicia Sesión
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trial Info */}
        <p className='text-center text-xs text-muted-foreground mt-4'>
          Al registrarte obtienes 14 días de prueba gratis. Sin tarjeta de
          crédito.
        </p>
      </div>
    </div>
  );
};

export default Register;
