from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict, Field


class UploadResponse(BaseModel):
    analysis_id: int
    filename: str
    status: str
    uploaded_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AnalysisSummaryResponse(BaseModel):
    analysisId: int
    filename: str
    sequenceLength: Optional[int] = None
    gcContent: Optional[float] = None
    atContent: Optional[float] = None
    status: str
    uploadedAt: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class StatisticsResponse(BaseModel):
    A: int
    T: int
    G: int
    C: int
    gcRatio: float
    atRatio: float

    model_config = ConfigDict(from_attributes=True)


class FullAnalysisResponse(BaseModel):
    analysis_id: int
    filename: str
    sequence_length: int
    gc_content: float
    at_content: float
    status: str
    base_counts: Dict[str, int]
    gc_ratio: float
    at_ratio: float
    kmer_frequencies: Optional[Dict[str, int]] = None
    chart_urls: Optional[List[str]] = None
