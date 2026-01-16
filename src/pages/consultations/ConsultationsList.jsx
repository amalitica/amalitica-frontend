// src/pages/ConsultationsList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Printer,
  FileText,
} from 'lucide-react';
import { getConsultations, deleteConsultation } from '@/api/consultations';
import { downloadConsultationTicket, downloadLabOrder } from '@/api/documents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function ConsultationsList() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Resetear a la primera página al buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cargar consultas
  useEffect(() => {
    fetchConsultations();
  }, [currentPage, debouncedSearch]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getConsultations(
        currentPage,
        pageSize,
        debouncedSearch
      );
      setConsultations(response.data.items);
      setTotalCount(response.data.total_count);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar las consultas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')
    ) {
      return;
    }

    try {
      await deleteConsultation(id);
      fetchConsultations(); // Recargar la lista
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al eliminar la consulta');
    }
  };

  const handlePrintTicket = async (consultationId, event) => {
    event.stopPropagation(); // Evitar que se abra el menú
    try {
      await downloadConsultationTicket(consultationId);
      toast.success('Ticket descargado correctamente');
    } catch (error) {
      toast.error('Error al descargar el ticket');
    }
  };

  const handlePrintLabOrder = async (consultationId, event) => {
    event.stopPropagation(); // Evitar que se abra el menú
    try {
      await downloadLabOrder(consultationId);
      toast.success('Orden de laboratorio descargada correctamente');
    } catch (error) {
      toast.error('Error al descargar la orden de laboratorio');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  if (loading && consultations.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-gray-500'>Cargando consultas...</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold'>Consultas</h1>
          <p className='text-sm text-gray-600 mt-1'>
            {totalCount} consulta{totalCount !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Button
          onClick={() => navigate('/consultations/new')}
          className='w-full sm:w-auto'
        >
          <Plus className='mr-2 h-4 w-4' />
          Nueva Consulta
        </Button>
      </div>

      {/* Búsqueda */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
        <Input
          type='text'
          placeholder='Buscar por folio, paciente o teléfono...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Error */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      {/* Tabla (Desktop) */}
      <div className='hidden md:block'>
        <Card>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Folio
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Paciente
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Fecha
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Precio
                    </th>
                    <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {consultations.length === 0 ? (
                    <tr>
                      <td
                        colSpan='5'
                        className='px-6 py-8 text-center text-gray-500'
                      >
                        No se encontraron consultas
                      </td>
                    </tr>
                  ) : (
                    consultations.map((consultation) => (
                      <tr key={consultation.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {consultation.folio || `#${consultation.id}`}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {consultation.customer
                            ? `${consultation.customer.name} ${consultation.customer.paternal_surname}`
                            : 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {formatDate(consultation.creation_date)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatPrice(consultation.total_price)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm'>
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/consultations/${consultation.id}`)
                                }
                              >
                                <Eye className='mr-2 h-4 w-4' />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/consultations/${consultation.id}/edit`
                                  )
                                }
                              >
                                <Edit className='mr-2 h-4 w-4' />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) =>
                                  handlePrintTicket(consultation.id, e)
                                }
                              >
                                <Printer className='mr-2 h-4 w-4' />
                                Imprimir Ticket
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) =>
                                  handlePrintLabOrder(consultation.id, e)
                                }
                              >
                                <FileText className='mr-2 h-4 w-4' />
                                Orden de Laboratorio
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(consultation.id)}
                                className='text-red-600'
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tarjetas (Mobile) */}
      <div className='md:hidden space-y-4'>
        {consultations.length === 0 ? (
          <Card>
            <CardContent className='p-8 text-center text-gray-500'>
              No se encontraron consultas
            </CardContent>
          </Card>
        ) : (
          consultations.map((consultation) => (
            <Card key={consultation.id}>
              <CardHeader>
                <CardTitle className='text-lg flex items-center justify-between'>
                  <span>{consultation.folio || `#${consultation.id}`}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/consultations/${consultation.id}`)
                        }
                      >
                        <Eye className='mr-2 h-4 w-4' />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/consultations/${consultation.id}/edit`)
                        }
                      >
                        <Edit className='mr-2 h-4 w-4' />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => handlePrintTicket(consultation.id, e)}
                      >
                        <Printer className='mr-2 h-4 w-4' />
                        Imprimir Ticket
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handlePrintLabOrder(consultation.id, e)}
                      >
                        <FileText className='mr-2 h-4 w-4' />
                        Orden de Laboratorio
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(consultation.id)}
                        className='text-red-600'
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Paciente:</span>
                  <span className='font-medium'>
                    {consultation.customer
                      ? `${consultation.customer.first_name} ${consultation.customer.last_name}`
                      : 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Fecha:</span>
                  <span>{formatDate(consultation.consultation_date)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Precio:</span>
                  <span className='font-medium'>
                    {formatPrice(consultation.total_price)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <Button
            variant='outline'
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className='text-sm text-gray-600'>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant='outline'
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
