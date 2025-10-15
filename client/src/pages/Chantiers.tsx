import ProjectsTable from "@/components/ProjectsTable";
import AddProjectDialog from "@/components/AddProjectDialog";
import ImportChantiersDialog from "@/components/ImportChantiersDialog";
import { useQuery } from "@tanstack/react-query";
import type { Chantier } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

export default function Chantiers() {
  const { t } = useTranslation();
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
      codeProjet: chantier.codeProjet || undefined,
      name: chantier.nom,
      beneficiaire: chantier.beneficiaire || undefined,
      status,
      budget: budgetPrev,
      budgetMainDoeuvre: chantier.budgetMainDoeuvre !== undefined && chantier.budgetMainDoeuvre !== null ? Number(chantier.budgetMainDoeuvre) : undefined,
      budgetMateriaux: chantier.budgetMateriaux !== undefined && chantier.budgetMateriaux !== null ? Number(chantier.budgetMateriaux) : undefined,
      budgetEquipement: chantier.budgetEquipement !== undefined && chantier.budgetEquipement !== null ? Number(chantier.budgetEquipement) : undefined,
      spent: budgetReal,
      spentMainDoeuvre: chantier.budgetReelMainDoeuvre !== undefined && chantier.budgetReelMainDoeuvre !== null ? Number(chantier.budgetReelMainDoeuvre) : undefined,
      spentMateriaux: chantier.budgetReelMateriaux !== undefined && chantier.budgetReelMateriaux !== null ? Number(chantier.budgetReelMateriaux) : undefined,
      spentEquipement: chantier.budgetReelEquipement !== undefined && chantier.budgetReelEquipement !== null ? Number(chantier.budgetReelEquipement) : undefined,
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
          <h1 className="text-3xl font-semibold tracking-tight">{t('chantiers.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('chantiers.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <ImportChantiersDialog>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importer Excel
            </Button>
          </ImportChantiersDialog>
          <AddProjectDialog onAdd={(project) => console.log('New project:', project)} />
        </div>
      </div>

      <ProjectsTable
        projects={projects}
        onView={(id) => console.log('View project:', id)}
        onEdit={(id) => console.log('Edit project:', id)}
      />
    </div>
  );
}
