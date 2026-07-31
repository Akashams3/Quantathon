import numpy as np
from typing import List, Dict, Tuple


BASE_ANGLE_MAP: Dict[str, float] = {
    "A": 0.0,
    "T": np.pi / 2.0,
    "G": np.pi,
    "C": 3.0 * np.pi / 2.0
}

BASE_BINARY_MAP: Dict[str, str] = {
    "A": "00",
    "T": "01",
    "G": "10",
    "C": "11"
}


class QuantumStateEncoder:
    """
    Qiskit State Encoder mapping nucleotide bases (A, T, G, C)
    to qubit rotation angles on the Bloch sphere and computational basis states.
    """

    @staticmethod
    def sequence_to_angles(sequence: str) -> List[float]:
        """Converts DNA sequence to list of rotation angles theta in radians."""
        clean_seq = sequence.upper()
        return [BASE_ANGLE_MAP.get(base, 0.0) for base in clean_seq if base in BASE_ANGLE_MAP]

    @staticmethod
    def sequence_to_binary(sequence: str) -> str:
        """Encodes DNA sequence to binary string representation."""
        clean_seq = sequence.upper()
        return "".join([BASE_BINARY_MAP.get(base, "00") for base in clean_seq if base in BASE_BINARY_MAP])

    @staticmethod
    def compute_base_phases(sequence: str) -> Dict[str, float]:
        """Calculates average quantum phase shift for each nucleotide."""
        angles = QuantumStateEncoder.sequence_to_angles(sequence)
        if not angles:
            return {"mean_phase": 0.0, "total_rotation": 0.0}
        return {
            "mean_phase": float(np.mean(angles)),
            "total_rotation": float(np.sum(angles)),
            "qubit_states_count": len(angles)
        }
