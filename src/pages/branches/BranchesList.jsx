import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Edit, Trash2, MapPin } from 'lucide-react';
import { getBranches, deleteBranch } from '@/api/branches';
import { Button } from '@/components/ui/button';
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

const BranchesList = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await getBranches();
      setBranches(response.data.items || []);
    } catch (err) {
      console.error('Error al cargar sucursales:', err);
      setError('Error al cargar las sucursales.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la sucursal ${name}?`)) return;
    try {
      await deleteBranch(id);
      fetchBranches();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al eliminar la sucursal');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold'>Sucursales</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Gestiona los puntos de venta de tu óptica
          </p>
        </div>
        <Button onClick={() => navigate('/branches/new')}>
          <Plus className='mr-2 h-4 w-4' />
          Nueva Sucursal
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          {loading ? (
            <p className='text-center py-4'>Cargando sucursales...</p>
          ) : branches.length === 0 ? (
            <p className='text-center py-4'>No hay sucursales registradas.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className='font-medium'>
                      {branch.name}
                      {branch.is_main && (
                        <span className='ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>
                          Matriz
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{branch.code || 'N/A'}</TableCell>
                    <TableCell>
                      <div className='flex items-center text-sm'>
                        <MapPin className='mr-1 h-3 w-3 text-muted-foreground' />
                        {branch.street}, {branch.postal_code}
                      </div>
                    </TableCell>
                    <TableCell className='capitalize'>{branch.branch_type}</TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm'>
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => navigate(`/branches/${branch.id}/edit`)}>
                            <Edit className='mr-2 h-4 w-4' />
                            Editar
                          </DropdownMenuItem>
                          {!branch.is_main && (
                            <DropdownMenuItem
                              onClick={() => handleDelete(branch.id, branch.name)}
                              className='text-destructive'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Eliminar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchesList;
