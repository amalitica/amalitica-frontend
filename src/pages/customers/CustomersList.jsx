import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FilePlus,
} from 'lucide-react';
import { getCustomers, deleteCustomer } from '@/api/customers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const pageSize = 20;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Debounce para la búsqueda (espera 500ms después de que el usuario deje de escribir)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Resetear a la primera página cuando se busca
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Cargar pacientes
  useEffect(() => {
    fetchCustomers();
  }, [page, debouncedSearch]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        size: pageSize,
        sort_by: 'creation_date',
        sort_order: 'desc',
      };

      if (debouncedSearch) {
        params.q = debouncedSearch;
      }

      const response = await getCustomers(params);
      setCustomers(response.data.items);
      setTotalCount(response.data.total_count);
    } catch (err) {
      console.error('Error al cargar pacientes:', err);
      setError('Error al cargar los pacientes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId, customerName) => {
    if (
      !window.confirm(`¿Estás seguro de que deseas eliminar a ${customerName}?`)
    ) {
      return;
    }

    try {
      await deleteCustomer(customerId);
      fetchCustomers(); // Recargar la lista
    } catch (err) {
      console.error('Error al eliminar paciente:', err);
      alert('Error al eliminar el paciente. Verifica tus permisos.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold'>Pacientes</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Gestiona la información de tus pacientes
          </p>
        </div>
        <Button
          onClick={() => navigate('/customers/new')}
          className='w-full sm:w-auto'
        >
          <Plus className='mr-2 h-4 w-4' />
          Nuevo Paciente
        </Button>
      </div>

      {/* Search and Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Pacientes</CardTitle>
          <CardDescription>
            Busca por nombre, apellido o teléfono
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Buscar paciente...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Pacientes
            {totalCount > 0 && (
              <span className='ml-2 text-sm font-normal text-muted-foreground'>
                ({totalCount} {totalCount === 1 ? 'paciente' : 'pacientes'})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex justify-center items-center py-8'>
              <p className='text-muted-foreground'>Cargando pacientes...</p>
            </div>
          ) : error ? (
            <div className='flex justify-center items-center py-8'>
              <p className='text-destructive'>{error}</p>
            </div>
          ) : customers.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <p className='text-muted-foreground mb-2'>
                {searchQuery
                  ? 'No se encontraron pacientes'
                  : 'No hay pacientes registrados'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => navigate('/customers/new')}
                  variant='outline'
                  size='sm'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Crear primer paciente
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Tabla para pantallas grandes */}
              <div className='hidden md:block overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                      <TableHead className='text-right'>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className='font-medium'>
                          {customer.name} {customer.paternal_surname}{' '}
                          {customer.maternal_surname || ''}
                        </TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.email || 'N/A'}</TableCell>
                        <TableCell>
                          {formatDate(customer.creation_date)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/consultations/new?customerId=${customer.id}&customerName=${encodeURIComponent(
                                      `${customer.name} ${customer.paternal_surname}`
                                    )}`
                                  )
                                }
                              >
                                <FilePlus className='mr-2 h-4 w-4' />
                                Crear Consulta
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/customers/${customer.id}`)
                                }
                              >
                                <Eye className='mr-2 h-4 w-4' />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/customers/${customer.id}/edit`)
                                }
                              >
                                <Edit className='mr-2 h-4 w-4' />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDelete(
                                    customer.id,
                                    `${customer.name} ${customer.paternal_surname}`
                                  )
                                }
                                className='text-destructive'
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Vista de tarjetas para móviles */}
              <div className='md:hidden space-y-4'>
                {customers.map((customer) => (
                  <Card key={customer.id}>
                    <CardContent className='pt-6'>
                      <div className='flex justify-between items-start mb-4'>
                        <div>
                          <p className='font-semibold'>
                            {customer.name} {customer.paternal_surname}{' '}
                            {customer.maternal_surname || ''}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {customer.phone}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {customer.email || 'Sin email'}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/customers/${customer.id}`)
                              }
                            >
                              <Eye className='mr-2 h-4 w-4' />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/customers/${customer.id}/edit`)
                              }
                            >
                              <Edit className='mr-2 h-4 w-4' />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDelete(
                                  customer.id,
                                  `${customer.name} ${customer.paternal_surname}`
                                )
                              }
                              className='text-destructive'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        Registrado: {formatDate(customer.creation_date)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t'>
                  <p className='text-sm text-muted-foreground'>
                    Página {page} de {totalPages}
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersList;
