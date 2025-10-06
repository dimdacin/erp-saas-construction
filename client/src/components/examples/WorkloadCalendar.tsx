import WorkloadCalendar from '../WorkloadCalendar';

export default function WorkloadCalendarExample() {
  const assignments = [
    {
      id: "1",
      resource: "Jean Dupont",
      project: "Construction Immeuble A",
      startDate: "01/12/2025",
      endDate: "15/12/2025",
      hoursPerDay: 8
    },
    {
      id: "2",
      resource: "Marie Martin",
      project: "Rénovation Usine Nord",
      startDate: "01/12/2025",
      endDate: "30/12/2025",
      hoursPerDay: 7
    },
    {
      id: "3",
      resource: "Pierre Durand",
      project: "Extension Entrepôt Sud",
      startDate: "10/12/2025",
      endDate: "20/12/2025",
      hoursPerDay: 5
    }
  ];

  return <WorkloadCalendar assignments={assignments} />;
}
