import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Achats() {
  const achats = [
    {
      id: "1",
      fournisseur: "BTP Matériaux Pro",
      reference: "ACH-2025-001",
      montant: 45000,
      statut: "livre" as const,
      date: "02/12/2025",
      chantier: "Immeuble Résidentiel Paris 15ème"
    },
    {
      id: "2",
      fournisseur: "Électricité Industrielle SA",
      reference: "ACH-2025-002",
      montant: 18500,
      statut: "en_cours" as const,
      date: "05/12/2025",
      chantier: "Installation Système Électrique Usine"
    },
    {
      id: "3",
      fournisseur: "Quincaillerie Bâtiment",
      reference: "ACH-2025-003",
      montant: 3200,
      statut: "commande" as const,
      date: "08/12/2025",
      chantier: "Aménagement Bureaux Entreprise Est"
    }
  ];

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "livre":
        return <Badge variant="default" className="bg-green-600">Livré</Badge>;
      case "en_cours":
        return <Badge variant="secondary">En cours</Badge>;
      case "commande":
        return <Badge variant="outline">Commandé</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Achats</h1>
          <p className="text-muted-foreground mt-1">Gestion des commandes et des fournisseurs</p>
        </div>
        <Button data-testid="button-nouveau-achat">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel achat
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achats</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€66,700</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Commandes actives</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fournisseurs</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Actifs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achats.map((achat) => (
              <div key={achat.id} className="flex items-center justify-between p-4 border rounded-md hover-elevate" data-testid={`achat-${achat.id}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{achat.fournisseur}</p>
                    {getStatutBadge(achat.statut)}
                  </div>
                  <p className="text-sm text-muted-foreground">{achat.reference}</p>
                  <p className="text-sm text-muted-foreground">{achat.chantier}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{achat.montant.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{achat.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
