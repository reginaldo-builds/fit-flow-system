import { Tenant, User, Student, CustomField, FormSubmission, WorkoutPlan, StudentEvolution } from '@/types';

// ===== TENANTS =====
export const tenants: Tenant[] = [
  {
    id: 'tenant-1',
    slug: 'caxufit',
    name: 'CaxuFit Academia',
    logo: undefined,
    whatsapp: '+5588999999999',
    termsOfUse: `# Termos de Uso - CaxuFit Academia

## 1. Aceitação dos Termos
Ao utilizar nossos serviços, você concorda com estes termos de uso.

## 2. Serviços Oferecidos
A CaxuFit oferece serviços de avaliação física e prescrição de treinos personalizados.

## 3. Responsabilidades do Usuário
- Fornecer informações verdadeiras
- Informar sobre condições de saúde
- Seguir as orientações dos profissionais

## 4. Limitação de Responsabilidade
A academia não se responsabiliza por lesões decorrentes do não cumprimento das orientações.`,
    privacyPolicy: `# Política de Privacidade - LGPD

## 1. Coleta de Dados
Coletamos dados pessoais necessários para a prestação dos serviços de avaliação física.

## 2. Uso dos Dados
Seus dados são utilizados exclusivamente para:
- Criação de fichas de treino personalizadas
- Comunicação via WhatsApp
- Acompanhamento da evolução física

## 3. Compartilhamento
Seus dados NÃO são compartilhados com terceiros.

## 4. Armazenamento
Os dados são armazenados de forma segura e criptografada.

## 5. Seus Direitos
Você tem direito a:
- Acessar seus dados
- Corrigir informações
- Solicitar exclusão
- Revogar consentimento`,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'tenant-2',
    slug: 'profit',
    name: 'Profit Fitness',
    logo: undefined,
    whatsapp: '+5588888888888',
    termsOfUse: `# Termos de Uso - Profit Fitness

Ao utilizar a Profit Fitness, você concorda com nossos termos e condições.`,
    privacyPolicy: `# Política de Privacidade - LGPD

A Profit Fitness se compromete com a proteção dos seus dados pessoais conforme a LGPD.`,
    createdAt: '2024-02-01T00:00:00Z'
  }
];

// ===== USERS =====
export const users: User[] = [
  // CaxuFit Users
  {
    id: 'user-admin-1',
    tenantId: 'tenant-1',
    name: 'Carlos Silva',
    email: 'admin@caxufit.com',
    password: 'admin123',
    role: 'admin',
    whatsapp: '+5588999999999',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-personal-1',
    tenantId: 'tenant-1',
    name: 'João Oliveira',
    email: 'joao@caxufit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588991111111',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'user-personal-2',
    tenantId: 'tenant-1',
    name: 'Maria Santos',
    email: 'maria@caxufit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588992222222',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'user-personal-3',
    tenantId: 'tenant-1',
    name: 'Pedro Costa',
    email: 'pedro@caxufit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588993333333',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user-student-1',
    tenantId: 'tenant-1',
    name: 'Ana Ferreira',
    email: 'ana@email.com',
    password: 'aluno123',
    role: 'student',
    whatsapp: '+5588994444444',
    createdAt: '2024-02-01T00:00:00Z'
  },
  
  // Profit Users
  {
    id: 'user-admin-2',
    tenantId: 'tenant-2',
    name: 'Roberto Almeida',
    email: 'admin@profit.com',
    password: 'admin123',
    role: 'admin',
    whatsapp: '+5588888888888',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user-personal-4',
    tenantId: 'tenant-2',
    name: 'Lucas Mendes',
    email: 'lucas@profit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588887777777',
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    id: 'user-personal-5',
    tenantId: 'tenant-2',
    name: 'Fernanda Lima',
    email: 'fernanda@profit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588886666666',
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'user-personal-6',
    tenantId: 'tenant-2',
    name: 'Gabriel Souza',
    email: 'gabriel@profit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588885555555',
    createdAt: '2024-02-15T00:00:00Z'
  }
];

