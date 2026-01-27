import { Building2, DollarSign, Ban, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { academias, plans, users } from '@/data/mockData';

const SystemAdminDashboard = () => {
  const academiasAtivas = academias.filter(a => a.isActive && !a.blocked);
  const academiasBloqueadas = academias.filter(a => a.blocked);
  
  const porPlano = plans.map(plan => ({
    plan: plan.name,
    displayName: plan.displayName,
    count: academias.filter(a => a.planId === plan.id).length
  }));
  
  // Simular receita mensal
  const receitaMes = academias.reduce((total, academia) => {
    const plan = plans.find(p => p.id === academia.planId);
    return total + (plan?.priceMonthly || 0);
  }, 0);

  const stats = [
    {
      title: 'Total de Academias',
      value: academias.length,
      icon: Building2,
      color: 'text-chart-1'
    },
    {
      title: 'Academias Ativas',
      value: academiasAtivas.length,
      icon: CheckCircle,
      color: 'text-chart-2'
    },
    {
      title: 'Bloqueadas',
      value: academiasBloqueadas.length,
      icon: Ban,
      color: 'text-destructive'
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${receitaMes.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-chart-4'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin do Sistema</h1>
        <p className="text-muted-foreground">
          Visão geral de todas as academias do Ficha.Life
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
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribuição por Plano */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Distribuição por Plano
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
                        item.plan === 'premium' ? 'secondary' :
                        'outline'
                      }
                    >
                      {item.displayName}
                    </Badge>
                  </div>
                  <span className="text-xl font-bold text-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Academias Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academias Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {academias.slice(0, 5).map((academia) => {
                const gerente = users.find(u => 
                  u.academiaId === academia.id && u.role === 'gerente'
                );
                const plan = plans.find(p => p.id === academia.planId);
                
                return (
                  <div 
                    key={academia.id} 
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {academia.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        /{academia.slug} • {gerente?.email || 'Sem gerente'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {plan?.displayName || 'N/A'}
                      </Badge>
                      {academia.blocked ? (
                        <Badge variant="destructive">Bloqueada</Badge>
                      ) : academia.isActive ? (
                        <Badge variant="default">Ativa</Badge>
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
    </div>
  );
};

export default SystemAdminDashboard;
