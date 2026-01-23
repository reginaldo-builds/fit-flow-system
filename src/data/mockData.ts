import { Academia, User, Student, CustomField, FormSubmission, WorkoutPlan, StudentEvolution, Plan, Product } from '@/types';

// ===== PLANOS =====
export const plans: Plan[] = [
  {
    id: 'plan-master',
    name: 'master',
    displayName: 'Master',
    priceMonthly: 49.90,
    priceYearly: 479.00,
    maxPersonals: 1,
    features: { customFields: false, charts: false, shop: false, customPage: false },
    description: 'Ideal para academias pequenas'
  },
  {
    id: 'plan-premium',
    name: 'premium',
    displayName: 'Premium',
    priceMonthly: 99.90,
    priceYearly: 959.00,
    maxPersonals: 3,
    features: { customFields: true, charts: true, shop: false, customPage: false },
    description: 'Para academias em crescimento'
  },
  {
    id: 'plan-elite',
    name: 'elite',
    displayName: 'Elite',
    priceMonthly: 199.90,
    priceYearly: 1919.00,
    maxPersonals: 10,
    features: { customFields: true, charts: true, shop: true, customPage: true },
    description: 'Recursos completos'
  }
];

// ===== ACADEMIAS =====
export const academias: Academia[] = [
  {
    id: 'academia-1',
    slug: 'caxufit',
    name: 'CaxuFit Academia',
    email: 'contato@caxufit.com',
    whatsapp: '+5588999999999',
    planId: 'plan-elite',
    plan: plans[2],
    isActive: true,
    blocked: false,
    termsOfUse: `# Termos de Uso - CaxuFit Academia\n\n## 1. Aceitação dos Termos\nAo utilizar nossos serviços, você concorda com estes termos.`,
    privacyPolicy: `# Política de Privacidade - LGPD\n\n## 1. Coleta de Dados\nColetamos dados pessoais necessários para a prestação dos serviços.`,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'academia-2',
    slug: 'profit',
    name: 'Profit Fitness',
    email: 'contato@profit.com',
    whatsapp: '+5588888888888',
    planId: 'plan-premium',
    plan: plans[1],
    isActive: true,
    blocked: false,
    termsOfUse: `# Termos de Uso - Profit Fitness`,
    privacyPolicy: `# Política de Privacidade - LGPD`,
    createdAt: '2024-02-01T00:00:00Z'
  }
];

// Alias para compatibilidade
export const tenants = academias;

