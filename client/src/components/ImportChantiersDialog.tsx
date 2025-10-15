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
import { Loader2, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ImportChantiersDialogProps {
  children: React.ReactNode;
}

export default function ImportChantiersDialog({ children }: ImportChantiersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/chantiers/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        queryClient.invalidateQueries({ queryKey: ["chantiers"] });
      } else {
        setError(data.error || 'Erreur lors de l\'import');
      }
    } catch (err) {
      setError('Erreur de connexion lors de l\'import');
      console.error('Import error:', err);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des chantiers</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier Excel (.xlsx) contenant vos chantiers. 
            Le fichier doit avoir une feuille "Chantiers" ou "Projets" avec les colonnes appropriées.
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
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Import réussi ! {result.imported} chantiers importés sur {result.total}.
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2">
                    <strong>Erreurs:</strong>
                    <ul className="list-disc list-inside">
                      {result.errors.map((err: any, idx: number) => (
                        <li key={idx}>{err.chantier}: {err.error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}