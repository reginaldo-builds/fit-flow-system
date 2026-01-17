import { MessageCircle, ChevronRight, CheckCircle, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HomePage = () => {
  const whatsappNumber = '+5588992912990';
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de solicitar uma demonstração do sistema de fichas para minha academia.');
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  const features = [
    {
      icon: Users,
      title: 'Multi-Tenant',
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground font-bold">
              GF
            </div>
            <span className="font-bold text-xl text-foreground">GymFit System</span>
          </div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="default" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contato
            </Button>
          </a>
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
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="text-lg px-8 py-6">
              <MessageCircle className="mr-2 h-5 w-5" />
              Solicite já uma demonstração
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Por que escolher o GymFit System?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
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

      {/* How it Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Como Funciona?
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Cadastramos sua Academia</h3>
                <p className="text-muted-foreground">
                  Configuramos seu espaço exclusivo no sistema com logo, cores e informações personalizadas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Personal cadastra alunos</h3>
                <p className="text-muted-foreground">
                  Os personais enviam links para os alunos preencherem seus dados e solicitarem fichas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Ficha entregue via WhatsApp</h3>
                <p className="text-muted-foreground">
                  O personal cria a ficha e envia diretamente para o WhatsApp do aluno com link para download.
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
            Entre em contato conosco e agende uma demonstração gratuita do sistema.
          </p>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar no WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} GymFit System - Soluções em Automação para Academias
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
