import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Building2, User, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { plans } from '@/data/mockData';

type Step = 'plan' | 'academia' | 'gerente' | 'payment' | 'success';

interface FormData {
  planId: string;
  academia: {
    name: string;
    slug: string;
    email: string;
    whatsapp: string;
  };
  gerente: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  paymentMethod: 'pix' | 'credit_card';
}

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('plan');
  const [loading, setLoading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    planId: '',
    academia: { name: '', slug: '', email: '', whatsapp: '' },
    gerente: { name: '', email: '', password: '', confirmPassword: '' },
    paymentMethod: 'pix',
  });

  const selectedPlan = plans.find(p => p.id === formData.planId);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 50);
  };

  const checkSlugAvailability = (slug: string) => {
    // Simulação - em produção seria uma chamada à API
    const reservedSlugs = ['admin', 'api', 'admin-system', 'onboarding'];
    setSlugAvailable(!reservedSlugs.includes(slug) && slug.length >= 3);
  };

  const handleAcademiaNameChange = (name: string) => {
    const slug = generateSlug(name);
    setFormData(prev => ({
      ...prev,
      academia: { ...prev.academia, name, slug }
    }));
    if (slug.length >= 3) {
      checkSlugAvailability(slug);
    } else {
      setSlugAvailable(null);
    }
  };

  const validateStep = (): boolean => {
    switch (step) {
      case 'plan':
        if (!formData.planId) {
          toast({ title: 'Selecione um plano', variant: 'destructive' });
          return false;
        }
        return true;
      
      case 'academia':
        if (!formData.academia.name || !formData.academia.email || !formData.academia.whatsapp) {
          toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
          return false;
        }
        if (!slugAvailable) {
          toast({ title: 'Slug indisponível', variant: 'destructive' });
          return false;
        }
        return true;
      
      case 'gerente':
        if (!formData.gerente.name || !formData.gerente.email || !formData.gerente.password) {
          toast({ title: 'Preencha todos os campos', variant: 'destructive' });
          return false;
        }
        if (formData.gerente.password !== formData.gerente.confirmPassword) {
          toast({ title: 'As senhas não conferem', variant: 'destructive' });
          return false;
        }
        if (formData.gerente.password.length < 6) {
          toast({ title: 'A senha deve ter no mínimo 6 caracteres', variant: 'destructive' });
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
    
    const steps: Step[] = ['plan', 'academia', 'gerente', 'payment', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['plan', 'academia', 'gerente', 'payment', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulação de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Cadastro realizado!',
      description: formData.paymentMethod === 'pix' 
        ? 'Escaneie o QR Code para ativar sua academia.'
        : 'Pagamento processado. Sua academia está ativa!',
    });
    
    setStep('success');
    setLoading(false);
  };

  const features = [
    { key: 'customFields', label: 'Campos Personalizados' },
    { key: 'charts', label: 'Gráficos de Evolução' },
    { key: 'shop', label: 'Lojinha de Produtos' },
    { key: 'customPage', label: 'Página Personalizada' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              F
            </div>
            <span className="font-bold text-lg">Ficha.Life</span>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-2">
            {['Plano', 'Academia', 'Gerente', 'Pagamento'].map((label, index) => {
              const steps: Step[] = ['plan', 'academia', 'gerente', 'payment'];
              const currentIndex = steps.indexOf(step);
              const isCompleted = index < currentIndex;
              const isCurrent = steps[index] === step;
              
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                    ${isCompleted ? 'bg-primary text-primary-foreground' : 
                      isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span className={`text-sm ${isCurrent ? 'font-medium' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step: Plan Selection */}
        {step === 'plan' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Escolha seu Plano</h1>
              <p className="text-muted-foreground mt-2">
                Selecione o melhor plano para sua academia
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    formData.planId === plan.id ? 'border-2 border-primary' : ''
                  } ${plan.name === 'elite' ? 'relative' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, planId: plan.id }))}
                >
                  {plan.name === 'elite' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Mais Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle>{plan.displayName}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">R$ {plan.priceMonthly}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Até {plan.maxPersonals} personal(is)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Alunos ilimitados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Integração WhatsApp</span>
                    </div>
                    {features.map(feature => (
                      <div key={feature.key} className="flex items-center gap-2">
                        {plan.features[feature.key as keyof typeof plan.features] ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <span className="h-4 w-4 text-muted-foreground">—</span>
                        )}
                        <span className={`text-sm ${
                          !plan.features[feature.key as keyof typeof plan.features] 
                            ? 'text-muted-foreground' : ''
                        }`}>
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={nextStep} disabled={!formData.planId}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Academia Info */}
        {step === 'academia' && (
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Dados da Academia
              </CardTitle>
              <CardDescription>
                Informe os dados da sua academia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Academia *</Label>
                <Input
                  value={formData.academia.name}
                  onChange={(e) => handleAcademiaNameChange(e.target.value)}
                  placeholder="Ex: Academia Força Total"
                />
              </div>

              <div className="space-y-2">
                <Label>URL da Academia</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">ficha.life/</span>
                  <Input
                    value={formData.academia.slug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setFormData(prev => ({ ...prev, academia: { ...prev.academia, slug } }));
                      checkSlugAvailability(slug);
                    }}
                    placeholder="minha-academia"
                    className="flex-1"
                  />
                </div>
                {slugAvailable !== null && (
                  <p className={`text-sm ${slugAvailable ? 'text-green-500' : 'text-destructive'}`}>
                    {slugAvailable ? '✓ URL disponível' : '✗ URL já em uso'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email da Academia *</Label>
                <Input
                  type="email"
                  value={formData.academia.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, academia: { ...prev.academia, email: e.target.value }
                  }))}
                  placeholder="contato@minhaacademia.com"
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp *</Label>
                <Input
                  value={formData.academia.whatsapp}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, academia: { ...prev.academia, whatsapp: e.target.value }
                  }))}
                  placeholder="+55 11 99999-9999"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button className="flex-1" onClick={nextStep}>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Gerente Info */}
        {step === 'gerente' && (
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Gerente
              </CardTitle>
              <CardDescription>
                Crie a conta do administrador da academia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.gerente.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, gerente: { ...prev.gerente, name: e.target.value }
                  }))}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label>Email de Acesso *</Label>
                <Input
                  type="email"
                  value={formData.gerente.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, gerente: { ...prev.gerente, email: e.target.value }
                  }))}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Senha *</Label>
                <Input
                  type="password"
                  value={formData.gerente.password}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, gerente: { ...prev.gerente, password: e.target.value }
                  }))}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="space-y-2">
                <Label>Confirmar Senha *</Label>
                <Input
                  type="password"
                  value={formData.gerente.confirmPassword}
                  onChange={(e) => setFormData(prev => ({
                    ...prev, gerente: { ...prev.gerente, confirmPassword: e.target.value }
                  }))}
                  placeholder="Repita a senha"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button className="flex-1" onClick={nextStep}>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Forma de Pagamento
              </CardTitle>
              <CardDescription>
                Escolha como deseja pagar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumo */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plano</span>
                  <span className="font-medium">{selectedPlan?.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Academia</span>
                  <span className="font-medium">{formData.academia.name}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total mensal</span>
                  <span className="text-primary">R$ {selectedPlan?.priceMonthly}</span>
                </div>
              </div>

              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev, paymentMethod: value as 'pix' | 'credit_card'
                }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex-1 cursor-pointer">
                    <span className="font-medium">Pix</span>
                    <p className="text-sm text-muted-foreground">
                      Pagamento instantâneo via QR Code
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                    <span className="font-medium">Cartão de Crédito</span>
                    <p className="text-sm text-muted-foreground">
                      Cobrança recorrente mensal
                    </p>
                  </Label>
                </div>
              </RadioGroup>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={prevStep} disabled={loading}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Finalizar Cadastro
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <Card className="max-w-xl mx-auto text-center">
            <CardContent className="py-12 space-y-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mx-auto">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">Cadastro Realizado!</h2>
                <p className="text-muted-foreground mt-2">
                  {formData.paymentMethod === 'pix' 
                    ? 'Escaneie o QR Code abaixo para ativar sua academia.'
                    : 'Seu pagamento foi processado e sua academia está ativa!'}
                </p>
              </div>

              {formData.paymentMethod === 'pix' && (
                <div className="p-6 bg-muted rounded-lg">
                  <div className="w-48 h-48 bg-primary/10 mx-auto flex items-center justify-center rounded-lg">
                    <span className="text-muted-foreground">QR Code Pix</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Após o pagamento, você receberá um email de confirmação
                  </p>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg text-left space-y-2">
                <p className="text-sm text-muted-foreground">Dados de acesso:</p>
                <p><strong>URL:</strong> ficha.life/{formData.academia.slug}</p>
                <p><strong>Email:</strong> {formData.gerente.email}</p>
              </div>

              <Button onClick={() => navigate(`/${formData.academia.slug}/login`)}>
                Acessar Minha Academia
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default OnboardingPage;