// ===== STUDENTS =====
export const students: Student[] = [
  // CaxuFit Students (10)
  {
    id: 'student-1',
    tenantId: 'tenant-1',
    personalId: 'user-personal-1',
    name: 'Ana Ferreira',
    whatsapp: '+5588994444444',
    email: 'ana@email.com',
    birthDate: '1995-05-15',
    gender: 'female',
    height: 165,
    weight: 62,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'student-2',
    tenantId: 'tenant-1',
    personalId: 'user-personal-1',
    name: 'Bruno Lima',
    whatsapp: '+5588995555555',
    email: 'bruno@email.com',
    birthDate: '1990-08-20',
    gender: 'male',
    height: 178,
    weight: 85,
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    id: 'student-3',
    tenantId: 'tenant-1',
    personalId: 'user-personal-1',
    name: 'Camila Rocha',
    whatsapp: '+5588996666666',
    email: 'camila@email.com',
    birthDate: '1998-03-10',
    gender: 'female',
    height: 160,
    weight: 55,
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'student-4',
    tenantId: 'tenant-1',
    personalId: 'user-personal-2',
    name: 'Diego Martins',
    whatsapp: '+5588997777777',
    email: 'diego@email.com',
    birthDate: '1988-11-25',
    gender: 'male',
    height: 182,
    weight: 90,
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'student-5',
    tenantId: 'tenant-1',
    personalId: 'user-personal-2',
    name: 'Elena Souza',
    whatsapp: '+5588998888888',
    email: 'elena@email.com',
    birthDate: '1992-07-05',
    gender: 'female',
    height: 168,
    weight: 58,
    createdAt: '2024-02-20T00:00:00Z'
  },
  {
    id: 'student-6',
    tenantId: 'tenant-1',
    personalId: 'user-personal-2',
    name: 'Felipe Alves',
    whatsapp: '+5588999999900',
    email: 'felipe@email.com',
    birthDate: '1985-09-30',
    gender: 'male',
    height: 175,
    weight: 78,
    createdAt: '2024-02-25T00:00:00Z'
  },
  {
    id: 'student-7',
    tenantId: 'tenant-1',
    personalId: 'user-personal-3',
    name: 'Gabriela Nunes',
    whatsapp: '+5588991111100',
    email: 'gabriela@email.com',
    birthDate: '1997-01-12',
    gender: 'female',
    height: 163,
    weight: 60,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'student-8',
    tenantId: 'tenant-1',
    personalId: 'user-personal-3',
    name: 'Henrique Castro',
    whatsapp: '+5588992222200',
    email: 'henrique@email.com',
    birthDate: '1991-04-18',
    gender: 'male',
    height: 180,
    weight: 82,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    id: 'student-9',
    tenantId: 'tenant-1',
    personalId: 'user-personal-3',
    name: 'Isabela Dias',
    whatsapp: '+5588993333300',
    email: 'isabela@email.com',
    birthDate: '1994-12-22',
    gender: 'female',
    height: 158,
    weight: 52,
    createdAt: '2024-03-10T00:00:00Z'
  },
  {
    id: 'student-10',
    tenantId: 'tenant-1',
    personalId: 'user-personal-1',
    name: 'Jorge Pereira',
    whatsapp: '+5588994444400',
    email: 'jorge@email.com',
    birthDate: '1989-06-08',
    gender: 'male',
    height: 176,
    weight: 88,
    createdAt: '2024-03-15T00:00:00Z'
  },
  
  // Profit Students (10)
  {
    id: 'student-11',
    tenantId: 'tenant-2',
    personalId: 'user-personal-4',
    name: 'Karla Ribeiro',
    whatsapp: '+5588881111111',
    email: 'karla@email.com',
    birthDate: '1996-02-28',
    gender: 'female',
    height: 170,
    weight: 65,
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'student-12',
    tenantId: 'tenant-2',
    personalId: 'user-personal-4',
    name: 'Leandro Gomes',
    whatsapp: '+5588882222222',
    email: 'leandro@email.com',
    birthDate: '1987-10-15',
    gender: 'male',
    height: 185,
    weight: 95,
    createdAt: '2024-03-05T00:00:00Z'
  },
  {
    id: 'student-13',
    tenantId: 'tenant-2',
    personalId: 'user-personal-4',
    name: 'Mariana Lopes',
    whatsapp: '+5588883333333',
    email: 'mariana@email.com',
    birthDate: '1993-08-05',
    gender: 'female',
    height: 162,
    weight: 57,
    createdAt: '2024-03-10T00:00:00Z'
  },
  {
    id: 'student-14',
    tenantId: 'tenant-2',
    personalId: 'user-personal-5',
    name: 'Nicolas Barros',
    whatsapp: '+5588884444444',
    email: 'nicolas@email.com',
    birthDate: '1990-05-20',
    gender: 'male',
    height: 172,
    weight: 75,
    createdAt: '2024-03-15T00:00:00Z'
  },
  {
    id: 'student-15',
    tenantId: 'tenant-2',
    personalId: 'user-personal-5',
    name: 'Olivia Cardoso',
    whatsapp: '+5588885555500',
    email: 'olivia@email.com',
    birthDate: '1999-11-30',
    gender: 'female',
    height: 166,
    weight: 54,
    createdAt: '2024-03-20T00:00:00Z'
  },
  {
    id: 'student-16',
    tenantId: 'tenant-2',
    personalId: 'user-personal-5',
    name: 'Paulo Mendonça',
    whatsapp: '+5588886666600',
    email: 'paulo@email.com',
    birthDate: '1986-03-25',
    gender: 'male',
    height: 179,
    weight: 83,
    createdAt: '2024-03-25T00:00:00Z'
  },
  {
    id: 'student-17',
    tenantId: 'tenant-2',
    personalId: 'user-personal-6',
    name: 'Queila Santos',
    whatsapp: '+5588887777700',
    email: 'queila@email.com',
    birthDate: '1995-09-12',
    gender: 'female',
    height: 155,
    weight: 50,
    createdAt: '2024-04-01T00:00:00Z'
  },
  {
    id: 'student-18',
    tenantId: 'tenant-2',
    personalId: 'user-personal-6',
    name: 'Rafael Teixeira',
    whatsapp: '+5588888888800',
    email: 'rafael@email.com',
    birthDate: '1992-01-08',
    gender: 'male',
    height: 183,
    weight: 87,
    createdAt: '2024-04-05T00:00:00Z'
  },
  {
    id: 'student-19',
    tenantId: 'tenant-2',
    personalId: 'user-personal-6',
    name: 'Sofia Azevedo',
    whatsapp: '+5588889999900',
    email: 'sofia@email.com',
    birthDate: '1997-06-18',
    gender: 'female',
    height: 167,
    weight: 59,
    createdAt: '2024-04-10T00:00:00Z'
  },
  {
    id: 'student-20',
    tenantId: 'tenant-2',
    personalId: 'user-personal-4',
    name: 'Thiago Moreira',
    whatsapp: '+5588880000000',
    email: 'thiago@email.com',
    birthDate: '1988-04-02',
    gender: 'male',
    height: 177,
    weight: 80,
    createdAt: '2024-04-15T00:00:00Z'
  }
];

