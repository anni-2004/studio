from pydantic import BaseModel, Field, EmailStr, HttpUrl, root_validator, validator
from typing import Optional, List, Dict

class CompanyDetails(BaseModel):
    company_name: str
    company_type: str
    date_of_establishment: str
    country: str
    state: str
    city: str
    address: str
    website: Optional[HttpUrl]


class Capabilities(BaseModel):
    business_roles: List[str]
    industry_sectors: List[str]
    product_service_keywords: List[str]
    technical_capabilities: Optional[str] = None
    has_certifications: bool
    certifications: Optional[List[str]] = []

    @validator("certifications", always=True)
    def check_certs(cls, v, values):
        if values.get("has_certifications") and not v:
            raise ValueError("Certifications list required if has_certifications is true")
        return v

class FinancialInfo(BaseModel):
    has_pan: bool
    has_gstin: bool
    has_msme: bool
    has_nsic: bool
    net_worth: float
    currency: str
    annual_turnover: Dict[str, float]
    blacklisted_or_in_litigation: bool
    blacklisting_details: Optional[str] = None

    @validator("net_worth")
    def net_worth_nonneg(cls, v):
        if v < 0: raise ValueError("Net worth cannot be negative")
        return v

    @validator("annual_turnover")
    def turnover_checks(cls, v):
        if "2025-26" not in v:
            raise ValueError("Turnover for 2025-26 is required")
        if any(val < 0 for val in v.values()):
            raise ValueError("Turnover values must be non-negative")
        return v
    @validator("blacklisting_details", always=True)
    def require_details_if_blacklisted(cls, v, values):
        if values.get("blacklisted_or_in_litigation") and not v:
            raise ValueError("Blacklisting/Litigation details are required when the company is blacklisted or in litigation")
        return v

class TenderExperience(BaseModel):
    supplied_to_government: bool
    has_past_clients: bool
    past_clients: Optional[List[str]] = None
    highest_order_value_eur: float
    tender_types_handled: List[str]

    @validator("highest_order_value_eur")
    def order_value_positive(cls, v):
        if v <= 0: raise ValueError("Highest order value must be > 0")
        return v

    @validator("tender_types_handled")
    def at_least_one_type(cls, v):
        if not v: raise ValueError("At least one tender type must be specified")
        return v
    @validator("past_clients", always=True)
    def require_clients_if_indicated(cls, v, values):
        if values.get("has_past_clients") and not v:
            raise ValueError("Past clients must be provided if 'has_past_clients' is true")
        return v
class GeographicReadiness(BaseModel):
    multi_state_operation: bool
    operational_states: Optional[List[str]] = None
    exports_to_other_countries: bool
    countries_served: Optional[List[str]] = None
    has_import_license: bool
    has_export_license: bool
    registered_on_portals: bool
    has_digital_signature_certificate: bool
    preferred_languages_for_tenders: List[str]

    @validator("preferred_languages_for_tenders")
    def languages_nonempty(cls, v):
        if not v: raise ValueError("At least one language must be selected")
        return v
    @validator("operational_states", always=True)
    def validate_states(cls, v, values):
        if values.get("multi_state_operation") and not v:
            raise ValueError("Operational states must be provided if 'operates_multiple_states' is true")
        return v

    @validator("countries_served", always=True)
    def validate_countries(cls, v, values):
        if values.get("exports_other_countries") and not v:
            raise ValueError("Countries served must be provided if 'exports_other_countries' is true")
        return v

class TermsAndConditions(BaseModel):
    acknowledge_tender_matching: bool
    confirm_profile_accuracy: bool
    acknowledge_tender_outcomes: bool
    agree_data_usage_terms: bool

    @root_validator
    def all_true(cls, values):
        for field, val in values.items():
            if not val:
                raise ValueError(f"You must accept: {field.replace('_',' ')}")
        return values

class Declaration(BaseModel):
    confirmed: bool

    @validator("confirmed")
    def must_confirm(cls, v):
        if not v: raise ValueError("Declaration must be confirmed")
        return v
