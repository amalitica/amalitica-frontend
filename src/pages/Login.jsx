import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import logoAmalitica from '@/assets/images/amalitica_logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-sm'>
        {' '}
        {/* ✅ CAMBIO: max-w-md a max-w-sm para un look más compacto en móvil */}
        <div className='text-center mb-6'>
          <img
            src={logoAmalitica}
            alt='Logo de Amalitica'
            className='w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2' // ✅ CAMBIO: Más pequeño en móvil, más grande en pantallas sm+
          />
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
            Amalitica
          </h1>{' '}
          {/* ✅ CAMBIO: Más pequeño en móvil */}
          <p className='text-sm text-muted-foreground'>
            Plataforma de Gestión para Ópticas
          </p>
        </div>
        {/* ✅ CAMBIO: Eliminada la sombra y el borde en móvil para un look más plano */}
        <Card className='sm:border sm:shadow-sm border-none shadow-none'>
          <CardHeader className='px-4 sm:px-6'>
            <CardTitle className='text-xl sm:text-2xl'>
              Iniciar Sesión
            </CardTitle>{' '}
            {/* ✅ CAMBIO: Más pequeño en móvil */}
            <CardDescription>
              Ingresa para acceder a tu panel de control.
            </CardDescription>
          </CardHeader>
          <CardContent className='px-4 sm:px-6'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {error && (
                <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
                  <p>{error}</p>
                </div>
              )}
              <div className='space-y-2'>
                <Label htmlFor='email'>Correo Electrónico</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='tu@email.com'
                  required
                  disabled={loading}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Contraseña</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