// ===== CUSTOM FIELDS =====
export const customFields: CustomField[] = [
  {
    id: 'field-1',
    tenantId: 'tenant-1',
    personalId: 'user-personal-1',
    name: 'suplementos',
    label: 'Usa suplementos? Quais?',
    type: 'textarea',
    required: false,
    order: 1
  },
  {
    id: 'field-2',
    tenantId: 'tenant-1',
    personalId: 'user-personal-1',
    name: 'experiencia_cardio',
    label: 'Experiência com cardio',
    type: 'select',
    options: ['Nenhuma', 'Básica', 'Intermediária', 'Avançada'],
    required: true,
    order: 2
  },
  {
    id: 'field-3',
    tenantId: 'tenant-1',
    personalId: 'user-personal-2',
    name: 'tem_personal_anterior',
    label: 'Já treinou com personal antes?',
    type: 'boolean',
    required: true,
    order: 1
  }
];

// ===== FORM SUBMISSIONS =====
export const formSubmissions: FormSubmission[] = [
  // Pending submissions
  {
    id: 'submission-1',
    tenantId: 'tenant-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    status: 'pending',
    periodStart: '2024-04-01',
    periodEnd: '2024-05-01',
    objective: 'Emagrecimento',
    experience: 'Iniciante',
    weeklyFrequency: 4,
    availableTime: 60,
    injuries: 'Nenhuma',
    diseases: 'Nenhuma',
    medications: 'Nenhum',
    surgeries: 'Nenhuma',
    painPoints: 'Nenhuma',
    activityLevel: 'Sedentário',
    profession: 'Analista de sistemas',
    sleepHours: 7,
    sleepQuality: 'regular',
    hasNutritionist: false,
    waterIntake: 'Médio',
    preferredTime: 'Manhã',
    trainingLocation: 'Academia',
    likedExercises: 'Esteira, bicicleta',
    dislikedExercises: 'Burpee',
    additionalNotes: 'Prefiro treinos curtos e intensos',
    acceptedTerms: true,
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-04-01T10:00:00Z'
  },
  {
    id: 'submission-2',
    tenantId: 'tenant-1',
    studentId: 'student-2',
    personalId: 'user-personal-1',
    status: 'pending',
    periodStart: '2024-04-02',
    periodEnd: '2024-05-02',
    objective: 'Ganho de massa',
    experience: 'Intermediário',
    weeklyFrequency: 5,
    availableTime: 90,
    injuries: 'Lesão antiga no ombro direito',
    diseases: 'Nenhuma',
    medications: 'Nenhum',
    surgeries: 'Nenhuma',
    painPoints: 'Ombro direito ao fazer supino',
    activityLevel: 'Moderado',
    profession: 'Engenheiro civil',
    sleepHours: 6,
    sleepQuality: 'regular',
    hasNutritionist: true,
    waterIntake: 'Alto',
    preferredTime: 'Noite',
    trainingLocation: 'Academia',
    likedExercises: 'Musculação em geral',
    dislikedExercises: 'Aeróbicos longos',
    additionalNotes: 'Foco em hipertrofia',
    acceptedTerms: true,
    createdAt: '2024-04-02T14:30:00Z',
    updatedAt: '2024-04-02T14:30:00Z'
  },
  
  // In progress
  {
    id: 'submission-3',
    tenantId: 'tenant-1',
    studentId: 'student-4',
    personalId: 'user-personal-2',
    status: 'in_progress',
    periodStart: '2024-03-28',
    periodEnd: '2024-04-28',
    objective: 'Condicionamento físico',
    experience: 'Avançado',
    weeklyFrequency: 6,
    availableTime: 75,
    injuries: 'Nenhuma',
    diseases: 'Nenhuma',
    medications: 'Nenhum',
    surgeries: 'Nenhuma',
    painPoints: 'Nenhuma',
    activityLevel: 'Ativo',
    profession: 'Personal Trainer',
    sleepHours: 8,
    sleepQuality: 'excellent',
    hasNutritionist: true,
    waterIntake: 'Alto',
    preferredTime: 'Tarde',
    trainingLocation: 'Academia',
    likedExercises: 'CrossFit, HIIT',
    dislikedExercises: 'Treinos muito longos',
    additionalNotes: 'Preparação para competição',
    acceptedTerms: true,
    createdAt: '2024-03-28T09:00:00Z',
    updatedAt: '2024-04-01T11:00:00Z'
  },
  
  // Completed - current period
  {
    id: 'submission-4',
    tenantId: 'tenant-1',
    studentId: 'student-7',
    personalId: 'user-personal-3',
    status: 'completed',
    periodStart: '2024-03-15',
    periodEnd: '2024-05-15',
    objective: 'Reabilitação',
    experience: 'Iniciante',
    weeklyFrequency: 3,
    availableTime: 45,
    injuries: 'Hérnia de disco L4-L5',
    diseases: 'Nenhuma',
    medications: 'Anti-inflamatório quando necessário',
    surgeries: 'Nenhuma',
    painPoints: 'Lombar',
    activityLevel: 'Sedentário',
    profession: 'Contador',
    sleepHours: 7,
    sleepQuality: 'good',
    hasNutritionist: false,
    waterIntake: 'Baixo',
    preferredTime: 'Manhã',
    trainingLocation: 'Academia',
    likedExercises: 'Alongamentos, pilates',
    dislikedExercises: 'Exercícios de impacto',
    additionalNotes: 'Liberado pelo médico para atividades leves',
    acceptedTerms: true,
    createdAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z'
  },
  
  // Completed - old period (historical)
  {
    id: 'submission-4-old',
    tenantId: 'tenant-1',
    studentId: 'student-7',
    personalId: 'user-personal-3',
    status: 'completed',
    periodStart: '2024-01-15',
    periodEnd: '2024-03-15',
    objective: 'Reabilitação inicial',
    experience: 'Iniciante',
    weeklyFrequency: 2,
    availableTime: 30,
    injuries: 'Hérnia de disco L4-L5 - Fase aguda',
    diseases: 'Nenhuma',
    medications: 'Relaxante muscular',
    surgeries: 'Nenhuma',
    painPoints: 'Lombar intensa',
    activityLevel: 'Sedentário',
    profession: 'Contador',
    sleepHours: 5,
    sleepQuality: 'poor',
    hasNutritionist: false,
    waterIntake: 'Baixo',
    preferredTime: 'Manhã',
    trainingLocation: 'Casa',
    likedExercises: 'Alongamentos leves',
    dislikedExercises: 'Qualquer exercício com carga',
    additionalNotes: 'Início do tratamento, muita dor',
    acceptedTerms: true,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z'
  },
  
  // Profit submissions
  {
    id: 'submission-5',
    tenantId: 'tenant-2',
    studentId: 'student-11',
    personalId: 'user-personal-4',
    status: 'pending',
    periodStart: '2024-04-03',
    periodEnd: '2024-05-03',
    objective: 'Emagrecimento',
    experience: 'Iniciante',
    weeklyFrequency: 4,
    availableTime: 60,
    injuries: 'Nenhuma',
    diseases: 'Nenhuma',
    medications: 'Nenhum',
    surgeries: 'Nenhuma',
    painPoints: 'Nenhuma',
    activityLevel: 'Sedentário',
    profession: 'Professora',
    sleepHours: 6,
    sleepQuality: 'regular',
    hasNutritionist: false,
    waterIntake: 'Médio',
    preferredTime: 'Noite',
    trainingLocation: 'Academia',
    likedExercises: 'Dança, aeróbico',
    dislikedExercises: 'Levantamento de peso',
    additionalNotes: 'Meta: perder 10kg em 6 meses',
    acceptedTerms: true,
    createdAt: '2024-04-03T18:00:00Z',
    updatedAt: '2024-04-03T18:00:00Z'
  },
  
  // Ana's historical submissions for evolution tracking
  {
    id: 'submission-ana-1',
    tenantId: 'tenant-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    status: 'completed',
    periodStart: '2024-01-01',
    periodEnd: '2024-02-01',
    objective: 'Emagrecimento',
    experience: 'Iniciante',
    weeklyFrequency: 3,
    availableTime: 45,
    injuries: 'Nenhuma',
    diseases: 'Nenhuma',
    medications: 'Nenhum',
    surgeries: 'Nenhuma',
    painPoints: 'Nenhuma',
    activityLevel: 'Sedentário',
    profession: 'Analista de sistemas',
    sleepHours: 5,
    sleepQuality: 'poor',
    hasNutritionist: false,
    waterIntake: 'Baixo',
    preferredTime: 'Manhã',
    trainingLocation: 'Academia',
    likedExercises: 'Esteira',
    dislikedExercises: 'Musculação',
    additionalNotes: 'Começando do zero',
    acceptedTerms: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  },
  {
    id: 'submission-ana-2',
    tenantId: 'tenant-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    status: 'completed',
    periodStart: '2024-02-01',
    periodEnd: '2024-03-01',
    objective: 'Emagrecimento',
    experience: 'Iniciante',
    weeklyFrequency: 4,
    availableTime: 60,
    injuries: 'Nenhuma',
    diseases: 'Nenhuma',
    medications: 'Nenhum',
    surgeries: 'Nenhuma',
    painPoints: 'Nenhuma',
    activityLevel: 'Leve',
    profession: 'Analista de sistemas',
    sleepHours: 6,
    sleepQuality: 'regular',
    hasNutritionist: false,
    waterIntake: 'Médio',
    preferredTime: 'Manhã',
    trainingLocation: 'Academia',
    likedExercises: 'Esteira, bicicleta',
    dislikedExercises: 'Burpee',
    additionalNotes: 'Evoluindo bem',
    acceptedTerms: true,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 'submission-ana-3',
    tenantId: 'tenant-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    status: 'completed',
    periodStart: '2024-03-01',
    periodEnd: '2024-04-01',
    objective: 'Emagrecimento e tonificação',
    experience: 'Iniciante',
    weeklyFrequency: 4,
    availableTime: 60,
    injuries: 'Nenhuma',
    diseases: 'Nenhuma',
    medications: 'Nenhum',
    surgeries: 'Nenhuma',
    painPoints: 'Nenhuma',
    activityLevel: 'Moderado',
    profession: 'Analista de sistemas',
    sleepHours: 7,
    sleepQuality: 'good',
    hasNutritionist: true,
    waterIntake: 'Alto',
    preferredTime: 'Manhã',
    trainingLocation: 'Academia',
    likedExercises: 'Esteira, bicicleta, musculação leve',
    dislikedExercises: 'Burpee',
    additionalNotes: 'Começando acompanhamento nutricional',
    acceptedTerms: true,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  }
];

