import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Factory, Box, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { StockItem, Usine, Depense, Chantier } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Achats() {
  const { t } = useTranslation();

  const { data: stockItems = [], isLoading: isLoadingStock } = useQuery<StockItem[]>({
    queryKey: ['/api/stock-items'],
  });

  const { data: usines = [], isLoading: isLoadingUsines } = useQuery<Usine[]>({
    queryKey: ['/api/usines'],
  });

  const { data: depenses = [], isLoading: isLoadingDepenses } = useQuery<Depense[]>({
    queryKey: ['/api/depenses'],
  });

  const { data: chantiers = [] } = useQuery<Chantier[]>({
    queryKey: ['/api/chantiers'],
  });

  const getUsineNom = (usineId: string | null) => {
    if (!usineId) return "-";
    const usine = usines.find(u => u.id === usineId);
    return usine?.nom || "-";
  };

  const getChantierNom = (chantierId: string | null) => {
    if (!chantierId) return t('achats.adminLevel');
    const chantier = chantiers.find(c => c.id === chantierId);
    return chantier?.nom || "-";
  };

  const getNiveauBadge = (niveau: string) => {
    if (niveau === "admin") {
      return <Badge variant="secondary">{t('achats.adminLevel')}</Badge>;
    }
    return <Badge variant="outline">{t('achats.siteLevel')}</Badge>;
  };

  if (isLoadingStock || isLoadingUsines || isLoadingDepenses) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t('achats.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('achats.subtitle')}</p>
          </div>
        </div>
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t('achats.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('achats.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-nouvelle-usine">
            <Factory className="h-4 w-4 mr-2" />
            {t('achats.newFactory')}
          </Button>
          <Button data-testid="button-nouvel-article">
            <Plus className="h-4 w-4 mr-2" />
            {t('achats.newArticle')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('achats.stockItems')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockItems.length}</div>
            <p className="text-xs text-muted-foreground">{t('achats.stockItems')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('achats.factories')}</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usines.length}</div>
            <p className="text-xs text-muted-foreground">{t('achats.factories')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('achats.quantity')}</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stockItems.reduce((sum, item) => sum + Number(item.quantite || 0), 0).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('achats.totalStock')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock" data-testid="tab-stock">{t('achats.stockItems')}</TabsTrigger>
          <TabsTrigger value="achats" data-testid="tab-achats">{t('achats.purchases')}</TabsTrigger>
          <TabsTrigger value="usines" data-testid="tab-usines">{t('achats.factories')}</TabsTrigger>
        </TabsList>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>{t('achats.stockItems')}</CardTitle>
            </CardHeader>
            <CardContent>
              {stockItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('achats.noStockItems')}</p>
                  <p className="text-sm mt-2">{t('achats.addFirstStockItem')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.itemId')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.itemName')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.factory')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.quantity')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.unit')}</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockItems.map((item) => (
                        <tr key={item.id} className="border-b hover-elevate" data-testid={`stock-item-${item.id}`}>
                          <td className="p-3">
                            <div className="font-mono text-sm font-medium">{item.itemId}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{item.nom}</div>
                            {item.categorie && (
                              <div className="text-sm text-muted-foreground">{item.categorie}</div>
                            )}
                          </td>
                          <td className="p-3 text-sm">{getUsineNom(item.usineId)}</td>
                          <td className="p-3 text-sm font-medium">{Number(item.quantite || 0).toFixed(2)}</td>
                          <td className="p-3 text-sm text-muted-foreground">{item.unite || "-"}</td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" data-testid={`button-edit-${item.id}`}>
                              {t('common.edit')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achats">
          <Card>
            <CardHeader>
              <CardTitle>{t('achats.recentPurchases')}</CardTitle>
            </CardHeader>
            <CardContent>
              {depenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('common.inDevelopment')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.level')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.category')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('common.description')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.amount')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.date')}</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">{t('achats.invoice')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {depenses.map((depense) => (
                        <tr key={depense.id} className="border-b hover-elevate" data-testid={`depense-${depense.id}`}>
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              {getNiveauBadge(depense.niveau)}
                              <span className="text-xs text-muted-foreground">{getChantierNom(depense.chantierId)}</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm">{depense.categorie}</td>
                          <td className="p-3 text-sm">{depense.description}</td>
                          <td className="p-3 text-sm font-medium">€{Number(depense.montant).toFixed(2)}</td>
                          <td className="p-3 text-sm text-muted-foreground">{depense.date}</td>
                          <td className="p-3 text-sm text-muted-foreground">{depense.facture || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usines">
          <Card>
            <CardHeader>
              <CardTitle>{t('achats.productionFactories')}</CardTitle>
            </CardHeader>
            <CardContent>
              {usines.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('achats.noFactories')}</p>
                  <p className="text-sm mt-2">{t('achats.addFirstFactory')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {usines.map((usine) => (
                    <div key={usine.id} className="flex items-center justify-between p-4 border rounded-md hover-elevate" data-testid={`usine-${usine.id}`}>
                      <div className="space-y-1">
                        <p className="font-medium">{usine.nom}</p>
                        {usine.localisation && (
                          <p className="text-sm text-muted-foreground">{usine.localisation}</p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {stockItems.filter(item => item.usineId === usine.id).length} {t('achats.articlesCount')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
