import { Users, UserCog, ClipboardList, CheckCircle, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getPersonalsByAcademia, 
  getStudentsByAcademia, 
  getSubmissionsByAcademia,
  plans
} from '@/data/mockData';

const GerenteDashboard = () => {
  const { tenant } = useTenant();
  const { user } = useAuth();

  if (!tenant) return null;

  const plan = plans.find(p => p.id === tenant.planId);
  const personals = getPersonalsByAcademia(tenant.id);
  const students = getStudentsByAcademia(tenant.id);
  const submissions = getSubmissionsByAcademia(tenant.id);

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const completedThisMonth = submissions.filter(s => {
    const date = new Date(s.updatedAt);
    const now = new Date();
    return s.status === 'completed' && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear();
  });

  const stats = [
    {
      title: 'Personais',
      value: `${personals.length}/${plan?.maxPersonals || 0}`,
      icon: UserCog,
      color: 'text-chart-1'
    },
    {
      title: 'Total de Alunos',
      value: students.length,
      icon: Users,
      color: 'text-chart-2'
    },
    {
      title: 'Solicitações Pendentes',
      value: pendingSubmissions.length,
      icon: ClipboardList,
      color: 'text-chart-3',
      badge: pendingSubmissions.length > 0
    },
    {
      title: 'Concluídas (Mês)',
      value: completedThisMonth.length,
      icon: CheckCircle,
      color: 'text-chart-4'
    }
  ];

  // Funcionalidades do plano
  const hasCustomFields = plan?.features.customFields;
  const hasCharts = plan?.features.charts;
  const hasShop = plan?.features.shop;
  const hasCustomPage = plan?.features.customPage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard do Gerente</h1>
          <p className="text-muted-foreground">
            Bem-vindo(a), {user?.name} - {tenant.name}
          </p>
        </div>
        <Badge 
          variant={
            plan?.name === 'elite' ? 'default' :
            plan?.name === 'premium' ? 'secondary' :
            'outline'
          }
          className="flex items-center gap-1"
        >
          <Crown className="h-3 w-3" />
          Plano {plan?.displayName}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.badge && (
                  <Badge variant="destructive" className="text-xs">
                    Pendente
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Equipe de Personais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personals.map((personal) => {
                const personalStudents = students.filter(s => s.personalId === personal.id);
                const personalPending = submissions.filter(
                  s => s.personalId === personal.id && s.status === 'pending'
                );
                
                return (
                  <div 
                    key={personal.id} 
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-secondary text-secondary-foreground font-medium">
                        {personal.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {personal.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {personalStudents.length} alunos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {personal.canDeleteStudents && (
                        <Badge variant="outline" className="text-xs">Pode deletar</Badge>
                      )}
                      {personal.canCreateCustomFields && hasCustomFields && (
                        <Badge variant="outline" className="text-xs">Campos</Badge>
                      )}
                      {personalPending.length > 0 && (
                        <Badge variant="destructive">
                          {personalPending.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
              {personals.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum personal cadastrado
                </p>
              )}
              {personals.length < (plan?.maxPersonals || 0) && (
                <Button variant="outline" className="w-full">
                  Adicionar Personal
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Funcionalidades do Plano */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades do Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Campos Personalizados</span>
                {hasCustomFields ? (
                  <Badge variant="default">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Indisponível</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Gráficos de Evolução</span>
                {hasCharts ? (
                  <Badge variant="default">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Indisponível</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Lojinha de Produtos</span>
                {hasShop ? (
                  <Badge variant="default">Ativo</Badge>
                ) : (
                  <Badge variant="secondary">Indisponível</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Página Personalizada</span>
                {hasCustomPage ? (
                  tenant.customPageUrl ? (
                    <Badge variant="default">Configurado</Badge>
                  ) : tenant.customPageRequested ? (
                    <Badge variant="secondary">Solicitado</Badge>
                  ) : (
                    <Button variant="outline" size="sm">Solicitar</Button>
                  )
                ) : (
                  <Badge variant="secondary">Indisponível</Badge>
                )}
              </div>
              
              {plan?.name !== 'elite' && (
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    Fazer Upgrade do Plano
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Solicitações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.slice(0, 5).map((submission) => {
              const student = students.find(s => s.id === submission.studentId);
              const personal = personals.find(p => p.id === submission.personalId);
              
              return (
                <div 
                  key={submission.id} 
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {student?.name || 'Aluno'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Personal: {personal?.name || 'N/A'}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      submission.status === 'pending' ? 'destructive' :
                      submission.status === 'in_progress' ? 'secondary' :
                      'default'
                    }
                  >
                    {submission.status === 'pending' ? 'Pendente' :
                     submission.status === 'in_progress' ? 'Em Produção' :
                     'Concluída'}
                  </Badge>
                </div>
              );
            })}
            {submissions.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma solicitação ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenteDashboard;
