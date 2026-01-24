import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import SystemLayout from "@/components/layout/SystemLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";

// System Admin Pages (Ficha.Life Admin)
import SystemDashboard from "./pages/system/SystemDashboard";
import AcademiasManagement from "./pages/system/AcademiasManagement";
import PlanosManagement from "./pages/system/PlanosManagement";
import PagamentosHistory from "./pages/system/PagamentosHistory";

// Gerente Pages (Academia Admin)
import GerenteDashboard from "./pages/gerente/GerenteDashboard";
import StaffManagement from "./pages/gerente/StaffManagement";
import GerenteStudentsList from "./pages/gerente/GerenteStudentsList";
import GerenteRequestsList from "./pages/gerente/GerenteRequestsList";
import GerenteSettings from "./pages/gerente/GerenteSettings";
import ShopManagement from "./pages/gerente/ShopManagement";

// Personal Pages
import PersonalDashboard from "./pages/personal/PersonalDashboard";
import PersonalStudentsList from "./pages/personal/PersonalStudentsList";
import PersonalRequestsList from "./pages/personal/PersonalRequestsList";
import FormBuilder from "./pages/personal/FormBuilder";
import InviteLink from "./pages/personal/InviteLink";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentForm from "./pages/student/StudentForm";
import StudentShop from "./pages/student/StudentShop";

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
              
              {/* Onboarding */}
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* System Admin Routes (Ficha.Life Admin) */}
              <Route path="/admin-system" element={<SystemLayout><SystemDashboard /></SystemLayout>} />
              <Route path="/admin-system/academias" element={<SystemLayout><AcademiasManagement /></SystemLayout>} />
              <Route path="/admin-system/planos" element={<SystemLayout><PlanosManagement /></SystemLayout>} />
              <Route path="/admin-system/pagamentos" element={<SystemLayout><PagamentosHistory /></SystemLayout>} />

              {/* Tenant Routes */}
              <Route path="/:slug/login" element={<LoginPage />} />
              <Route path="/:slug/terms" element={<TermsPage />} />
              <Route path="/:slug/privacy" element={<PrivacyPage />} />
              <Route path="/:slug/form/:personalId" element={<StudentForm />} />

              {/* Gerente Routes (Academia Admin) */}
              <Route path="/:slug/gerente" element={<DashboardLayout />}>
                <Route index element={<GerenteDashboard />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="students" element={<GerenteStudentsList />} />
                <Route path="requests" element={<GerenteRequestsList />} />
                <Route path="settings" element={<GerenteSettings />} />
                <Route path="shop" element={<ShopManagement />} />
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
              <Route path="/:slug/aluno" element={<DashboardLayout />}>
                <Route index element={<StudentDashboard />} />
                <Route path="request" element={<StudentForm />} />
                <Route path="shop" element={<StudentShop />} />
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
