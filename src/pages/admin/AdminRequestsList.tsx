import { useState } from 'react';
import { Eye, MessageCircle, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenant } from '@/contexts/TenantContext';
import { getSubmissionsByTenant, getStudentsByTenant, getPersonalsByTenant } from '@/data/mockData';
import { FormSubmission } from '@/types';

const AdminRequestsList = () => {
  const { tenant } = useTenant();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);

  if (!tenant) return null;

  const submissions = getSubmissionsByTenant(tenant.id);
  const students = getStudentsByTenant(tenant.id);
  const personals = getPersonalsByTenant(tenant.id);

  const filteredSubmissions = submissions.filter(s => 
    selectedStatus === 'all' || s.status === selectedStatus
  );

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'N/A';
  };

  const getPersonalName = (personalId: string) => {
    return personals.find(p => p.id === personalId)?.name || 'N/A';
  };

  const getStudentWhatsapp = (studentId: string) => {
    return students.find(s => s.id === studentId)?.whatsapp || '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive"><Clock className="mr-1 h-3 w-3" /> Pendente</Badge>;
      case 'in_progress':
        return <Badge variant="secondary"><Loader2 className="mr-1 h-3 w-3" /> Em Produção</Badge>;
      case 'completed':
        return <Badge><CheckCircle className="mr-1 h-3 w-3" /> Concluída</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const inProgressCount = submissions.filter(s => s.status === 'in_progress').length;
  const completedCount = submissions.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Solicitações</h1>
        <p className="text-muted-foreground">
          Visualize todas as solicitações de ficha da academia
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">{inProgressCount}</div>
            <p className="text-sm text-muted-foreground">Em Produção</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{completedCount}</div>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="in_progress">Em Produção</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Personal</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {getStudentName(submission.studentId)}
                  </TableCell>
                  <TableCell>{getPersonalName(submission.personalId)}</TableCell>
                  <TableCell>{submission.objective || 'N/A'}</TableCell>
                  <TableCell>{formatDate(submission.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <a
                        href={`https://wa.me/${getStudentWhatsapp(submission.studentId).replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSubmissions.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma solicitação encontrada
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Dialog */}
      <Dialog open={!!viewingSubmission} onOpenChange={(open) => !open && setViewingSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas do formulário enviado
            </DialogDescription>
          </DialogHeader>
          {viewingSubmission && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="health">Saúde</TabsTrigger>
                <TabsTrigger value="habits">Hábitos</TabsTrigger>
                <TabsTrigger value="preferences">Preferências</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Aluno</p>
                    <p className="font-medium">{getStudentName(viewingSubmission.studentId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Personal</p>
                    <p className="font-medium">{getPersonalName(viewingSubmission.personalId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objetivo</p>
                    <p className="font-medium">{viewingSubmission.objective || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experiência</p>
                    <p className="font-medium">{viewingSubmission.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frequência Semanal</p>
                    <p className="font-medium">{viewingSubmission.weeklyFrequency || 'N/A'}x</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo Disponível</p>
                    <p className="font-medium">{viewingSubmission.availableTime || 'N/A'} min</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Lesões</p>
                    <p className="font-medium">{viewingSubmission.injuries || 'Nenhuma'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doenças</p>
                    <p className="font-medium">{viewingSubmission.diseases || 'Nenhuma'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Medicamentos</p>
                    <p className="font-medium">{viewingSubmission.medications || 'Nenhum'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cirurgias</p>
                    <p className="font-medium">{viewingSubmission.surgeries || 'Nenhuma'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pontos de Dor</p>
                    <p className="font-medium">{viewingSubmission.painPoints || 'Nenhum'}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="habits" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nível de Atividade</p>
                    <p className="font-medium">{viewingSubmission.activityLevel || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profissão</p>
                    <p className="font-medium">{viewingSubmission.profession || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horas de Sono</p>
                    <p className="font-medium">{viewingSubmission.sleepHours || 'N/A'}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nutricionista</p>
                    <p className="font-medium">{viewingSubmission.hasNutritionist ? 'Sim' : 'Não'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Consumo de Água</p>
                    <p className="font-medium">{viewingSubmission.waterIntake || 'N/A'}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Horário Preferido</p>
                    <p className="font-medium">{viewingSubmission.preferredTime || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Local de Treino</p>
                    <p className="font-medium">{viewingSubmission.trainingLocation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exercícios que Gosta</p>
                    <p className="font-medium">{viewingSubmission.likedExercises || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exercícios que Não Gosta</p>
                    <p className="font-medium">{viewingSubmission.dislikedExercises || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Observações Adicionais</p>
                    <p className="font-medium">{viewingSubmission.additionalNotes || 'N/A'}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequestsList;
