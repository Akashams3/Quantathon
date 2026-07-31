from typing import Dict, Any
from .validator import DNAValidator
from .cleaner import DNACleaner
from .feature_extractor import DNAFeatureExtractor


class DNAAnalyzer:
    """
    DNA Analyzer Orchestrator.
    Runs validation, cleaning, and feature extraction pipeline on sequence records.
    Produces clean structured analysis output reports.
    """

    @classmethod
    def analyze_record(cls, record: Dict[str, Any], k_mer_size: int = 3) -> Dict[str, Any]:
        """
        Processes a single sequence record through the full Phase 1 pipeline.
        
        Args:
            record (dict): Record containing 'sequence_id', 'description', 'sequence'.
            k_mer_size (int): K-mer length for feature extraction.
            
        Returns:
            Dict containing full validation, cleaning, features, and status.
        """
        raw_sequence = record.get("sequence", "")
        seq_id = record.get("sequence_id", "Unknown")
        description = record.get("description", "")

        # Step 1: Validate DNA
        validation = DNAValidator.validate(raw_sequence)

        # Step 2: Clean DNA
        cleaning = DNACleaner.clean_sequence(raw_sequence)
        cleaned_seq = cleaning["cleaned_sequence"]

        # Step 3: Feature Extraction
        features = DNAFeatureExtractor.extract_features(cleaned_seq, k=k_mer_size)

        # Build comprehensive report object
        report = {
            "sequence_id": seq_id,
            "description": description,
            "validation": validation,
            "cleaning": cleaning,
            "features": features,
            "status": "Ready for AI & Quantum Analysis"
        }

        return report

    @classmethod
    def generate_text_summary(cls, report: Dict[str, Any]) -> str:
        """
        Generates a human-readable text report.
        """
        feat = report.get("features", {})
        val = report.get("validation", {})
        base_counts = feat.get("base_counts", {})
        dist = feat.get("nucleotide_distribution_pct", {})

        summary_lines = [
            "=" * 45,
            "         DNA ANALYSIS REPORT",
            "=" * 45,
            f"Sequence ID      : {report.get('sequence_id')}",
            f"Description      : {report.get('description')}",
            f"Validation       : {val.get('status_message')}",
            "-" * 45,
            f"Sequence Length  : {feat.get('sequence_length')} bases",
            f"GC Content       : {feat.get('gc_content_pct')}%",
            f"AT Content       : {feat.get('at_content_pct')}%",
            f"GC/AT Ratio      : {feat.get('gc_at_ratio')}",
            "-" * 45,
            f"A Count          : {base_counts.get('A')} ({dist.get('A')}%)",
            f"T Count          : {base_counts.get('T')} ({dist.get('T')}%)",
            f"G Count          : {base_counts.get('G')} ({dist.get('G')}%)",
            f"C Count          : {base_counts.get('C')} ({dist.get('C')}%)",
            "-" * 45,
            f"Total Codons     : {feat.get('total_codons')}",
            f"Unique 3-mers    : {feat.get('unique_kmers_count')}",
            f"Status           : {report.get('status')}",
            "=" * 45
        ]
        return "\n".join(summary_lines)
