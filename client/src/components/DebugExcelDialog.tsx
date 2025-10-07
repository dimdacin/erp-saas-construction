import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Bug } from "lucide-react";

interface DebugExcelDialogProps {
  children: React.ReactNode;
}

export default function DebugExcelDialog({ children }: DebugExcelDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDebugInfo(null);
    }
  };

  const handleDebug = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/equipements/debug-excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Debug Excel - Voir les colonnes</DialogTitle>
          <DialogDescription>
            Analysez votre fichier Excel pour voir les noms de colonnes détectés
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4">
            <input
              type="file"
              accept=".xlsx,.xls,.xlsm"
              onChange={handleFileChange}
              className="hidden"
              id="debug-excel-upload"
            />
            <label htmlFor="debug-excel-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Choisir un fichier
                </span>
              </Button>
            </label>
            {file && (
              <p className="mt-2 text-sm text-muted-foreground">
                Fichier : {file.name}
              </p>
            )}
          </div>

          <Button onClick={handleDebug} disabled={!file} className="w-full">
            <Bug className="h-4 w-4 mr-2" />
            Analyser les colonnes
          </Button>

          {debugInfo && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Feuille : {debugInfo.sheetName}</p>
                <p className="text-sm text-muted-foreground">Nombre de lignes : {debugInfo.totalRows}</p>
              </div>

              <div>
                <p className="font-medium mb-2">Colonnes détectées :</p>
                <div className="bg-background p-3 rounded border">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(debugInfo.columnNames, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Première ligne de données :</p>
                <div className="bg-background p-3 rounded border">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(debugInfo.firstRow, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
