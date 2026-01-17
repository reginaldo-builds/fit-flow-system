import { Bell, LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPendingSubmissionsByPersonal, getSubmissionsByTenant } from '@/data/mockData';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { tenant, slug } = useTenant();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Calculate pending notifications based on role
  const getPendingCount = () => {
    if (!user || !tenant) return 0;
    
    if (user.role === 'admin') {
      const submissions = getSubmissionsByTenant(tenant.id);
      return submissions.filter(s => s.status === 'pending').length;
    } else if (user.role === 'personal') {
      return getPendingSubmissionsByPersonal(user.id).length;
    }
    return 0;
  };

  const pendingCount = getPendingCount();

  const handleLogout = () => {
    logout();
    navigate(`/${slug}/login`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'personal': return 'Personal';
      case 'student': return 'Aluno';
      default: return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex items-center gap-3">
        {tenant?.logo ? (
          <img src={tenant.logo} alt={tenant.name} className="h-8 w-auto" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
            {tenant?.name?.charAt(0) || 'G'}
          </div>
        )}
        <span className="font-semibold text-foreground hidden sm:inline">
          {tenant?.name || 'GymFit'}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        {(user?.role === 'admin' || user?.role === 'personal') && (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {pendingCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground"
              >
                {pendingCount > 9 ? '9+' : pendingCount}
              </Badge>
            )}
            <span className="sr-only">Notificações</span>
          </Button>
        )}

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1 text-xs">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${slug}/profile`)}>
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
