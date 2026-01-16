import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Edit, Trash2, User as UserIcon, Shield } from 'lucide-react';
import { getUsers, deleteUser } from '@/api/users';
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
import { Badge } from '@/components/ui/badge';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.items || []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${name}?`)) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al eliminar el usuario');
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      Admin: 'bg-purple-100 text-purple-800',
      Manager: 'bg-blue-100 text-blue-800',
      Empleado: 'bg-green-100 text-green-800',
      SuperAdmin: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={styles[role] || 'bg-gray-100 text-gray-800'} variant="secondary">
        {role}
      </Badge>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-bold'>Usuarios</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Gestiona el personal y sus permisos de acceso
          </p>
        </div>
        <Button onClick={() => navigate('/users/new')}>
          <Plus className='mr-2 h-4 w-4' />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardContent className='pt-6'>
          {loading ? (
            <p className='text-center py-4'>Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p className='text-center py-4'>No hay usuarios registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>
                      <div className='flex items-center gap-2'>
                        <UserIcon className='h-4 w-4 text-muted-foreground' />
                        {user.name} {user.paternal_surname}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'success' : 'destructive'}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm'>
                            <MoreVertical className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => navigate(`/users/${user.id}/edit`)}>
                            <Edit className='mr-2 h-4 w-4' />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(user.id, user.name)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersList;
