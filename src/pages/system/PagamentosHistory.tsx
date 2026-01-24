import { useState } from 'react';
import { 
  CreditCard, Search, Calendar, TrendingUp, 
  CheckCircle, XCircle, Clock, RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { academias, plans } from '@/data/mockData';
import { Payment, PaymentStatus } from '@/types';

// Mock de pagamentos
const mockPayments: Payment[] = academias.map((academia, index) => ({
  id: `pay-${index + 1}`,
  academiaId: academia.id,
  mpPaymentId: `MP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  status: ['approved', 'pending', 'approved', 'approved'][index % 4] as PaymentStatus,
  amount: plans.find(p => p.id === academia.planId)?.priceMonthly || 0,
  paymentMethod: index % 2 === 0 ? 'pix' : 'credit_card',
  periodStart: new Date(2024, new Date().getMonth(), 1).toISOString(),
  periodEnd: new Date(2024, new Date().getMonth() + 1, 0).toISOString(),
  createdAt: new Date(2024, new Date().getMonth(), index + 1).toISOString(),
}));

const PagamentosHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [payments] = useState(mockPayments);

  const filteredPayments = payments.filter(payment => {
    const academia = academias.find(a => a.id === payment.academiaId);
    const matchesSearch = academia?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.mpPaymentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalReceita = payments
    .filter(p => p.status === 'approved')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendentes = payments.filter(p => p.status === 'pending').length;

  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, label: 'Aprovado', variant: 'default' as const, color: 'text-green-500' };
      case 'pending':
        return { icon: Clock, label: 'Pendente', variant: 'secondary' as const, color: 'text-yellow-500' };
      case 'rejected':
        return { icon: XCircle, label: 'Rejeitado', variant: 'destructive' as const, color: 'text-destructive' };
      case 'refunded':
        return { icon: RefreshCw, label: 'Reembolsado', variant: 'outline' as const, color: 'text-muted-foreground' };
      default:
        return { icon: Clock, label: status, variant: 'outline' as const, color: 'text-muted-foreground' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Histórico de Pagamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe todos os pagamentos das academias
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(totalReceita)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Pagamentos
            </CardTitle>
            <CreditCard className="h-5 w-5 text-chart-1" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">
              {payments.length}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">
              {pendentes}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por academia ou ID do pagamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
            <SelectItem value="refunded">Reembolsados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium">Academia</th>
                  <th className="text-left py-3 px-4 font-medium">ID Pagamento</th>
                  <th className="text-left py-3 px-4 font-medium">Método</th>
                  <th className="text-left py-3 px-4 font-medium">Valor</th>
                  <th className="text-left py-3 px-4 font-medium">Período</th>
                  <th className="text-left py-3 px-4 font-medium">Data</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const academia = academias.find(a => a.id === payment.academiaId);
                  const plan = plans.find(p => p.id === academia?.planId);
                  const statusConfig = getStatusConfig(payment.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{academia?.name}</p>
                          <p className="text-sm text-muted-foreground">{plan?.displayName}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {payment.mpPaymentId}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {payment.paymentMethod === 'pix' ? 'Pix' : 'Cartão'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(payment.periodStart)} - {formatDate(payment.periodEnd)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusConfig.variant} className="flex items-center gap-1 w-fit">
                          <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                          {statusConfig.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="py-12 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Nenhum pagamento encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PagamentosHistory;
