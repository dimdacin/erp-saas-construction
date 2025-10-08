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
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Depense } from "@shared/schema";

const receptionFormSchema = z.object({
  operateur: z.string().min(1),
  dateReception: z.string().min(1),
  photo: z.any().optional(),
});

type ReceptionFormValues = z.infer<typeof receptionFormSchema>;

interface ReceptionDialogProps {
  depense: Depense;
}

export default function ReceptionDialog({ depense }: ReceptionDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const form = useForm<ReceptionFormValues>({
    resolver: zodResolver(receptionFormSchema),
    defaultValues: {
      operateur: "",
      dateReception: new Date().toISOString().split('T')[0],
      photo: null,
    },
  });

  const receptionMutation = useMutation({
    mutationFn: async (data: ReceptionFormValues) => {
      let photoPath = undefined;

      // Upload photo if provided
      if (data.photo && data.photo.length > 0) {
        setUploadingPhoto(true);
        const formData = new FormData();
        formData.append('file', data.photo[0]);

        const uploadResponse = await fetch('/api/upload-facture', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          photoPath = uploadData.path;
        }
        setUploadingPhoto(false);
      }

      return apiRequest('PATCH', `/api/depenses/${depense.id}/reception`, {
        dateReception: data.dateReception,
        operateurReception: data.operateur,
        photoFacturePath: photoPath,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/depenses'] });
      toast({
        title: t('achats.success'),
        description: t('achats.receptionValidated'),
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t('achats.error'),
        description: t('achats.errorValidatingReception'),
      });
    },
  });

  const onSubmit = (data: ReceptionFormValues) => {
    receptionMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" data-testid={`button-receive-${depense.id}`}>
          <CheckCircle className="mr-2 h-4 w-4" />
          {t('achats.receiveAction')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('achats.receiveAction')}</DialogTitle>
              <DialogDescription>
                {t('achats.receptionDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="operateur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('achats.operator')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('achats.operatorPlaceholder')}
                        data-testid="input-operator"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateReception"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('achats.receptionDate')}</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        data-testid="input-reception-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>{t('achats.uploadInvoice')}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        data-testid="input-invoice-photo"
                        {...field}
                        onChange={(e) => onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                data-testid="button-submit-reception" 
                disabled={receptionMutation.isPending || uploadingPhoto}
              >
                {uploadingPhoto ? t('achats.uploading') : receptionMutation.isPending ? t('common.loading') : t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
