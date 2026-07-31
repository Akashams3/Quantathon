import os
from typing import List, Dict, Any, Union
from Bio import SeqIO
from Bio.SeqRecord import SeqRecord


class DNAReader:
    """
    DNA File Reader module supporting .fasta, .fa, .txt, and raw sequence strings.
    Utilizes Biopython SeqIO for robust genomic parsing.
    """

    @staticmethod
    def read_file(file_path: str) -> List[Dict[str, Any]]:
        """
        Reads a DNA sequence file (.fasta, .fa, or .txt) and returns a list of sequence dicts.
        
        Each dictionary contains:
          - sequence_id: Identifier of the sequence
          - description: Header description or filename
          - sequence: Raw DNA string
          - format: File format ('fasta' or 'text')
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"DNA file not found at path: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()
        records: List[Dict[str, Any]] = []

        if ext in [".fasta", ".fa", ".fna"]:
            records = DNAReader._read_fasta(file_path)
        else:
            # Fallback to plain text reader or attempt fasta parsing first
            try:
                records = DNAReader._read_fasta(file_path)
                if not records:
                    records = DNAReader._read_plain_text(file_path)
            except Exception:
                records = DNAReader._read_plain_text(file_path)

        if not records:
            raise ValueError(f"No valid DNA sequence records found in file: {file_path}")

        return records

    @staticmethod
    def _read_fasta(file_path: str) -> List[Dict[str, Any]]:
        """Parses FASTA files using Biopython SeqIO."""
        records = []
        for record in SeqIO.parse(file_path, "fasta"):
            records.append({
                "sequence_id": record.id,
                "description": record.description,
                "sequence": str(record.seq),
                "format": "fasta"
            })
        return records

    @staticmethod
    def _read_plain_text(file_path: str) -> List[Dict[str, Any]]:
        """Reads plain text sequence files, stripping headers if any."""
        filename = os.path.basename(file_path)
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = [line.strip() for line in f if line.strip()]

        seq_id = filename
        description = f"Plain text sequence from {filename}"
        seq_lines = []

        for line in lines:
            if line.startswith(">"):
                seq_id = line[1:].split()[0]
                description = line[1:].strip()
            else:
                seq_lines.append(line)

        raw_sequence = "".join(seq_lines)
        return [{
            "sequence_id": seq_id,
            "description": description,
            "sequence": raw_sequence,
            "format": "text"
        }]

    @staticmethod
    def read_string(raw_dna: str, sequence_id: str = "Raw_Sequence") -> Dict[str, Any]:
        """Parses a raw DNA string directly."""
        lines = [line.strip() for line in raw_dna.strip().splitlines() if line.strip()]
        seq_id = sequence_id
        description = "Direct text input"
        seq_lines = []

        for line in lines:
            if line.startswith(">"):
                seq_id = line[1:].split()[0]
                description = line[1:].strip()
            else:
                seq_lines.append(line)

        full_seq = "".join(seq_lines) if seq_lines else raw_dna.strip()
        return {
            "sequence_id": seq_id,
            "description": description,
            "sequence": full_seq,
            "format": "raw_string"
        }
