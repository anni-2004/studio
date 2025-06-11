from fastapi import APIRouter, HTTPException
from models import CompanyDetails, Capabilities, FinancialInfo, TenderExperience, GeographicReadiness, TermsAndConditions, Declaration
from database import company_profiles

router = APIRouter()

@router.post("/register")
def register_company(
    company_details: CompanyDetails,
    capabilities: Capabilities,
    financial_info: FinancialInfo,
    tender_experience: TenderExperience,
    geo_readiness: GeographicReadiness,
    terms: TermsAndConditions,
    declaration: Declaration
):
    profile_data = {
        "company_details": company_details.dict(),
        "capabilities": capabilities.dict(),
        "financial_info": financial_info.dict(),
        "tender_experience": tender_experience.dict(),
        "geo_readiness": geo_readiness.dict(),
        "terms_and_conditions": terms.dict(),
        "declaration": declaration.dict(),
    }

    try:
        result = company_profiles.insert_one(profile_data)
        return {"message": "Company profile registered successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
