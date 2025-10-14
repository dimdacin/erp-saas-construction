import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Salarie } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function Salaries() {
  const { t, i18n } = useTranslation();
  const { data: salaries, isLoading } = useQuery<Salarie[]>({
    queryKey: ["/api/salaries"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "disponible":
        return <Badge variant="default" className="bg-green-600">Disponible</Badge>;
      case "affecte":
        return <Badge variant="secondary">Affecté</Badge>;
      case "conge":
        return <Badge variant="outline" className="border-orange-600 text-orange-600">Congé</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

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

  const salariesDisponibles = salaries?.filter(s => s.statut === "disponible").length || 0;
  const salariesAffectes = salaries?.filter(s => s.statut === "affecte").length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Salariés</h1>
          <p className="text-muted-foreground mt-1">Gérez votre équipe et ressources humaines</p>
        </div>
        <div className="flex gap-2">
          <Button data-testid="button-nouveau-salarie">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau salarié
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total salariés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salaries?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salariesDisponibles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affectés</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salariesAffectes}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des salariés</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un salarié..."
                  className="pl-10 w-[300px]"
                  data-testid="input-recherche-salarie"
                />
              </div>
              <Button variant="outline" size="sm" data-testid="button-exporter">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Nom</th>
                  <th className="text-left p-3 font-medium">Fonction</th>
                  <th className="text-left p-3 font-medium">Division</th>
                  <th className="text-left p-3 font-medium">Service</th>
                  <th className="text-left p-3 font-medium">Centre de coût</th>
                  <th className="text-left p-3 font-medium">Taux horaire</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salaries?.map((salarie) => (
                  <tr key={salarie.id} className="border-b hover-elevate" data-testid={`salarie-row-${salarie.id}`}>
                    <td className="p-3">
                      <div className="font-medium">{salarie.nom} {salarie.prenom}</div>
                      {salarie.inNum && <div className="text-xs text-muted-foreground font-mono">{salarie.inNum}</div>}
                    </td>
                    <td className="p-3 text-sm">
                      <div>{salarie.poste}</div>
                      {salarie.codeFonction && <div className="text-xs text-muted-foreground">{salarie.codeFonction}</div>}
                    </td>
                    <td className="p-3 text-sm">{salarie.division || <span className="text-muted-foreground">-</span>}</td>
                    <td className="p-3 text-sm">{salarie.services || <span className="text-muted-foreground">-</span>}</td>
                    <td className="p-3 text-sm text-muted-foreground">{salarie.coastCenter || "-"}</td>
                    <td className="p-3 text-sm font-mono">
                      {salarie.tauxHoraire ? formatCurrency(parseFloat(salarie.tauxHoraire)) : "-"}
                    </td>
                    <td className="p-3">{getStatutBadge(salarie.statut)}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-${salarie.id}`}>
                        Modifier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {salaries?.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucun salarié</h3>
              <p className="text-sm text-muted-foreground mt-1">Commencez par ajouter votre premier salarié</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
