from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db, Assessment, AssessmentDocument, ReadinessScore, AnalysisResult, User
from routers.auth import get_current_user
from services.ollama_service import OllamaService
import json
import os

router = APIRouter()
ollama = OllamaService()

READINESS_CATEGORIES = [
    "Compute", "Storage", "Network", "Security",
    "Identity", "Backup", "DR", "Monitoring", "Cost", "Compliance"
]

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "prompts", filename)
    try:
        with open(prompt_path, "r") as f:
            return f.read()
    except:
        return ""

@router.post("/{assessment_id}/run")
async def run_analysis(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id, Assessment.user_id == current_user.id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    docs_result = await db.execute(select(AssessmentDocument).where(AssessmentDocument.assessment_id == assessment_id))
    documents = docs_result.scalars().all()
    if not documents:
        raise HTTPException(status_code=400, detail="No documents uploaded. Please upload assessment files first.")

    combined_text = "\n\n".join([
        f"=== {doc.doc_type.upper()} ({doc.original_filename}) ===\n{doc.extracted_text[:8000]}"
        for doc in documents
    ])[:30000]

    # Run readiness scoring
    readiness_prompt = load_prompt("cloud_readiness_analyzer.txt")
    readiness_response = await ollama.generate(
        f"{readiness_prompt}\n\nORGANIZATION: {assessment.organization}\n\nDOCUMENTS:\n{combined_text}\n\nReturn a JSON object with scores (0-100) for each category and a brief justification. Categories: {', '.join(READINESS_CATEGORIES)}"
    )

    scores = {}
    try:
        json_start = readiness_response.find('{')
        json_end = readiness_response.rfind('}') + 1
        if json_start >= 0 and json_end > json_start:
            parsed = json.loads(readiness_response[json_start:json_end])
            for cat in READINESS_CATEGORIES:
                if cat in parsed:
                    val = parsed[cat]
                    if isinstance(val, dict):
                        scores[cat] = {"score": int(val.get("score", 50)), "justification": str(val.get("justification", ""))}
                    else:
                        scores[cat] = {"score": int(val), "justification": ""}
    except:
        for cat in READINESS_CATEGORIES:
            scores[cat] = {"score": 50, "justification": "Could not parse score"}

    overall_score = int(sum(v["score"] for v in scores.values()) / len(scores))

    existing = await db.execute(select(ReadinessScore).where(ReadinessScore.assessment_id == assessment_id))
    existing_score = existing.scalar_one_or_none()
    if existing_score:
        existing_score.overall_score = overall_score
        existing_score.category_scores = scores
    else:
        readiness_score = ReadinessScore(
            assessment_id=assessment_id,
            overall_score=overall_score,
            category_scores=scores
        )
        db.add(readiness_score)

    # Run risk analysis
    risk_prompt = load_prompt("migration_risk_analyzer.txt")
    risk_response = await ollama.generate(f"{risk_prompt}\n\nORGANIZATION: {assessment.organization}\n\nDOCUMENTS:\n{combined_text[:15000]}")
    
    # Security baseline
    security_prompt = load_prompt("security_baseline_checker.txt")
    security_response = await ollama.generate(f"{security_prompt}\n\nORGANIZATION: {assessment.organization}\n\nDOCUMENTS:\n{combined_text[:10000]}")
    
    # Compliance gaps
    compliance_prompt = load_prompt("compliance_gap_analyzer.txt")
    compliance_response = await ollama.generate(f"{compliance_prompt}\n\nORGANIZATION: {assessment.organization}\n\nDOCUMENTS:\n{combined_text[:10000]}")
    
    # Landing zone
    landing_prompt = load_prompt("landing_zone_reviewer.txt")
    landing_response = await ollama.generate(f"{landing_prompt}\n\nORGANIZATION: {assessment.organization}\n\nDOCUMENTS:\n{combined_text[:10000]}")

    # Store analysis results
    existing_analysis = await db.execute(select(AnalysisResult).where(AnalysisResult.assessment_id == assessment_id))
    existing_ar = existing_analysis.scalar_one_or_none()
    
    analysis_data = {
        "migration_risks": risk_response,
        "security_baseline": security_response,
        "compliance_gaps": compliance_response,
        "landing_zone": landing_response
    }
    
    if existing_ar:
        existing_ar.analysis_type = "full"
        existing_ar.result_data = analysis_data
    else:
        ar = AnalysisResult(
            assessment_id=assessment_id,
            analysis_type="full",
            result_data=analysis_data,
            model_used=os.getenv("OLLAMA_MODEL", "qwen2.5:7b-instruct")
        )
        db.add(ar)

    assessment.status = "analyzed"
    await db.commit()

    return {
        "assessment_id": assessment_id,
        "overall_score": overall_score,
        "category_scores": scores,
        "status": "analyzed",
        "message": f"Analysis complete. Overall readiness score: {overall_score}/100"
    }

@router.get("/{assessment_id}/results")
async def get_results(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id, Assessment.user_id == current_user.id))
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    score_result = await db.execute(select(ReadinessScore).where(ReadinessScore.assessment_id == assessment_id))
    readiness = score_result.scalar_one_or_none()

    ar_result = await db.execute(select(AnalysisResult).where(AnalysisResult.assessment_id == assessment_id))
    analysis = ar_result.scalar_one_or_none()

    return {
        "assessment": {"id": assessment.id, "name": assessment.name, "organization": assessment.organization, "status": assessment.status},
        "readiness": {"overall_score": readiness.overall_score, "category_scores": readiness.category_scores} if readiness else None,
        "analysis": analysis.result_data if analysis else None
    }
