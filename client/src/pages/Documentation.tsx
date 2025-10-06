import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, File, Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Documentation() {
  const documents = [
    {
      id: "1",
      nom: "Cahier des charges - Immeuble Paris 15ème",
      type: "cahier_charges",
      chantier: "Immeuble Résidentiel Paris 15ème",
      date: "15/10/2025",
      taille: "2.4 MB"
    },
    {
      id: "2",
      nom: "Plan architectural - Immeuble Paris 15ème",
      type: "plan",
      chantier: "Immeuble Résidentiel Paris 15ème",
      date: "18/10/2025",
      taille: "5.8 MB"
    },
    {
      id: "3",
      nom: "Facture BTP Matériaux Pro",
      type: "facture",
      chantier: "Immeuble Résidentiel Paris 15ème",
      date: "02/12/2025",
      taille: "156 KB"
    },
    {
      id: "4",
      nom: "Cahier des charges - Usine Nord",
      type: "cahier_charges",
      chantier: "Rénovation Usine Automobile Nord",
      date: "01/09/2025",
      taille: "1.8 MB"
    },
    {
      id: "5",
      nom: "Devis Électricité Industrielle SA",
      type: "devis",
      chantier: "Installation Système Électrique Usine",
      date: "20/11/2025",
      taille: "245 KB"
    },
    {
      id: "6",
      nom: "Facture Quincaillerie Bâtiment",
      type: "facture",
      chantier: "Aménagement Bureaux Entreprise Est",
      date: "05/12/2025",
      taille: "128 KB"
    }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "cahier_charges":
        return <Badge variant="default">Cahier des charges</Badge>;
      case "plan":
        return <Badge variant="secondary">Plan</Badge>;
      case "facture":
        return <Badge variant="outline" className="border-green-600 text-green-600">Facture</Badge>;
      case "devis":
        return <Badge variant="outline">Devis</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground mt-1">Gestion des documents par chantier</p>
        </div>
        <Button data-testid="button-telecharger-document">
          <Upload className="h-4 w-4 mr-2" />
          Télécharger document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un document..." 
                className="pl-10"
                data-testid="input-recherche-document"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[250px]" data-testid="select-chantier">
                <SelectValue placeholder="Tous les chantiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les chantiers</SelectItem>
                <SelectItem value="paris">Immeuble Résidentiel Paris 15ème</SelectItem>
                <SelectItem value="usine">Rénovation Usine Automobile Nord</SelectItem>
                <SelectItem value="bureaux">Aménagement Bureaux Entreprise Est</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[200px]" data-testid="select-type-document">
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="cahier_charges">Cahier des charges</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
                <SelectItem value="facture">Facture</SelectItem>
                <SelectItem value="devis">Devis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-md hover-elevate" data-testid={`document-${doc.id}`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                    {doc.type === "plan" ? <File className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{doc.nom}</p>
                      {getTypeBadge(doc.type)}
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.chantier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{doc.taille}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                  <Button size="sm" variant="ghost" data-testid={`button-download-${doc.id}`}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