// ===== STUDENT EVOLUTION DATA =====
export const studentEvolutions: StudentEvolution[] = [
  // Ana's evolution
  { id: 'evo-1', studentId: 'student-1', submissionId: 'submission-ana-1', date: '2024-01-01', weight: 70, height: 165, sleepHours: 5, sleepQuality: 'poor', trainingTime: 'Manhã' },
  { id: 'evo-2', studentId: 'student-1', submissionId: 'submission-ana-2', date: '2024-02-01', weight: 68, height: 165, sleepHours: 6, sleepQuality: 'regular', trainingTime: 'Manhã' },
  { id: 'evo-3', studentId: 'student-1', submissionId: 'submission-ana-3', date: '2024-03-01', weight: 65, height: 165, sleepHours: 7, sleepQuality: 'good', trainingTime: 'Manhã' },
  { id: 'evo-4', studentId: 'student-1', submissionId: 'submission-1', date: '2024-04-01', weight: 62, height: 165, sleepHours: 7, sleepQuality: 'good', trainingTime: 'Manhã' },
  
  // Gabriela's evolution (student-7)
  { id: 'evo-5', studentId: 'student-7', submissionId: 'submission-4-old', date: '2024-01-15', weight: 65, height: 163, sleepHours: 5, sleepQuality: 'poor', trainingTime: 'Manhã' },
  { id: 'evo-6', studentId: 'student-7', submissionId: 'submission-4', date: '2024-03-15', weight: 62, height: 163, sleepHours: 7, sleepQuality: 'good', trainingTime: 'Manhã' },
];

