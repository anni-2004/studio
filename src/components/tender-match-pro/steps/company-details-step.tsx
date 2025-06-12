
"use client";

import type { FC } from 'react';
import React, { useState, useEffect, useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { RegistrationFormData } from '@/lib/schemas/registration-schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase } from 'lucide-react';
import { getYear, getMonth, getDate } from 'date-fns';

interface CompanyDetailsStepProps {
  form: UseFormReturn<RegistrationFormData>;
}

const DUMMY_COUNTRIES = [{ label: "India", value: "IN" }, { label: "United States", value: "US" }];

const INDIAN_STATES_UTS = [
  { label: "Andaman and Nicobar Islands", value: "AN" },
  { label: "Andhra Pradesh", value: "AP" },
  { label: "Arunachal Pradesh", value: "AR" },
  { label: "Assam", value: "AS" },
  { label: "Bihar", value: "BR" },
  { label: "Chandigarh", value: "CH" },
  { label: "Chhattisgarh", value: "CG" },
  { label: "Dadra & Nagar Haveli and Daman & Diu", value: "DD" },
  { label: "Delhi", value: "DL" },
  { label: "Goa", value: "GA" },
  { label: "Gujarat", value: "GJ" },
  { label: "Haryana", value: "HR" },
  { label: "Himachal Pradesh", value: "HP" },
  { label: "Jammu and Kashmir", value: "JK" },
  { label: "Jharkhand", value: "JH" },
  { label: "Karnataka", value: "KA" },
  { label: "Kerala", value: "KL" },
  { label: "Ladakh", value: "LA" },
  { label: "Lakshadweep", value: "LD" },
  { label: "Madhya Pradesh", value: "MP" },
  { label: "Maharashtra", value: "MH" },
  { label: "Manipur", value: "MN" },
  { label: "Meghalaya", value: "ML" },
  { label: "Mizoram", value: "MZ" },
  { label: "Nagaland", value: "NL" },
  { label: "Odisha", value: "OD" },
  { label: "Puducherry", value: "PY" },
  { label: "Punjab", value: "PB" },
  { label: "Rajasthan", value: "RJ" },
  { label: "Sikkim", value: "SK" },
  { label: "Tamil Nadu", value: "TN" },
  { label: "Telangana", value: "TG" },
  { label: "Tripura", value: "TR" },
  { label: "Uttar Pradesh", value: "UP" },
  { label: "Uttarakhand", value: "UK" },
  { label: "West Bengal", value: "WB" }
].sort((a, b) => a.label.localeCompare(b.label));


const US_STATES = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" }
].sort((a, b) => a.label.localeCompare(b.label));

const COMPANY_TYPES = ["Proprietorship", "Pvt Ltd", "LLP", "Public Ltd", "Partnership", "Other"];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1800 + 1 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(0, i).toLocaleString('default', { month: 'long' }),
}));

const getDaysInMonth = (month: number, year: number): number[] => {
  const days = new Date(year, month, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
};

export const CompanyDetailsStep: FC<CompanyDetailsStepProps> = ({ form }) => {
  const { control, setValue, watch, getValues } = form;
  const selectedCountry = watch('companyDetails.country');

  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);

  const existingDate = getValues('companyDetails.dateOfEstablishment');

  useEffect(() => {
    if (existingDate instanceof Date && !isNaN(existingDate.getTime())) {
      setSelectedYear(String(getYear(existingDate)));
      setSelectedMonth(String(getMonth(existingDate) + 1));
      setSelectedDay(String(getDate(existingDate)));
    }
  }, [existingDate]);

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const day = parseInt(selectedDay, 10);
      const month = parseInt(selectedMonth, 10);
      const year = parseInt(selectedYear, 10);

      // Validate if the constructed date is a real date (e.g. Feb 30 is not)
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        setValue('companyDetails.dateOfEstablishment', date, { shouldValidate: true, shouldDirty: true });
      } else {
        // Set to an invalid value or undefined to trigger RHF validation
        setValue('companyDetails.dateOfEstablishment', null, { shouldValidate: true, shouldDirty: true });
      }
    } else {
        // If any part is missing, set RHF field to undefined to ensure validation fires if field is required
        setValue('companyDetails.dateOfEstablishment', null, { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedDay, selectedMonth, selectedYear, setValue]);

  const daysInSelectedMonth = useMemo(() => {
    if (selectedMonth && selectedYear) {
      return getDaysInMonth(parseInt(selectedMonth, 10), parseInt(selectedYear, 10));
    }
    return Array.from({ length: 31 }, (_, i) => i + 1); // Default to 31 days
  }, [selectedMonth, selectedYear]);

  const handleDayChange = (value: string) => {
    setSelectedDay(value);
  };
  
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    // Reset day if it's no longer valid for the new month
    if (selectedDay && selectedYear) {
      const currentDayNum = parseInt(selectedDay, 10);
      const daysInNewMonth = getDaysInMonth(parseInt(value, 10), parseInt(selectedYear, 10)).length;
      if (currentDayNum > daysInNewMonth) {
        setSelectedDay(undefined); // Or set to daysInNewMonth.toString()
      }
    }
  };
  
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
     // Reset day if it's February and day becomes invalid due to leap year change
    if (selectedDay && selectedMonth === '2') {
        const currentDayNum = parseInt(selectedDay, 10);
        const daysInNewFeb = getDaysInMonth(2, parseInt(value, 10)).length;
        if (currentDayNum > daysInNewFeb) {
            setSelectedDay(undefined);
        }
    }
  };

  const getStatesForCountry = (countryCode: string | undefined) => {
    if (countryCode === "IN") return INDIAN_STATES_UTS;
    if (countryCode === "US") return US_STATES;
    return [];
  };
  
  const stateLabel = selectedCountry === "IN" ? "State / Union Territory" : "State";

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Briefcase className="mr-2 h-6 w-6 text-primary" />
          Company Details
        </CardTitle>
        <CardDescription>Provide fundamental information about your company.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="companyDetails.companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., Acme Innovations Inc." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyDetails.companyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COMPANY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Date of Establishment Field */}
        <FormField
          control={control}
          name="companyDetails.dateOfEstablishment"
          render={({ field }) => ( // field is kept for RHF to register and validate
            <FormItem>
              <FormLabel>Date of Establishment</FormLabel>
              <div className="grid grid-cols-3 gap-3">
                <Select value={selectedDay} onValueChange={handleDayChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {daysInSelectedMonth.map(day => (
                      <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONTHS.map(month => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={handleYearChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {YEARS.map(year => (
                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage /> {/* This will show error for companyDetails.dateOfEstablishment */}
            </FormItem>
          )}
        />

         <FormField
          control={control}
          name="companyDetails.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value); 
                  setValue('companyDetails.state', '', { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                }} 
                value={field.value ?? ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DUMMY_COUNTRIES.map(country => (
                    <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyDetails.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{stateLabel}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ''} disabled={!selectedCountry}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${stateLabel.toLowerCase()}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getStatesForCountry(selectedCountry).map(state => (
                    <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedCountry && <FormDescription>Please select a country first.</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyDetails.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g., Mumbai" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyDetails.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Company Address</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="e.g., 123 Tech Park, Silicon Valley, CA 94000" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="companyDetails.websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website URL (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="e.g., https://www.acmeinnovations.com" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

    