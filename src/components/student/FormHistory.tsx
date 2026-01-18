import { useState } from 'react';
import { FileText, Calendar, Clock, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Loader2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormSubmission } from '@/types';

interface FormHistoryProps {
  submissions: FormSubmission[];
  onUpdateForm: (submissionId: string) => void;
}

const FormHistory = ({ submissions, onUpdateForm }: FormHistoryProps) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isExpired = (periodEnd: string) => {
    return new Date(periodEnd) < new Date();
  };

  const getStatusBadge = (submission: FormSubmission) => {
    const expired = isExpired(submission.periodEnd);
    
    if (submission.status === 'completed' && !expired) {
      return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Ativa</Badge>;
    }
    if (submission.status === 'completed' && expired) {
      return <Badge variant="outline" className="text-muted-foreground">Expirada</Badge>;
    }
    if (submission.status === 'in_progress') {
      return <Badge variant="secondary">Em Produção</Badge>;
    }
    return <Badge variant="destructive">Aguardando</Badge>;
  };

  const getStatusIcon = (submission: FormSubmission) => {
    if (submission.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (submission.status === 'in_progress') {
      return <Loader2 className="h-5 w-5 text-chart-2 animate-spin" />;
    }
    return <Clock className="h-5 w-5 text-chart-3" />;
  };

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Nenhum formulário encontrado</h3>
          <p className="text-muted-foreground">
            Você ainda não preencheu nenhum formulário de avaliação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission, index) => {
        const expired = isExpired(submission.periodEnd);
        const canUpdate = submission.status === 'completed' && expired;
        const isOpen = openItems.includes(submission.id);
        
        return (
          <Collapsible 
            key={submission.id} 
            open={isOpen}
            onOpenChange={() => toggleItem(submission.id)}
          >
            <Card className={index === 0 ? 'border-primary/50' : ''}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(submission)}
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {submission.objective || 'Avaliação Física'}
                          {index === 0 && <Badge variant="outline" className="text-xs">Atual</Badge>}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(submission.periodStart)} - {formatDate(submission.periodEnd)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(submission)}
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Expired Warning */}
                  {canUpdate && (
                    <div className="flex items-center gap-3 p-4 bg-chart-3/10 border border-chart-3/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-chart-3" />
                      <div className="flex-1">
                        <p className="font-medium text-chart-3">Período expirado</p>
                        <p className="text-sm text-muted-foreground">
                          Atualize suas informações para solicitar uma nova ficha.
                        </p>
                      </div>
                      <Button onClick={() => onUpdateForm(submission.id)} size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Atualizar
                      </Button>
                    </div>
                  )}

                  {/* Form Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Informações Básicas
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Objetivo:</span>
                          <span>{submission.objective || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Experiência:</span>
                          <span>{submission.experience || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frequência semanal:</span>
                          <span>{submission.weeklyFrequency}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tempo disponível:</span>
                          <span>{submission.availableTime} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horário preferido:</span>
                          <span>{submission.preferredTime || '-'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Saúde e Hábitos
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lesões:</span>
                          <span className="text-right max-w-[150px] truncate">{submission.injuries || 'Nenhuma'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horas de sono:</span>
                          <span>{submission.sleepHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Qualidade do sono:</span>
                          <span className="capitalize">{submission.sleepQuality || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nível de atividade:</span>
                          <span>{submission.activityLevel || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nutricionista:</span>
                          <span>{submission.hasNutritionist ? 'Sim' : 'Não'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {submission.additionalNotes && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Observações
                      </h4>
                      <p className="text-sm bg-muted p-3 rounded-lg">
                        {submission.additionalNotes}
                      </p>
                    </div>
                  )}

                  {/* Update Button for active forms */}
                  {submission.status === 'completed' && !expired && (
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => onUpdateForm(submission.id)}
                        className="w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Atualizar Informações
                      </Button>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default FormHistory;
