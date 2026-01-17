import { FileText, Download, Calendar, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { 
  students as allStudents, 
  getWorkoutPlansByStudent,
  getSubmissionsByPersonal,
  users
} from '@/data/mockData';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { tenant } = useTenant();

  if (!user || !tenant) return null;

  // Find student by user email/whatsapp (in real app, this would be properly linked)
  const student = allStudents.find(s => 
    s.tenantId === tenant.id && 
    (s.email === user.email || s.name === user.name)
  );

  const workoutPlans = student ? getWorkoutPlansByStudent(student.id) : [];
  
  // Get pending requests for this student
  const allSubmissions = users
    .filter(u => u.tenantId === tenant.id && u.role === 'personal')
    .flatMap(p => getSubmissionsByPersonal(p.id))
    .filter(s => student && s.studentId === student.id);

  const pendingRequests = allSubmissions.filter(s => s.status === 'pending' || s.status === 'in_progress');

  const getPersonalName = (personalId: string) => {
    return users.find(u => u.id === personalId)?.name || 'N/A';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minhas Fichas</h1>
        <p className="text-muted-foreground">
          Visualize suas fichas de treino e solicitações
        </p>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card className="border-chart-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-chart-3" />
              Solicitações em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{request.objective || 'Ficha de Treino'}</p>
                    <p className="text-sm text-muted-foreground">
                      Personal: {getPersonalName(request.personalId)}
                    </p>
                  </div>
                  <Badge variant={request.status === 'pending' ? 'destructive' : 'secondary'}>
                    {request.status === 'pending' ? 'Aguardando' : 'Em Produção'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Plans */}
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

      {workoutPlans.length === 0 && pendingRequests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhuma ficha disponível</h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não possui fichas de treino. Faça uma solicitação ao seu personal.
            </p>
            <Button onClick={() => window.location.href = `/${tenant.slug}/student/request`}>
              Solicitar Nova Ficha
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentDashboard;
