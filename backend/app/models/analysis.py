from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.config.database import Base


class Analysis(Base):
    """
    SQLAlchemy Model for 'analysis' table.
    Stores every uploaded DNA file and its core sequence metrics.
    """
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    sequence_length = Column(Integer, nullable=True)
    gc_content = Column(Float, nullable=True)
    at_content = Column(Float, nullable=True)
    status = Column(String(50), default="Uploaded")
    uploaded_at = Column(DateTime, server_default=func.now())

    # One-to-one relationship with NucleotideStatistics
    nucleotide_statistics = relationship(
        "NucleotideStatistics",
        back_populates="analysis",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # One-to-many relationship with MutationResult (for Phase 3 & 4)
    mutation_results = relationship(
        "MutationResult",
        back_populates="analysis",
        cascade="all, delete-orphan"
    )


class NucleotideStatistics(Base):
    """
    SQLAlchemy Model for 'nucleotide_statistics' table.
    Stores granular base counts and ratio metrics.
    """
    __tablename__ = "nucleotide_statistics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("analysis.id", ondelete="CASCADE"), nullable=False)
    a_count = Column(Integer, default=0)
    t_count = Column(Integer, default=0)
    g_count = Column(Integer, default=0)
    c_count = Column(Integer, default=0)
    gc_ratio = Column(Float, default=0.0)
    at_ratio = Column(Float, default=0.0)

    analysis = relationship("Analysis", back_populates="nucleotide_statistics")
