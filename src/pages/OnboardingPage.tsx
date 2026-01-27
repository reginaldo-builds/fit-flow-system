import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Crown, Building2, CreditCard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { plans } from '@/data/mockData';

type Step = 'plan' | 'academia' | 'gerente' | 'payment';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('plan');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Plano
    planId: '',
    // Academia
    academiaName: '',
    academiaSlug: '',
    academiaEmail: '',
    academiaWhatsapp: '',
    // Gerente
    gerenteName: '',
    gerenteEmail: '',
    gerentePassword: '',
    gerentePasswordConfirm: '',
    // Pagamento
    paymentMethod: 'pix' as 'pix' | 'credit_card'
  });

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const selectedPlan = plans.find(p => p.id === formData.planId);

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'plan', label: 'Escolha o Plano', icon: <Crown className="h-4 w-4" /> },
    { key: 'academia', label: 'Dados da Academia', icon: <Building2 className="h-4 w-4" /> },
    { key: 'gerente', label: 'Conta do Gerente', icon: <Building2 className="h-4 w-4" /> },
    { key: 'payment', label: 'Pagamento', icon: <CreditCard className="h-4 w-4" /> }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const handleSlugChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, academiaSlug: slug });
    // Simular verificação
    if (slug.length >= 3) {
      setSlugAvailable(!['caxufit', 'profit', 'test'].includes(slug));
    } else {
      setSlugAvailable(null);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'plan':
        return !!formData.planId;
      case 'academia':
        return formData.academiaName && formData.academiaSlug && 
               formData.academiaEmail && formData.academiaWhatsapp && slugAvailable;
      case 'gerente':
        return formData.gerenteName && formData.gerenteEmail && 
               formData.gerentePassword && formData.gerentePassword === formData.gerentePasswordConfirm;
      case 'payment':
        return formData.paymentMethod;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const idx = currentStepIndex;
    if (idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1].key);
    }
  };

  const prevStep = () => {
    const idx = currentStepIndex;
    if (idx > 0) {
      setCurrentStep(steps[idx - 1].key);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simular chamada API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Cadastro realizado!',
      description: formData.paymentMethod === 'pix' 
        ? 'Escaneie o QR Code do Pix para ativar sua conta.'
        : 'Pagamento processado! Sua academia está ativa.',
    });
    
    setIsLoading(false);
    navigate(`/${formData.academiaSlug}/login`);
  };

  const featureLabels: Record<string, string> = {
    customFields: 'Campos Personalizados',
    charts: 'Gráficos de Evolução',
    shop: 'Lojinha de Produtos',
    customPage: 'Página Personalizada'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl text-foreground">Ficha.Life</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Voltar ao início
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${idx <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx < currentStepIndex ? 'bg-primary text-primary-foreground' :
                    idx === currentStepIndex ? 'border-2 border-primary' :
                    'border-2 border-muted'
                  }`}>
                    {idx < currentStepIndex ? <Check className="h-4 w-4" /> : step.icon}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${idx < currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 'plan' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Escolha seu plano</h1>
              <p className="text-muted-foreground mt-2">
                Selecione o plano ideal para sua academia
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    formData.planId === plan.id 
                      ? 'border-primary border-2 ring-2 ring-primary/20' 
                      : 'hover:border-primary/50'
                  } ${plan.name === 'elite' ? 'relative' : ''}`}
                  onClick={() => setFormData({ ...formData, planId: plan.id })}
                >
                  {plan.name === 'elite' && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <Badge 
                      variant={
                        plan.name === 'elite' ? 'default' :
                        plan.name === 'premium' ? 'secondary' :
                        'outline'
                      }
                      className="w-fit"
                    >
                      {plan.displayName}
                    </Badge>
                    <CardTitle className="text-2xl">
                      R$ {plan.priceMonthly.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        Até {plan.maxPersonals} personal(is)
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        Alunos ilimitados
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        Integração WhatsApp
                      </li>
                      {Object.entries(plan.features).map(([key, value]) => (
                        <li key={key} className={`flex items-center gap-2 text-sm ${!value ? 'text-muted-foreground' : ''}`}>
                          <Check className={`h-4 w-4 ${value ? 'text-green-600' : 'text-muted'}`} />
                          {featureLabels[key]}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'academia' && (
          <Card>
            <CardHeader>
              <CardTitle>Dados da Academia</CardTitle>
              <CardDescription>Informações básicas da sua academia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="academiaName">Nome da Academia</Label>
                <Input
                  id="academiaName"
                  value={formData.academiaName}
                  onChange={(e) => setFormData({ ...formData, academiaName: e.target.value })}
                  placeholder="Nome da sua academia"
                />
              </div>
              <div>
                <Label htmlFor="academiaSlug">Slug (URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">ficha.life/</span>
                  <Input
                    id="academiaSlug"
                    value={formData.academiaSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="sua-academia"
                    className="flex-1"
                  />
                </div>
                {formData.academiaSlug.length >= 3 && (
                  <p className={`text-sm mt-1 ${slugAvailable ? 'text-green-600' : 'text-destructive'}`}>
                    {slugAvailable ? '✓ Disponível!' : '✗ Já está em uso'}
                  </p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="academiaEmail">Email</Label>
                  <Input
                    id="academiaEmail"
                    type="email"
                    value={formData.academiaEmail}
                    onChange={(e) => setFormData({ ...formData, academiaEmail: e.target.value })}
                    placeholder="contato@academia.com"
                  />
                </div>
                <div>
                  <Label htmlFor="academiaWhatsapp">WhatsApp</Label>
                  <Input
                    id="academiaWhatsapp"
                    value={formData.academiaWhatsapp}
                    onChange={(e) => setFormData({ ...formData, academiaWhatsapp: e.target.value })}
                    placeholder="+5588999999999"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'gerente' && (
          <Card>
            <CardHeader>
              <CardTitle>Conta do Gerente</CardTitle>
              <CardDescription>Crie a conta de administrador da academia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gerenteName">Nome Completo</Label>
                <Input
                  id="gerenteName"
                  value={formData.gerenteName}
                  onChange={(e) => setFormData({ ...formData, gerenteName: e.target.value })}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <Label htmlFor="gerenteEmail">Email de Acesso</Label>
                <Input
                  id="gerenteEmail"
                  type="email"
                  value={formData.gerenteEmail}
                  onChange={(e) => setFormData({ ...formData, gerenteEmail: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="gerentePassword">Senha</Label>
                  <Input
                    id="gerentePassword"
                    type="password"
                    value={formData.gerentePassword}
                    onChange={(e) => setFormData({ ...formData, gerentePassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <Label htmlFor="gerentePasswordConfirm">Confirmar Senha</Label>
                  <Input
                    id="gerentePasswordConfirm"
                    type="password"
                    value={formData.gerentePasswordConfirm}
                    onChange={(e) => setFormData({ ...formData, gerentePasswordConfirm: e.target.value })}
                    placeholder="Repita a senha"
                  />
                </div>
              </div>
              {formData.gerentePassword && formData.gerentePasswordConfirm && 
               formData.gerentePassword !== formData.gerentePasswordConfirm && (
                <p className="text-sm text-destructive">As senhas não coincidem</p>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 'payment' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{formData.academiaName}</p>
                    <p className="text-sm text-muted-foreground">ficha.life/{formData.academiaSlug}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={selectedPlan?.name === 'elite' ? 'default' : 'secondary'}>
                      {selectedPlan?.displayName}
                    </Badge>
                    <p className="text-xl font-bold mt-1">
                      R$ {selectedPlan?.priceMonthly.toFixed(2)}/mês
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
                <CardDescription>Escolha como deseja pagar sua assinatura</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as 'pix' | 'credit_card' })}
                  className="space-y-4"
                >
                  <div className={`flex items-center space-x-4 p-4 border rounded-lg ${
                    formData.paymentMethod === 'pix' ? 'border-primary' : ''
                  }`}>
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex-1 cursor-pointer">
                      <div className="font-medium">Pix</div>
                      <div className="text-sm text-muted-foreground">
                        Pagamento instantâneo via QR Code
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-4 p-4 border rounded-lg ${
                    formData.paymentMethod === 'credit_card' ? 'border-primary' : ''
                  }`}>
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cartão de Crédito</div>
                      <div className="text-sm text-muted-foreground">
                        Cobrança recorrente automática
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          {currentStep === 'payment' ? (
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Finalizar Cadastro
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
