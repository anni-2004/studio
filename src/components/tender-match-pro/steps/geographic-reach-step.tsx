
"use client";

import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/schemas/registration-schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Globe2, Wifi } from 'lucide-react'; // Using Globe2 and Wifi

interface GeographicDigitalReachStepProps { // Renamed
  form: UseFormReturn<RegistrationFormData>;
}

export const GeographicDigitalReachStep: FC<GeographicDigitalReachStepProps> = ({ form }) => { // Renamed
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Globe2 className="mr-2 h-6 w-6 text-primary" />
          <span className="mr-2">Geographic Reach</span>
           & <Wifi className="ml-2 mr-2 h-6 w-6 text-primary" />
          Digital Readiness
        </CardTitle>
        <CardDescription>Define your operational markets and digital preparedness.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-semibold text-primary mt-4">Geographic Reach</h3>
        <FormField
          control={form.control}
          name="geographicDigitalReach.operationalStates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operational States</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="e.g., Maharashtra, California, Tamil Nadu" {...field} />
              </FormControl>
              <FormDescription>Enter states separated by commas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geographicDigitalReach.countriesServed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Countries Served</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="e.g., India, USA, UAE" {...field} />
              </FormControl>
              <FormDescription>Enter countries separated by commas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geographicDigitalReach.hasImportExportLicense"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Have Import/Export License?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <h3 className="text-lg font-semibold text-primary mt-8">Digital Readiness</h3>
        <FormField
          control={form.control}
          name="geographicDigitalReach.registeredOnPortals"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Registered on GeM / CPPP / State Portals?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geographicDigitalReach.hasDigitalSignature"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Have Digital Signature Certificate (DSC)?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geographicDigitalReach.preferredTenderLanguages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Languages for Tenders</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="e.g., English, Hindi, Marathi" {...field} />
              </FormControl>
              <FormDescription>Enter languages separated by commas.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
