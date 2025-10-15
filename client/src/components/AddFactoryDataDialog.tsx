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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Factory } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import type { Usine, Salarie } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AddFactoryDataDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("consommation");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usines = [] } = useQuery<Usine[]>({
    queryKey: ['/api/usines'],
  });

  const { data: salaries = [] } = useQuery<Salarie[]>({
    queryKey: ['/api/salaries'],
  });

  // Consommation state
  const [consommationData, setConsommationData] = useState({
    usineId: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    consommationElectrique: "",
    consommationGaz: "",
    unite: "kWh",
  });

  // Production state
  const [productionData, setProductionData] = useState({
    usineId: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    typeMarchandise: "",
    tonnesRecues: "",
    tonnesVendues: "",
    clientNom: "",
    notes: "",
  });

  // Affectation state
  const [affectationData, setAffectationData] = useState({
    usineId: "",
    salarieId: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    heuresParJour: "8",
    notes: "",
  });

  const consommationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/usine-consommations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create consommation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/usine-consommations'] });
      toast({ title: "Consommation ajoutée avec succès" });
      setOpen(false);
      resetForms();
    },
    onError: () => {
      toast({ title: "Erreur lors de l'ajout de la consommation", variant: "destructive" });
    },
  });

  const productionMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/usine-productions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create production');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/usine-productions'] });
      toast({ title: "Production ajoutée avec succès" });
      setOpen(false);
      resetForms();
    },
    onError: () => {
      toast({ title: "Erreur lors de l'ajout de la production", variant: "destructive" });
    },
  });

  const affectationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/usine-affectations-salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create affectation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/usine-affectations-salaries'] });
      toast({ title: "Affectation ajoutée avec succès" });
      setOpen(false);
      resetForms();
    },
    onError: () => {
      toast({ title: "Erreur lors de l'ajout de l'affectation", variant: "destructive" });
    },
  });

  const resetForms = () => {
    setConsommationData({
      usineId: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      consommationElectrique: "",
      consommationGaz: "",
      unite: "kWh",
    });
    setProductionData({
      usineId: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      typeMarchandise: "",
      tonnesRecues: "",
      tonnesVendues: "",
      clientNom: "",
      notes: "",
    });
    setAffectationData({
      usineId: "",
      salarieId: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      heuresParJour: "8",
      notes: "",
    });
  };

  const handleSubmit = () => {
    if (activeTab === "consommation") {
      consommationMutation.mutate(consommationData);
    } else if (activeTab === "production") {
      productionMutation.mutate(productionData);
    } else if (activeTab === "affectation") {
      affectationMutation.mutate(affectationData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Données Usine
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Ajouter des données d'usine
          </DialogTitle>
          <DialogDescription>
            Saisissez les données de production, consommation ou affectation du personnel.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="consommation">Consommation</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="affectation">Personnel</TabsTrigger>
          </TabsList>

          <TabsContent value="consommation" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="usine-conso">Usine</Label>
              <Select
                value={consommationData.usineId}
                onValueChange={(value) => setConsommationData({ ...consommationData, usineId: value })}
              >
                <SelectTrigger id="usine-conso">
                  <SelectValue placeholder="Sélectionner une usine" />
                </SelectTrigger>
                <SelectContent>
                  {usines.map((usine) => (
                    <SelectItem key={usine.id} value={usine.id}>
                      {usine.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-conso">Date</Label>
              <Input
                id="date-conso"
                type="date"
                value={consommationData.date}
                onChange={(e) => setConsommationData({ ...consommationData, date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="elec">Consommation Électrique</Label>
                <Input
                  id="elec"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={consommationData.consommationElectrique}
                  onChange={(e) => setConsommationData({ ...consommationData, consommationElectrique: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gaz">Consommation Gaz</Label>
                <Input
                  id="gaz"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={consommationData.consommationGaz}
                  onChange={(e) => setConsommationData({ ...consommationData, consommationGaz: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unite-conso">Unité</Label>
              <Select
                value={consommationData.unite}
                onValueChange={(value) => setConsommationData({ ...consommationData, unite: value })}
              >
                <SelectTrigger id="unite-conso">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kWh">kWh</SelectItem>
                  <SelectItem value="MWh">MWh</SelectItem>
                  <SelectItem value="m³">m³</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="usine-prod">Usine</Label>
              <Select
                value={productionData.usineId}
                onValueChange={(value) => setProductionData({ ...productionData, usineId: value })}
              >
                <SelectTrigger id="usine-prod">
                  <SelectValue placeholder="Sélectionner une usine" />
                </SelectTrigger>
                <SelectContent>
                  {usines.map((usine) => (
                    <SelectItem key={usine.id} value={usine.id}>
                      {usine.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-prod">Date</Label>
              <Input
                id="date-prod"
                type="date"
                value={productionData.date}
                onChange={(e) => setProductionData({ ...productionData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-marchandise">Type de Marchandise</Label>
              <Input
                id="type-marchandise"
                placeholder="Ex: Béton, Acier, Gravier..."
                value={productionData.typeMarchandise}
                onChange={(e) => setProductionData({ ...productionData, typeMarchandise: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tonnes-recues">Tonnes Reçues</Label>
                <Input
                  id="tonnes-recues"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productionData.tonnesRecues}
                  onChange={(e) => setProductionData({ ...productionData, tonnesRecues: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tonnes-vendues">Tonnes Vendues</Label>
                <Input
                  id="tonnes-vendues"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={productionData.tonnesVendues}
                  onChange={(e) => setProductionData({ ...productionData, tonnesVendues: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                placeholder="Nom du client (optionnel)"
                value={productionData.clientNom}
                onChange={(e) => setProductionData({ ...productionData, clientNom: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes-prod">Notes</Label>
              <Textarea
                id="notes-prod"
                placeholder="Notes additionnelles..."
                value={productionData.notes}
                onChange={(e) => setProductionData({ ...productionData, notes: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="affectation" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="usine-aff">Usine</Label>
              <Select
                value={affectationData.usineId}
                onValueChange={(value) => setAffectationData({ ...affectationData, usineId: value })}
              >
                <SelectTrigger id="usine-aff">
                  <SelectValue placeholder="Sélectionner une usine" />
                </SelectTrigger>
                <SelectContent>
                  {usines.map((usine) => (
                    <SelectItem key={usine.id} value={usine.id}>
                      {usine.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salarie">Salarié</Label>
              <Select
                value={affectationData.salarieId}
                onValueChange={(value) => setAffectationData({ ...affectationData, salarieId: value })}
              >
                <SelectTrigger id="salarie">
                  <SelectValue placeholder="Sélectionner un salarié" />
                </SelectTrigger>
                <SelectContent>
                  {salaries.map((salarie) => (
                    <SelectItem key={salarie.id} value={salarie.id}>
                      {salarie.prenom} {salarie.nom} - {salarie.poste}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-aff">Date</Label>
              <Input
                id="date-aff"
                type="date"
                value={affectationData.date}
                onChange={(e) => setAffectationData({ ...affectationData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heures">Heures par Jour</Label>
              <Input
                id="heures"
                type="number"
                step="0.5"
                placeholder="8"
                value={affectationData.heuresParJour}
                onChange={(e) => setAffectationData({ ...affectationData, heuresParJour: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes-aff">Notes</Label>
              <Textarea
                id="notes-aff"
                placeholder="Notes additionnelles..."
                value={affectationData.notes}
                onChange={(e) => setAffectationData({ ...affectationData, notes: e.target.value })}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
