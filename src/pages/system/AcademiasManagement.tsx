import { useState } from 'react';
import { 
  Building2, Search, Ban, CheckCircle, MoreVertical, 
  Key, Eye, Mail, Phone, Calendar, CreditCard 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { academias as allAcademias, plans, users } from '@/data/mockData';
import { Academia } from '@/types';

const AcademiasManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [academias, setAcademias] = useState(allAcademias);
  
  // Dialog states
  const [blockDialog, setBlockDialog] = useState<{ open: boolean; academia: Academia | null }>({
    open: false, academia: null
  });
  const [passwordDialog, setPasswordDialog] = useState<{ open: boolean; academia: Academia | null }>({
    open: false, academia: null
  });
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; academia: Academia | null }>({
    open: false, academia: null
  });
  
  const [blockReason, setBlockReason] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const filteredAcademias = academias.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlock = () => {
    if (!blockDialog.academia) return;
    
    setAcademias(prev => prev.map(a => 
      a.id === blockDialog.academia!.id 
        ? { ...a, blocked: true, blockedReason: blockReason }
        : a
    ));
    
    toast({
      title: 'Academia Bloqueada',
      description: `${blockDialog.academia.name} foi bloqueada com sucesso.`,
    });
    
    setBlockDialog({ open: false, academia: null });
    setBlockReason('');
  };

  const handleUnblock = (academia: Academia) => {
    setAcademias(prev => prev.map(a => 
      a.id === academia.id 
        ? { ...a, blocked: false, blockedReason: undefined }
        : a
    ));
    
    toast({
      title: 'Academia Liberada',
      description: `${academia.name} foi liberada com sucesso.`,
    });
  };

  const handleChangePassword = () => {
    if (!passwordDialog.academia || !newPassword) return;
    
    toast({
      title: 'Senha Alterada',
      description: `A senha do gerente de ${passwordDialog.academia.name} foi alterada.`,
    });
    
    setPasswordDialog({ open: false, academia: null });
    setNewPassword('');
  };

  const getGerente = (academiaId: string) => {
    return users.find(u => u.academiaId === academiaId && u.role === 'gerente');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Academias</h1>
          <p className="text-muted-foreground">
            {filteredAcademias.length} academia(s) cadastrada(s)
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar academias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Academias */}
      <div className="grid gap-4">
        {filteredAcademias.map((academia) => {
          const plan = plans.find(p => p.id === academia.planId);
          const gerente = getGerente(academia.id);
          
          return (
            <Card key={academia.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg">
                      {academia.name.charAt(0)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{academia.name}</h3>
                        {academia.blocked ? (
                          <Badge variant="destructive">Bloqueada</Badge>
                        ) : academia.isActive ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                            Ativa
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Aguardando Pagamento</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          /{academia.slug}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {academia.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {academia.whatsapp}
                        </span>
                      </div>
                      
                      {gerente && (
                        <p className="text-sm text-muted-foreground">
                          Gerente: {gerente.name} ({gerente.email})
                        </p>
                      )}
                      
                      {academia.blocked && academia.blockedReason && (
                        <p className="text-sm text-destructive">
                          Motivo: {academia.blockedReason}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {plan?.displayName}
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(academia.createdAt)}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetailsDialog({ open: true, academia })}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPasswordDialog({ open: true, academia })}>
                          <Key className="mr-2 h-4 w-4" />
                          Alterar Senha Gerente
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {academia.blocked ? (
                          <DropdownMenuItem onClick={() => handleUnblock(academia)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Liberar Academia
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => setBlockDialog({ open: true, academia })}
                            className="text-destructive focus:text-destructive"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Bloquear Academia
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAcademias.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhuma academia encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar sua busca ou aguarde novos cadastros.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog: Bloquear Academia */}
      <Dialog open={blockDialog.open} onOpenChange={(open) => setBlockDialog({ open, academia: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear Academia</DialogTitle>
            <DialogDescription>
              Ao bloquear, a academia {blockDialog.academia?.name} perderá acesso ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Motivo do bloqueio</Label>
              <Textarea
                placeholder="Informe o motivo do bloqueio..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialog({ open: false, academia: null })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleBlock}>
              Bloquear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Alterar Senha */}
      <Dialog open={passwordDialog.open} onOpenChange={(open) => setPasswordDialog({ open, academia: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha do Gerente</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para o gerente de {passwordDialog.academia?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input
                type="password"
                placeholder="Digite a nova senha..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialog({ open: false, academia: null })}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={!newPassword}>
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detalhes */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, academia: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailsDialog.academia?.name}</DialogTitle>
          </DialogHeader>
          {detailsDialog.academia && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Slug</Label>
                  <p className="font-medium">/{detailsDialog.academia.slug}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{detailsDialog.academia.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">WhatsApp</Label>
                  <p className="font-medium">{detailsDialog.academia.whatsapp}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Plano</Label>
                  <p className="font-medium">
                    {plans.find(p => p.id === detailsDialog.academia?.planId)?.displayName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium">
                    {detailsDialog.academia.blocked ? 'Bloqueada' : 
                     detailsDialog.academia.isActive ? 'Ativa' : 'Aguardando Pagamento'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cadastrada em</Label>
                  <p className="font-medium">{formatDate(detailsDialog.academia.createdAt)}</p>
                </div>
              </div>
              
              {detailsDialog.academia.customPageRequested && (
                <div className="p-4 bg-muted rounded-lg">
                  <Label className="text-muted-foreground">Página Personalizada</Label>
                  <p className="font-medium">
                    {detailsDialog.academia.customPageUrl || 'Solicitada - Aguardando criação'}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcademiasManagement;
