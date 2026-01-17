import { useState } from 'react';
import { Search, Eye, Trash2, Phone, Calendar, Ruler, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { getStudentsByTenant, getPersonalsByTenant } from '@/data/mockData';
import { Student } from '@/types';

const AdminStudentsList = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersonal, setSelectedPersonal] = useState<string>('all');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  if (!tenant) return null;

  const students = getStudentsByTenant(tenant.id);
  const personals = getPersonalsByTenant(tenant.id);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.whatsapp.includes(searchTerm) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPersonal = selectedPersonal === 'all' || student.personalId === selectedPersonal;

    return matchesSearch && matchesPersonal;
  });

  const getPersonalName = (personalId: string) => {
    const personal = personals.find(p => p.id === personalId);
    return personal?.name || 'N/A';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDelete = (student: Student) => {
    toast({
      title: 'Aluno removido',
      description: `${student.name} foi removido do sistema.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alunos</h1>
        <p className="text-muted-foreground">
          Visualize todos os alunos cadastrados na academia
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedPersonal} onValueChange={setSelectedPersonal}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por personal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os personais</SelectItem>
            {personals.map(personal => (
              <SelectItem key={personal.id} value={personal.id}>
                {personal.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-sm text-muted-foreground">Total de alunos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{personals.length}</div>
            <p className="text-sm text-muted-foreground">Personais ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {(students.length / (personals.length || 1)).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Média de alunos por personal</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Personal</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.whatsapp}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getPersonalName(student.personalId)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(student.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Aluno?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. {student.name} será removido 
                              permanentemente do sistema, incluindo todas as fichas e histórico.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(student)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm || selectedPersonal !== 'all' 
                  ? 'Nenhum aluno encontrado com os filtros aplicados'
                  : 'Nenhum aluno cadastrado'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno</DialogTitle>
            <DialogDescription>Informações completas do aluno</DialogDescription>
          </DialogHeader>
          {viewingStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center bg-secondary text-secondary-foreground font-bold text-xl">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{viewingStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {viewingStudent.email || 'Email não informado'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{viewingStudent.whatsapp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(viewingStudent.birthDate)}</span>
                </div>
                {viewingStudent.height && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{viewingStudent.height} cm</span>
                  </div>
                )}
                {viewingStudent.weight && (
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{viewingStudent.weight} kg</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Personal responsável:</p>
                <Badge variant="secondary" className="mt-1">
                  {getPersonalName(viewingStudent.personalId)}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudentsList;
