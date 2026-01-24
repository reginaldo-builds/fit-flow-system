import { Check, X, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { plans, academias } from '@/data/mockData';

const PlanosManagement = () => {
  const getAcademiasCount = (planId: string) => {
    return academias.filter(a => a.planId === planId).length;
  };

  const features = [
    { key: 'painelGerente', label: 'Painel do Gerente' },
    { key: 'painelPersonal', label: 'Painel do Personal' },
    { key: 'painelAluno', label: 'Painel do Aluno' },
    { key: 'maxPersonals', label: 'Limite de Personais', isNumber: true },
    { key: 'alunosIlimitados', label: 'Alunos Ilimitados' },
    { key: 'whatsapp', label: 'Integração WhatsApp' },
    { key: 'formulario', label: 'Formulário de Solicitação' },
    { key: 'customFields', label: 'Campos Adicionais' },
    { key: 'charts', label: 'Gráficos Inteligentes' },
    { key: 'shop', label: 'Lojinha de Produtos' },
    { key: 'customPage', label: 'Página de Planos Academia' },
  ];

  const planFeatures: Record<string, Record<string, boolean | number | string>> = {
    master: {
      painelGerente: true,
      painelPersonal: true,
      painelAluno: true,
      maxPersonals: 1,
      alunosIlimitados: true,
      whatsapp: true,
      formulario: true,
      customFields: false,
      charts: false,
      shop: false,
      customPage: false,
    },
    premium: {
      painelGerente: true,
      painelPersonal: true,
      painelAluno: true,
      maxPersonals: 3,
      alunosIlimitados: true,
      whatsapp: true,
      formulario: true,
      customFields: true,
      charts: true,
      shop: false,
      customPage: false,
    },
    elite: {
      painelGerente: true,
      painelPersonal: true,
      painelAluno: true,
      maxPersonals: 10,
      alunosIlimitados: true,
      whatsapp: true,
      formulario: true,
      customFields: true,
      charts: true,
      shop: true,
      customPage: true,
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Planos do Sistema</h1>
        <p className="text-muted-foreground">
          Configuração de planos e funcionalidades disponíveis
        </p>
      </div>

      {/* Cards de Planos */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const count = getAcademiasCount(plan.id);
          
          return (
            <Card 
              key={plan.id}
              className={`relative ${
                plan.name === 'elite' ? 'border-primary' : ''
              }`}
            >
              {plan.name === 'elite' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Mais Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.displayName}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    R$ {plan.priceMonthly.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ou R$ {plan.priceYearly.toLocaleString('pt-BR')}/ano
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-muted rounded-lg">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{count}</strong> academia{count !== 1 ? 's' : ''} neste plano
                  </span>
                </div>
                
                <div className="space-y-3">
                  {features.map((feature) => {
                    const value = planFeatures[plan.name][feature.key];
                    const isEnabled = feature.isNumber ? true : value;
                    
                    return (
                      <div key={feature.key} className="flex items-center gap-2">
                        {isEnabled ? (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${!isEnabled ? 'text-muted-foreground' : ''}`}>
                          {feature.label}
                          {feature.isNumber && (
                            <span className="font-semibold"> ({value})</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabela Comparativa */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativo de Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Funcionalidade</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-3 px-4">
                      {plan.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.key} className="border-b last:border-0">
                    <td className="py-3 px-4">{feature.label}</td>
                    {plans.map((plan) => {
                      const value = planFeatures[plan.name][feature.key];
                      
                      return (
                        <td key={plan.id} className="text-center py-3 px-4">
                          {feature.isNumber ? (
                            <span className="font-semibold">{value}</span>
                          ) : value ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanosManagement;
