import re
from typing import Dict, Any, List


class DNACleaner:
    """
    DNA Cleaning Module.
    Cleans raw DNA sequences by stripping whitespace, converting to uppercase,
    removing invalid nucleotides, and handling duplicates across datasets.
    """

    VALID_BASES = {"A", "T", "G", "C"}

    @classmethod
    def clean_sequence(cls, sequence: str) -> Dict[str, Any]:
        """
        Cleans a single DNA sequence string.
        
        Steps:
        1. Remove whitespace, newlines, and carriage returns.
        2. Convert to uppercase.
        3. Strip any characters outside {A, T, G, C}.
        """
        original_length = len(sequence)

        # 1. Remove all whitespace (spaces, tabs, newlines)
        no_whitespace = re.sub(r"\s+", "", sequence)

        # 2. Upper-case
        uppercase_seq = no_whitespace.upper()

        # 3. Filter out non-ATGC bases
        cleaned_chars = [char for char in uppercase_seq if char in cls.VALID_BASES]
        cleaned_sequence = "".join(cleaned_chars)

        removed_chars_count = original_length - len(cleaned_sequence)

        return {
            "cleaned_sequence": cleaned_sequence,
            "original_length": original_length,
            "cleaned_length": len(cleaned_sequence),
            "removed_characters_count": removed_chars_count
        }

    @classmethod
    def deduplicate_records(cls, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Removes duplicate sequence records from a list of record dicts while preserving order.
        """
        seen_sequences = set()
        unique_records = []

        for rec in records:
            seq = rec.get("sequence", "")
            if seq not in seen_sequences:
                seen_sequences.add(seq)
                unique_records.append(rec)

        return unique_records
