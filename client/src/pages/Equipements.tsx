import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Equipement } from "@shared/schema";
import { useTranslation } from "react-i18next";

export default function Equipements() {
  const { t, i18n } = useTranslation();
  const { data: equipements, isLoading } = useQuery<Equipement[]>({
    queryKey: ["/api/equipements"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatFuelConsumption = (value: number) => {
    const formatted = new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
    return `${formatted} ${t('equipements.fuelUnit')}`;
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "disponible":
        return <Badge variant="default" className="bg-green-600">{t('equipements.available')}</Badge>;
      case "en_service":
        return <Badge variant="secondary">{t('equipements.inService')}</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="border-orange-600 text-orange-600">{t('equipements.maintenance')}</Badge>;
      case "hors_service":
        return <Badge variant="destructive">{t('equipements.outOfService')}</Badge>;
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

  const equipementsDisponibles = equipements?.filter(e => e.statut === "disponible").length || 0;
  const equipementsEnService = equipements?.filter(e => e.statut === "en_service").length || 0;
  const equipementsMaintenance = equipements?.filter(e => e.statut === "maintenance").length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t('equipements.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('equipements.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button data-testid="button-nouvel-equipement">
            <Plus className="h-4 w-4 mr-2" />
            {t('equipements.newEquipment')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('equipements.totalEquipment')}</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipements?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('equipements.available')}</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipementsDisponibles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('equipements.inService')}</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipementsEnService}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('equipements.maintenance')}</CardTitle>
            <div className="h-2 w-2 rounded-full bg-orange-600"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipementsMaintenance}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('equipements.equipmentList')}</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t('equipements.search')}
                  className="pl-10 w-[300px]"
                  data-testid="input-recherche-equipement"
                />
              </div>
              <Button variant="outline" size="sm" data-testid="button-exporter">
                <Download className="h-4 w-4 mr-2" />
                {t('equipements.export')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">{t('equipements.name')}</th>
                  <th className="text-left p-3 font-medium">{t('equipements.category')}</th>
                  <th className="text-left p-3 font-medium">{t('equipements.brand')}</th>
                  <th className="text-left p-3 font-medium">{t('equipements.registration')}</th>
                  <th className="text-left p-3 font-medium">{t('equipements.fuelConsumption')}</th>
                  <th className="text-left p-3 font-medium">{t('equipements.operatorWage')}</th>
                  <th className="text-left p-3 font-medium">{t('equipements.status')}</th>
                  <th className="text-left p-3 font-medium">{t('equipements.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {equipements?.map((equipement) => (
                  <tr key={equipement.id} className="border-b hover-elevate" data-testid={`equipement-row-${equipement.id}`}>
                    <td className="p-3">
                      <div className="font-medium">{equipement.nom}</div>
                      <div className="text-sm text-muted-foreground">{equipement.type}</div>
                    </td>
                    <td className="p-3 text-sm">{equipement.categorie || "-"}</td>
                    <td className="p-3 text-sm">
                      {equipement.marque && equipement.modele 
                        ? `${equipement.marque} ${equipement.modele}`
                        : equipement.marque || equipement.modele || "-"
                      }
                    </td>
                    <td className="p-3 text-sm font-mono">{equipement.immatriculation || "-"}</td>
                    <td className="p-3 text-sm">
                      {equipement.consommationGasoilHeure 
                        ? formatFuelConsumption(Number(equipement.consommationGasoilHeure))
                        : "-"
                      }
                    </td>
                    <td className="p-3 text-sm">
                      {equipement.salaireHoraireOperateur 
                        ? formatCurrency(Number(equipement.salaireHoraireOperateur))
                        : "-"
                      }
                    </td>
                    <td className="p-3">{getStatutBadge(equipement.statut)}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-${equipement.id}`}>
                        {t('common.edit')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!equipements || equipements.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('equipements.noEquipment')}</p>
                <p className="text-sm mt-1">{t('equipements.addFirstEquipment')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
