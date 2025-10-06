import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Finances() {
  const transactions = [
    {
      id: "1",
      type: "entree" as const,
      description: "Paiement client - Immeuble Paris 15ème",
      montant: 120000,
      date: "01/12/2025",
      categorie: "Facturation"
    },
    {
      id: "2",
      type: "sortie" as const,
      description: "Achat matériaux - BTP Pro",
      montant: 45000,
      date: "02/12/2025",
      categorie: "Achats"
    },
    {
      id: "3",
      type: "sortie" as const,
      description: "Salaires équipe",
      montant: 68000,
      date: "30/11/2025",
      categorie: "Salaires"
    },
    {
      id: "4",
      type: "entree" as const,
      description: "Acompte client - Usine Nord",
      montant: 85000,
      date: "28/11/2025",
      categorie: "Facturation"
    }
  ];

  const getTypeBadge = (type: string) => {
    return type === "entree" 
      ? <Badge variant="default" className="bg-green-600">Entrée</Badge>
      : <Badge variant="default" className="bg-red-600">Sortie</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Finances / Trésorerie</h1>
          <p className="text-muted-foreground mt-1">Suivi des flux financiers et trésorerie</p>
        </div>
        <Button data-testid="button-nouvelle-transaction">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€425,000</div>
            <p className="text-xs text-success">+15.2% ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entrées</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€205,000</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorties</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">€113,000</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À recevoir</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€156,000</div>
            <p className="text-xs text-muted-foreground">Factures en attente</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-md hover-elevate" data-testid={`transaction-${transaction.id}`}>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{transaction.description}</p>
                    {getTypeBadge(transaction.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction.categorie}</p>
                </div>
                <div className="text-right ml-4">
                  <p className={`font-semibold ${transaction.type === 'entree' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'entree' ? '+' : '-'}€{transaction.montant.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
