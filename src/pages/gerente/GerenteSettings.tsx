import { useState } from 'react';
import { Settings, FileText, Shield, Image, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { plans } from '@/data/mockData';

const GerenteSettings = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();

  const [academiaData, setAcademiaData] = useState({
    name: tenant?.name || '',
    whatsapp: tenant?.whatsapp || '',
    email: tenant?.email || '',
    logo: tenant?.logo || ''
  });

  const [termsData, setTermsData] = useState({
    termsOfUse: tenant?.termsOfUse || '',
    privacyPolicy: tenant?.privacyPolicy || ''
  });

  if (!tenant) return null;

  const plan = plans.find(p => p.id === tenant.planId);

  const handleSaveInfo = () => {
    toast({
      title: 'Informações atualizadas',
      description: 'As informações da academia foram salvas.',
    });
  };

  const handleSaveTerms = () => {
    toast({
      title: 'Termos atualizados',
      description: 'Os termos de uso e política de privacidade foram salvos.',
    });
  };

  const handleRequestCustomPage = () => {
    toast({
      title: 'Solicitação enviada',
      description: 'Sua solicitação de página personalizada foi enviada. Entraremos em contato.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Configure sua academia e personalize a experiência
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

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">
            <Settings className="mr-2 h-4 w-4" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="terms">
            <FileText className="mr-2 h-4 w-4" />
            Termos e Políticas
          </TabsTrigger>
          <TabsTrigger value="plan">
            <Crown className="mr-2 h-4 w-4" />
            Plano
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Academia</CardTitle>
              <CardDescription>
                Dados básicos da sua academia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nome da Academia</Label>
                  <Input
                    id="name"
                    value={academiaData.name}
                    onChange={(e) => setAcademiaData({ ...academiaData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={tenant.slug}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    O slug não pode ser alterado
                  </p>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={academiaData.email}
                    onChange={(e) => setAcademiaData({ ...academiaData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={academiaData.whatsapp}
                    onChange={(e) => setAcademiaData({ ...academiaData, whatsapp: e.target.value })}
                    placeholder="+5588999999999"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="logo">URL do Logo</Label>
                <div className="flex gap-2">
                  <Input
                    id="logo"
                    value={academiaData.logo}
                    onChange={(e) => setAcademiaData({ ...academiaData, logo: e.target.value })}
                    placeholder="https://..."
                  />
                  <Button variant="outline">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={handleSaveInfo}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Termos de Uso
              </CardTitle>
              <CardDescription>
                Termos que o aluno deve aceitar ao preencher o formulário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={termsData.termsOfUse}
                onChange={(e) => setTermsData({ ...termsData, termsOfUse: e.target.value })}
                placeholder="# Termos de Uso

1. Ao utilizar nossos serviços...
2. ..."
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Suporta formatação Markdown
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Política de Privacidade (LGPD)
              </CardTitle>
              <CardDescription>
                Política de proteção de dados pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={termsData.privacyPolicy}
                onChange={(e) => setTermsData({ ...termsData, privacyPolicy: e.target.value })}
                placeholder="# Política de Privacidade

## 1. Coleta de Dados
Coletamos os seguintes dados pessoais...

## 2. Uso dos Dados
..."
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Suporta formatação Markdown
              </p>
              <Button onClick={handleSaveTerms}>
                Salvar Termos e Políticas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seu Plano Atual</CardTitle>
              <CardDescription>
                Detalhes do plano {plan?.displayName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Badge 
                    variant={
                      plan?.name === 'elite' ? 'default' :
                      plan?.name === 'premium' ? 'secondary' :
                      'outline'
                    }
                    className="mb-2"
                  >
                    {plan?.displayName}
                  </Badge>
                  <p className="text-2xl font-bold">
                    R$ {plan?.priceMonthly.toFixed(2)}/mês
                  </p>
                </div>
                {plan?.name !== 'elite' && (
                  <Button>Fazer Upgrade</Button>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Funcionalidades do seu plano:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge variant="default" className="w-3 h-3 p-0" />
                    Até {plan?.maxPersonals} personal(is)
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="default" className="w-3 h-3 p-0" />
                    Alunos ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="default" className="w-3 h-3 p-0" />
                    Integração WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge 
                      variant={plan?.features.customFields ? 'default' : 'secondary'} 
                      className="w-3 h-3 p-0" 
                    />
                    <span className={!plan?.features.customFields ? 'text-muted-foreground' : ''}>
                      Campos personalizados
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge 
                      variant={plan?.features.charts ? 'default' : 'secondary'} 
                      className="w-3 h-3 p-0" 
                    />
                    <span className={!plan?.features.charts ? 'text-muted-foreground' : ''}>
                      Gráficos de evolução
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge 
                      variant={plan?.features.shop ? 'default' : 'secondary'} 
                      className="w-3 h-3 p-0" 
                    />
                    <span className={!plan?.features.shop ? 'text-muted-foreground' : ''}>
                      Lojinha de produtos
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge 
                      variant={plan?.features.customPage ? 'default' : 'secondary'} 
                      className="w-3 h-3 p-0" 
                    />
                    <span className={!plan?.features.customPage ? 'text-muted-foreground' : ''}>
                      Página personalizada
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {plan?.features.customPage && !tenant.customPageUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Página Personalizada</CardTitle>
                <CardDescription>
                  Solicite uma página exclusiva para divulgar sua academia
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tenant.customPageRequested ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <Badge variant="secondary">Solicitação em andamento</Badge>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nossa equipe entrará em contato para criar sua página personalizada.
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleRequestCustomPage}>
                    Solicitar Página Personalizada
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenteSettings;
