import { useState } from 'react';
import { Eye, MessageCircle, Clock, CheckCircle, Loader2, Upload, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { getSubmissionsByPersonal, students as allStudents } from '@/data/mockData';
import { FormSubmission } from '@/types';

const PersonalRequestsList = () => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);
  const [attendingSubmission, setAttendingSubmission] = useState<FormSubmission | null>(null);

  // Form for creating workout plan
  const [workoutForm, setWorkoutForm] = useState({
    trainingType: '',
    muscleSplit: '',
    personalNotes: '',
    textContent: '',
    fileType: 'text' as 'text' | 'pdf' | 'image'
  });

  if (!user || !tenant) return null;

  const submissions = getSubmissionsByPersonal(user.id);

  const filteredSubmissions = submissions.filter(s => 
    selectedStatus === 'all' || s.status === selectedStatus
  );

  const getStudentName = (studentId: string) => {
    return allStudents.find(s => s.id === studentId)?.name || 'N/A';
  };

  const getStudentWhatsapp = (studentId: string) => {
    return allStudents.find(s => s.id === studentId)?.whatsapp || '';
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

  const handleAttend = () => {
    if (!attendingSubmission) return;

    const studentWhatsapp = getStudentWhatsapp(attendingSubmission.studentId);
    const studentName = getStudentName(attendingSubmission.studentId);
    const downloadLink = `https://example.com/ficha-${Date.now().toString(36)}`;

    const message = `Olá ${studentName}! 🏋️\n\nSua ficha de treino está pronta!\n\n📋 Tipo: ${workoutForm.trainingType}\n💪 Divisão: ${workoutForm.muscleSplit}\n\n📥 Baixe sua ficha aqui: ${downloadLink}\n\nQualquer dúvida, estou à disposição!\n\n- ${user.name}, ${tenant.name}`;

    toast({
      title: 'Ficha enviada!',
      description: `A ficha de ${studentName} foi criada e o link será enviado via WhatsApp.`,
    });

    // Open WhatsApp
    const url = `https://wa.me/${studentWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    setAttendingSubmission(null);
    setWorkoutForm({
      trainingType: '',
      muscleSplit: '',
      personalNotes: '',
      textContent: '',
      fileType: 'text'
    });
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Solicitações</h1>
        <p className="text-muted-foreground">
          Gerencie as solicitações de ficha dos seus alunos
          {pendingCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </Badge>
          )}
        </p>
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

      {/* Requests List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center bg-secondary text-secondary-foreground font-bold">
                    {getStudentName(submission.studentId).charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {getStudentName(submission.studentId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {submission.objective || 'Objetivo não informado'} • {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(submission.status)}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingSubmission(submission)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>

                  {submission.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => setAttendingSubmission(submission)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Atender
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const url = `https://wa.me/${getStudentWhatsapp(submission.studentId).replace(/\D/g, '')}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredSubmissions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma solicitação encontrada
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Submission Dialog */}
      <Dialog open={!!viewingSubmission} onOpenChange={(open) => !open && setViewingSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações do formulário enviado pelo aluno
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

      {/* Attend Request Dialog */}
      <Dialog open={!!attendingSubmission} onOpenChange={(open) => !open && setAttendingSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Ficha de Treino</DialogTitle>
            <DialogDescription>
              Crie a ficha para {attendingSubmission && getStudentName(attendingSubmission.studentId)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Treino</Label>
                <Select
                  value={workoutForm.trainingType}
                  onValueChange={(value) => setWorkoutForm({ ...workoutForm, trainingType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABC">ABC</SelectItem>
                    <SelectItem value="ABCD">ABCD</SelectItem>
                    <SelectItem value="ABCDE">ABCDE</SelectItem>
                    <SelectItem value="Full Body">Full Body</SelectItem>
                    <SelectItem value="Upper/Lower">Upper/Lower</SelectItem>
                    <SelectItem value="Push/Pull/Legs">Push/Pull/Legs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Divisão Muscular</Label>
                <Input
                  value={workoutForm.muscleSplit}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, muscleSplit: e.target.value })}
                  placeholder="Ex: A: Peito/Tríceps, B: Costas/Bíceps..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações do Personal</Label>
              <Textarea
                value={workoutForm.personalNotes}
                onChange={(e) => setWorkoutForm({ ...workoutForm, personalNotes: e.target.value })}
                placeholder="Observações importantes para o aluno..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo da Ficha</Label>
              <Textarea
                value={workoutForm.textContent}
                onChange={(e) => setWorkoutForm({ ...workoutForm, textContent: e.target.value })}
                placeholder="Digite aqui a ficha de treino completa..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Ou faça upload de arquivo (Mock)</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline" disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PDF
                </Button>
                <Button variant="outline" disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Imagem
                </Button>
                <span className="text-xs text-muted-foreground">(Apenas demonstração)</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAttendingSubmission(null)}>
              Cancelar
            </Button>
            <Button onClick={handleAttend}>
              <Send className="mr-2 h-4 w-4" />
              Enviar via WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalRequestsList;
