import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SystemAdminLayout from "@/components/layout/SystemAdminLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";

// System Admin Pages
import SystemAdminDashboard from "./pages/system/SystemAdminDashboard";
import SystemAcademiasList from "./pages/system/SystemAcademiasList";
import SystemPlans from "./pages/system/SystemPlans";
import SystemPayments from "./pages/system/SystemPayments";

// Gerente (Admin da Academia) Pages
import GerenteDashboard from "./pages/gerente/GerenteDashboard";
import GerentePersonais from "./pages/gerente/GerentePersonais";
import GerenteSettings from "./pages/gerente/GerenteSettings";
import GerenteLoja from "./pages/gerente/GerenteLoja";

// Admin Pages (legacy - redirect to gerente)
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffManagement from "./pages/admin/StaffManagement";
import AdminStudentsList from "./pages/admin/AdminStudentsList";
import AdminRequestsList from "./pages/admin/AdminRequestsList";
import AdminSettings from "./pages/admin/AdminSettings";

// Personal Pages
import PersonalDashboard from "./pages/personal/PersonalDashboard";
import PersonalStudentsList from "./pages/personal/PersonalStudentsList";
import PersonalRequestsList from "./pages/personal/PersonalRequestsList";
import FormBuilder from "./pages/personal/FormBuilder";
import InviteLink from "./pages/personal/InviteLink";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentForm from "./pages/student/StudentForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantProvider>
          <AuthProvider>
            <Routes>
              {/* Home - Landing page */}
              <Route path="/" element={<HomePage />} />
              
              {/* Onboarding - Cadastro de nova academia */}
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* System Admin Routes (Admin do Sistema) */}
              <Route path="/system" element={<SystemAdminLayout />}>
                <Route index element={<SystemAdminDashboard />} />
                <Route path="academias" element={<SystemAcademiasList />} />
                <Route path="planos" element={<SystemPlans />} />
                <Route path="pagamentos" element={<SystemPayments />} />
              </Route>

              {/* Tenant Routes */}
              <Route path="/:slug/login" element={<LoginPage />} />
              <Route path="/:slug/terms" element={<TermsPage />} />
              <Route path="/:slug/privacy" element={<PrivacyPage />} />
              <Route path="/:slug/form/:personalId" element={<StudentForm />} />

              {/* Gerente Routes (Admin da Academia) */}
              <Route path="/:slug/gerente" element={<DashboardLayout />}>
                <Route index element={<GerenteDashboard />} />
                <Route path="personais" element={<GerentePersonais />} />
                <Route path="alunos" element={<AdminStudentsList />} />
                <Route path="solicitacoes" element={<AdminRequestsList />} />
                <Route path="loja" element={<GerenteLoja />} />
                <Route path="configuracoes" element={<GerenteSettings />} />
              </Route>

              {/* Admin Routes (legacy - mantido para compatibilidade) */}
              <Route path="/:slug/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="students" element={<AdminStudentsList />} />
                <Route path="requests" element={<AdminRequestsList />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Personal Routes */}
              <Route path="/:slug/personal" element={<DashboardLayout />}>
                <Route index element={<PersonalDashboard />} />
                <Route path="students" element={<PersonalStudentsList />} />
                <Route path="requests" element={<PersonalRequestsList />} />
                <Route path="form-builder" element={<FormBuilder />} />
                <Route path="invite" element={<InviteLink />} />
              </Route>

              {/* Student Routes */}
              <Route path="/:slug/student" element={<DashboardLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="request" element={<StudentForm />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TenantProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
