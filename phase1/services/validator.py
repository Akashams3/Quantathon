from typing import Dict, Any, List, Set
from collections import Counter


class DNAValidator:
    """
    DNA Sequence Validation Module.
    Validates nucleotide sequence against standard bases (A, T, G, C).
    """

    VALID_BASES: Set[str] = {"A", "T", "G", "C"}

    @classmethod
    def validate(cls, sequence: str) -> Dict[str, Any]:
        """
        Validates a DNA sequence string.
        
        Returns:
            Dict containing:
                - is_valid (bool): True if sequence contains ONLY A, T, G, C (case-insensitive)
                - total_length (int): Total length of input string
                - invalid_characters (List[str]): Unique sorted list of invalid characters found
                - invalid_counts (Dict[str, int]): Count of each invalid character
                - invalid_total_count (int): Sum of all invalid characters
                - status_message (str): Formatted status indicator ('✓ Valid DNA' or '❌ Invalid Characters Found')
        """
        upper_seq = sequence.upper()
        invalid_counts: Dict[str, int] = {}
        invalid_chars_set: Set[str] = set()

        for char in upper_seq:
            if char not in cls.VALID_BASES:
                invalid_chars_set.add(char)
                invalid_counts[char] = invalid_counts.get(char, 0) + 1

        invalid_total = sum(invalid_counts.values())
        is_valid = (invalid_total == 0) and len(sequence) > 0

        status_msg = "[OK] Valid DNA" if is_valid else f"[INVALID] Invalid Characters Found ({invalid_total} invalid bases)"

        return {
            "is_valid": is_valid,
            "total_length": len(sequence),
            "invalid_characters": sorted(list(invalid_chars_set)),
            "invalid_counts": invalid_counts,
            "invalid_total_count": invalid_total,
            "status_message": status_msg
        }
