import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  ClipboardList, 
  Settings, 
  FileText,
  UserPlus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { getPendingSubmissionsByPersonal, getSubmissionsByTenant } from '@/data/mockData';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { tenant, slug } = useTenant();
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !slug) return null;

  // Calculate pending counts
  const getPendingCount = () => {
    if (!tenant) return 0;
    if (user.role === 'admin') {
      const submissions = getSubmissionsByTenant(tenant.id);
      return submissions.filter(s => s.status === 'pending').length;
    } else if (user.role === 'personal') {
      return getPendingSubmissionsByPersonal(user.id).length;
    }
    return 0;
  };

  const pendingCount = getPendingCount();

  const navItems: NavItem[] = [
    // Admin items
    {
      title: 'Dashboard',
      href: `/${slug}/admin`,
      icon: LayoutDashboard,
      roles: ['admin']
    },
    {
      title: 'Funcionários',
      href: `/${slug}/admin/staff`,
      icon: UserCog,
      roles: ['admin']
    },
    {
      title: 'Alunos',
      href: `/${slug}/admin/students`,
      icon: Users,
      roles: ['admin']
    },
    {
      title: 'Solicitações',
      href: `/${slug}/admin/requests`,
      icon: ClipboardList,
      badge: user.role === 'admin' ? pendingCount : undefined,
      roles: ['admin']
    },
    {
      title: 'Configurações',
      href: `/${slug}/admin/settings`,
      icon: Settings,
      roles: ['admin']
    },

    // Personal items
    {
      title: 'Dashboard',
      href: `/${slug}/personal`,
      icon: LayoutDashboard,
      roles: ['personal']
    },
    {
      title: 'Meus Alunos',
      href: `/${slug}/personal/students`,
      icon: Users,
      roles: ['personal']
    },
    {
      title: 'Solicitações',
      href: `/${slug}/personal/requests`,
      icon: ClipboardList,
      badge: user.role === 'personal' ? pendingCount : undefined,
      roles: ['personal']
    },
    {
      title: 'Formulário',
      href: `/${slug}/personal/form-builder`,
      icon: FileText,
      roles: ['personal']
    },
    {
      title: 'Link de Cadastro',
      href: `/${slug}/personal/invite`,
      icon: UserPlus,
      roles: ['personal']
    },

    // Student items
    {
      title: 'Minhas Fichas',
      href: `/${slug}/student`,
      icon: FileText,
      roles: ['student']
    },
    {
      title: 'Nova Solicitação',
      href: `/${slug}/student/request`,
      icon: ClipboardList,
      roles: ['student']
    },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 transform border-r border-border bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <span className="font-semibold">{tenant?.name || 'GymFit'}</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4">
          {filteredItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive || location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="h-5 min-w-[20px] flex items-center justify-center p-0 text-xs"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
