import { useState } from 'react';
import { Building2, Search, Eye, Lock, Unlock, Key, MoreVertical, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { academias, plans, users, getPersonalsByAcademia, getStudentsByAcademia } from '@/data/mockData';

const SystemAcademiasList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAcademia, setSelectedAcademia] = useState<typeof academias[0] | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const filteredAcademias = academias.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlock = () => {
    toast({
      title: selectedAcademia?.blocked ? 'Academia liberada' : 'Academia bloqueada',
      description: selectedAcademia?.blocked 
        ? `${selectedAcademia.name} foi liberada com sucesso.`
        : `${selectedAcademia?.name} foi bloqueada. Motivo: ${blockReason}`,
    });
    setBlockDialogOpen(false);
    setBlockReason('');
  };

  const handleChangePassword = () => {
    toast({
      title: 'Senha alterada',
      description: `A senha do gerente de ${selectedAcademia?.name} foi alterada.`,
    });
    setPasswordDialogOpen(false);
    setNewPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academias</h1>
          <p className="text-muted-foreground">
            Gerencie todas as academias cadastradas no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Lista de Academias
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar academia..."
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
                <TableHead>Academia</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Personais</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAcademias.map((academia) => {
                const plan = plans.find(p => p.id === academia.planId);
                const personais = getPersonalsByAcademia(academia.id);
                const alunos = getStudentsByAcademia(academia.id);
                
                return (
                  <TableRow key={academia.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{academia.name}</p>
                        <p className="text-sm text-muted-foreground">{academia.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1">
                        /{academia.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          plan?.name === 'elite' ? 'default' :
                          plan?.name === 'premium' ? 'secondary' :
                          'outline'
                        }
                      >
                        {plan?.displayName || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {personais.length}/{plan?.maxPersonals || 0}
                    </TableCell>
                    <TableCell>{alunos.length}</TableCell>
                    <TableCell>
                      {academia.blocked ? (
                        <Badge variant="destructive">Bloqueada</Badge>
                      ) : academia.isActive ? (
                        <Badge variant="default">Ativa</Badge>
                      ) : (
                        <Badge variant="secondary">Inativa</Badge>
                      )}
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
                              setSelectedAcademia(academia);
                              setDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => window.open(`/${academia.slug}/admin`, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Acessar Painel
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedAcademia(academia);
                              setPasswordDialogOpen(true);
                            }}
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Alterar Senha Gerente
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedAcademia(academia);
                              setBlockDialogOpen(true);
                            }}
                            className={academia.blocked ? 'text-green-600' : 'text-destructive'}
                          >
                            {academia.blocked ? (
                              <>
                                <Unlock className="mr-2 h-4 w-4" />
                                Liberar Academia
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Bloquear Academia
                              </>
                            )}
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

      {/* Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAcademia?.blocked ? 'Liberar Academia' : 'Bloquear Academia'}
            </DialogTitle>
            <DialogDescription>
              {selectedAcademia?.blocked 
                ? `Deseja liberar o acesso da academia ${selectedAcademia.name}?`
                : `Informe o motivo do bloqueio da academia ${selectedAcademia?.name}.`
              }
            </DialogDescription>
          </DialogHeader>
          {!selectedAcademia?.blocked && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Motivo do Bloqueio</Label>
                <Textarea
                  id="reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Descreva o motivo..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleBlock}
              variant={selectedAcademia?.blocked ? 'default' : 'destructive'}
            >
              {selectedAcademia?.blocked ? 'Liberar' : 'Bloquear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha do Gerente</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para o gerente de {selectedAcademia?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword}>
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAcademia?.name}</DialogTitle>
            <DialogDescription>
              Detalhes completos da academia
            </DialogDescription>
          </DialogHeader>
          {selectedAcademia && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Slug</Label>
                  <p className="font-medium">/{selectedAcademia.slug}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedAcademia.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">WhatsApp</Label>
                  <p className="font-medium">{selectedAcademia.whatsapp}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Plano</Label>
                  <p className="font-medium">
                    {plans.find(p => p.id === selectedAcademia.planId)?.displayName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {selectedAcademia.blocked ? (
                      <Badge variant="destructive">Bloqueada</Badge>
                    ) : selectedAcademia.isActive ? (
                      <Badge variant="default">Ativa</Badge>
                    ) : (
                      <Badge variant="secondary">Inativa</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cadastrada em</Label>
                  <p className="font-medium">
                    {new Date(selectedAcademia.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <Label className="text-muted-foreground">Gerente</Label>
                {(() => {
                  const gerente = users.find(u => 
                    u.academiaId === selectedAcademia.id && u.role === 'gerente'
                  );
                  return gerente ? (
                    <div className="mt-2">
                      <p className="font-medium">{gerente.name}</p>
                      <p className="text-sm text-muted-foreground">{gerente.email}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum gerente cadastrado</p>
                  );
                })()}
              </div>

              <div className="border-t pt-4">
                <Label className="text-muted-foreground">Estatísticas</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-2xl font-bold">
                        {getPersonalsByAcademia(selectedAcademia.id).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Personais</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-2xl font-bold">
                        {getStudentsByAcademia(selectedAcademia.id).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Alunos</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemAcademiasList;
