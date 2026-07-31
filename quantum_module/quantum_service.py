import os
import sys
from typing import Dict, Any

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from quantum_analyzer import QuantumAnalyzer


class QuantumService:
    """
    Quantum Computing Service orchestrating Qiskit simulations.
    """

    @staticmethod
    def run_analysis(sequence: str, ref_sequence: str = None) -> Dict[str, Any]:
        """
        Executes Qiskit quantum circuit simulation and returns quantum metrics.
        """
        if ref_sequence and ref_sequence.strip():
            return QuantumAnalyzer.analyze_sequence_pair(ref_sequence, sequence)
        else:
            return QuantumAnalyzer.analyze_single_sequence(sequence)
