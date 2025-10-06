import BudgetChart from '../BudgetChart';

export default function BudgetChartExample() {
  const data = [
    { name: 'Immeuble A', previsionnel: 450000, realise: 385000 },
    { name: 'Usine Nord', previsionnel: 280000, realise: 295000 },
    { name: 'Entrepôt Sud', previsionnel: 520000, realise: 125000 },
    { name: 'Bureau Est', previsionnel: 180000, realise: 165000 },
  ];

  return <BudgetChart data={data} />;
}
