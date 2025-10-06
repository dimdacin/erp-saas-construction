import DashboardStats from '../DashboardStats';
import { Building2, Users, Wrench, DollarSign } from 'lucide-react';

export default function DashboardStatsExample() {
  const stats = [
    {
      title: "Chantiers Actifs",
      value: "12",
      trend: { value: "+2 ce mois", isPositive: true },
      icon: <Building2 className="h-4 w-4" />
    },
    {
      title: "Salariés Affectés",
      value: "48",
      trend: { value: "92% utilisation", isPositive: true },
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Équipements en Service",
      value: "35",
      trend: { value: "3 en maintenance", isPositive: false },
      icon: <Wrench className="h-4 w-4" />
    },
    {
      title: "Budget Global",
      value: "€2.4M",
      trend: { value: "+8.2% réalisé", isPositive: false },
      icon: <DollarSign className="h-4 w-4" />
    }
  ];

  return <DashboardStats stats={stats} />;
}
