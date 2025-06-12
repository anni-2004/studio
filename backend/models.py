from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CompanyDetails(BaseModel):
    companyName: str
    companyType: str
    dateOfEstablishment: datetime
    country: str
    state: str
    city: str
    address: str
    websiteUrl: Optional[str] = None

class Capabilities(BaseModel):
    businessRoles: str
    industrySectors: str
    productServiceKeywords: str
    technicalCapabilities: str
    certifications: Optional[str]
    hasNoCertifications: bool

class Turnover(BaseModel):
    financialYear: str
    amount: str

class FinancialInfo(BaseModel):
    hasPan: bool
    hasGstin: bool
    hasMsmeUdyam: bool
    hasNsic: bool
    annualTurnovers: List[Turnover]
    netWorthAmount: Optional[str]
    netWorthCurrency: Optional[str]
    isBlacklistedOrLitigation: bool
    blacklistedDetails: Optional[str]

class TenderExperience(BaseModel):
    suppliedToGovtPsus: bool
    hasPastClients: bool
    pastClients: Optional[str]
    highestOrderValueFulfilled: Optional[float]
    tenderTypesHandled: Optional[str]

class GeographicReadiness(BaseModel):
    operatesInMultipleStates: bool
    operationalStates: Optional[str]
    exportsToOtherCountries: bool
    countriesServed: Optional[str]
    hasImportLicense: bool
    hasExportLicense: bool
    registeredOnPortals: bool
    hasDigitalSignature: bool
    preferredTenderLanguages: Optional[str]

class TermsAndConditions(BaseModel):
    acknowledgmentOfTenderMatching: bool
    accuracyOfSharedCompanyProfile: bool
    noResponsibilityForTenderOutcomes: bool
    nonDisclosureAndLimitedUse: bool

class Declaration(BaseModel):
    infoConfirmed: bool

class RegistrationRequest(BaseModel):
    companyDetails: CompanyDetails
    businessCapabilities: Capabilities
    financialLegalInfo: FinancialInfo
    tenderExperience: TenderExperience
    geographicDigitalReach: GeographicReadiness
    termsAndConditions: TermsAndConditions
    declarationsUploads: Declaration
