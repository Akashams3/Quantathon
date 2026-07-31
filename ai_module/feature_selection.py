import pandas as pd
import numpy as np
from typing import Dict, Any, List


FEATURE_COLUMNS: List[str] = [
    "sequence_length",
    "gc_content_pct",
    "at_content_pct",
    "a_count",
    "t_count",
    "g_count",
    "c_count",
    "gc_at_ratio",
    "top_kmer_freq",
    "unique_kmers_count"
]


def extract_feature_vector(features_dict: Dict[str, Any]) -> pd.DataFrame:
    """
    Converts Phase 1 / Phase 2 extracted features dictionary into a 1-row DataFrame
    matching the training feature matrix schema.
    """
    base_counts = features_dict.get("base_counts", {})
    kmers = features_dict.get("kmer_frequencies", {})

    top_kmer_freq = max(kmers.values()) if kmers else 0
    unique_kmers = features_dict.get("unique_kmers_count", len(kmers))

    row = {
        "sequence_length": features_dict.get("sequence_length", 0),
        "gc_content_pct": features_dict.get("gc_content_pct", 0.0),
        "at_content_pct": features_dict.get("at_content_pct", 0.0),
        "a_count": base_counts.get("A", 0),
        "t_count": base_counts.get("T", 0),
        "g_count": base_counts.get("G", 0),
        "c_count": base_counts.get("C", 0),
        "gc_at_ratio": features_dict.get("gc_at_ratio", 0.0),
        "top_kmer_freq": top_kmer_freq,
        "unique_kmers_count": unique_kmers
    }

    return pd.DataFrame([row], columns=FEATURE_COLUMNS)
