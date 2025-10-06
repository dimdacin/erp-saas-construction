import ProjectsTable from "@/components/ProjectsTable";
import AddProjectDialog from "@/components/AddProjectDialog";

export default function Chantiers() {
  const projects = [
    {
      id: "1",
      name: "Construction Immeuble A",
      status: "en_cours" as const,
      budget: 450000,
      spent: 385000,
      progress: 75,
      deadline: "15/12/2025"
    },
    {
      id: "2",
      name: "Rénovation Usine Nord",
      status: "retard" as const,
      budget: 280000,
      spent: 295000,
      progress: 82,
      deadline: "30/11/2025"
    },
    {
      id: "3",
      name: "Extension Entrepôt Sud",
      status: "planifie" as const,
      budget: 520000,
      spent: 0,
      progress: 0,
      deadline: "20/01/2026"
    },
    {
      id: "4",
      name: "Bureau Est - Aménagement",
      status: "en_cours" as const,
      budget: 180000,
      spent: 165000,
      progress: 88,
      deadline: "10/12/2025"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Chantiers</h1>
          <p className="text-muted-foreground mt-1">Gérez vos projets et suivez leur progression</p>
        </div>
        <AddProjectDialog onAdd={(project) => console.log('New project:', project)} />
      </div>

      <ProjectsTable
        projects={projects}
        onView={(id) => console.log('View project:', id)}
        onEdit={(id) => console.log('Edit project:', id)}
      />
    </div>
  );
}
