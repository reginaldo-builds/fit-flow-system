import { CreditCard, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { plans, academias } from '@/data/mockData';

const SystemPlans = () => {
  const getAcademiaCount = (planId: string) => {
    return academias.filter(a => a.planId === planId).length;
  };

  const featureLabels = {
    customFields: 'Campos Personalizados',
    charts: 'Gráficos de Evolução',
    shop: 'Lojinha de Produtos',
    customPage: 'Página Personalizada'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Planos</h1>
        <p className="text-muted-foreground">
          Visualize os planos disponíveis e suas funcionalidades
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={plan.name === 'elite' ? 'border-primary border-2' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={
                    plan.name === 'elite' ? 'default' :
                    plan.name === 'premium' ? 'secondary' :
                    'outline'
                  }
                >
                  {plan.displayName}
                </Badge>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl">
                R$ {plan.priceMonthly.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground">/mês</span>
              </CardTitle>
              <CardDescription>
                ou R$ {plan.priceYearly.toFixed(2)}/ano
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-muted-foreground">Academias neste plano</p>
                <p className="text-2xl font-bold">{getAcademiaCount(plan.id)}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Limite de Personais</p>
                <p className="text-lg font-bold">{plan.maxPersonals}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Funcionalidades</p>
                <ul className="space-y-2">
                  {Object.entries(plan.features).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2 text-sm">
                      {value ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={!value ? 'text-muted-foreground' : ''}>
                        {featureLabels[key as keyof typeof featureLabels]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium">Incluído em todos:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    Painel do Gerente
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    Painel do Personal
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    Painel do Aluno
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    Alunos ilimitados
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    Integração WhatsApp
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    Formulário de Solicitação
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info sobre Página Personalizada */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre Página Personalizada (Elite)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Quando uma academia contrata o plano Elite, ela pode solicitar uma página personalizada.
            Ao receber a solicitação, você entrará em contato com a academia para criar a página
            e enviar o link para ela.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Academias com solicitação pendente:</p>
            <p className="text-2xl font-bold mt-2">
              {academias.filter(a => a.planId === 'plan-elite' && a.customPageRequested).length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemPlans;
