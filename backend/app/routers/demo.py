import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/demo", tags=["Demo Hub"])

class AIChatRequest(BaseModel):
    question: str

class AIChatResponse(BaseModel):
    answer: str

class ResearchPaperRequest(BaseModel):
    prompt: str

class ResearchPaperResponse(BaseModel):
    title: str
    abstract: str
    content: str

class HistoryEntry(BaseModel):
    id: int
    title: str
    status: str
    duration: str
    verdict: str

@router.get("/feature-cards")
def feature_cards() -> List[dict]:
    return [
        {
            "id": "3d-dna",
            "title": "3D DNA Explorer",
            "description": "Interactive helix viewer for immersive genomic structure exploration.",
            "status": "Live"
        },
        {
            "id": "quantum-animation",
            "title": "Quantum Circuit Animation",
            "description": "Animated Qiskit circuit run-time preview with coherence meter.",
            "status": "Preview"
        },
        {
            "id": "ai-chat",
            "title": "AI Chat Assistant",
            "description": "Ask a genomic AI assistant about mutation impact, reports, or demo ideas.",
            "status": "Ready"
        }
    ]

@router.post("/ai-chat", response_model=AIChatResponse)
def ai_chat(payload: AIChatRequest):
    if not payload.question:
        return {"answer": "Please ask a valid question."}

    answer = (
        "The current analysis shows strong agreement between classical Random Forest mutation calls "
        "and quantum SVM fidelity. The insertion signal is confirmed by a 94% fidelity statevector match "
        "and a 98% ML confidence score."
    )
    return {"answer": answer}

@router.post("/research-paper", response_model=ResearchPaperResponse)
def research_paper(payload: ResearchPaperRequest):
    prompt = payload.prompt or "Generate a research paper summary."
    title = "QuantumDNA X Comparative Genomics Research Summary"
    abstract = (
        "This demo summary presents an integrative AI and quantum computational assessment of genomic variant calls. "
        "Classical machine learning predictions and quantum state fidelity are synthesized to provide a hybrid confidence verdict."
    )
    content = (
        "In this mock research paper, QuantumDNA X compares classical and quantum outputs for a genomic sequence. "
        "The simulated analysis yields an insertion mutation with high classical confidence and a complementary 94% statevector fidelity. "
        "These metrics demonstrate how hybrid computational genomics can strengthen mutation discovery and validation workflows."
    )
    return {"title": title, "abstract": abstract, "content": content}

@router.get("/cloud-history", response_model=List[HistoryEntry])
def cloud_history():
    return [
        {"id": 1, "title": "BRCA1 Demo Run", "status": "Completed", "duration": "2m 18s", "verdict": "Consensus Confirmed"},
        {"id": 2, "title": "SARS-CoV-2 Spike", "status": "Completed", "duration": "3m 04s", "verdict": "Qiskit Supportive"},
        {"id": 3, "title": "HTT CAG Expansion", "status": "Completed", "duration": "2m 52s", "verdict": "Genome Stability High"}
    ]
