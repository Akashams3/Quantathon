from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.config.database import Base


class MutationResult(Base):
    """
    SQLAlchemy Model for 'mutation_results' table.
    Stores AI (Phase 3) and Quantum (Phase 4) detected mutations and confidence scores.
    """
    __tablename__ = "mutation_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("analysis.id", ondelete="CASCADE"), nullable=False)
    mutation_position = Column(Integer, nullable=True)
    mutation_type = Column(String(100), nullable=True)
    confidence = Column(Float, nullable=True)
    risk_level = Column(String(50), nullable=True)

    analysis = relationship("Analysis", back_populates="mutation_results")
