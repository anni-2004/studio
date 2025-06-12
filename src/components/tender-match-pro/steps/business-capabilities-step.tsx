
"use client";

import type { FC } from 'react';
import React, { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/schemas/registration-schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TagInput } from '@/components/ui/tag-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap } from 'lucide-react';

interface BusinessCapabilitiesStepProps {
  form: UseFormReturn<RegistrationFormData>;
}

const BUSINESS_ROLE_OPTIONS = [
  "Manufacturer", "Distributor", "Retailer", "Franchise", "Subscription",
  "Freemium", "Advertising", "Marketplace", "On-Demand", "Brokerage",
  "Product-as-a-Service", "Dropshipping", "Aggregator", "Pay-Per-Use",
  "Crowdsourcing", "Licensing", "Consulting", "E-commerce",
  "Dealer", "Trader", "OEM", "Service Provider", "EPC Contractor"
].filter((value, index, self) => self.indexOf(value) === index)
 .sort();

const INDUSTRY_SECTOR_OPTIONS = [
  "Technology", "Healthcare", "Finance", "Manufacturing", "Education", "Retail",
  "Construction", "Agriculture", "Energy", "Transportation", "Hospitality",
  "Media", "Telecommunications", "Pharmaceutical", "Automotive", "Aerospace",
  "Real Estate", "Consulting", "Government", "Non-Profit"
].sort();

const EXAMPLE_KEYWORD_OPTIONS = [
  "Software Development", "Cloud Services", "Data Analytics", "Project Management",
  "Supply Chain Management", "Office Supplies", "CNC Machining", "Consulting Services",
  "Digital Marketing", "Logistics", "Hardware Manufacturing", "AI Solutions"
].sort();


const rawCertifications = [
  "MSME Registration", "UDYAM Registration", "GSTIN", "PAN", "TAN",
  "Trade License", "Factory License", "Shops & Establishment License", "FSSAI",
  "Import Export Code (IEC)", "RERA Registration", "DPIIT Startup India Recognition",
  "Labour Law Compliances", "ESIC", "EPFO", "CSR Registration",
  "Professional Tax Registration", "Fire Department NOC", "Pollution Control Certificate",
  "ISO 9001", "ISO 14001", "ISO 45001", "ISO 50001", "ISO 31000",
  "ISO 22301", "ISO 37001", "TQM", "TPM", "Kaizen Certification",
  "Lean Manufacturing", "Six Sigma (Green/Black Belt)", "ISO 27001", "ISO 20000",
  "CMMI", "SOC 1", "SOC 2", "SOC 3", "PCI-DSS", "HIPAA", "GDPR", "eSCM",
  "CERT-In Empanelment", "BIS CRS", "STQC Approval", "NABL", "GLP",
  "ASTM Standards", "ISO/IEC 17025", "FDA India", "FDA US", "CDSCO Licensing",
  "ISI Mark", "BEE Star Rating", "IATF 16949", "AS9100", "CE Mark",
  "UL Certification", "RoHS", "REACH", "PED", "API Certification", "ISO 3834",
  "FSSAI License", "AGMARK", "HACCP", "ISO 22000", "GMP", "cGMP",
  "Halal Certification", "Kosher Certification", "Jaivik Bharat", "NPOP",
  "USDA Organic", "Rainforest Alliance", "Non-GMO", "Gluten-Free", "BRCGS",
  "SQF", "LEED", "GRIHA", "GOTS", "FSC", "ISO 14064", "Ecomark",
  "Fair Trade", "Carbon Neutral Certification", "Zero Liquid Discharge",
  "Water Positive", "C-TPAT", "Authorized Economic Operator (AEO)", "GS1 Barcode",
  "WTO-TBT Compliance", "RCMC", "UNGM Registration", "ITAR", "EAR",
  "CEPA Compliance", "FTA Compliance", "UKCA Mark", "TGA", "MHRA", "ANVISA",
  "SA 8000", "ISO 26000", "Ethical Trade Initiative (ETI)", "BSCI", "WRAP",
  "SMETA", "Fair Wage Certification", "ISO 20400", "Women-Owned Certification",
  "LGBTQ+ Inclusive Labels", "AI Ethics Certification", "Cyber Insurance Compliance",
  "ESG Audit", "Data Sovereignty Compliance", "Blockchain Certification",
  "ISO 42001", "NIST Cybersecurity Framework"
];

const CERTIFICATION_OPTIONS = [
  ...rawCertifications
    .filter((value, index, self) => self.indexOf(value) === index) 
    .sort() 
];


export const BusinessCapabilitiesStep: FC<BusinessCapabilitiesStepProps> = ({ form }) => {
  const watchHasNoCertifications = form.watch('businessCapabilities.hasNoCertifications');

  useEffect(() => {
    if (watchHasNoCertifications) {
      form.setValue('businessCapabilities.certifications', '', { shouldValidate: true, shouldDirty: true });
    }
  }, [watchHasNoCertifications, form.setValue, form]);


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Zap className="mr-2 h-6 w-6 text-primary" />
          Business Capabilities
        </CardTitle>
        <CardDescription>Describe your company's roles, sectors, products, and capacities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="businessCapabilities.businessRoles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Role(s)</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  options={BUSINESS_ROLE_OPTIONS}
                  placeholder="Select or type business roles..."
                  id="businessRoles"
                  aria-describedby="businessRoles-description"
                  aria-invalid={!!form.formState.errors.businessCapabilities?.businessRoles}
                />
              </FormControl>
              <FormDescription id="businessRoles-description">
                Select your company's business roles. You can type to search or add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessCapabilities.industrySectors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Sectors</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  options={INDUSTRY_SECTOR_OPTIONS}
                  placeholder="Select or type industry sectors..."
                  id="industrySectors"
                  aria-describedby="industrySectors-description"
                  aria-invalid={!!form.formState.errors.businessCapabilities?.industrySectors}
                />
              </FormControl>
              <FormDescription id="industrySectors-description">
                Enter the primary industry sectors your company operates in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessCapabilities.productServiceKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product & Service Keywords</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  options={EXAMPLE_KEYWORD_OPTIONS}
                  placeholder="Enter product/service keywords..."
                  id="productServiceKeywords"
                  aria-describedby="productServiceKeywords-description"
                  aria-invalid={!!form.formState.errors.businessCapabilities?.productServiceKeywords}
                />
              </FormControl>
              <FormDescription id="productServiceKeywords-description">
                Enter relevant keywords for your products or services. You can type to add custom keywords.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessCapabilities.technicalCapabilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Capabilities (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="text"
                  placeholder="Describe your technical expertise, equipment, or methodologies..." 
                  {...field} 
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessCapabilities.hasNoCertifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                  id={field.name}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel htmlFor={field.name} className="font-normal">
                  I have no certifications.
                </FormLabel>
                <FormDescription>
                  Check this box if your company does not hold any certifications.
                </FormDescription>
              </div>
               <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessCapabilities.certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
              <FormControl>
                 <TagInput
                  {...field}
                  value={field.value ?? ""}
                  options={CERTIFICATION_OPTIONS}
                  placeholder="Enter certification names..."
                  id="certifications"
                  aria-describedby="certifications-description"
                  aria-invalid={!!form.formState.errors.businessCapabilities?.certifications}
                  disabled={watchHasNoCertifications}
                />
              </FormControl>
              <FormDescription id="certifications-description">
                Enter certification names if applicable. This field is for names only.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