// ===== WORKOUT PLANS =====
export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'plan-1',
    tenantId: 'tenant-1',
    studentId: 'student-7',
    personalId: 'user-personal-3',
    submissionId: 'submission-4',
    trainingType: 'ABC',
    muscleSplit: 'A: Peito/Tríceps, B: Costas/Bíceps, C: Pernas/Core',
    exercises: [
      { name: 'Supino reto com halteres', sets: 3, reps: '12-15', load: 'Leve', rest: '60s', notes: 'Movimento controlado' },
      { name: 'Crucifixo inclinado', sets: 3, reps: '12-15', load: 'Leve', rest: '60s' },
      { name: 'Tríceps corda', sets: 3, reps: '15', load: 'Leve', rest: '45s' }
    ],
    personalNotes: 'Evitar carga excessiva devido à hérnia. Foco em fortalecimento do core.',
    fileType: 'text',
    textContent: `FICHA DE TREINO - GABRIELA NUNES
    
Divisão: ABC (3x por semana)

TREINO A - PEITO E TRÍCEPS
1. Supino reto halteres - 3x12-15 (carga leve, movimento controlado)
2. Crucifixo inclinado - 3x12-15
3. Tríceps corda - 3x15
4. Prancha isométrica - 3x30s

TREINO B - COSTAS E BÍCEPS
1. Remada baixa - 3x12-15
2. Pulldown frontal - 3x12-15
3. Rosca direta - 3x15
4. Superman isométrico - 3x30s

TREINO C - PERNAS E CORE
1. Leg press 45° - 3x15 (carga moderada)
2. Cadeira extensora - 3x15
3. Cadeira flexora - 3x15
4. Ponte de glúteos - 3x20

Observações: Sempre aquecer 10min na esteira. Alongar ao final.`,
    downloadLink: 'https://example.com/ficha-gabriela-abc123',
    createdAt: '2024-03-20T16:00:00Z',
    validUntil: '2024-05-20T16:00:00Z'
  }
];

