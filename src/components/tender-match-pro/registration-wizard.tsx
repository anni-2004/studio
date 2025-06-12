
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm, FormProvider, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registrationSchema,
  RegistrationFormData,
  companyDetailsSchema,
  businessCapabilitiesSchema,
  financialLegalInfoSchema,
  tenderExperienceSchema,
  geographicDigitalReachSchema,
  termsAndConditionsSchema, 
  declarationsUploadsSchema
} from '@/lib/schemas/registration-schema';
import { useFormPersistence } from '@/hooks/use-form-persistence';
import { useToast } from '@/hooks/use-toast';

import { Progress } from '@/components/ui/progress';
import { FormNavigation } from './form-navigation';
import { CompanyDetailsStep } from './steps/company-details-step';
import { BusinessCapabilitiesStep } from './steps/business-capabilities-step';
import { FinancialLegalInfoStep } from './steps/financial-info-step';
import { TenderExperienceStep } from './steps/tender-experience-step';
import { GeographicDigitalReachStep } from './steps/geographic-reach-step';
import { TermsConditionsStep } from './steps/terms-conditions-step'; 
import { DeclarationsUploadsStep } from './steps/declarations-uploads-step';
import { ReviewSubmitStep } from './steps/review-submit-step';

const STEPS = [
  { id: 'companyDetails', title: 'Company Details', component: CompanyDetailsStep, schema: companyDetailsSchema, fields: ['companyDetails'] as const },
  { id: 'businessCapabilities', title: 'Business Capabilities', component: BusinessCapabilitiesStep, schema: businessCapabilitiesSchema, fields: ['businessCapabilities'] as const },
  { id: 'financialLegalInfo', title: 'Financial & Legal Info', component: FinancialLegalInfoStep, schema: financialLegalInfoSchema, fields: ['financialLegalInfo'] as const },
  { id: 'tenderExperience', title: 'Tender Experience', component: TenderExperienceStep, schema: tenderExperienceSchema, fields: ['tenderExperience'] as const },
  { id: 'geographicDigitalReach', title: 'Geographic & Digital', component: GeographicDigitalReachStep, schema: geographicDigitalReachSchema, fields: ['geographicDigitalReach'] as const },
  { id: 'termsAndConditions', title: 'Terms & Conditions', component: TermsConditionsStep, schema: termsAndConditionsSchema, fields: ['termsAndConditions'] as const }, 
  { id: 'declarationsUploads', title: 'Declarations', component: DeclarationsUploadsStep, schema: declarationsUploadsSchema, fields: ['declarationsUploads'] as const },
  { id: 'reviewSubmit', title: 'Review & Submit', component: ReviewSubmitStep, schema: registrationSchema, fields: [] as const },
];

const FORM_DATA_STORAGE_KEY = 'tenderMatchProRegistrationForm_v2';
const CURRENT_STEP_STORAGE_KEY = 'tenderMatchProRegistrationStep_v2';

// Helper to generate a financial year string like "YYYY-YY"
const getFinancialYearString = (startYear: number): string => {
  const endYearShort = (startYear + 1).toString().slice(-2);
  return `${startYear}-${endYearShort}`;
};

const generateInitialTurnovers = (count: number = 10) => {
  let latestFinancialYearStart = new Date().getFullYear();
  // Financial year in India (and many places) is typically April-March.
  // If current month is Jan, Feb, Mar (0,1,2), then the current FY started in the previous calendar year.
  if (new Date().getMonth() < 3) { 
    latestFinancialYearStart -= 1;
  }
  const turnovers = [];
  for (let i = 0; i < count; i++) { 
    const startYear = latestFinancialYearStart - i;
    turnovers.push({ financialYear: getFinancialYearString(startYear), amount: '' });
  }
  return turnovers;
};


