import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Zap, Flame, Users, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { 
  Usine, 
  UsineConsommation, 
  UsineProduction, 
  UsineAffectationSalarie,
  Salarie 
} from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AddFactoryDataDialog from "./AddFactoryDataDialog";
import ImportFactoryDataDialog from "./ImportFactoryDataDialog";
import ExportFactoryDataButton from "./ExportFactoryDataButton";

interface FactoryDashboardProps {
  selectedDate?: string;
}

export default function FactoryDashboard({ selectedDate = format(new Date(), 'yyyy-MM-dd') }: FactoryDashboardProps) {
  const { data: usines = [] } = useQuery<Usine[]>({
    queryKey: ['/api/usines'],
  });

  const { data: consommations = [] } = useQuery<UsineConsommation[]>({
    queryKey: [`/api/usine-consommations/date/${selectedDate}`],
  });

  const { data: productions = [] } = useQuery<UsineProduction[]>({
    queryKey: [`/api/usine-productions/date/${selectedDate}`],
  });

  const { data: affectations = [] } = useQuery<UsineAffectationSalarie[]>({
    queryKey: [`/api/usine-affectations-salaries/date/${selectedDate}`],
  });

  const { data: salaries = [] } = useQuery<Salarie[]>({
    queryKey: ['/api/salaries'],
  });

  const getUsineData = (usineId: string) => {
    const consommation = consommations.find(c => c.usineId === usineId);
    const productionsUsine = productions.filter(p => p.usineId === usineId);
    const affectationsUsine = affectations.filter(a => a.usineId === usineId);
    
    const tonnesRecues = productionsUsine.reduce((sum, p) => sum + Number(p.tonnesRecues || 0), 0);
    const tonnesVendues = productionsUsine.reduce((sum, p) => sum + Number(p.tonnesVendues || 0), 0);
    
    return {
      consommation,
      productions: productionsUsine,
      affectations: affectationsUsine,
      tonnesRecues,
      tonnesVendues,
      nbSalaries: affectationsUsine.length
    };
  };

  const getSalarieNom = (salarieId: string) => {
    const salarie = salaries.find(s => s.id === salarieId);
    return salarie ? `${salarie.prenom} ${salarie.nom}` : '-';
  };

  if (usines.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Factory className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Aucune usine configurée</p>
        <p className="text-sm mt-2">Ajoutez des usines dans la section Achats pour commencer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Tableau de bord Usines</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Données du {format(new Date(selectedDate), 'dd/MM/yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportFactoryDataButton selectedDate={selectedDate} />
          <ImportFactoryDataDialog />
          <AddFactoryDataDialog />
        </div>
      </div>

      {usines.map((usine) => {
        const data = getUsineData(usine.id);
        
        return (
          <Card key={usine.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Factory className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>{usine.nom}</CardTitle>
                    {usine.localisation && (
                      <p className="text-sm text-muted-foreground mt-1">{usine.localisation}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {data.nbSalaries} salarié{data.nbSalaries > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Consommation Électrique */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    Consommation Électrique
                  </div>
                  <div className="text-2xl font-bold">
                    {data.consommation?.consommationElectrique 
                      ? `${Number(data.consommation.consommationElectrique).toFixed(2)} ${data.consommation.unite || 'kWh'}`
                      : '-'}
                  </div>
                </div>

                {/* Consommation Gaz */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Flame className="h-4 w-4" />
                    Consommation Gaz
                  </div>
                  <div className="text-2xl font-bold">
                    {data.consommation?.consommationGaz 
                      ? `${Number(data.consommation.consommationGaz).toFixed(2)} ${data.consommation.unite || 'kWh'}`
                      : '-'}
                  </div>
                </div>

                {/* Tonnes Reçues */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingDown className="h-4 w-4" />
                    Tonnes Reçues
                  </div>
                  <div className="text-2xl font-bold">
                    {data.tonnesRecues.toFixed(2)} T
                  </div>
                </div>

                {/* Tonnes Vendues */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Tonnes Vendues
                  </div>
                  <div className="text-2xl font-bold">
                    {data.tonnesVendues.toFixed(2)} T
                  </div>
                </div>
              </div>

              {/* Détails Productions */}
              {data.productions.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium mb-3">Productions du jour</h4>
                  <div className="space-y-2">
                    {data.productions.map((prod) => (
                      <div key={prod.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {prod.typeMarchandise}
                          </Badge>
                          {prod.clientNom && (
                            <span className="text-muted-foreground">Client: {prod.clientNom}</span>
                          )}
                        </div>
                        <div className="flex gap-4 text-xs">
                          {prod.tonnesRecues && (
                            <span className="text-muted-foreground">
                              ↓ {Number(prod.tonnesRecues).toFixed(2)}T
                            </span>
                          )}
                          {prod.tonnesVendues && (
                            <span className="text-muted-foreground">
                              ↑ {Number(prod.tonnesVendues).toFixed(2)}T
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Salariés Affectés */}
              {data.affectations.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4" />
                    <h4 className="text-sm font-medium">Salariés affectés ({data.nbSalaries})</h4>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {data.affectations.map((aff) => (
                      <div key={aff.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30">
                        <span>{getSalarieNom(aff.salarieId)}</span>
                        <span className="text-xs text-muted-foreground">
                          {Number(aff.heuresParJour).toFixed(1)}h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
