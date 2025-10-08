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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertDepenseSchema } from "@shared/schema";
import type { StockItem, Chantier } from "@shared/schema";

const purchaseFormSchema = insertDepenseSchema.extend({
  quantite: z.string().optional(),
  montant: z.string().min(1),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

interface NewPurchaseDialogProps {
  stockItems: StockItem[];
  chantiers: Chantier[];
}

export default function NewPurchaseDialog({ stockItems, chantiers }: NewPurchaseDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      stockItemId: null,
      niveau: "chantier",
      chantierId: null,
      categorie: "Matériel",
      description: "",
      montant: "",
      quantite: "",
      date: new Date().toISOString().split('T')[0],
      facture: null,
    },
  });

  const createPurchaseMutation = useMutation({
    mutationFn: async (data: PurchaseFormValues) => {
      const submitData = {
        ...data,
        montant: data.montant,
        quantite: data.quantite || null,
      };
      return apiRequest('POST', '/api/depenses', submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/depenses'] });
      toast({
        title: t('achats.success'),
        description: t('achats.purchaseCreated'),
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t('achats.error'),
        description: t('achats.errorCreatingPurchase'),
      });
    },
  });

  const onSubmit = (data: PurchaseFormValues) => {
    createPurchaseMutation.mutate(data);
  };

  const niveauValue = form.watch("niveau");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-new-purchase">
          <Plus className="mr-2 h-4 w-4" />
          {t('achats.newPurchase')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('achats.newPurchase')}</DialogTitle>
              <DialogDescription>
                {t('achats.newPurchaseDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="niveau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('achats.level')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === "admin") {
                          form.setValue("chantierId", null);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-niveau">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">{t('achats.adminLevel')}</SelectItem>
                        <SelectItem value="chantier">{t('achats.siteLevel')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {niveauValue === "chantier" && (
                <FormField
                  control={form.control}
                  name="chantierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('achats.selectChantier')}</FormLabel>
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-chantier">
                            <SelectValue placeholder={t('achats.selectChantier')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chantiers.map((chantier) => (
                            <SelectItem key={chantier.id} value={chantier.id}>
                              {chantier.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="stockItemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('achats.selectStockItem')}</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-stock-item">
                          <SelectValue placeholder={t('achats.selectStockItem')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stockItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.nom} ({item.itemId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.description')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('achats.descriptionPlaceholder')}
                        data-testid="input-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('achats.quantity')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="100"
                          data-testid="input-quantite"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="montant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('achats.amount')} (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="5000"
                          data-testid="input-montant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('achats.date')}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        data-testid="input-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" data-testid="button-submit-purchase" disabled={createPurchaseMutation.isPending}>
                {createPurchaseMutation.isPending ? t('common.loading') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
