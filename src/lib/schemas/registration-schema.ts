
import { z } from 'zod';

// Step 1: Company Details
export const companyDetailsSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  companyType: z.string().min(1, { message: "Please select a company type." }),
  dateOfEstablishment: z
  .union([
    z.date(),
    z.null()
  ])
  .superRefine((val, ctx) => {
    if (val !== null) {
      if (val < new Date("1800-01-01")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date cannot be before January 1, 1800.",
        });
      }
      if (val > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date cannot be in the future.",
        });
      }
    }
  }),
  country: z.string().min(2, { message: "Please select a country." }),
  state: z.string().min(2, { message: "Please select a state." }),
  city: z.string().min(2, { message: "Please enter a city." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  websiteUrl: z.string().url({ message: "Invalid URL format. Must be like https://example.com" }).optional().or(z.literal('')),
});

// Step 2: Business Capabilities
export const businessCapabilitiesSchema = z.object({
  businessRoles: z.string().min(3, { message: "Please enter at least one business role." }),
  industrySectors: z.string().min(3, { message: "Please enter at least one industry sector." }),
  productServiceKeywords: z.string().min(3, { message: "Please enter product/service keywords." }),
  technicalCapabilities: z.string().optional().or(z.literal('')),
  certifications: z.string().optional(),
  hasNoCertifications: z.boolean().default(false),
}).superRefine((data, ctx) => {
  if (!data.hasNoCertifications && (!data.certifications || data.certifications.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Certification names are required, or check the 'I have no certifications' box.",
      path: ['certifications'],
    });
  }
  if (data.hasNoCertifications && data.certifications && data.certifications.trim() !== "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "If 'I have no certifications' is checked, the certifications list must be empty. Please clear certifications or uncheck the box.",
      path: ['certifications'],
    });
  }
});

// Step 3: Financial & Legal Info
const turnoverEntrySchema = z.object({
  financialYear: z.string(),
  amount: z.string().optional().or(z.literal('')),
});

export const financialLegalInfoSchema = z.object({
  hasPan: z.boolean().default(false),
  hasGstin: z.boolean().default(false),
  hasMsmeUdyam: z.boolean().default(false),
  hasNsic: z.boolean().default(false),
  annualTurnovers: z.array(turnoverEntrySchema)
    .min(10, { message: "Turnover data for at least 10 financial years is expected." })
    .max(15, { message: "Turnover data cannot exceed 15 financial years." })
    .superRefine((turnovers, ctx) => {
      if (!turnovers[0]?.amount || turnovers[0].amount.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Turnover amount for the latest financial year is required.",
          path: [0, 'amount'],
        });
      } else if (turnovers[0]?.amount && !/^\d+(\.\d{1,2})?$/.test(turnovers[0].amount)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid amount format for the latest financial year. Must be a number.",
          path: [0, 'amount'],
        });
      }

      for (let i = 1; i < turnovers.length; i++) {
        if (turnovers[i]?.amount && turnovers[i].amount.trim() !== "" && !/^\d+(\.\d{1,2})?$/.test(turnovers[i].amount)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid amount format for financial year ${turnovers[i].financialYear}. Must be a number.`,
            path: [i, 'amount'],
          });
        }
      }
    }),
  netWorthAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Invalid amount format." }).min(1, { message: "Net worth amount is required." }),
  netWorthCurrency: z.string().min(1, { message: "Net worth currency is required." }),
  isBlacklistedOrLitigation: z.boolean().default(false),
  blacklistedDetails: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.isBlacklistedOrLitigation && (!data.blacklistedDetails || data.blacklistedDetails.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Details of blacklisting/litigation are required if 'Yes' is selected.",
      path: ['blacklistedDetails'],
    });
  }
});


// Step 4: Tender Experience
export const tenderExperienceSchema = z.object({
  suppliedToGovtPsus: z.boolean().default(false),
  hasPastClients: z.boolean().default(false),
  pastClients: z.string().optional().or(z.literal('')),
  highestOrderValueFulfilled: z.coerce.number().min(0, {message: "Highest order value fulfilled is required (can be 0)."}),
  tenderTypesHandled: z.string().min(3, { message: "Tender types handled are required." }),
}).superRefine((data, ctx) => {
  if (data.hasPastClients && (!data.pastClients || data.pastClients.trim().length < 3)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Past clients are required if you indicate you have them (minimum 3 characters).",
      path: ['pastClients'],
    });
  }
});

// Step 5: Geographic Reach & Digital Readiness
export const geographicDigitalReachSchema = z.object({
  operatesInMultipleStates: z.boolean().default(false),
  operationalStates: z.string().optional().or(z.literal('')),
  exportsToOtherCountries: z.boolean().default(false),
  countriesServed: z.string().optional().or(z.literal('')),
  hasImportLicense: z.boolean().default(false),
  hasExportLicense: z.boolean().default(false),
  registeredOnPortals: z.boolean().default(false),
  hasDigitalSignature: z.boolean().default(false),
  preferredTenderLanguages: z.string().min(2, { message: "Enter preferred languages, comma-separated." }),
}).superRefine((data, ctx) => {
  if (data.operatesInMultipleStates && (!data.operationalStates || data.operationalStates.trim().length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Operational states are required if you operate in multiple states (minimum 2 characters).",
      path: ['operationalStates'],
    });
  }
  if (data.exportsToOtherCountries && (!data.countriesServed || data.countriesServed.trim().length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Countries served are required if you export to other countries (minimum 2 characters).",
      path: ['countriesServed'],
    });
  }
});

// Step 6: Terms & Conditions
export const termsAndConditionsSchema = z.object({
  acknowledgmentOfTenderMatching: z.boolean().refine(val => val === true, {
    message: "You must acknowledge this term to proceed."
  }),
  accuracyOfSharedCompanyProfile: z.boolean().refine(val => val === true, {
    message: "You must confirm the accuracy of your profile to proceed."
  }),
  noResponsibilityForTenderOutcomes: z.boolean().refine(val => val === true, {
    message: "You must acknowledge this term to proceed."
  }),
  nonDisclosureAndLimitedUse: z.boolean().refine(val => val === true, {
    message: "You must agree to the data usage terms to proceed."
  }),
});


// Step 7: Declarations
export const declarationsUploadsSchema = z.object({
  infoConfirmed: z.boolean().refine(val => val === true, { message: "You must confirm the information is true." }),
});


// Main Schema combining all steps
export const registrationSchema = z.object({
  companyDetails: companyDetailsSchema,
  businessCapabilities: businessCapabilitiesSchema,
  financialLegalInfo: financialLegalInfoSchema,
  tenderExperience: tenderExperienceSchema,
  geographicDigitalReach: geographicDigitalReachSchema,
  termsAndConditions: termsAndConditionsSchema,
  declarationsUploads: declarationsUploadsSchema,
}).strict();

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type TurnoverEntry = z.infer<typeof turnoverEntrySchema>;

