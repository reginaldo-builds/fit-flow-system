import { Outlet } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  CreditCard, 
  Crown, 
  Settings,
  LogOut 
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SystemAdminLayout = () => {
  const navigate = useNavigate();

  const navItems = [
    { to: '/system', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/system/academias', icon: Building2, label: 'Academias' },
    { to: '/system/planos', icon: Crown, label: 'Planos' },
    { to: '/system/pagamentos', icon: CreditCard, label: 'Pagamentos' },
    { to: '/system/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
            <div>
              <span className="font-bold text-foreground">Ficha.Life</span>
              <p className="text-xs text-muted-foreground">Admin do Sistema</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              activeClassName="bg-accent text-accent-foreground font-medium"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate('/')}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SystemAdminLayout;
