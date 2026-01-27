import { useState } from 'react';
import { UserCog, Plus, Search, MoreVertical, Trash2, Settings, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { 
  getPersonalsByAcademia, 
  getStudentsByPersonal,
  getPendingSubmissionsByPersonal,
  plans
} from '@/data/mockData';

const GerentePersonais = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState<any>(null);
  
  // Form state
  const [newPersonal, setNewPersonal] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: ''
  });

  if (!tenant) return null;

  const plan = plans.find(p => p.id === tenant.planId);
  const personals = getPersonalsByAcademia(tenant.id);
  const canAddMore = personals.length < (plan?.maxPersonals || 0);
  const hasCustomFields = plan?.features.customFields;
  const hasShop = plan?.features.shop;

  const filteredPersonals = personals.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPersonal = () => {
    if (!canAddMore) {
      toast({
        title: 'Limite atingido',
        description: `Seu plano permite apenas ${plan?.maxPersonals} personal(is). Faça upgrade para adicionar mais.`,
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Personal adicionado',
      description: `${newPersonal.name} foi adicionado à equipe.`,
    });
    setAddDialogOpen(false);
    setNewPersonal({ name: '', email: '', whatsapp: '', password: '' });
  };

  const handleSavePermissions = () => {
    toast({
      title: 'Permissões atualizadas',
      description: `As permissões de ${selectedPersonal?.name} foram atualizadas.`,
    });
    setPermissionsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Personais</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe de personal trainers ({personals.length}/{plan?.maxPersonals})
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAddMore}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Personal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Personal</DialogTitle>
              <DialogDescription>
                Cadastre um novo personal trainer para sua academia.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newPersonal.name}
                  onChange={(e) => setNewPersonal({ ...newPersonal, name: e.target.value })}
                  placeholder="Nome do personal"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPersonal.email}
                  onChange={(e) => setNewPersonal({ ...newPersonal, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={newPersonal.whatsapp}
                  onChange={(e) => setNewPersonal({ ...newPersonal, whatsapp: e.target.value })}
                  placeholder="+5588999999999"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha Inicial</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPersonal.password}
                  onChange={(e) => setNewPersonal({ ...newPersonal, password: e.target.value })}
                  placeholder="Senha de acesso"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddPersonal}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!canAddMore && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Limite de personais atingido</p>
                <p className="text-sm text-muted-foreground">
                  Seu plano {plan?.displayName} permite apenas {plan?.maxPersonals} personal(is).
                </p>
              </div>
              <Button>Fazer Upgrade</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Lista de Personais
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar personal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personal</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Pendentes</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead className="w-12">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonals.map((personal) => {
                const studentCount = getStudentsByPersonal(personal.id).length;
                const pendingCount = getPendingSubmissionsByPersonal(personal.id).length;
                
                return (
                  <TableRow key={personal.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-secondary text-secondary-foreground font-medium">
                          {personal.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{personal.name}</p>
                          <p className="text-sm text-muted-foreground">{personal.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {studentCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      {pendingCount > 0 ? (
                        <Badge variant="destructive">{pendingCount}</Badge>
                      ) : (
                        <Badge variant="secondary">0</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {personal.canDeleteStudents && (
                          <Badge variant="outline" className="text-xs">Deletar</Badge>
                        )}
                        {personal.canCreateCustomFields && hasCustomFields && (
                          <Badge variant="outline" className="text-xs">Campos</Badge>
                        )}
                        {personal.canManageShop && hasShop && (
                          <Badge variant="outline" className="text-xs">Loja</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPersonal(personal);
                              setPermissionsDialogOpen(true);
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Permissões
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permissões de {selectedPersonal?.name}</DialogTitle>
            <DialogDescription>
              Configure as permissões deste personal trainer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Pode deletar alunos</Label>
                <p className="text-sm text-muted-foreground">
                  Permite remover alunos do sistema
                </p>
              </div>
              <Switch defaultChecked={selectedPersonal?.canDeleteStudents} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Criar campos personalizados</Label>
                <p className="text-sm text-muted-foreground">
                  {hasCustomFields 
                    ? 'Permite criar campos no formulário'
                    : 'Indisponível no seu plano'
                  }
                </p>
              </div>
              <Switch 
                defaultChecked={selectedPersonal?.canCreateCustomFields} 
                disabled={!hasCustomFields}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Gerenciar loja</Label>
                <p className="text-sm text-muted-foreground">
                  {hasShop 
                    ? 'Permite cadastrar produtos na loja'
                    : 'Indisponível no seu plano'
                  }
                </p>
              </div>
              <Switch 
                defaultChecked={selectedPersonal?.canManageShop} 
                disabled={!hasShop}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSavePermissions}>
              Salvar Permissões
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerentePersonais;
