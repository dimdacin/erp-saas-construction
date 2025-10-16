import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SheetInfo {
  columns: string[];
  mappingExists: boolean;
}

interface AnalyzeResult {
  success: boolean;
  fileName: string;
  availableSheets: string[];
  sheetInfo: { [key: string]: SheetInfo };
  error?: string;
}

interface ImportResult {
  success: boolean;
  sheetName: string;
  rowsProcessed: number;
  rowsInserted: number;
  rowsUpdated: number;
  rowsIgnored: number;
  rowsErrored: number;
  errors: Array<{ row: number; field?: string; message: string; data?: any }>;
  duration: number;
}

interface ImportLog {
  id: string;
  sheetName: string;
  fileName: string;
  status: string;
  rowsProcessed: number;
  rowsInserted: number;
  rowsUpdated: number;
  rowsIgnored: number;
  rowsErrored: number;
  errors: string | null;
  duration: number;
  createdAt: string;
}

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importLogs, setImportLogs] = useState<ImportLog[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalyzeResult(null);
      setSelectedSheet("");
      setImportResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalyzeResult(result);
        if (result.availableSheets.length === 1) {
          setSelectedSheet(result.availableSheets[0]);
        }
        toast({
          title: "Analysis Complete",
          description: `Found ${result.availableSheets.length} importable sheet(s)`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: result.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze file",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedSheet) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/import/${selectedSheet}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setImportResult(result);

      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Inserted: ${result.rowsInserted}, Updated: ${result.rowsUpdated}`,
        });
        fetchImportLogs();
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `Errors: ${result.rowsErrored}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message || "Unknown error during import",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const fetchImportLogs = async () => {
    try {
      const response = await fetch('/api/import/logs');
      const logs = await response.json();
      setImportLogs(logs);
    } catch (error) {
      console.error('Failed to fetch import logs:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Excel Import</h1>
        <p className="text-muted-foreground mt-2">
          Import data from Excel files with automatic mapping and validation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. Upload File</CardTitle>
            <CardDescription>Select an Excel file (.xlsx) to import</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Excel File</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={analyzing || importing}
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <FileSpreadsheet className="h-5 w-5" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!file || analyzing || importing}
              className="w-full"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze File
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sheet Selection */}
        <Card>
          <CardHeader>
            <CardTitle>2. Select Sheet</CardTitle>
            <CardDescription>Choose which sheet to import</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sheet">Sheet Name</Label>
              <Select
                value={selectedSheet}
                onValueChange={setSelectedSheet}
                disabled={!analyzeResult || importing}
              >
                <SelectTrigger id="sheet">
                  <SelectValue placeholder="Select a sheet" />
                </SelectTrigger>
                <SelectContent>
                  {analyzeResult?.availableSheets.map((sheet) => (
                    <SelectItem key={sheet} value={sheet}>
                      {sheet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSheet && analyzeResult?.sheetInfo[selectedSheet] && (
              <div className="space-y-2">
                <Label>Detected Columns</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="text-xs text-muted-foreground mb-2">
                    {analyzeResult.sheetInfo[selectedSheet].columns.length} columns found
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analyzeResult.sheetInfo[selectedSheet].columns.slice(0, 8).map((col) => (
                      <span key={col} className="px-2 py-1 bg-background rounded text-xs">
                        {col}
                      </span>
                    ))}
                    {analyzeResult.sheetInfo[selectedSheet].columns.length > 8 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{analyzeResult.sheetInfo[selectedSheet].columns.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={!selectedSheet || importing}
              className="w-full"
              variant="default"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Start Import
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Import Result */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Import Report
            </CardTitle>
            <CardDescription>
              Sheet: {importResult.sheetName} | Duration: {(importResult.duration / 1000).toFixed(2)}s
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold">{importResult.rowsProcessed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Inserted</p>
                <p className="text-2xl font-bold text-green-600">{importResult.rowsInserted}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Updated</p>
                <p className="text-2xl font-bold text-blue-600">{importResult.rowsUpdated}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ignored</p>
                <p className="text-2xl font-bold text-gray-600">{importResult.rowsIgnored}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{importResult.rowsErrored}</p>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="space-y-2">
                <Label>Errors ({importResult.errors.length})</Label>
                <div className="max-h-48 overflow-y-auto border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResult.errors.slice(0, 20).map((error, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm">{error.row}</TableCell>
                          <TableCell className="text-sm">{error.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {importResult.errors.length > 20 && (
                    <p className="p-2 text-xs text-center text-muted-foreground">
                      Showing first 20 errors of {importResult.errors.length}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Logs */}
      {importLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Imports</CardTitle>
            <CardDescription>Last 50 import operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Sheet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Processed</TableHead>
                    <TableHead className="text-right">Inserted</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                    <TableHead className="text-right">Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{log.fileName}</TableCell>
                      <TableCell className="text-sm font-mono">{log.sheetName}</TableCell>
                      <TableCell>
                        {log.status === 'success' ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Success
                          </span>
                        ) : log.status === 'partial' ? (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <AlertCircle className="h-4 w-4" />
                            Partial
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" />
                            Failed
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{log.rowsProcessed}</TableCell>
                      <TableCell className="text-right text-green-600">{log.rowsInserted}</TableCell>
                      <TableCell className="text-right text-blue-600">{log.rowsUpdated}</TableCell>
                      <TableCell className="text-right text-red-600">{log.rowsErrored}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Import Information</AlertTitle>
        <AlertDescription>
          The import uses UPSERT logic based on unique keys. Existing records will be updated, new records will be inserted.
          Mapping configuration is loaded from <code className="px-1 py-0.5 bg-muted rounded">attached_assets/mapping_v1.json</code>.
        </AlertDescription>
      </Alert>
    </div>
  );
}