// ===== USERS =====
export const users: User[] = [
  // Admin do Sistema
  {
    id: 'user-admin-system',
    name: 'Admin Sistema',
    email: 'admin@ficha.life',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // CaxuFit Users
  {
    id: 'user-gerente-1',
    academiaId: 'academia-1',
    name: 'Carlos Silva',
    email: 'gerente@caxufit.com',
    password: 'gerente123',
    role: 'gerente',
    whatsapp: '+5588999999999',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-personal-1',
    academiaId: 'academia-1',
    name: 'João Oliveira',
    email: 'joao@caxufit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588991111111',
    canDeleteStudents: true,
    canCreateCustomFields: true,
    canManageShop: true,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'user-personal-2',
    academiaId: 'academia-1',
    name: 'Maria Santos',
    email: 'maria@caxufit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588992222222',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'user-aluno-1',
    academiaId: 'academia-1',
    personalId: 'user-personal-1',
    name: 'Ana Ferreira',
    email: 'ana@email.com',
    password: 'aluno123',
    role: 'aluno',
    whatsapp: '+5588994444444',
    birthDate: '1995-05-15',
    gender: 'female',
    height: 165,
    weight: 62,
    createdAt: '2024-02-01T00:00:00Z'
  },
  // Profit Users
  {
    id: 'user-gerente-2',
    academiaId: 'academia-2',
    name: 'Roberto Almeida',
    email: 'gerente@profit.com',
    password: 'gerente123',
    role: 'gerente',
    whatsapp: '+5588888888888',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user-personal-4',
    academiaId: 'academia-2',
    name: 'Lucas Mendes',
    email: 'lucas@profit.com',
    password: 'personal123',
    role: 'personal',
    whatsapp: '+5588887777777',
    createdAt: '2024-02-05T00:00:00Z'
  }
];

// ===== STUDENTS =====
export const students: Student[] = [
  {
    id: 'student-1',
    academiaId: 'academia-1',
    personalId: 'user-personal-1',
    name: 'Ana Ferreira',
    whatsapp: '+5588994444444',
    email: 'ana@email.com',
    birthDate: '1995-05-15',
    gender: 'female',
    height: 165,
    weight: 62,
    hasAccount: true,
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'student-2',
    academiaId: 'academia-1',
    personalId: 'user-personal-1',
    name: 'Bruno Lima',
    whatsapp: '+5588995555555',
    email: 'bruno@email.com',
    birthDate: '1990-08-20',
    gender: 'male',
    height: 178,
    weight: 85,
    hasAccount: true,
    createdAt: '2024-02-05T00:00:00Z'
  },
  {
    id: 'student-3',
    academiaId: 'academia-1',
    personalId: 'user-personal-2',
    name: 'Camila Rocha',
    whatsapp: '+5588996666666',
    email: 'camila@email.com',
    hasAccount: false,
    createdAt: '2024-02-10T00:00:00Z'
  },
  {
    id: 'student-11',
    academiaId: 'academia-2',
    personalId: 'user-personal-4',
    name: 'Karla Ribeiro',
    whatsapp: '+5588881111111',
    email: 'karla@email.com',
    hasAccount: false,
    createdAt: '2024-03-01T00:00:00Z'
  }
];

// ===== CUSTOM FIELDS =====
export const customFields: CustomField[] = [
  {
    id: 'field-1',
    academiaId: 'academia-1',
    personalId: 'user-personal-1',
    name: 'suplementos',
    label: 'Usa suplementos? Quais?',
    type: 'textarea',
    required: false,
    order: 1
  },
  {
    id: 'field-2',
    academiaId: 'academia-1',
    personalId: 'user-personal-1',
    name: 'experiencia_cardio',
    label: 'Experiência com cardio',
    type: 'select',
    options: ['Nenhuma', 'Básica', 'Intermediária', 'Avançada'],
    required: true,
    order: 2
  }
];

// ===== FORM SUBMISSIONS =====
export const formSubmissions: FormSubmission[] = [
  {
    id: 'submission-1',
    academiaId: 'academia-1',
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
    activityLevel: 'Sedentário',
    profession: 'Analista de sistemas',
    sleepHours: 7,
    sleepQuality: 'regular',
    hasNutritionist: false,
    waterIntake: 'Médio',
    preferredTime: 'Manhã',
    trainingLocation: 'Academia',
    acceptedTerms: true,
    acceptedPrivacy: true,
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-04-01T10:00:00Z'
  },
  {
    id: 'submission-2',
    academiaId: 'academia-1',
    studentId: 'student-2',
    personalId: 'user-personal-1',
    status: 'completed',
    periodStart: '2024-03-01',
    periodEnd: '2024-04-01',
    objective: 'Ganho de massa',
    experience: 'Intermediário',
    weeklyFrequency: 5,
    sleepHours: 6,
    sleepQuality: 'good',
    acceptedTerms: true,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  },
  {
    id: 'submission-ana-1',
    academiaId: 'academia-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    status: 'completed',
    periodStart: '2024-01-01',
    periodEnd: '2024-02-01',
    objective: 'Emagrecimento',
    sleepHours: 5,
    sleepQuality: 'poor',
    acceptedTerms: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  },
  {
    id: 'submission-ana-2',
    academiaId: 'academia-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    status: 'completed',
    periodStart: '2024-02-01',
    periodEnd: '2024-03-01',
    objective: 'Emagrecimento',
    sleepHours: 6,
    sleepQuality: 'regular',
    acceptedTerms: true,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 'submission-ana-3',
    academiaId: 'academia-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    status: 'completed',
    periodStart: '2024-03-01',
    periodEnd: '2024-04-01',
    objective: 'Emagrecimento e tonificação',
    sleepHours: 7,
    sleepQuality: 'good',
    acceptedTerms: true,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  }
];

// ===== STUDENT EVOLUTION DATA =====
export const studentEvolutions: StudentEvolution[] = [
  { id: 'evo-1', studentId: 'student-1', submissionId: 'submission-ana-1', date: '2024-01-01', weight: 70, height: 165, sleepHours: 5, sleepQuality: 'poor', trainingTime: 'Manhã' },
  { id: 'evo-2', studentId: 'student-1', submissionId: 'submission-ana-2', date: '2024-02-01', weight: 68, height: 165, sleepHours: 6, sleepQuality: 'regular', trainingTime: 'Manhã' },
  { id: 'evo-3', studentId: 'student-1', submissionId: 'submission-ana-3', date: '2024-03-01', weight: 65, height: 165, sleepHours: 7, sleepQuality: 'good', trainingTime: 'Manhã' },
  { id: 'evo-4', studentId: 'student-1', submissionId: 'submission-1', date: '2024-04-01', weight: 62, height: 165, sleepHours: 7, sleepQuality: 'good', trainingTime: 'Manhã' },
];

// ===== WORKOUT PLANS =====
export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'plan-1',
    academiaId: 'academia-1',
    studentId: 'student-1',
    personalId: 'user-personal-1',
    submissionId: 'submission-ana-3',
    trainingType: 'ABC',
    muscleSplit: 'A: Peito/Tríceps, B: Costas/Bíceps, C: Pernas/Core',
    fileType: 'text',
    textContent: `FICHA DE TREINO - ANA FERREIRA\n\nDivisão: ABC (3x por semana)`,
    secureToken: 'abc123token',
    createdAt: '2024-03-05T16:00:00Z',
    validUntil: '2024-05-05T16:00:00Z'
  }
];

