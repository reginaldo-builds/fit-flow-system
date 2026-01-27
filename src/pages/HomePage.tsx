import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronRight, CheckCircle, Zap, Shield, Users, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { plans } from '@/data/mockData';

const HomePage = () => {
  const navigate = useNavigate();
  const whatsappNumber = '+5588992912990';
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de solicitar uma demonstração do sistema de fichas para minha academia.');
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  const features = [
    {
      icon: Users,
      title: 'Exclusivo',
      description: 'Cada academia tem seu próprio espaço isolado e seguro'
    },
    {
      icon: Zap,
      title: 'Automatizado',
      description: 'Envio de fichas via WhatsApp de forma automática'
    },
    {
      icon: Shield,
      title: 'Seguro',
      description: 'Dados protegidos conforme a LGPD'
    },
    {
      icon: CheckCircle,
      title: 'Completo',
      description: 'Gestão de alunos, personais e fichas em um só lugar'
    }
  ];

  const featureLabels: Record<string, string> = {
    customFields: 'Campos Personalizados',
    charts: 'Gráficos de Evolução',
    shop: 'Lojinha de Produtos',
    customPage: 'Página Personalizada'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground font-bold rounded-full">
              F
            </div>
            <span className="font-bold text-xl text-foreground">Ficha.Life</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/system')}>
              Admin
            </Button>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contato
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            Sistema de Gestão de Fichas
            <br />
            <span className="text-primary">para Academias</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Automatize o envio de fichas de treino personalizadas para seus alunos. 
            Integração com WhatsApp, formulários dinâmicos e gestão completa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/onboarding')}>
              <Crown className="mr-2 h-5 w-5" />
              Começar Agora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar com Consultor
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Por que escolher o Ficha.Life?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary rounded-full">
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20" id="planos">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Escolha o Plano Ideal
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Planos flexíveis que crescem com sua academia
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative ${plan.name === 'elite' ? 'border-primary border-2 scale-105' : ''}`}
              >
                {plan.name === 'elite' && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <Badge 
                    variant={
                      plan.name === 'elite' ? 'default' :
                      plan.name === 'premium' ? 'secondary' :
                      'outline'
                    }
                    className="w-fit mx-auto mb-2"
                  >
                    {plan.displayName}
                  </Badge>
                  <CardTitle className="text-3xl">
                    R$ {plan.priceMonthly.toFixed(2)}
                    <span className="text-base font-normal text-muted-foreground">/mês</span>
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
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
                  <Button 
                    className="w-full" 
                    variant={plan.name === 'elite' ? 'default' : 'outline'}
                    onClick={() => navigate('/onboarding')}
                  >
                    Escolher {plan.displayName}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Como Funciona?
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm rounded-full">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Escolha seu Plano</h3>
                <p className="text-muted-foreground">
                  Selecione o plano que melhor atende sua academia e faça o cadastro online.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm rounded-full">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Configure sua Academia</h3>
                <p className="text-muted-foreground">
                  Cadastre seus personais e configure os termos de uso e política de privacidade.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm rounded-full">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Compartilhe o Link</h3>
                <p className="text-muted-foreground">
                  Os personais enviam links para os alunos preencherem seus dados e solicitarem fichas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm rounded-full">
                4
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Fichas via WhatsApp</h3>
                <p className="text-muted-foreground">
                  O personal cria a ficha e envia diretamente para o WhatsApp do aluno com link seguro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Pronto para automatizar sua academia?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Comece agora mesmo e veja a diferença na gestão das suas fichas de treino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => navigate('/onboarding')}>
              <Crown className="mr-2 h-5 w-5" />
              Começar Gratuitamente
            </Button>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Ficha.Life - Sistema de Gestão de Fichas para Academias
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Desenvolvido para simplificar a gestão de fichas de treino
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20bd5a] transition-colors"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
};

export default HomePage;
