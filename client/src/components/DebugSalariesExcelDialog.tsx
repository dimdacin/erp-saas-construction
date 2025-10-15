import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileSearch, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DebugSalariesExcelDialogProps {
  children: React.ReactNode;
}

export default function DebugSalariesExcelDialog({ children }: DebugSalariesExcelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/salaries/debug-excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Erreur lors de l\'analyse');
      }
    } catch (err) {
      setError('Erreur de connexion lors de l\'analyse');
      console.error('Analyze error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetDialog();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analyser le fichier Excel des salariés</DialogTitle>
          <DialogDescription>
            Analysez votre fichier Excel pour voir comment les colonnes seront mappées avant l'import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fichier Excel</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {file && (
            <div className="text-sm text-muted-foreground">
              Fichier sélectionné: {file.name}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Feuille sélectionnée:</strong> {result.selectedSheet} <br />
                  <strong>Nombre de lignes:</strong> {result.totalRows} <br />
                  <strong>Feuilles disponibles:</strong> {result.sheetNames.join(", ")}
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Colonnes détectées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {result.columnNames.map((col: string, index: number) => (
                      <div key={index} className="bg-muted p-2 rounded">
                        {col}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Première ligne de données</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(result.firstRow).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between border-b pb-1">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {result.sample && result.sample.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Échantillon de données</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm max-h-40 overflow-y-auto">
                      {result.sample.slice(1).map((row: any, index: number) => (
                        <div key={index} className="border rounded p-2">
                          <div className="font-medium mb-1">Ligne {index + 2}:</div>
                          {Object.entries(row).slice(0, 6).map(([key, value]: [string, any]) => (
                            <div key={key} className="flex justify-between text-xs">
                              <span>{key}:</span>
                              <span className="text-muted-foreground">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
            <Button 
              onClick={handleAnalyze} 
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}