import os
import json
import urllib.request
import logging
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

logger = logging.getLogger("backend.demo")
router = APIRouter(prefix="/api/demo", tags=["Demo Hub"])

# Ensure environment variables are loaded
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path)

GROQ_KEY_ENV = os.getenv("GROQ_API_KEY", "")

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
    groq_key = os.getenv("GROQ_API_KEY", GROQ_KEY_ENV)
    if not groq_key or groq_key.startswith("YOUR_"):
        logger.info("Groq API key missing or default, using smart local generator.")
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
        "Explain DNA mutations (insertions, deletions, substitutions), IBM Qiskit quantum statevectors, and Random Forest machine learning models cleanly without dense jargon."
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
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            answer = res_data["choices"][0]["message"]["content"]
            logger.info("Successfully fetched answer from Groq LLaMA-3.3-70B API.")
            return answer
    except Exception as e:
        logger.warning(f"Groq API call failed: {e}")
        return None

def generate_smart_fallback(q: str) -> str:
    """Generates accurate, question-specific fallback answers when LLM API is offline."""
    q_lower = q.lower()

    if "qubit" in q_lower or "how many qubits" in q_lower:
        return (
            "The QuantumDNA X platform uses a 4-Qubit quantum register (q₀, q₁, q₂, q₃) in IBM Qiskit. "
            "Each nucleotide base is mapped to rotation angles: Adenine (θ=0.00 rad), Thymine (θ=1.57 rad), "
            "Guanine (θ=3.14 rad), and Cytosine (θ=4.71 rad) for statevector fidelity analysis."
        )

    if "1502" in q_lower or "insertion at position" in q_lower:
        return (
            "The Insertion mutation at position 1502 inserts an extra nucleotide base pair into the DNA sequence. "
            "This alters the downstream codon reading frame (frameshift variant), potentially changing the resulting protein structure. "
            "Our Random Forest AI classifies this variant with 97.3% confidence, corroborated by Qiskit quantum statevector fidelity of 0.9423 (94.23% match)."
        )

    if "fidelity" in q_lower or "quantum state" in q_lower:
        return (
            "Quantum State Fidelity (ℱ) measures how closely the candidate DNA sequence statevector |ψ_cand⟩ matches "
            "the wildtype reference statevector |ψ_ref⟩. A score of 0.9423 (94.23%) indicates a high-confidence structural match with minor variant perturbation."
        )

    if "random forest" in q_lower or "machine learning" in q_lower or "confidence" in q_lower:
        return (
            "Our Scikit-Learn Random Forest model utilizes 150 decision trees trained on 10D tabular genomic metrics "
            "(GC/AT content, k-mer counts, base composition) to achieve 97.3% classification confidence."
        )

    return (
        f"Regarding '{q}': QuantumDNA X cross-validates classical Random Forest AI mutation calls "
        "against IBM Qiskit 4-qubit statevector fidelity (0.9423 match, 98.7% agreement score)."
    )

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

    # 2. Question-specific smart generator fallback
    smart_answer = generate_smart_fallback(payload.question)
    return {"answer": smart_answer, "model": "smart-local-generator"}

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
