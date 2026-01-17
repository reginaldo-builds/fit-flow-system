import { Users, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStudentsByPersonal, 
  getSubmissionsByPersonal,
  students as allStudents
} from '@/data/mockData';

const PersonalDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const myStudents = getStudentsByPersonal(user.id);
  const submissions = getSubmissionsByPersonal(user.id);

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const inProgressSubmissions = submissions.filter(s => s.status === 'in_progress');
  const completedThisMonth = submissions.filter(s => {
    const date = new Date(s.updatedAt);
    const now = new Date();
    return s.status === 'completed' && 
      date.getMonth() === now.getMonth() && 
      date.getFullYear() === now.getFullYear();
  });

  const stats = [
    {
      title: 'Meus Alunos',
      value: myStudents.length,
      icon: Users,
      color: 'text-chart-1'
    },
    {
      title: 'Pendentes',
      value: pendingSubmissions.length,
      icon: Clock,
      color: 'text-destructive',
      badge: pendingSubmissions.length > 0
    },
    {
      title: 'Em Produção',
      value: inProgressSubmissions.length,
      icon: ClipboardList,
      color: 'text-chart-3'
    },
    {
      title: 'Concluídas (Mês)',
      value: completedThisMonth.length,
      icon: CheckCircle,
      color: 'text-chart-4'
    }
  ];

  const getStudentName = (studentId: string) => {
    return allStudents.find(s => s.id === studentId)?.name || 'N/A';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a), {user.name}!
        </p>
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
                    Atenção
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-destructive" />
              Solicitações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingSubmissions.slice(0, 5).map((submission) => (
                <div 
                  key={submission.id} 
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {getStudentName(submission.studentId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {submission.objective || 'Objetivo não informado'}
                    </p>
                  </div>
                  <Badge variant="destructive">Pendente</Badge>
                </div>
              ))}
              {pendingSubmissions.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma solicitação pendente 🎉
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Students */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-chart-1" />
              Meus Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myStudents.slice(0, 5).map((student) => {
                const studentSubmissions = submissions.filter(s => s.studentId === student.id);
                const hasPending = studentSubmissions.some(s => s.status === 'pending');
                
                return (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center bg-secondary text-secondary-foreground font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {student.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.whatsapp}
                        </p>
                      </div>
                    </div>
                    {hasPending && (
                      <Badge variant="destructive">Pendente</Badge>
                    )}
                  </div>
                );
              })}
              {myStudents.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum aluno cadastrado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalDashboard;
