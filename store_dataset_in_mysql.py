import os
import sys

# Set paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
APP_DIR = os.path.join(BACKEND_DIR, "app")
for p in [APP_DIR, BACKEND_DIR, BASE_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.config.database import engine, Base, SessionLocal
import app.models
from app.models.analysis import Analysis, NucleotideStatistics
from app.models.mutation import MutationResult
from app.services.dna_service import DNAService
from ai_module.predict import MutationPredictor
from quantum_module.quantum_service import QuantumService

def main():
    print("=" * 70)
    print("[START] STORING CHROMOSOME 22 100K DATASET IN MYSQL DATABASE")
    print("=" * 70)

    # 1. Initialize DB tables in MySQL
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    fasta_path = os.path.join(BASE_DIR, "backend", "uploads", "Chromosome22_100k_clean.fasta")
    filename = "Chromosome22_100k_clean.fasta"

    # 2. Check if record already exists or create new
    analysis = db.query(Analysis).filter(Analysis.filename == filename).first()
    if not analysis:
        analysis = Analysis(
            filename=filename,
            file_path=fasta_path,
            status="Uploaded"
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        print(f"[OK] Created new Analysis record in MySQL with ID: {analysis.id}")
    else:
        print(f"[OK] Found existing Analysis record in MySQL with ID: {analysis.id}")

    # 3. Execute Phase 1 DNA Processing & Store in MySQL
    print("\n[PHASE 1 & 2] Processing 100,000 bp DNA Sequence...")
    charts_dir = os.path.join(BACKEND_DIR, "reports", "charts")
    reports_dir = os.path.join(BACKEND_DIR, "reports")

    p1_results = DNAService.process_and_store(
        db=db,
        analysis_record=analysis,
        charts_dir=charts_dir,
        reports_dir=reports_dir
    )
    print(f"  - Sequence Length : {p1_results['sequence_length']:,} bp")
    print(f"  - GC Content      : {p1_results['gc_content']}%")
    print(f"  - AT Content      : {p1_results['at_content']}%")
    print(f"  - Base Counts     : {p1_results['base_counts']}")

    from ai_module.predict import predict
    ai_pred = predict(p1_results)
    print(f"  - AI Predicted Class : {ai_pred['mutationType']}")
    print(f"  - Confidence Score   : {ai_pred['confidence']}%")
    print(f"  - Risk Level         : {ai_pred['riskLevel']}")
    print(f"  - Anomaly Detected   : {ai_pred['isAnomaly']}")

    # Save/Update in mutation_results MySQL table
    mut_rec = db.query(MutationResult).filter(MutationResult.analysis_id == analysis.id).first()
    if not mut_rec:
        mut_rec = MutationResult(
            analysis_id=analysis.id,
            mutation_type=ai_pred['mutationType'],
            confidence=ai_pred['confidence'],
            risk_level=ai_pred['riskLevel']
        )
        db.add(mut_rec)
    else:
        mut_rec.mutation_type = ai_pred['mutationType']
        mut_rec.confidence = ai_pred['confidence']
        mut_rec.risk_level = ai_pred['riskLevel']
    
    db.commit()
    print("  [OK] Saved AI predictions to MySQL 'mutation_results' table.")

    # 5. Execute Phase 4 Qiskit Quantum Simulation
    print("\n[PHASE 4] Running IBM Qiskit Quantum Circuit Simulation...")
    seq = p1_results.get("cleaned_sequence", "")
    q_results = QuantumService.run_analysis(seq[:500]) # Run Qiskit circuit on 500bp region
    print(f"  - Qubits Allocated   : {q_results['qubitsCount']} Qubits")
    print(f"  - Circuit Depth      : {q_results['circuitDepth']}")
    print(f"  - Quantum Fidelity   : {q_results['quantumFidelity']}")
    print(f"  - Quantum Entropy    : {q_results['quantumEntropy']}")
    sv_str = str(q_results['stateVector']).encode('ascii', 'ignore').decode('ascii')
    print(f"  - Statevector        : {sv_str}")

    print("\n" + "=" * 70)
    print("[SUCCESS] Chromosome22_100k_clean DATASET FULLY STORED IN MYSQL!")
    print("=" * 70)
    db.close()

if __name__ == "__main__":
    main()
