import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  codeProjet?: string;
  name: string;
  beneficiaire?: string;
  status: "en_cours" | "planifie" | "termine" | "retard";
  budget: number;
  budgetMainDoeuvre?: number;
  budgetMateriaux?: number;
  budgetEquipement?: number;
  spent: number;
  spentMainDoeuvre?: number;
  spentMateriaux?: number;
  spentEquipement?: number;
  progress: number;
  deadline: string;
}

interface ProjectsTableProps {
  projects: Project[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const statusConfig = {
  en_cours: { label: "En cours", variant: "default" as const },
  planifie: { label: "Planifié", variant: "secondary" as const },
  termine: { label: "Terminé", variant: "outline" as const },
  retard: { label: "Retard", variant: "destructive" as const },
};

export default function ProjectsTable({ projects, onView, onEdit }: ProjectsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nom du Chantier</TableHead>
            <TableHead>Bénéficiaire</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Budget Total</TableHead>
            <TableHead className="text-right">MDO</TableHead>
            <TableHead className="text-right">Matériaux</TableHead>
            <TableHead className="text-right">Équipement</TableHead>
            <TableHead className="text-right">Progression</TableHead>
            <TableHead>Date Limite</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const variance = ((project.spent - project.budget) / project.budget) * 100;
            return (
              <TableRow key={project.id} data-testid={`row-project-${project.id}`}>
                <TableCell className="font-mono text-sm font-medium">{project.codeProjet || "-"}</TableCell>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell className="text-sm">{project.beneficiaire || <span className="text-muted-foreground">-</span>}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig[project.status].variant}>
                    {statusConfig[project.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">€{project.budget.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    <span className={variance > 0 ? "text-chart-4" : ""}>
                      €{project.spent.toLocaleString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm">
                  {project.budgetMainDoeuvre !== undefined && project.budgetMainDoeuvre !== null ? (
                    <>
                      <div>€{Number(project.budgetMainDoeuvre).toLocaleString()}</div>
                      {project.spentMainDoeuvre !== undefined && project.spentMainDoeuvre !== null && (
                        <div className="text-xs text-muted-foreground">€{Number(project.spentMainDoeuvre).toLocaleString()}</div>
                      )}
                    </>
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {project.budgetMateriaux !== undefined && project.budgetMateriaux !== null ? (
                    <>
                      <div>€{Number(project.budgetMateriaux).toLocaleString()}</div>
                      {project.spentMateriaux !== undefined && project.spentMateriaux !== null && (
                        <div className="text-xs text-muted-foreground">€{Number(project.spentMateriaux).toLocaleString()}</div>
                      )}
                    </>
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {project.budgetEquipement !== undefined && project.budgetEquipement !== null ? (
                    <>
                      <div>€{Number(project.budgetEquipement).toLocaleString()}</div>
                      {project.spentEquipement !== undefined && project.spentEquipement !== null && (
                        <div className="text-xs text-muted-foreground">€{Number(project.spentEquipement).toLocaleString()}</div>
                      )}
                    </>
                  ) : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-right">{project.progress}%</TableCell>
                <TableCell>{project.deadline}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-actions-${project.id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(project.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(project.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
