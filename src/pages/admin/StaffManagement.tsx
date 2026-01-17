import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Phone } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { getPersonalsByTenant, getStudentsByPersonal, getPendingSubmissionsByPersonal } from '@/data/mockData';
import { User } from '@/types';

const StaffManagement = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    whatsapp: ''
  });

  if (!tenant) return null;

  const personals = getPersonalsByTenant(tenant.id);
  
  const filteredPersonals = personals.filter(personal =>
    personal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    personal.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', whatsapp: '' });
  };

  const handleCreate = () => {
    toast({
      title: 'Personal cadastrado!',
      description: `${formData.name} foi adicionado à equipe.`,
    });
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    toast({
      title: 'Personal atualizado!',
      description: `As informações de ${formData.name} foram atualizadas.`,
    });
    setEditingStaff(null);
    resetForm();
  };

  const handleDelete = (staff: User) => {
    toast({
      title: 'Personal removido',
      description: `${staff.name} foi removido da equipe.`,
    });
  };

  const openEditDialog = (staff: User) => {
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '',
      whatsapp: staff.whatsapp || ''
    });
    setEditingStaff(staff);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">
            Gerencie os personais da academia
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Personal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Personal</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo personal trainer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do personal"
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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Senha de acesso"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+55 88 99999-9999"
                />
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
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Staff List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPersonals.map((personal) => {
          const studentCount = getStudentsByPersonal(personal.id).length;
          const pendingCount = getPendingSubmissionsByPersonal(personal.id).length;

          return (
            <Card key={personal.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center bg-secondary text-secondary-foreground font-bold text-lg">
                      {personal.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{personal.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{personal.email}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {personal.whatsapp && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {personal.whatsapp}
                  </div>
                )}

                <div className="flex gap-2">
                  <Badge variant="secondary">{studentCount} alunos</Badge>
                  {pendingCount > 0 && (
                    <Badge variant="destructive">{pendingCount} pendente{pendingCount > 1 ? 's' : ''}</Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Dialog open={editingStaff?.id === personal.id} onOpenChange={(open) => !open && setEditingStaff(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(personal)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Personal</DialogTitle>
                        <DialogDescription>
                          Atualize os dados do personal trainer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nome completo</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-password">Nova Senha (deixe em branco para manter)</Label>
                          <Input
                            id="edit-password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Nova senha"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-whatsapp">WhatsApp</Label>
                          <Input
                            id="edit-whatsapp"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingStaff(null)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleEdit}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Personal?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. O personal {personal.name} será removido 
                          permanentemente da academia.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(personal)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPersonals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhum personal encontrado' : 'Nenhum personal cadastrado'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffManagement;
