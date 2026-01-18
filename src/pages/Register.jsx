// src/pages/Register.jsx
/**
 * Página de registro de nuevo tenant (óptica).
 * 
 * Flujo de 3 pasos:
 * 1. Datos del negocio
 * 2. Ubicación de la sucursal principal
 * 3. Datos del administrador (con inferencia de género)
 * 
 * Refactorizado para usar componentes reutilizables:
 * - PersonNameFields: Captura nombre, apellidos y género
 * - GeographicSelector: Captura datos geográficos basados en SEPOMEX
 */

import { useState, useEffect } from 'react';
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
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Building2,
  User,
  MapPin,
} from 'lucide-react';
import logoAmalitica from '@/assets/images/amalitica_logo.png';
import { registerTenant } from '@/api/tenants';
import apiClient from '@/api/axios';
import PersonNameFields from '@/components/common/PersonNameFields';
import GeographicSelector from '@/components/common/GeographicSelector';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Agregar clase al body para permitir scroll en página pública
  useEffect(() => {
    document.body.classList.add('public-page');
    document.body.classList.remove('has-layout');
    
    return () => {
      document.body.classList.remove('public-page');
    };
  }, []);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Datos del negocio
    business_name: '',
    // Datos de la sucursal (geográficos)
    branch_name: 'Matriz',
    branch_postal_code: '',
    branch_state_id: null,
    branch_municipality_id: null,
    branch_settlement_id: null,
    branch_settlement_custom: '',
    branch_street: '',
    branch_exterior_number: '',
    branch_interior_number: '',
    // Datos del administrador
    admin_name: '',
    admin_paternal_surname: '',
    admin_maternal_surname: '',
    admin_gender: null,
    admin_gender_inferred: false,
    admin_gender_confidence: null,
    admin_gender_inference_method: null,
    admin_email: '',
    admin_phone: '',
    admin_password: '',
    admin_password_confirmation: '',
  });

  // Handler genérico para cambios en campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler para campos controlados (usado por componentes reutilizables)
  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Validación del paso 1 (Datos del negocio)
  const validateStep1 = () => {
    setError('');
    if (!formData.business_name.trim()) {
      setError('El nombre del negocio es requerido');
      return false;
    }
    if (formData.business_name.trim().length < 2) {
      setError('El nombre del negocio debe tener al menos 2 caracteres');
      return false;
    }
    return true;
  };

  // Validación del paso 2 (Ubicación)
  const validateStep2 = () => {
    setError('');
    if (!formData.branch_postal_code) {
      setError('El código postal es requerido');
      return false;
    }
    if (!formData.branch_state_id) {
      setError('El estado es requerido');
      return false;
    }
    if (!formData.branch_municipality_id) {
      setError('El municipio es requerido');
      return false;
    }
    if (!formData.branch_settlement_id && !formData.branch_settlement_custom) {
      setError('La colonia es requerida');
      return false;
    }
    if (!formData.branch_street.trim()) {
      setError('La calle es requerida');
      return false;
    }
    if (!formData.branch_exterior_number.trim()) {
      setError('El número exterior es requerido');
      return false;
    }
    return true;
  };

  // Validación del paso 3 (Datos del administrador)
  const validateStep3 = () => {
    setError('');
    if (!formData.admin_name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (formData.admin_name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }
    if (!formData.admin_paternal_surname.trim()) {
      setError('El apellido paterno es requerido');
      return false;
    }
    if (formData.admin_paternal_surname.trim().length < 2) {
      setError('El apellido paterno debe tener al menos 2 caracteres');
      return false;
    }
    if (!formData.admin_email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin_email)) {
      setError('El correo electrónico no es válido');
      return false;
    }
    if (!formData.admin_phone.trim()) {
      setError('El teléfono es requerido');
      return false;
    }
    if (!/^\d+$/.test(formData.admin_phone)) {
      setError('El teléfono solo debe contener dígitos');
      return false;
    }
    if (formData.admin_phone.length < 10) {
      setError('El teléfono debe tener al menos 10 dígitos');
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
    if (!/[A-Z]/.test(formData.admin_password)) {
      setError('La contraseña debe contener al menos una mayúscula');
      return false;
    }
    if (!/[a-z]/.test(formData.admin_password)) {
      setError('La contraseña debe contener al menos una minúscula');
      return false;
    }
    if (!/[0-9]/.test(formData.admin_password)) {
      setError('La contraseña debe contener al menos un número');
      return false;
    }
    if (/\s/.test(formData.admin_password)) {
      setError('La contraseña no debe contener espacios');
      return false;
    }
    if (formData.admin_password !== formData.admin_password_confirmation) {
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
      const payload = {
        business_name: formData.business_name.trim(),
        branch_name: formData.branch_name.trim() || 'Matriz',
        branch_postal_code: formData.branch_postal_code,
        branch_state_id: formData.branch_state_id,
        branch_municipality_id: formData.branch_municipality_id,
        branch_settlement_id: formData.branch_settlement_id,
        branch_settlement_custom: formData.branch_settlement_custom?.trim() || null,
        branch_street: formData.branch_street.trim(),
        branch_exterior_number: formData.branch_exterior_number.trim(),
        branch_interior_number: formData.branch_interior_number?.trim() || null,
        admin_name: formData.admin_name.trim(),
        admin_paternal_surname: formData.admin_paternal_surname.trim(),
        admin_maternal_surname: formData.admin_maternal_surname?.trim() || null,
        admin_gender: formData.admin_gender,
        admin_gender_inferred: formData.admin_gender_inferred,
        admin_gender_confidence: formData.admin_gender_confidence,
        admin_gender_inference_method: formData.admin_gender_inference_method,
        admin_email: formData.admin_email.trim(),
        admin_phone: formData.admin_phone.trim(),
        admin_password: formData.admin_password,
        admin_password_confirmation: formData.admin_password_confirmation,
      };

      const response = await registerTenant(payload);

      // Limpiar localStorage completamente antes de guardar nuevos tokens
      localStorage.clear();
      
      // Guardar nuevos tokens en localStorage
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      
      // Actualizar el header de Authorization en apiClient inmediatamente
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      
      // Obtener información del usuario autenticado
      const userResponse = await apiClient.get('/users/me');
      localStorage.setItem('user', JSON.stringify(userResponse.data));

      setSuccess(true);

      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error('Error de registro:', err);
      const errorData = err.response?.data;
      let errorMessage = 'Error al registrar. Por favor, intenta de nuevo.';

      if (errorData?.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((e) => e.msg).join('. ');
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Negocio', icon: Building2 },
    { number: 2, title: 'Ubicación', icon: MapPin },
    { number: 3, title: 'Cuenta', icon: User },
  ];

  // Pantalla de éxito
  if (success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4'>
        <Card className='w-full max-w-md text-center'>
          <CardContent className='pt-6'>
            <CheckCircle2 className='h-16 w-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold mb-2'>¡Registro Exitoso!</h2>
            <p className='text-muted-foreground mb-4'>
              Tu cuenta ha sido creada correctamente. Serás redirigido al
              dashboard en unos segundos...
            </p>
            <Loader2 className='h-6 w-6 animate-spin mx-auto text-primary' />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4'>
      <div className='w-full max-w-lg'>
        {/* Logo */}
        <div className='text-center mb-6'>
          <img
            src={logoAmalitica}
            alt='Amalitica'
            className='h-12 mx-auto mb-2'
          />
          <p className='text-muted-foreground text-sm'>
            Gestión inteligente para tu óptica
          </p>
        </div>

        <Card>
          <CardHeader className='text-center pb-2'>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>
              Registra tu óptica en 3 simples pasos
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress Steps */}
            <div className='flex justify-between mb-6'>
              {steps.map((step, index) => (
                <div key={step.number} className='flex items-center'>
                  <div
                    className={`flex flex-col items-center ${
                      index < steps.length - 1 ? 'flex-1' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        currentStep >= step.number
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/30 text-muted-foreground'
                      }`}
                    >
                      <step.icon className='h-5 w-5' />
                    </div>
                    <span
                      className={`text-xs mt-1 ${
                        currentStep >= step.number
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 mt-[-20px] ${
                        currentStep > step.number
                          ? 'bg-primary'
                          : 'bg-muted-foreground/30'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Step 1: Datos del Negocio */}
              {currentStep === 1 && (
                <>
                  <div className='space-y-2'>
                    <Label htmlFor='business_name'>
                      Nombre de tu Óptica <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='business_name'
                      name='business_name'
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder='Óptica Visión 2020'
                      required
                      disabled={loading}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Este será el nombre que verán tus pacientes
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='branch_name'>
                      Nombre de la Sucursal Principal
                    </Label>
                    <Input
                      id='branch_name'
                      name='branch_name'
                      value={formData.branch_name}
                      onChange={handleChange}
                      placeholder='Matriz'
                      disabled={loading}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Por defecto: "Matriz". Puedes cambiarlo después.
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Ubicación de la Sucursal */}
              {currentStep === 2 && (
                <GeographicSelector
                  values={formData}
                  onChange={handleFieldChange}
                  fieldPrefix='branch_'
                  disabled={loading}
                  showStreetFields={true}
                  required={true}
                />
              )}

              {/* Step 3: Datos del Administrador */}
              {currentStep === 3 && (
                <>
                  {/* Campos de nombre con inferencia de género */}
                  <PersonNameFields
                    values={formData}
                    onChange={handleFieldChange}
                    namePrefix='admin_'
                    disabled={loading}
                    showGender={true}
                    showMaternalSurname={true}
                    requiredFields={{
                      name: true,
                      paternal_surname: true,
                      maternal_surname: false,
                      gender: false,
                    }}
                    labels={{
                      name: 'Tu Nombre(s)',
                      paternal_surname: 'Apellido Paterno',
                      maternal_surname: 'Apellido Materno',
                      gender: 'Género',
                    }}
                    placeholders={{
                      name: 'Juan',
                      paternal_surname: 'Pérez',
                      maternal_surname: 'García',
                    }}
                  />

                  {/* Email */}
                  <div className='space-y-2'>
                    <Label htmlFor='admin_email'>
                      Tu Correo Electrónico <span className='text-red-500'>*</span>
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
                    <p className='text-xs text-muted-foreground'>
                      Este será tu usuario para iniciar sesión
                    </p>
                  </div>

                  {/* Teléfono */}
                  <div className='space-y-2'>
                    <Label htmlFor='admin_phone'>
                      Tu Teléfono <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='admin_phone'
                      name='admin_phone'
                      type='tel'
                      value={formData.admin_phone}
                      onChange={handleChange}
                      placeholder='5512345678'
                      required
                      disabled={loading}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Solo dígitos, mínimo 10
                    </p>
                  </div>

                  {/* Contraseña */}
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
                        placeholder='••••••••'
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
                    <p className='text-xs text-muted-foreground'>
                      Mínimo 8 caracteres, una mayúscula, una minúscula y un número
                    </p>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className='space-y-2'>
                    <Label htmlFor='admin_password_confirmation'>
                      Confirmar Contraseña <span className='text-red-500'>*</span>
                    </Label>
                    <div className='relative'>
                      <Input
                        id='admin_password_confirmation'
                        name='admin_password_confirmation'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.admin_password_confirmation}
                        onChange={handleChange}
                        placeholder='••••••••'
                        required
                        disabled={loading}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          </CardContent>
        </Card>

        {/* Footer */}
        <p className='text-center text-sm text-muted-foreground mt-4'>
          ¿Ya tienes una cuenta?{' '}
          <Link to='/login' className='text-primary hover:underline font-medium'>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
