import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsPage = () => {
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
            <CardTitle className="text-2xl">Termos de Uso - {tenant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              {tenant.termsOfUse ? (
                <div className="whitespace-pre-wrap">{tenant.termsOfUse}</div>
              ) : (
                <p className="text-muted-foreground">
                  Os termos de uso ainda não foram configurados.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
