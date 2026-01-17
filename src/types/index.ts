// ===== ENUMS =====
export type UserRole = 'admin' | 'personal' | 'student';

export type RequestStatus = 'pending' | 'in_progress' | 'completed';

export type FieldType = 'text' | 'number' | 'select' | 'boolean' | 'textarea' | 'date';

// ===== CORE ENTITIES =====

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  whatsapp: string;
  termsOfUse?: string;
  privacyPolicy?: string;
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  whatsapp?: string;
  avatar?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  tenantId: string;
  personalId: string;
  name: string;
  whatsapp: string;
  email?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  avatar?: string;
  createdAt: string;
}

export interface CustomField {
  id: string;
  tenantId: string;
  personalId: string;
  name: string;
  label: string;
  type: FieldType;
  options?: string[]; // For select fields
  required: boolean;
  order: number;
}

export interface FormSubmission {
  id: string;
  tenantId: string;
  studentId: string;
  personalId: string;
  status: RequestStatus;
  
  // Basic Info
  objective?: string;
  experience?: string;
  weeklyFrequency?: number;
  availableTime?: number;
  
  // Health
  injuries?: string;
  diseases?: string;
  medications?: string;
  surgeries?: string;
  painPoints?: string;
  
  // Habits
  activityLevel?: string;
  profession?: string;
  sleepHours?: number;
  hasNutritionist?: boolean;
  waterIntake?: string;
  
  // Preferences
  preferredTime?: string;
  trainingLocation?: string;
  likedExercises?: string;
  dislikedExercises?: string;
  additionalNotes?: string;
  
  // Custom fields data
  customFieldsData?: Record<string, unknown>;
  
  // Terms
  acceptedTerms: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: string;
  tenantId: string;
  studentId: string;
  personalId: string;
  submissionId: string;
  
  trainingType?: string;
  muscleSplit?: string;
  exercises?: Exercise[];
  personalNotes?: string;
  
  // File can be PDF, image, or text
  fileUrl?: string;
  fileType?: 'pdf' | 'image' | 'text';
  textContent?: string;
  
  downloadLink?: string;
  
  createdAt: string;
  validUntil?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  load?: string;
  rest?: string;
  notes?: string;
}

// ===== AUTH =====

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ===== DASHBOARD STATS =====

export interface AdminStats {
  totalPersonals: number;
  totalStudents: number;
  pendingRequests: number;
  completedThisMonth: number;
}

export interface PersonalStats {
  totalStudents: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedThisMonth: number;
}
