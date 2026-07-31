import os
import json
import pandas as pd
from typing import Dict, Any, List


class DNAExporter:
    """
    Data Exporter Module for Phase 1.
    Saves analysis reports as JSON and CSV files for Phase 3 (AI) & Phase 4 (Quantum) modules.
    """

    @staticmethod
    def export_all(report: Dict[str, Any], output_dir: str) -> Dict[str, str]:
        """
        Exports analysis report to JSON and CSV files.
        
        Returns:
            Dict containing output file paths.
        """
        os.makedirs(output_dir, exist_ok=True)
        seq_id = report.get("sequence_id", "sequence")

        json_path = os.path.join(output_dir, f"{seq_id}_report.json")
        summary_csv_path = os.path.join(output_dir, f"{seq_id}_summary.csv")
        kmers_csv_path = os.path.join(output_dir, f"{seq_id}_kmers.csv")
        codons_csv_path = os.path.join(output_dir, f"{seq_id}_codons.csv")

        # 1. Export JSON
        DNAExporter.export_json(report, json_path)

        # 2. Export Summary CSV
        DNAExporter.export_summary_csv(report, summary_csv_path)

        # 3. Export K-mers CSV
        feat = report.get("features", {})
        DNAExporter.export_dict_csv(feat.get("kmer_frequencies", {}), "kmer", "frequency", kmers_csv_path)

        # 4. Export Codons CSV
        DNAExporter.export_dict_csv(feat.get("codon_frequencies", {}), "codon", "frequency", codons_csv_path)

        return {
            "json_report": json_path,
            "summary_csv": summary_csv_path,
            "kmers_csv": kmers_csv_path,
            "codons_csv": codons_csv_path
        }

    @staticmethod
    def export_json(report: Dict[str, Any], file_path: str) -> None:
        """Saves report dictionary to formatted JSON file."""
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

    @staticmethod
    def export_summary_csv(report: Dict[str, Any], file_path: str) -> None:
        """Saves high-level summary metrics to CSV using Pandas."""
        feat = report.get("features", {})
        val = report.get("validation", {})
        base_counts = feat.get("base_counts", {})
        dist = feat.get("nucleotide_distribution_pct", {})

        data = [{
            "sequence_id": report.get("sequence_id"),
            "description": report.get("description"),
            "is_valid": val.get("is_valid"),
            "sequence_length": feat.get("sequence_length"),
            "gc_content_pct": feat.get("gc_content_pct"),
            "at_content_pct": feat.get("at_content_pct"),
            "gc_at_ratio": feat.get("gc_at_ratio"),
            "a_count": base_counts.get("A", 0),
            "t_count": base_counts.get("T", 0),
            "g_count": base_counts.get("G", 0),
            "c_count": base_counts.get("C", 0),
            "a_pct": dist.get("A", 0.0),
            "t_pct": dist.get("T", 0.0),
            "g_pct": dist.get("G", 0.0),
            "c_pct": dist.get("C", 0.0),
            "total_codons": feat.get("total_codons"),
            "unique_kmers": feat.get("unique_kmers_count"),
            "status": report.get("status")
        }]

        df = pd.DataFrame(data)
        df.to_csv(file_path, index=False)

    @staticmethod
    def export_dict_csv(data_dict: Dict[str, int], key_col: str, val_col: str, file_path: str) -> None:
        """Helper to export a key-value dictionary to CSV."""
        rows = [{key_col: k, val_col: v} for k, v in data_dict.items()]
        df = pd.DataFrame(rows)
        df.to_csv(file_path, index=False)
