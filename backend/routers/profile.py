from fastapi import APIRouter, HTTPException
from ..models import RegistrationRequest
from ..database import company_collection  # assuming you have this

router = APIRouter()

@router.post("/register")
def register_company(payload: RegistrationRequest):
    try:
        # Convert nested models to dict
        profile_data = {
            "company_details": payload.companyDetails.dict(),
            "capabilities": payload.businessCapabilities.dict(),
            "financial_info": payload.financialLegalInfo.dict(),
            "tender_experience": payload.tenderExperience.dict(),
            "geo_readiness": payload.geographicDigitalReach.dict(),
            "terms_and_conditions": payload.termsAndConditions.dict(),
            "declaration": payload.declarationsUploads.dict(),
        }

        result = company_collection.insert_one(profile_data)

        return {
            "message": "Company profile registered successfully",
            "id": str(result.inserted_id),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
