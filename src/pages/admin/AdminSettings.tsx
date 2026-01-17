import { useState } from 'react';
import { Save, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    name: tenant?.name || '',
    whatsapp: tenant?.whatsapp || '',
    logo: tenant?.logo || '',
    termsOfUse: tenant?.termsOfUse || '',
    privacyPolicy: tenant?.privacyPolicy || ''
  });

  if (!tenant) return null;

  const handleSaveGeneral = () => {
    toast({
      title: 'Configurações salvas!',
      description: 'As informações da academia foram atualizadas.',
    });
  };

  const handleSaveTerms = () => {
    toast({
      title: 'Termos atualizados!',
      description: 'Os termos de uso foram salvos com sucesso.',
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: 'Política atualizada!',
      description: 'A política de privacidade foi salva com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da academia
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="terms">Termos de Uso</TabsTrigger>
          <TabsTrigger value="privacy">Política LGPD</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Academia</CardTitle>
              <CardDescription>
                Configure o nome, logo e informações de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Academia</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Nome da sua academia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="+55 88 99999-9999"
                />
                <p className="text-xs text-muted-foreground">
                  Número de contato principal da academia
                </p>
              </div>

              <div className="space-y-2">
                <Label>Logo da Academia</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center border-2 border-dashed border-border bg-muted">
                    {settings.logo ? (
                      <img src={settings.logo} alt="Logo" className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {settings.name.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recomendado: imagem quadrada, mínimo 200x200px
                </p>
              </div>

              <Button onClick={handleSaveGeneral}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Termos de Uso
              </CardTitle>
              <CardDescription>
                Defina os termos de uso que os alunos devem aceitar ao se cadastrar.
                Suporta formatação Markdown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={settings.termsOfUse}
                onChange={(e) => setSettings({ ...settings, termsOfUse: e.target.value })}
                placeholder="# Termos de Uso&#10;&#10;Digite aqui os termos de uso da academia..."
                className="min-h-[400px] font-mono text-sm"
              />
              <Button onClick={handleSaveTerms}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Termos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Política de Privacidade (LGPD)
              </CardTitle>
              <CardDescription>
                Defina a política de privacidade conforme a Lei Geral de Proteção de Dados.
                Suporta formatação Markdown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={settings.privacyPolicy}
                onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
                placeholder="# Política de Privacidade&#10;&#10;Digite aqui a política de privacidade..."
                className="min-h-[400px] font-mono text-sm"
              />
              <Button onClick={handleSavePrivacy}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Política
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
