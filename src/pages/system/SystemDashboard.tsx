import { Building2, CreditCard, Ban, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { academias, plans } from '@/data/mockData';

const SystemDashboard = () => {
  const navigate = useNavigate();

  // Stats do sistema
  const totalAcademias = academias.length;
  const academiasAtivas = academias.filter(a => a.isActive && !a.blocked).length;
  const academiasBloqueadas = academias.filter(a => a.blocked).length;
  const academiasInativas = academias.filter(a => !a.isActive).length;

  // Receita simulada do mês
  const receitaMes = academias.reduce((acc, a) => {
    const plan = plans.find(p => p.id === a.planId);
    return acc + (plan?.priceMonthly || 0);
  }, 0);

  // Academias por plano
  const porPlano = plans.map(plan => ({
    plan: plan.name,
    displayName: plan.displayName,
    count: academias.filter(a => a.planId === plan.id).length
  }));

  const stats = [
    {
      title: 'Total de Academias',
      value: totalAcademias,
      icon: Building2,
      color: 'text-chart-1',
      description: `${academiasAtivas} ativas`
    },
    {
      title: 'Academias Ativas',
      value: academiasAtivas,
      icon: CheckCircle,
      color: 'text-chart-2'
    },
    {
      title: 'Academias Bloqueadas',
      value: academiasBloqueadas,
      icon: Ban,
      color: 'text-destructive',
      badge: academiasBloqueadas > 0
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${receitaMes.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      color: 'text-chart-4'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>
        <p className="text-muted-foreground">
          Gestão global do sistema Ficha.Life
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
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Academias por Plano */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Academias por Plano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {porPlano.map((item) => (
                <div key={item.plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        item.plan === 'elite' ? 'default' :
                        item.plan === 'premium' ? 'secondary' : 'outline'
                      }
                    >
                      {item.displayName}
                    </Badge>
                  </div>
                  <span className="text-lg font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Academias Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Academias Recentes
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin-system/academias')}>
              Ver Todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {academias.slice(0, 5).map((academia) => {
                const plan = plans.find(p => p.id === academia.planId);
                
                return (
                  <div 
                    key={academia.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-medium">
                        {academia.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{academia.name}</p>
                        <p className="text-sm text-muted-foreground">{academia.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{plan?.displayName}</Badge>
                      {academia.blocked ? (
                        <Badge variant="destructive">Bloqueada</Badge>
                      ) : academia.isActive ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inativa</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/admin-system/academias')}>
            <Building2 className="mr-2 h-4 w-4" />
            Gerenciar Academias
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin-system/planos')}>
            <CreditCard className="mr-2 h-4 w-4" />
            Ver Planos
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin-system/pagamentos')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Histórico de Pagamentos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemDashboard;
