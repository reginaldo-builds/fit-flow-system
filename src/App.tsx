import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";

// Admin Pages
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

              {/* Tenant Routes */}
              <Route path="/:slug/login" element={<LoginPage />} />
              <Route path="/:slug/terms" element={<TermsPage />} />
              <Route path="/:slug/privacy" element={<PrivacyPage />} />
              <Route path="/:slug/form/:personalId" element={<StudentForm />} />

              {/* Admin Routes */}
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
