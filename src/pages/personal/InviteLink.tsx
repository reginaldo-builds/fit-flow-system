import { useState } from 'react';
import { Copy, Share2, MessageCircle, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

const InviteLink = () => {
  const { user } = useAuth();
  const { tenant, slug } = useTenant();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!user || !tenant) return null;

  const baseUrl = window.location.origin;
  const inviteLink = `${baseUrl}/${slug}/form/${user.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para a área de transferência.'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive'
      });
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Olá! 👋\n\nAcesse o link abaixo para preencher sua ficha de avaliação e solicitar seu treino personalizado:\n\n${inviteLink}\n\nAtenciosamente,\n${user.name}\n${tenant.name}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Link de Cadastro</h1>
        <p className="text-muted-foreground">
          Compartilhe este link com seus alunos para que preencham o formulário de avaliação
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Seu Link Personalizado
          </CardTitle>
          <CardDescription>
            Este link direciona os alunos diretamente para o formulário vinculado a você
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={copyToClipboard} variant="outline">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={copyToClipboard} className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copiar Link
            </Button>
            <Button onClick={shareViaWhatsApp} variant="secondary" className="flex-1">
              <MessageCircle className="mr-2 h-4 w-4" />
              Compartilhar via WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Como funciona?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Compartilhe o link</p>
                <p className="text-sm text-muted-foreground">
                  Envie o link para seus alunos via WhatsApp ou outro meio
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Aluno preenche o formulário</p>
                <p className="text-sm text-muted-foreground">
                  O aluno responde às perguntas de avaliação física e aceita os termos
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Você recebe a solicitação</p>
                <p className="text-sm text-muted-foreground">
                  A solicitação aparece em sua lista e você recebe uma notificação
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-primary-foreground font-bold text-sm">
                4
              </div>
              <div>
                <p className="font-medium">Crie e envie a ficha</p>
                <p className="text-sm text-muted-foreground">
                  Monte a ficha de treino e envie diretamente via WhatsApp
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mensagem sugerida</CardTitle>
          <CardDescription>
            Copie e personalize esta mensagem para enviar aos seus alunos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
{`Olá! 👋

Preparei um formulário de avaliação para montarmos seu treino personalizado. 

📋 Acesse o link abaixo e preencha suas informações:
${inviteLink}

Após o envio, vou criar sua ficha de treino e enviar aqui no WhatsApp!

Abraços,
${user.name}
${tenant.name} 💪`}
          </div>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => {
              const message = `Olá! 👋\n\nPreparei um formulário de avaliação para montarmos seu treino personalizado.\n\n📋 Acesse o link abaixo e preencha suas informações:\n${inviteLink}\n\nApós o envio, vou criar sua ficha de treino e enviar aqui no WhatsApp!\n\nAbraços,\n${user.name}\n${tenant.name} 💪`;
              navigator.clipboard.writeText(message);
              toast({
                title: 'Mensagem copiada!',
                description: 'A mensagem foi copiada para a área de transferência.'
              });
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar Mensagem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteLink;
