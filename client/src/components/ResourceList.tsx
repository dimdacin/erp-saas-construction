import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";

interface Resource {
  id: string;
  name: string;
  role: string;
  status: "disponible" | "affecte" | "conge";
  project?: string;
}

interface ResourceListProps {
  title: string;
  resources: Resource[];
  onAdd?: () => void;
}

const statusConfig = {
  disponible: { label: "Disponible", variant: "outline" as const },
  affecte: { label: "Affecté", variant: "default" as const },
  conge: { label: "Congé", variant: "secondary" as const },
};

export default function ResourceList({ title, resources, onAdd }: ResourceListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>{title}</CardTitle>
        <Button size="sm" onClick={onAdd} data-testid="button-add-resource">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-resource"
          />
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-3 p-3 rounded-md hover-elevate border"
              data-testid={`card-resource-${resource.id}`}
            >
              <Avatar>
                <AvatarFallback>{resource.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{resource.name}</p>
                <p className="text-sm text-muted-foreground truncate">{resource.role}</p>
                {resource.project && (
                  <p className="text-xs text-muted-foreground truncate mt-1">{resource.project}</p>
                )}
              </div>
              <Badge variant={statusConfig[resource.status].variant}>
                {statusConfig[resource.status].label}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
