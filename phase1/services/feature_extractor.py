from typing import Dict, Any, List
from collections import Counter


class DNAFeatureExtractor:
    """
    Genomic Feature Extraction Engine.
    Calculates sequence length, nucleotide counts/distributions, GC/AT ratios,
    K-mer frequencies, and codon frequencies.
    """

    @staticmethod
    def extract_features(sequence: str, k: int = 3) -> Dict[str, Any]:
        """
        Extracts all genomic features from a cleaned DNA sequence.
        
        Args:
            sequence (str): Cleaned uppercase DNA sequence (A, T, G, C).
            k (int): K-mer length (default k=3).
            
        Returns:
            Dict containing calculated feature metrics.
        """
        length = len(sequence)
        if length == 0:
            return DNAFeatureExtractor._empty_features()

        # 1. Base Counts
        counts = Counter(sequence)
        a_count = counts.get("A", 0)
        t_count = counts.get("T", 0)
        g_count = counts.get("G", 0)
        c_count = counts.get("C", 0)

        # 2. GC & AT Content Percentage
        gc_content = round(((g_count + c_count) / length) * 100, 2)
        at_content = round(((a_count + t_count) / length) * 100, 2)

        # 3. GC / AT Ratio
        at_total = a_count + t_count
        gc_ratio = round((g_count + c_count) / at_total, 4) if at_total > 0 else 0.0

        # 4. Nucleotide Distribution %
        nucleotide_distribution = {
            "A": round((a_count / length) * 100, 2),
            "T": round((t_count / length) * 100, 2),
            "G": round((g_count / length) * 100, 2),
            "C": round((c_count / length) * 100, 2)
        }

        # 5. K-mer Frequency (sliding window)
        kmers: Counter = Counter()
        if length >= k:
            for i in range(length - k + 1):
                kmer = sequence[i:i + k]
                kmers[kmer] += 1

        # Sort k-mers by frequency descending
        sorted_kmers = dict(sorted(kmers.items(), key=lambda x: x[1], reverse=True))

        # 6. Codon Frequency (non-overlapping triplets starting from index 0)
        codons: Counter = Counter()
        full_codons_count = length // 3
        for i in range(0, full_codons_count * 3, 3):
            codon = sequence[i:i + 3]
            codons[codon] += 1

        sorted_codons = dict(sorted(codons.items(), key=lambda x: x[1], reverse=True))

        return {
            "sequence_length": length,
            "gc_content_pct": gc_content,
            "at_content_pct": at_content,
            "gc_at_ratio": gc_ratio,
            "base_counts": {
                "A": a_count,
                "T": t_count,
                "G": g_count,
                "C": c_count
            },
            "nucleotide_distribution_pct": nucleotide_distribution,
            "k_value": k,
            "unique_kmers_count": len(sorted_kmers),
            "kmer_frequencies": sorted_kmers,
            "total_codons": full_codons_count,
            "unique_codons_count": len(sorted_codons),
            "codon_frequencies": sorted_codons
        }

    @staticmethod
    def _empty_features() -> Dict[str, Any]:
        return {
            "sequence_length": 0,
            "gc_content_pct": 0.0,
            "at_content_pct": 0.0,
            "gc_at_ratio": 0.0,
            "base_counts": {"A": 0, "T": 0, "G": 0, "C": 0},
            "nucleotide_distribution_pct": {"A": 0.0, "T": 0.0, "G": 0.0, "C": 0.0},
            "k_value": 3,
            "unique_kmers_count": 0,
            "kmer_frequencies": {},
            "total_codons": 0,
            "unique_codons_count": 0,
            "codon_frequencies": {}
        }
