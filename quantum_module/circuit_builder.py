import numpy as np
from typing import Dict, Any, Tuple
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

from state_encoder import QuantumStateEncoder


class QiskitCircuitBuilder:
    """
    Qiskit 4-Qubit Circuit Simulator for Genomic Superposition and Entanglement.
    Encodes nucleotide bases (A, T, G, C) onto 4 Qubits (q0, q1, q2, q3) with Hadamard,
    Ry rotation, and cyclic CNOT entanglement gates.
    """

    @staticmethod
    def build_genomic_circuit(sequence: str, num_qubits: int = 4) -> Tuple[QuantumCircuit, Statevector, Dict[str, Any]]:
        """
        Builds an explicit Qiskit 4-Qubit Quantum Circuit.
        
        Steps:
        1. Encodes A, T, G, C nucleotides into rotation angles theta.
        2. Applies Hadamard (H) gates across all 4 qubits to create superposition.
        3. Applies Ry(theta) rotation gates based on nucleotide phases.
        4. Applies CNOT (CX) ring entanglement gates across q0, q1, q2, q3.
        """
        angles = QuantumStateEncoder.sequence_to_angles(sequence)
        
        # Ensure 4-Qubit Register Simulator
        n_qubits = max(2, num_qubits)

        # Initialize Qiskit 4-Qubit Quantum Circuit
        qc = QuantumCircuit(n_qubits)

        # 1. Apply Hadamard gates (Superposition across all qubits)
        for q in range(n_qubits):
            qc.h(q)

        # 2. Apply Ry rotation gates (Nucleotide Encoding A, T, G, C)
        for q in range(n_qubits):
            angle = angles[q % len(angles)] if angles else (q * np.pi / 2.0)
            qc.ry(angle, q)

        # 3. Apply CNOT entangling ring (Quantum Coupling between q0-q1, q1-q2, q2-q3, q3-q0)
        for q in range(n_qubits):
            next_q = (q + 1) % n_qubits
            qc.cx(q, next_q)

        # Compute Statevector |ψ⟩ in Hilbert Space
        statevector = Statevector.from_instruction(qc)

        metadata = {
            "num_qubits": n_qubits,
            "circuit_depth": qc.depth(),
            "num_gates": len(qc.data),
            "state_dimension": len(statevector),
            "backend": f"Qiskit Aer {n_qubits}-Qubit Simulator"
        }

        return qc, statevector, metadata

    @staticmethod
    def format_statevector_notation(statevector: Statevector, top_k: int = 4) -> str:
        """Formats Statevector |ψ⟩ into quantum Dirac bra-ket notation string."""
        probs = np.abs(statevector.data) ** 2
        top_indices = np.argsort(probs)[::-1][:top_k]

        num_qubits = statevector.num_qubits
        terms = []

        for idx in top_indices:
            prob = probs[idx]
            if prob > 0.01:
                amplitude = statevector.data[idx]
                bin_str = format(idx, f'0{num_qubits}b')
                amp_str = f"{amplitude.real:.3f}" if abs(amplitude.imag) < 0.001 else f"({amplitude.real:.2f}+{amplitude.imag:.2f}j)"
                terms.append(f"{amp_str}|{bin_str}⟩")

        return "|ψ⟩ = " + " + ".join(terms) if terms else "|ψ⟩ = |0000⟩"
