import ProjectsTable from "@/components/ProjectsTable";
import AddProjectDialog from "@/components/AddProjectDialog";

export default function Chantiers() {
  const projects = [
    {
      id: "1",
      name: "Construction Immeuble Résidentiel Paris 15ème",
      status: "en_cours" as const,
      budget: 450000,
      spent: 385000,
      progress: 75,
      deadline: "15/12/2025"
    },
    {
      id: "2",
      name: "Rénovation Usine Automobile Nord",
      status: "retard" as const,
      budget: 280000,
      spent: 295000,
      progress: 82,
      deadline: "30/11/2025"
    },
    {
      id: "3",
      name: "Extension Entrepôt Logistique Sud",
      status: "planifie" as const,
      budget: 520000,
      spent: 0,
      progress: 0,
      deadline: "20/01/2026"
    },
    {
      id: "4",
      name: "Aménagement Bureaux Entreprise Est",
      status: "en_cours" as const,
      budget: 180000,
      spent: 165000,
      progress: 88,
      deadline: "10/12/2025"
    },
    {
      id: "5",
      name: "Construction Parking Souterrain Centre-Ville",
      status: "en_cours" as const,
      budget: 650000,
      spent: 420000,
      progress: 62,
      deadline: "28/02/2026"
    },
    {
      id: "6",
      name: "Rénovation Façade Immeuble Historique",
      status: "planifie" as const,
      budget: 125000,
      spent: 0,
      progress: 0,
      deadline: "15/03/2026"
    },
    {
      id: "7",
      name: "Installation Système Électrique Usine",
      status: "en_cours" as const,
      budget: 95000,
      spent: 78000,
      progress: 80,
      deadline: "05/01/2026"
    },
    {
      id: "8",
      name: "Construction École Primaire Zone Nord",
      status: "planifie" as const,
      budget: 1200000,
      spent: 0,
      progress: 0,
      deadline: "01/09/2026"
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
