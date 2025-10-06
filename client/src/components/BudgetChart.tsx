import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BudgetData {
  name: string;
  previsionnel: number;
  realise: number;
}

interface BudgetChartProps {
  data: BudgetData[];
}

export default function BudgetChart({ data }: BudgetChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison Budgétaire</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }}
            />
            <Legend />
            <Bar dataKey="previsionnel" fill="hsl(var(--chart-1))" name="Prévisionnel" />
            <Bar dataKey="realise" fill="hsl(var(--chart-3))" name="Réalisé" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
