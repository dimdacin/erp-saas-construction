import ProjectsTable from "@/components/ProjectsTable";
import AddProjectDialog from "@/components/AddProjectDialog";
import { useQuery } from "@tanstack/react-query";
import type { Chantier } from "@shared/schema";

export default function Chantiers() {
  const { data: chantiers, isLoading } = useQuery<Chantier[]>({
    queryKey: ["/api/chantiers"],
  });

  const mapChantierToProject = (chantier: Chantier) => {
    const budgetPrev = Number(chantier.budgetPrevisionnel);
    const budgetReal = Number(chantier.budgetRealise);
    
    let status: "en_cours" | "retard" | "planifie" = "en_cours";
    if (chantier.statut === "planifie" || chantier.progression === 0) {
      status = "planifie";
    } else if (budgetReal > budgetPrev || (chantier.dateLimite && new Date(chantier.dateLimite) < new Date() && chantier.progression < 100)) {
      status = "retard";
    }

    return {
      id: chantier.id,
      name: chantier.nom,
      status,
      budget: budgetPrev,
      spent: budgetReal,
      progress: chantier.progression,
      deadline: chantier.dateLimite ? new Date(chantier.dateLimite).toLocaleDateString('fr-FR') : "N/A"
    };
  };

  const projects = chantiers?.map(mapChantierToProject) || [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

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
