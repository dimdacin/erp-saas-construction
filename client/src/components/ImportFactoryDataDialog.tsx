import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ImportFactoryDataDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier Excel",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/factory-data/import?mode=${mode}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Import réussi",
          description: `${result.imported || 0} enregistrements importés avec succès`,
        });
        
        // Invalidate all factory data queries
        queryClient.invalidateQueries({ queryKey: ['/api/usine-consommations'] });
        queryClient.invalidateQueries({ queryKey: ['/api/usine-productions'] });
        queryClient.invalidateQueries({ queryKey: ['/api/usine-affectations-salaries'] });
        
        setOpen(false);
        setFile(null);
      } else {
        toast({
          title: "Erreur d'import",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'import du fichier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importer Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importer des données d'usine
          </DialogTitle>
          <DialogDescription>
            Importez des données de consommation, production et affectations depuis un fichier Excel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="excel-file">Fichier Excel</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Fichier sélectionné: {file.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Mode d'import</Label>
            <RadioGroup value={mode} onValueChange={(value) => setMode(value as 'append' | 'replace')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="append" id="append" />
                <Label htmlFor="append" className="font-normal cursor-pointer">
                  Ajouter aux données existantes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="replace" id="replace" />
                <Label htmlFor="replace" className="font-normal cursor-pointer">
                  Remplacer toutes les données
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="font-medium mb-2">Format Excel attendu:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Feuille "Consommations":</strong> Usine, Date, Électrique (kWh), Gaz (kWh)</li>
              <li><strong>Feuille "Productions":</strong> Usine, Date, Type Marchandise, Tonnes Reçues, Tonnes Vendues, Client</li>
              <li><strong>Feuille "Affectations":</strong> Usine, Date, Salarié, Heures/Jour</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? "Import en cours..." : "Importer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
