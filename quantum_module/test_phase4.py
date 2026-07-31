import os
import sys
import unittest

QUANTUM_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(QUANTUM_DIR)
for p in [QUANTUM_DIR, PROJECT_ROOT]:
    if p not in sys.path:
        sys.path.insert(0, p)

from state_encoder import QuantumStateEncoder
from circuit_builder import QiskitCircuitBuilder
from quantum_analyzer import QuantumAnalyzer
from quantum_service import QuantumService


class TestPhase4QiskitQuantumModule(unittest.TestCase):

    def setUp(self):
        self.ref_seq = "ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGAC"
        self.mut_seq = "ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTAAC"

    def test_state_encoder(self):
        angles = QuantumStateEncoder.sequence_to_angles("ATGC")
        self.assertEqual(len(angles), 4)
        binary = QuantumStateEncoder.sequence_to_binary("ATGC")
        self.assertEqual(binary, "00011011")

    def test_circuit_builder(self):
        qc, sv, meta = QiskitCircuitBuilder.build_genomic_circuit(self.ref_seq)
        self.assertGreater(meta["num_qubits"], 1)
        self.assertGreater(meta["circuit_depth"], 0)
        self.assertTrue(sv.is_valid())

    def test_quantum_analyzer_pair(self):
        res = QuantumAnalyzer.analyze_sequence_pair(self.ref_seq, self.mut_seq)
        self.assertIn("quantumFidelity", res)
        self.assertIn("quantumEntropy", res)
        self.assertIn("stateVector", res)
        self.assertIn("qubitsCount", res)
        self.assertGreater(res["quantumFidelity"], 0.0)
        self.assertLessEqual(res["quantumFidelity"], 1.0)
        self.assertIn("|ψ⟩ =", res["stateVector"])

    def test_quantum_service(self):
        res = QuantumService.run_analysis(self.ref_seq)
        self.assertGreater(res["quantumFidelity"], 0.0)
        self.assertGreater(res["qubitsCount"], 0)


if __name__ == "__main__":
    unittest.main()
