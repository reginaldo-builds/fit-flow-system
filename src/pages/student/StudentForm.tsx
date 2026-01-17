import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, ChevronLeft, ChevronRight, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';
import { getPersonalsByTenant, users } from '@/data/mockData';

const StudentForm = () => {
  const { personalId } = useParams();
  const { tenant, slug } = useTenant();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    whatsapp: '',
    email: '',
    birthDate: '',
    gender: '',
    height: '',
    weight: '',
    personalId: personalId || '',
    
    // Training Goals
    objective: '',
    experience: '',
    weeklyFrequency: '',
    availableTime: '',
    
    // Health
    injuries: '',
    diseases: '',
    medications: '',
    surgeries: '',
    painPoints: '',
    
    // Habits
    activityLevel: '',
    profession: '',
    sleepHours: '',
    hasNutritionist: '',
    waterIntake: '',
    
    // Preferences
    preferredTime: '',
    trainingLocation: '',
    likedExercises: '',
    dislikedExercises: '',
    additionalNotes: ''
  });

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Academia não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const personals = getPersonalsByTenant(tenant.id);
  const selectedPersonal = users.find(u => u.id === formData.personalId);

  const steps = [
    { title: 'Dados Pessoais', description: 'Informações básicas' },
    { title: 'Objetivos', description: 'Metas e experiência' },
    { title: 'Saúde', description: 'Histórico médico' },
    { title: 'Hábitos', description: 'Rotina e estilo de vida' },
    { title: 'Preferências', description: 'Como você gosta de treinar' },
    { title: 'Confirmação', description: 'Revise e envie' }
  ];

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!acceptedTerms) {
      toast({
        title: 'Termos não aceitos',
        description: 'Você precisa aceitar os termos de uso para continuar.',
        variant: 'destructive'
      });
      return;
    }

    if (!selectedPersonal) {
      toast({
        title: 'Selecione um Personal',
        description: 'Você precisa selecionar um personal trainer.',
        variant: 'destructive'
      });
      return;
    }

    const message = `Olá ${selectedPersonal.name}! 🏋️\n\nSou ${formData.name} e acabei de preencher o formulário de avaliação na ${tenant.name}.\n\n📋 Objetivo: ${formData.objective}\n⏰ Disponibilidade: ${formData.weeklyFrequency}x por semana, ${formData.availableTime} min\n\nAguardo minha ficha personalizada!\n\nObrigado(a)! 💪`;

    const whatsappUrl = `https://wa.me/${selectedPersonal.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    toast({
      title: 'Formulário enviado!',
      description: 'Você será redirecionado para o WhatsApp do seu personal.',
    });

    window.open(whatsappUrl, '_blank');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Dados Pessoais
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                placeholder="+55 88 99999-9999"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => updateField('birthDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => updateField('gender', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Feminino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Outro</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateField('height', e.target.value)}
                  placeholder="170"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                  placeholder="70"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Personal Trainer *</Label>
              <Select
                value={formData.personalId}
                onValueChange={(value) => updateField('personalId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu personal" />
                </SelectTrigger>
                <SelectContent>
                  {personals.map((personal) => (
                    <SelectItem key={personal.id} value={personal.id}>
                      {personal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1: // Objetivos
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Objetivo Principal *</Label>
              <Select
                value={formData.objective}
                onValueChange={(value) => updateField('objective', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                  <SelectItem value="Ganho de massa">Ganho de massa muscular</SelectItem>
                  <SelectItem value="Condicionamento">Condicionamento físico</SelectItem>
                  <SelectItem value="Reabilitação">Reabilitação</SelectItem>
                  <SelectItem value="Qualidade de vida">Qualidade de vida</SelectItem>
                  <SelectItem value="Preparação esportiva">Preparação esportiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Experiência com Musculação</Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => updateField('experience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Iniciante">Iniciante (nunca treinei)</SelectItem>
                  <SelectItem value="Básico">Básico (menos de 6 meses)</SelectItem>
                  <SelectItem value="Intermediário">Intermediário (6 meses a 2 anos)</SelectItem>
                  <SelectItem value="Avançado">Avançado (mais de 2 anos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frequência Semanal *</Label>
              <Select
                value={formData.weeklyFrequency}
                onValueChange={(value) => updateField('weeklyFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quantas vezes por semana?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2x por semana</SelectItem>
                  <SelectItem value="3">3x por semana</SelectItem>
                  <SelectItem value="4">4x por semana</SelectItem>
                  <SelectItem value="5">5x por semana</SelectItem>
                  <SelectItem value="6">6x por semana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tempo Disponível por Treino</Label>
              <Select
                value={formData.availableTime}
                onValueChange={(value) => updateField('availableTime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quanto tempo por treino?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="75">1 hora e 15 minutos</SelectItem>
                  <SelectItem value="90">1 hora e 30 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2: // Saúde
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="injuries">Possui alguma lesão ou limitação física?</Label>
              <Textarea
                id="injuries"
                value={formData.injuries}
                onChange={(e) => updateField('injuries', e.target.value)}
                placeholder="Descreva lesões atuais ou antigas..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diseases">Possui alguma doença diagnosticada?</Label>
              <Textarea
                id="diseases"
                value={formData.diseases}
                onChange={(e) => updateField('diseases', e.target.value)}
                placeholder="Ex: diabetes, hipertensão, problemas cardíacos..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Usa algum medicamento contínuo?</Label>
              <Textarea
                id="medications"
                value={formData.medications}
                onChange={(e) => updateField('medications', e.target.value)}
                placeholder="Liste os medicamentos que usa regularmente..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surgeries">Já realizou cirurgia?</Label>
              <Textarea
                id="surgeries"
                value={formData.surgeries}
                onChange={(e) => updateField('surgeries', e.target.value)}
                placeholder="Descreva cirurgias realizadas..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="painPoints">Sente dores frequentes? Onde?</Label>
              <Textarea
                id="painPoints"
                value={formData.painPoints}
                onChange={(e) => updateField('painPoints', e.target.value)}
                placeholder="Descreva as regiões onde sente dor..."
                rows={2}
              />
            </div>
          </div>
        );

      case 3: // Hábitos
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nível de Atividade Física Atual</Label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value) => updateField('activityLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedentário">Sedentário (não pratico atividades)</SelectItem>
                  <SelectItem value="Leve">Leve (1-2x por semana)</SelectItem>
                  <SelectItem value="Moderado">Moderado (3-4x por semana)</SelectItem>
                  <SelectItem value="Ativo">Ativo (5+ vezes por semana)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession">Profissão / Rotina Diária</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => updateField('profession', e.target.value)}
                placeholder="Ex: trabalho sentado, esforço físico..."
              />
            </div>
            <div className="space-y-2">
              <Label>Horas de Sono por Noite</Label>
              <Select
                value={formData.sleepHours}
                onValueChange={(value) => updateField('sleepHours', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quantas horas dorme?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">Menos de 5 horas</SelectItem>
                  <SelectItem value="5">5-6 horas</SelectItem>
                  <SelectItem value="7">7-8 horas</SelectItem>
                  <SelectItem value="9">Mais de 8 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Alimentação Acompanhada por Nutricionista?</Label>
              <RadioGroup
                value={formData.hasNutritionist}
                onValueChange={(value) => updateField('hasNutritionist', value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="nutri-yes" />
                  <Label htmlFor="nutri-yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="nutri-no" />
                  <Label htmlFor="nutri-no">Não</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Consumo de Água Diário</Label>
              <Select
                value={formData.waterIntake}
                onValueChange={(value) => updateField('waterIntake', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quanto bebe de água?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixo">Baixo (menos de 1L)</SelectItem>
                  <SelectItem value="Médio">Médio (1-2L)</SelectItem>
                  <SelectItem value="Alto">Alto (mais de 2L)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4: // Preferências
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Horário Preferido para Treino</Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) => updateField('preferredTime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã">Manhã (6h - 12h)</SelectItem>
                  <SelectItem value="Tarde">Tarde (12h - 18h)</SelectItem>
                  <SelectItem value="Noite">Noite (18h - 22h)</SelectItem>
                  <SelectItem value="Flexível">Flexível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Local de Treino</Label>
              <Select
                value={formData.trainingLocation}
                onValueChange={(value) => updateField('trainingLocation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academia">Academia</SelectItem>
                  <SelectItem value="Casa">Em casa</SelectItem>
                  <SelectItem value="Ar livre">Ao ar livre</SelectItem>
                  <SelectItem value="Misto">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="likedExercises">Exercícios que Gosta</Label>
              <Textarea
                id="likedExercises"
                value={formData.likedExercises}
                onChange={(e) => updateField('likedExercises', e.target.value)}
                placeholder="Ex: musculação, corrida, dança..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dislikedExercises">Exercícios que Não Gosta</Label>
              <Textarea
                id="dislikedExercises"
                value={formData.dislikedExercises}
                onChange={(e) => updateField('dislikedExercises', e.target.value)}
                placeholder="Ex: burpee, abdominais, pular corda..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Observações Adicionais</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                placeholder="Algo mais que gostaria de informar ao seu personal?"
                rows={3}
              />
            </div>
          </div>
        );

      case 5: // Confirmação
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold">Dados Pessoais</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Nome:</strong> {formData.name || '-'}</p>
                  <p><strong>WhatsApp:</strong> {formData.whatsapp || '-'}</p>
                  <p><strong>Personal:</strong> {selectedPersonal?.name || '-'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Objetivos</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Objetivo:</strong> {formData.objective || '-'}</p>
                  <p><strong>Frequência:</strong> {formData.weeklyFrequency}x/semana</p>
                  <p><strong>Tempo:</strong> {formData.availableTime} min</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <div className="text-sm">
                  <Label htmlFor="terms" className="cursor-pointer">
                    Li e aceito os{' '}
                    <Link 
                      to={`/${slug}/terms`} 
                      target="_blank"
                      className="text-primary underline inline-flex items-center"
                    >
                      Termos de Uso <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                    {' '}e a{' '}
                    <Link 
                      to={`/${slug}/privacy`} 
                      target="_blank"
                      className="text-primary underline inline-flex items-center"
                    >
                      Política de Privacidade (LGPD) <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="h-16 w-auto" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center bg-primary text-primary-foreground font-bold text-2xl">
                {tenant.name.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{tenant.name}</h1>
          <p className="text-muted-foreground">Formulário de Avaliação Física</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Próximo
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!acceptedTerms}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Solicitação
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