export function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const initialDefaultValues = useMemo<RegistrationFormData>(() => ({
    companyDetails: {
      companyName: '',
      companyType: '',
      dateOfEstablishment: new Date(), // Changed from yearOfEstablishment
      country: '',
      state: '',
      city: '',
      address: '',
      websiteUrl: ''
    },
    businessCapabilities: {
      businessRoles: '',
      industrySectors: '',
      productServiceKeywords: '',
      technicalCapabilities: '',
      certifications: '',
      hasNoCertifications: false,
    },
    financialLegalInfo: {
      hasPan: false,
      hasGstin: false,
      hasMsmeUdyam: false,
      hasNsic: false,
      annualTurnovers: generateInitialTurnovers(10),
      netWorthAmount: '',
      netWorthCurrency: '',
      isBlacklistedOrLitigation: false,
      blacklistedDetails: ''
    },
    tenderExperience: {
      suppliedToGovtPsus: false,
      hasPastClients: false,
      pastClients: '',
      highestOrderValueFulfilled: 0,
      tenderTypesHandled: ''
    },
    geographicDigitalReach: {
      operatesInMultipleStates: false,
      operationalStates: '',
      exportsToOtherCountries: false,
      countriesServed: '',
      hasImportLicense: false,
      hasExportLicense: false,
      registeredOnPortals: false,
      hasDigitalSignature: false,
      preferredTenderLanguages: ''
    },
    termsAndConditions: { 
      acknowledgmentOfTenderMatching: false,
      accuracyOfSharedCompanyProfile: false,
      noResponsibilityForTenderOutcomes: false,
      nonDisclosureAndLimitedUse: false,
    },
    declarationsUploads: {
      infoConfirmed: false,
    },
  }), []);


  const methods = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange', 
    defaultValues: initialDefaultValues,
  });

  useFormPersistence(methods, FORM_DATA_STORAGE_KEY, initialDefaultValues);

  useEffect(() => {
    const savedStep = localStorage.getItem(CURRENT_STEP_STORAGE_KEY);
    if (savedStep) {
      const stepNumber = parseInt(savedStep, 10);
      if (!isNaN(stepNumber) && stepNumber >= 0 && stepNumber < STEPS.length) {
        setCurrentStep(stepNumber);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CURRENT_STEP_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);


  const handleNext = async () => {
    console.log(currentStep, STEPS.length);
    if (currentStep < STEPS.length - 1) {
      const currentStepFields = STEPS[currentStep].fields.slice() as (keyof RegistrationFormData)[];
      
      const fieldsToValidate: (keyof RegistrationFormData)[] | (Path<RegistrationFormData>)[] = 
        STEPS[currentStep].id === 'termsAndConditions' ? ['termsAndConditions'] :
        (currentStepFields.length > 0 ? currentStepFields as any : undefined);


      const isValid = await methods.trigger(fieldsToValidate as any);

      if (isValid) {
        try {
          const currentValues = methods.getValues();
          localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(currentValues));
        } catch (error) {
          console.error("Failed to save form data to localStorage on Next:", error);
          toast({
            title: "Save Error",
            description: "Could not save form progress. Please try again.",
            variant: "destructive",
          });
        }
        setCurrentStep(prev => prev + 1);
      } else {
        toast({
          title: "Validation Error",
          description: "Please correct the errors on the current page before proceeding.",
          variant: "destructive",
        });
      }
    } 
    else {
      console.log("wroking")
      console.log(methods.getValues());
      await onSubmit(methods.getValues());
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    console.log("hello");
    try {
      console.log(data);
    const response = await fetch(`http://127.0.0.1:8000/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Failed to submit registration.');
    }

    toast({
      title: "Profile Submitted!",
      description: "Your company profile has been successfully submitted.",
      className: "bg-green-500 text-white",
    });

    localStorage.removeItem(FORM_DATA_STORAGE_KEY);
    localStorage.removeItem(CURRENT_STEP_STORAGE_KEY);
    methods.reset(initialDefaultValues);
    setCurrentStep(0);

  } catch (error: any) {
    toast({
      title: "Submission Error",
      description: error.message || "Something went wrong while submitting your profile.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
    setIsSubmitting(false);
    toast({
      title: "Profile Submitted!",
      description: "Your company profile has been successfully submitted.",
      className: "bg-green-500 text-white", 
    });
    
    localStorage.removeItem(FORM_DATA_STORAGE_KEY);
    localStorage.removeItem(CURRENT_STEP_STORAGE_KEY);
    methods.reset(initialDefaultValues); 
    setCurrentStep(0); 
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const progressValue = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8 w-full">
        <Progress value={progressValue} className="w-full mb-6 h-3" />

        <CurrentStepComponent form={methods} />

        <FormNavigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isNextDisabled={methods.formState.isSubmitting || (currentStep === STEPS.length -1 && !methods.formState.isValid && methods.formState.isSubmitted) }
          isSubmitting={isSubmitting}
        />
      </form>
    </FormProvider>
  );
}
