import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPage = () => {
  const { tenant } = useTenant();

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Política de Privacidade (LGPD) - {tenant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              {tenant.privacyPolicy ? (
                <div className="whitespace-pre-wrap">{tenant.privacyPolicy}</div>
              ) : (
                <p className="text-muted-foreground">
                  A política de privacidade ainda não foi configurada.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
