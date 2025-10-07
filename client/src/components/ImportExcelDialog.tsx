import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface ImportExcelDialogProps {
  children: React.ReactNode;
}

export default function ImportExcelDialog({ children }: ImportExcelDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ imported: number; total: number } | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/equipements/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({ imported: data.imported, total: data.total });
        toast({
          title: "Import réussi",
          description: `${data.imported} équipements importés sur ${data.total}`,
        });
        
        // Rafraîchir la liste des équipements
        queryClient.invalidateQueries({ queryKey: ['/api/equipements'] });
        
        setTimeout(() => {
          setOpen(false);
          setFile(null);
          setResult(null);
        }, 2000);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer depuis Excel</DialogTitle>
          <DialogDescription>
            Sélectionnez votre fichier Excel contenant la feuille "Machines" avec le tableau tblMachines
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!result ? (
            <>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <input
                  type="file"
                  accept=".xlsx,.xls,.xlsm"
                  onChange={handleFileChange}
                  className="hidden"
                  id="excel-upload"
                  data-testid="input-excel-file"
                />
                <label htmlFor="excel-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Choisir un fichier
                    </span>
                  </Button>
                </label>
                {file && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fichier sélectionné : {file.name}
                  </p>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Format attendu :</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Feuille "Machines" avec tableau tblMachines</li>
                  <li>Colonnes : ID machine, Catégorie, Modèle, Immatriculation</li>
                  <li>Colonnes techniques : Consommation gasoil, Salaire opérateur</li>
                </ul>
              </div>

              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
                className="w-full"
                data-testid="button-upload-excel"
              >
                {uploading ? "Import en cours..." : "Importer les données"}
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">Import réussi !</h3>
              <p className="text-muted-foreground">
                {result.imported} équipements importés sur {result.total}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