// ===== HELPER FUNCTIONS =====

export const getTenantBySlug = (slug: string): Tenant | undefined => {
  return tenants.find(t => t.slug === slug);
};

export const getUsersByTenant = (tenantId: string): User[] => {
  return users.filter(u => u.tenantId === tenantId);
};

export const getPersonalsByTenant = (tenantId: string): User[] => {
  return users.filter(u => u.tenantId === tenantId && u.role === 'personal');
};

export const getStudentsByTenant = (tenantId: string): Student[] => {
  return students.filter(s => s.tenantId === tenantId);
};

export const getStudentsByPersonal = (personalId: string): Student[] => {
  return students.filter(s => s.personalId === personalId);
};

export const getSubmissionsByTenant = (tenantId: string): FormSubmission[] => {
  return formSubmissions.filter(s => s.tenantId === tenantId);
};

export const getSubmissionsByPersonal = (personalId: string): FormSubmission[] => {
  return formSubmissions.filter(s => s.personalId === personalId);
};

export const getPendingSubmissionsByPersonal = (personalId: string): FormSubmission[] => {
  return formSubmissions.filter(s => s.personalId === personalId && s.status === 'pending');
};

export const getWorkoutPlansByStudent = (studentId: string): WorkoutPlan[] => {
  return workoutPlans.filter(p => p.studentId === studentId);
};

export const getCustomFieldsByPersonal = (personalId: string): CustomField[] => {
  return customFields.filter(f => f.personalId === personalId);
};

export const getSubmissionsByStudent = (studentId: string): FormSubmission[] => {
  return formSubmissions.filter(s => s.studentId === studentId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getEvolutionsByStudent = (studentId: string): StudentEvolution[] => {
  return studentEvolutions.filter(e => e.studentId === studentId).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const authenticateUser = (email: string, password: string, tenantId: string): User | null => {
  const user = users.find(
    u => u.email === email && u.password === password && u.tenantId === tenantId
  );
  return user || null;
};