// ===== PRODUCTS (LOJA) =====
export const products: Product[] = [
  {
    id: 'product-1',
    academiaId: 'academia-1',
    name: 'Whey Protein 1kg',
    description: 'Whey protein concentrado sabor chocolate',
    price: 129.90,
    imageUrl: 'https://via.placeholder.com/300',
    isActive: true,
    createdById: 'user-personal-1',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'product-2',
    academiaId: 'academia-1',
    name: 'Creatina 300g',
    description: 'Creatina monohidratada pura',
    price: 89.90,
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z'
  }
];

// ===== HELPER FUNCTIONS =====

export const getAcademiaBySlug = (slug: string): Academia | undefined => {
  return academias.find(a => a.slug === slug);
};

// Alias para compatibilidade
export const getTenantBySlug = getAcademiaBySlug;

export const getUsersByAcademia = (academiaId: string): User[] => {
  return users.filter(u => u.academiaId === academiaId);
};

export const getPersonalsByAcademia = (academiaId: string): User[] => {
  return users.filter(u => u.academiaId === academiaId && u.role === 'personal');
};

export const getStudentsByAcademia = (academiaId: string): Student[] => {
  return students.filter(s => s.academiaId === academiaId);
};

export const getStudentsByPersonal = (personalId: string): Student[] => {
  return students.filter(s => s.personalId === personalId);
};

export const getSubmissionsByAcademia = (academiaId: string): FormSubmission[] => {
  return formSubmissions.filter(s => s.academiaId === academiaId);
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

export const getProductsByAcademia = (academiaId: string): Product[] => {
  return products.filter(p => p.academiaId === academiaId && p.isActive);
};

export const authenticateUser = (email: string, password: string, academiaId?: string): User | null => {
  const user = users.find(u => {
    if (u.email !== email || u.password !== password) return false;
    if (u.role === 'admin') return true;
    return u.academiaId === academiaId;
  });
  return user || null;
};

// Aliases para compatibilidade
export const getUsersByTenant = getUsersByAcademia;
export const getPersonalsByTenant = getPersonalsByAcademia;
export const getStudentsByTenant = getStudentsByAcademia;
export const getSubmissionsByTenant = getSubmissionsByAcademia;
