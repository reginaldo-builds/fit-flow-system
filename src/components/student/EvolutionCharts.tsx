import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, Moon, Clock, Activity } from 'lucide-react';
import { StudentEvolution } from '@/types';

interface EvolutionChartsProps {
  evolutions: StudentEvolution[];
}

const sleepQualityMap: Record<string, number> = {
  'poor': 1,
  'regular': 2,
  'good': 3,
  'excellent': 4
};

const sleepQualityLabels: Record<number, string> = {
  1: 'Ruim',
  2: 'Regular',
  3: 'Bom',
  4: 'Excelente'
};

const EvolutionCharts = ({ evolutions }: EvolutionChartsProps) => {
  if (evolutions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Sem dados de evolução</h3>
          <p className="text-muted-foreground">
            Os dados de evolução aparecerão aqui após preencher formulários.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = evolutions.map(evo => ({
    date: new Date(evo.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    peso: evo.weight,
    sono: evo.sleepHours,
    qualidadeSono: sleepQualityMap[evo.sleepQuality] || 2,
  }));

  const firstWeight = evolutions[0]?.weight || 0;
  const lastWeight = evolutions[evolutions.length - 1]?.weight || 0;
  const weightChange = lastWeight - firstWeight;
  const avgSleep = evolutions.reduce((sum, e) => sum + e.sleepHours, 0) / evolutions.length;
  const lastSleepQuality = evolutions[evolutions.length - 1]?.sleepQuality || 'regular';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variação de Peso</CardTitle>
            <TrendingDown className={`h-4 w-4 ${weightChange < 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
            </div>
            <p className="text-xs text-muted-foreground">
              {firstWeight} kg → {lastWeight} kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média de Sono</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSleep.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              por noite
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualidade do Sono</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {sleepQualityLabels[sleepQualityMap[lastSleepQuality]] || 'Regular'}
            </div>
            <p className="text-xs text-muted-foreground">
              última avaliação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weight Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Evolução do Peso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="peso" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Peso (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sleep Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              Horas de Sono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[0, 10]} className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="sono" 
                  fill="hsl(var(--chart-2))" 
                  radius={[4, 4, 0, 0]}
                  name="Horas"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Qualidade do Sono
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis 
                  domain={[0, 4]} 
                  ticks={[1, 2, 3, 4]}
                  tickFormatter={(value) => sleepQualityLabels[value] || ''}
                  className="text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [sleepQualityLabels[value], 'Qualidade']}
                />
                <Line 
                  type="monotone" 
                  dataKey="qualidadeSono" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-3))' }}
                  name="Qualidade"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvolutionCharts;
