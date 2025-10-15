import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ExportFactoryDataButtonProps {
  selectedDate?: string;
}

export default function ExportFactoryDataButton({ selectedDate = format(new Date(), 'yyyy-MM-dd') }: ExportFactoryDataButtonProps) {
  const { toast } = useToast();

  const handleExport = async (format: 'csv' | 'excel' | 'json') => {
    try {
      const response = await fetch(`/api/factory-data/export?format=${format}&date=${selectedDate}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const extension = format === 'excel' ? 'xlsx' : format;
      a.download = `factory-data-${selectedDate}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: `Les données ont été exportées au format ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Format d'export</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          CSV (.csv)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          JSON (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
