import os
import sys
from typing import Dict, Any
from sqlalchemy.orm import Session

# Add project root and phase1 path to sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", ".."))
PHASE1_DIR = os.path.join(PROJECT_ROOT, "phase1")

for path in [PROJECT_ROOT, PHASE1_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

# Import Phase 1 Processing Engine
from phase1.services.reader import DNAReader
from phase1.services.analyzer import DNAAnalyzer
from phase1.services.visualizer import DNAVisualizer
from phase1.services.exporter import DNAExporter

# Import Phase 2 ORM Models
from app.models.analysis import Analysis, NucleotideStatistics


class DNAService:
    """
    Service layer integrating Phase 1 DNA Processing Engine with Phase 2 MySQL Database Persistence.
    """

    @staticmethod
    def process_and_store(db: Session, analysis_record: Analysis, charts_dir: str, reports_dir: str) -> Dict[str, Any]:
        """
        Reads uploaded file from analysis_record, calls Phase 1 DNA engine,
        saves calculated metrics in MySQL analysis & nucleotide_statistics tables.
        """
        file_path = analysis_record.file_path
        if not file_path or not os.path.exists(file_path):
            raise FileNotFoundError(f"Uploaded file not found at path: {file_path}")

        # 1. Read & Analyze using Phase 1 Engine
        records = DNAReader.read_file(file_path)
        primary_record = records[0]
        report = DNAAnalyzer.analyze_record(primary_record, k_mer_size=3)

        # 2. Extract calculated features
        feat = report.get("features", {})
        seq_length = feat.get("sequence_length", 0)
        gc_content = feat.get("gc_content_pct", 0.0)
        at_content = feat.get("at_content_pct", 0.0)
        base_counts = feat.get("base_counts", {})
        gc_at_ratio = feat.get("gc_at_ratio", 0.0)
        dist = feat.get("nucleotide_distribution_pct", {})

        # Compute ratios for MySQL table
        gc_ratio = round((base_counts.get("G", 0) + base_counts.get("C", 0)) / seq_length * 100, 2) if seq_length > 0 else 0.0
        at_ratio = round((base_counts.get("A", 0) + base_counts.get("T", 0)) / seq_length * 100, 2) if seq_length > 0 else 0.0

        # 3. Generate visual charts & exports
        os.makedirs(charts_dir, exist_ok=True)
        os.makedirs(reports_dir, exist_ok=True)

        chart_paths = DNAVisualizer.generate_all_charts(report, charts_dir)
        export_paths = DNAExporter.export_all(report, reports_dir)

        chart_filenames = [os.path.basename(p) for p in chart_paths]

        # 4. Update MySQL Analysis Table
        analysis_record.sequence_length = seq_length
        analysis_record.gc_content = gc_content
        analysis_record.at_content = at_content
        analysis_record.status = "Completed"

        # 5. Insert/Update MySQL NucleotideStatistics Table
        stats = db.query(NucleotideStatistics).filter(NucleotideStatistics.analysis_id == analysis_record.id).first()
        if not stats:
            stats = NucleotideStatistics(
                analysis_id=analysis_record.id,
                a_count=base_counts.get("A", 0),
                t_count=base_counts.get("T", 0),
                g_count=base_counts.get("G", 0),
                c_count=base_counts.get("C", 0),
                gc_ratio=gc_ratio,
                at_ratio=at_ratio
            )
            db.add(stats)
        else:
            stats.a_count = base_counts.get("A", 0)
            stats.t_count = base_counts.get("T", 0)
            stats.g_count = base_counts.get("G", 0)
            stats.c_count = base_counts.get("C", 0)
            stats.gc_ratio = gc_ratio
            stats.at_ratio = at_ratio

        db.commit()
        db.refresh(analysis_record)

        return {
            "analysis_id": analysis_record.id,
            "filename": analysis_record.filename,
            "sequence_length": seq_length,
            "gc_content": gc_content,
            "at_content": at_content,
            "status": analysis_record.status,
            "base_counts": base_counts,
            "gc_ratio": gc_ratio,
            "at_ratio": at_ratio,
            "kmer_frequencies": feat.get("kmer_frequencies", {}),
            "chart_urls": [f"/static/charts/{fname}" for fname in chart_filenames]
        }
