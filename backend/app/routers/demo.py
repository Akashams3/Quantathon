import os
import json
import urllib.request
import logging
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

logger = logging.getLogger("backend.demo")
router = APIRouter(prefix="/api/demo", tags=["Demo Hub"])

class AIChatRequest(BaseModel):
    question: str

class AIChatResponse(BaseModel):
    answer: str
    model: Optional[str] = "groq-llama-3.3-70b"

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

def call_groq_llm(user_question: str) -> Optional[str]:
    """Calls Groq LLaMA-3.3-70B API using environment key."""
    groq_key = os.getenv("GROQ_API_KEY", "")
    if not groq_key or groq_key.startswith("YOUR_"):
        logger.info("Groq API key not provided in .env, falling back to local synthesis.")
        return None

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json",
        "User-Agent": "QuantumDNA-X/4.0"
    }

    system_prompt = (
        "You are an expert Genomic and Quantum Computing AI Assistant for the QuantumDNA X platform. "
        "Provide highly accurate, scientifically sound, precise, yet simple and easily understandable answers for common people. "
        "Explain DNA mutations (insertions, deletions, substitutions), IBM Qiskit quantum statevectors, and Random Forest machine learning models cleanly."
    )

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_question}
        ],
        "temperature": 0.3,
        "max_tokens": 600
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=12) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            answer = res_data["choices"][0]["message"]["content"]
            return answer
    except Exception as e:
        logger.warning(f"Groq API execution error: {e}")
        return None

@router.get("/feature-cards")
def feature_cards() -> List[dict]:
    return [
        {
            "id": "3d-dna",
            "title": "3D DNA Explorer",
            "description": "Interactive double-helix viewer with hydrogen bonding geometry (A=T 2 bonds, C≡G 3 bonds).",
            "status": "Live"
        },
        {
            "id": "quantum-animation",
            "title": "Quantum Circuit Animation",
            "description": "Animated IBM Qiskit 4-qubit circuit with ring CNOT entanglement.",
            "status": "Preview"
        },
        {
            "id": "ai-chat",
            "title": "AI Chat Assistant",
            "description": "Powered by Groq LLaMA-3.3-70B for instant, accurate genomic explanations.",
            "status": "Ready"
        }
    ]

@router.post("/ai-chat", response_model=AIChatResponse)
def ai_chat(payload: AIChatRequest):
    if not payload.question:
        return {"answer": "Please ask a valid question.", "model": "local"}

    # 1. Try Groq LLaMA 3.3 70B API
    groq_answer = call_groq_llm(payload.question)
    if groq_answer:
        return {"answer": groq_answer, "model": "groq-llama-3.3-70b-versatile"}

    # 2. Local fallback answer if API offline
    fallback_answer = (
        f"Regarding '{payload.question}': Based on Chromosome 22 sequence analysis, "
        "our Scikit-learn Random Forest model detected an Insertion variant with 97.3% confidence, "
        "corroborated by IBM Qiskit 4-Qubit statevector fidelity of 0.9423 (94.23% match)."
    )
    return {"answer": fallback_answer, "model": "local-fallback"}

@router.post("/research-paper", response_model=ResearchPaperResponse)
def research_paper(payload: ResearchPaperRequest):
    prompt = payload.prompt or "Generate a research paper summary."
    title = "QuantumDNA X Comparative Genomics Research Summary"
    abstract = (
        "This research paper presents an integrative AI and quantum computational assessment of genomic variant calls. "
        "Classical machine learning predictions and quantum state fidelity are synthesized to provide a hybrid confidence verdict."
    )
    content = (
        "QuantumDNA X compares classical and quantum outputs for a 100,000 bp Chromosome 22 sequence. "
        "The analysis yields an insertion mutation with 97.3% classical confidence and a complementary 94.2% statevector fidelity. "
        "These metrics demonstrate how hybrid computational genomics strengthens mutation discovery and validation workflows."
    )
    return {"title": title, "abstract": abstract, "content": content}

@router.get("/cloud-history", response_model=List[HistoryEntry])
def cloud_history():
    return [
        {"id": 1, "title": "BRCA1 Demo Run", "status": "Completed", "duration": "2m 18s", "verdict": "Consensus Confirmed"},
        {"id": 2, "title": "SARS-CoV-2 Spike", "status": "Completed", "duration": "3m 04s", "verdict": "Qiskit Supportive"},
        {"id": 3, "title": "HTT CAG Expansion", "status": "Completed", "duration": "2m 52s", "verdict": "Genome Stability High"}
    ]
