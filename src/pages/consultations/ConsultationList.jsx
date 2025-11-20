import React, { useState, useEffect } from 'react';
import { getConsultations } from '@/api/consultations';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
// Importa el componente del formulario que crearemos en el siguiente paso

import ConsultationForm from './ConsultationForm';

const ConsultationList = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await getConsultations({ page: 1, size: 20 });
        setConsultations(response.data.items);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  if (loading) return <div>Cargando consultas...</div>;

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Consultas Oftalmológicas</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className='mr-2 h-4 w-4' /> Nueva Consulta
        </Button>
      </div>

      {/* Aquí irá el componente del formulario/modal */}
      <ConsultationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folio</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Optometrista</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultations.map((consultation) => (
                <TableRow key={consultation.id}>
                  <TableCell className='font-medium'>
                    {consultation.folio || 'N/A'}
                  </TableCell>
                  <TableCell>{consultation.customer.name}</TableCell>
                  <TableCell>
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{consultation.created_by.name}</TableCell>
                  <TableCell>
                    <Button variant='outline' size='sm'>
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationList;
