import { DollarSign, Search, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { academias, plans } from '@/data/mockData';

// Mock de pagamentos
const mockPayments = [
  {
    id: 'pay-1',
    academiaId: 'academia-1',
    amount: 199.90,
    status: 'approved',
    method: 'pix',
    createdAt: '2024-04-01T10:00:00Z'
  },
  {
    id: 'pay-2',
    academiaId: 'academia-2',
    amount: 99.90,
    status: 'approved',
    method: 'credit_card',
    createdAt: '2024-04-02T14:30:00Z'
  },
  {
    id: 'pay-3',
    academiaId: 'academia-1',
    amount: 199.90,
    status: 'pending',
    method: 'pix',
    createdAt: '2024-04-15T09:00:00Z'
  }
];

const SystemPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getAcademia = (academiaId: string) => {
    return academias.find(a => a.id === academiaId);
  };

  const totalApproved = mockPayments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = mockPayments.filter(payment => {
    const academia = getAcademia(payment.academiaId);
    return academia?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           academia?.slug.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pagamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe os pagamentos das academias
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Aprovado (Mês)
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">
              R$ {totalApproved.toFixed(2)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendente
            </CardTitle>
            <Calendar className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">
              R$ {totalPending.toFixed(2)}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Transações
            </CardTitle>
            <DollarSign className="h-5 w-5 text-chart-1" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-foreground">
              {mockPayments.length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Histórico de Pagamentos
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por academia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Academia</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const academia = getAcademia(payment.academiaId);
                const plan = plans.find(p => p.id === academia?.planId);
                
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{academia?.name}</p>
                        <p className="text-sm text-muted-foreground">/{academia?.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{plan?.displayName}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      R$ {payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {payment.method === 'pix' ? 'Pix' : 'Cartão'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          payment.status === 'approved' ? 'default' :
                          payment.status === 'pending' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {payment.status === 'approved' ? 'Aprovado' :
                         payment.status === 'pending' ? 'Pendente' :
                         'Rejeitado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemPayments;
