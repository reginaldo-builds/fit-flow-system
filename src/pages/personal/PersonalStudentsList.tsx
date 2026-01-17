import { useState } from 'react';
import { Search, Plus, Pencil, Phone, MessageCircle, Eye, Calendar, Ruler, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { getStudentsByPersonal, getSubmissionsByPersonal } from '@/data/mockData';
import { Student } from '@/types';

const PersonalStudentsList = () => {
  const { user } = useAuth();
  const { tenant, slug } = useTenant();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: ''
  });

  if (!user || !tenant) return null;

  const students = getStudentsByPersonal(user.id);
  const submissions = getSubmissionsByPersonal(user.id);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.whatsapp.includes(searchTerm) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      name: '',
      whatsapp: '',
      email: '',
      birthDate: '',
      gender: '',
      height: '',
      weight: ''
    });
  };

  const handleCreate = () => {
    toast({
      title: 'Aluno cadastrado!',
      description: `${formData.name} foi adicionado à sua lista.`,
    });
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const getStudentPendingStatus = (studentId: string) => {
    return submissions.some(s => s.studentId === studentId && s.status === 'pending');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const sendWhatsApp = (whatsapp: string, message: string) => {
    const url = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Alunos</h1>
          <p className="text-muted-foreground">
            Gerencie seus alunos e envie links de cadastro
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Aluno</DialogTitle>
              <DialogDescription>
                Cadastre um novo aluno manualmente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do aluno"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+55 88 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexo</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="170"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar alunos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => {
          const hasPending = getStudentPendingStatus(student.id);

          return (
            <Card key={student.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center bg-secondary text-secondary-foreground font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{student.email || 'Sem email'}</p>
                    </div>
                  </div>
                  {hasPending && (
                    <Badge variant="destructive">Pendente</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {student.whatsapp}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setViewingStudent(student)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendWhatsApp(
                      student.whatsapp,
                      `Olá ${student.name}! Aqui é ${user.name} da ${tenant.name}. Tudo bem?`
                    )}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Student Detail Dialog */}
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Aluno</DialogTitle>
            <DialogDescription>Informações completas</DialogDescription>
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

              <div className="pt-4 flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => sendWhatsApp(
                    viewingStudent.whatsapp,
                    `Olá ${viewingStudent.name}! Preencha sua ficha de avaliação: ${window.location.origin}/${slug}/form/${user.id}`
                  )}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar Formulário
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalStudentsList;
