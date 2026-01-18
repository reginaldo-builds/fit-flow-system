import { useState } from 'react';
import { FileText, Download, Calendar, User, Clock, TrendingUp, History, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { 
  students as allStudents, 
  getWorkoutPlansByStudent,
  getSubmissionsByStudent,
  getEvolutionsByStudent,
  users
} from '@/data/mockData';
import EvolutionCharts from '@/components/student/EvolutionCharts';
import FormHistory from '@/components/student/FormHistory';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || !tenant) return null;

  // Find student by user email/whatsapp (in real app, this would be properly linked)
  const student = allStudents.find(s => 
    s.tenantId === tenant.id && 
    (s.email === user.email || s.name === user.name)
  );

  const workoutPlans = student ? getWorkoutPlansByStudent(student.id) : [];
  const submissions = student ? getSubmissionsByStudent(student.id) : [];
  const evolutions = student ? getEvolutionsByStudent(student.id) : [];
  
  // Get current/pending submissions
  const currentSubmission = submissions.find(s => s.status === 'pending' || s.status === 'in_progress');
  const completedSubmissions = submissions.filter(s => s.status === 'completed');

  const getPersonalName = (personalId: string) => {
    return users.find(u => u.id === personalId)?.name || 'N/A';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleUpdateForm = (submissionId: string) => {
    toast.info('Redirecionando para atualização do formulário...');
    // In a real app, navigate to form with pre-filled data
    navigate(`/${tenant.slug}/student/request?update=${submissionId}`);
  };

  const handleNewRequest = () => {
    const personal = student ? users.find(u => u.id === student.personalId) : null;
    if (personal) {
      navigate(`/${tenant.slug}/form/${personal.id}`);
    } else {
      navigate(`/${tenant.slug}/student/request`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minha Área</h1>
        <p className="text-muted-foreground">
          Acompanhe suas fichas, histórico e evolução
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="evolution" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Evolução</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Request Status */}
          {currentSubmission && (
            <Card className="border-chart-3">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-chart-3" />
                  Solicitação em Andamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{currentSubmission.objective || 'Ficha de Treino'}</p>
                    <p className="text-sm text-muted-foreground">
                      Personal: {getPersonalName(currentSubmission.personalId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Período: {formatDate(currentSubmission.periodStart)} - {formatDate(currentSubmission.periodEnd)}
                    </p>
                  </div>
                  <Badge variant={currentSubmission.status === 'pending' ? 'destructive' : 'secondary'}>
                    {currentSubmission.status === 'pending' ? 'Aguardando' : 'Em Produção'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Formulários Enviados</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedSubmissions.length} concluídos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fichas Recebidas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutPlans.length}</div>
                <p className="text-xs text-muted-foreground">
                  disponíveis para download
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evolução</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{evolutions.length}</div>
                <p className="text-xs text-muted-foreground">
                  registros de acompanhamento
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Workout Plans */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Minhas Fichas de Treino
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {workoutPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {plan.trainingType || 'Ficha de Treino'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.muscleSplit}
                        </p>
                      </div>
                      <Badge>Ativa</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{getPersonalName(plan.personalId)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(plan.createdAt)}</span>
                      </div>
                    </div>

                    {plan.validUntil && (
                      <p className="text-sm text-muted-foreground">
                        Válida até: {formatDate(plan.validUntil)}
                      </p>
                    )}

                    {plan.personalNotes && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Observações:</p>
                        <p className="text-sm text-muted-foreground">{plan.personalNotes}</p>
                      </div>
                    )}

                    {plan.textContent && (
                      <div className="p-3 bg-card border border-border rounded-lg max-h-48 overflow-y-auto">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {plan.textContent}
                        </pre>
                      </div>
                    )}

                    {plan.downloadLink && (
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar Ficha
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {workoutPlans.length === 0 && !currentSubmission && (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Nenhuma ficha disponível</h3>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não possui fichas de treino. Faça uma solicitação ao seu personal.
                  </p>
                  <Button onClick={handleNewRequest}>
                    Solicitar Nova Ficha
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Formulários
            </h2>
            <Button onClick={handleNewRequest} size="sm">
              Novo Formulário
            </Button>
          </div>
          
          <FormHistory 
            submissions={submissions} 
            onUpdateForm={handleUpdateForm}
          />
        </TabsContent>

        {/* Evolution Tab */}
        <TabsContent value="evolution" className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Minha Evolução
          </h2>
          
          <EvolutionCharts evolutions={evolutions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
