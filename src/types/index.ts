// ===== ENUMS =====
export type UserRole = 'admin' | 'gerente' | 'personal' | 'aluno';

export type RequestStatus = 'pending' | 'in_progress' | 'completed';

export type FieldType = 'text' | 'number' | 'select' | 'boolean' | 'textarea' | 'date';

export type PlanType = 'master' | 'premium' | 'elite';

export type SleepQuality = 'poor' | 'regular' | 'good' | 'excellent';

// ===== PLANOS =====

export interface Plan {
  id: string;
  name: PlanType;
  displayName: string;
  priceMonthly: number;
  priceYearly: number;
  maxPersonals: number;
  features: PlanFeatures;
  description: string;
}

export interface PlanFeatures {
  customFields: boolean;
  charts: boolean;
  shop: boolean;
  customPage: boolean;
}

// ===== CORE ENTITIES =====

export interface Academia {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  whatsapp: string;
  email: string;
  
  // Plano e status
  planId: string;
  plan?: Plan;
  isActive: boolean;
  blocked: boolean;
  blockedReason?: string;
  
  // Termos e políticas
  termsOfUse?: string;
  privacyPolicy?: string;
  
  // Mercado Pago
  mpSubscriptionId?: string;
  mpPayerId?: string;
  
  // Página personalizada (Elite)
  customPageUrl?: string;
  customPageRequested?: boolean;
  
  createdAt: string;
}

// Alias para compatibilidade
export type Tenant = Academia;

export interface User {
  id: string;
  academiaId?: string;
  academia?: Academia;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  whatsapp?: string;
  avatar?: string;
  
  // Relacionamento com personal (para alunos)
  personalId?: string;
  
  // Permissões do personal
  canDeleteStudents?: boolean;
  canCreateCustomFields?: boolean;
  canManageShop?: boolean;
  
  // Dados de perfil do aluno
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  
  createdAt: string;
}

export interface Student {
  id: string;
  academiaId: string;
  personalId: string;
  userId?: string; // Referência ao User se tiver conta
  name: string;
  whatsapp: string;
  email?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  avatar?: string;
  hasAccount: boolean; // Se já tem senha criada
  createdAt: string;
}

export interface CustomField {
  id: string;
  academiaId: string;
  personalId: string;
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required: boolean;
  order: number;
}

export interface FormSubmission {
  id: string;
  academiaId: string;
  studentId: string;
  personalId: string;
  status: RequestStatus;
  
  // Período de validade
  periodStart?: string;
  periodEnd?: string;
  isExpired?: boolean;
  
  // Dados básicos
  objective?: string;
  experience?: string;
  weeklyFrequency?: number;
  availableTime?: number;
  
  // Saúde
  injuries?: string;
  diseases?: string;
  medications?: string;
  surgeries?: string;
  painPoints?: string;
  
  // Hábitos
  activityLevel?: string;
  profession?: string;
  sleepHours?: number;
  sleepQuality?: SleepQuality;
  hasNutritionist?: boolean;
  waterIntake?: string;
  
  // Preferências
  preferredTime?: string;
  trainingLocation?: string;
  likedExercises?: string;
  dislikedExercises?: string;
  additionalNotes?: string;
  
  // Campos personalizados
  customFieldsData?: Record<string, unknown>;
  
  // Termos
  acceptedTerms: boolean;
  acceptedPrivacy?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// Alias para compatibilidade
export type Solicitacao = FormSubmission;

export interface StudentEvolution {
  id: string;
  studentId: string;
  submissionId: string;
  date: string;
  weight: number;
  height?: number;
  sleepHours: number;
  sleepQuality: SleepQuality;
  trainingTime?: string;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  academiaId: string;
  studentId: string;
  personalId: string;
  submissionId: string;
  
  trainingType?: string;
  muscleSplit?: string;
  exercises?: Exercise[];
  personalNotes?: string;
  
  // Arquivo (PDF, imagem ou texto)
  fileUrl?: string;
  fileType?: 'pdf' | 'image' | 'text';
  textContent?: string;
  
  // Link seguro
  secureToken?: string;
  downloadLink?: string;
  
  createdAt: string;
  validUntil?: string;
}

// Alias para compatibilidade
export type FichaTreino = WorkoutPlan;

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  load?: string;
  rest?: string;
  notes?: string;
}

// ===== LOJA (Elite) =====

export interface Product {
  id: string;
  academiaId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
  createdById?: string;
  createdAt: string;
}

// ===== PAGAMENTOS =====

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded';

export interface Payment {
  id: string;
  academiaId: string;
  mpPaymentId: string;
  status: PaymentStatus;
  amount: number;
  paymentMethod: 'pix' | 'credit_card';
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  academiaId: string;
  mpSubscriptionId: string;
  status: 'pending' | 'authorized' | 'paused' | 'cancelled';
  planId: string;
  nextPaymentDate?: string;
  createdAt: string;
}

// ===== AUTH =====

export interface AuthState {
  user: User | null;
  academia: Academia | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ===== DASHBOARD STATS =====

export interface AdminSystemStats {
  totalAcademias: number;
  academiasAtivas: number;
  academiasBloqueadas: number;
  porPlano: { plan: PlanType; count: number }[];
  receitaMes: number;
}

export interface GerenteStats {
  totalPersonais: number;
  totalAlunos: number;
  solicitacoesPendentes: number;
  limitePlano: number;
}

export interface PersonalStats {
  totalStudents: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedThisMonth: number;
}

export interface AlunoStats {
  totalFormularios: number;
  ultimaFicha?: WorkoutPlan;
  podeAtualizar: boolean;
  hasCharts: boolean;
  hasShop: boolean;
}

// ===== ONBOARDING =====

export interface OnboardingData {
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
  };
  planId: string;
  paymentMethod: 'pix' | 'credit_card';
  cardToken?: string;
}
