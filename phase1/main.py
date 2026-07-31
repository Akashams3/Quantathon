import os
import sys
import argparse
from typing import Optional, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Internal services imports
from services.reader import DNAReader
from services.analyzer import DNAAnalyzer
from services.visualizer import DNAVisualizer
from services.exporter import DNAExporter


# Base directories configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
CHARTS_DIR = os.path.join(OUTPUT_DIR, "charts")
REPORTS_DIR = os.path.join(OUTPUT_DIR, "reports")


# FastAPI Application Setup
app = FastAPI(
    title="Quantum DNA-X: Phase 1 DNA Processing Engine",
    description="Genomic sequence ingestion, validation, cleaning, feature extraction, visualization, and export engine.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure output directories exist
os.makedirs(CHARTS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

# Mount static files to serve generated charts
app.mount("/static/charts", StaticFiles(directory=CHARTS_DIR), name="charts")
app.mount("/static/reports", StaticFiles(directory=REPORTS_DIR), name="reports")


# Request Pydantic Schemas
class SequenceRequest(BaseModel):
    sequence: str = Field(..., example="ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGAC")
    sequence_id: Optional[str] = Field("User_Sequence", example="Seq_001")
    k_mer_size: Optional[int] = Field(3, ge=1, le=10)


def process_dna_file(file_path: str, k_mer_size: int = 3) -> Dict[str, Any]:
    """Helper function to execute full pipeline on a file."""
    records = DNAReader.read_file(file_path)
    # Process primary/first record in file
    primary_record = records[0]
    report = DNAAnalyzer.analyze_record(primary_record, k_mer_size=k_mer_size)

    # Generate visual charts
    chart_paths = DNAVisualizer.generate_all_charts(report, CHARTS_DIR)
    chart_filenames = [os.path.basename(p) for p in chart_paths]
    report["chart_files"] = chart_filenames
    report["chart_urls"] = [f"/static/charts/{fname}" for fname in chart_filenames]

    # Save exports
    export_paths = DNAExporter.export_all(report, REPORTS_DIR)
    report["export_files"] = {k: os.path.basename(v) for k, v in export_paths.items()}

    return report


def process_raw_sequence(sequence_str: str, sequence_id: str = "Raw_Input", k_mer_size: int = 3) -> Dict[str, Any]:
    """Helper function to execute full pipeline on raw sequence text."""
    record = DNAReader.read_string(sequence_str, sequence_id=sequence_id)
    report = DNAAnalyzer.analyze_record(record, k_mer_size=k_mer_size)

    # Charts
    chart_paths = DNAVisualizer.generate_all_charts(report, CHARTS_DIR)
    chart_filenames = [os.path.basename(p) for p in chart_paths]
    report["chart_files"] = chart_filenames
    report["chart_urls"] = [f"/static/charts/{fname}" for fname in chart_filenames]

    # Exports
    export_paths = DNAExporter.export_all(report, REPORTS_DIR)
    report["export_files"] = {k: os.path.basename(v) for k, v in export_paths.items()}

    return report


# FastAPI REST Endpoints

@app.get("/")
def read_root():
    return {
        "engine": "Quantum DNA-X Processing Engine",
        "phase": 1,
        "status": "Active",
        "supported_formats": [".fasta", ".fa", ".txt"],
        "endpoints": {
            "health": "/api/health",
            "process_file": "/api/process-file",
            "process_sequence": "/api/process-sequence",
            "sample_analysis": "/api/sample"
        }
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "phase": 1, "module": "DNA Processing Engine"}


@app.get("/api/sample")
def analyze_sample_dataset():
    sample_file = os.path.join(DATASETS_DIR, "sample.fasta")
    if not os.path.exists(sample_file):
        raise HTTPException(status_code=404, detail="Sample dataset file not found.")
    return process_dna_file(sample_file, k_mer_size=3)


@app.post("/api/process-file")
async def api_process_file(file: UploadFile = File(...), k_mer_size: int = Form(3)):
    try:
        temp_path = os.path.join(OUTPUT_DIR, f"temp_{file.filename}")
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        report = process_dna_file(temp_path, k_mer_size=k_mer_size)

        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/process-sequence")
def api_process_sequence(payload: SequenceRequest):
    try:
        return process_raw_sequence(
            sequence_str=payload.sequence,
            sequence_id=payload.sequence_id or "User_Seq",
            k_mer_size=payload.k_mer_size or 3
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# CLI Runner Logic

def run_cli(file_path: Optional[str] = None):
    """Runs Phase 1 in CLI mode."""
    target_file = file_path or os.path.join(DATASETS_DIR, "sample.fasta")

    print(f"\n[DNA] Quantum DNA-X: Phase 1 DNA Processing Engine")
    print(f"Loading sequence file: {target_file}\n")

    if not os.path.exists(target_file):
        print(f"[ERROR] File not found at {target_file}")
        sys.exit(1)

    try:
        report = process_dna_file(target_file, k_mer_size=3)
        formatted_summary = DNAAnalyzer.generate_text_summary(report)
        print(formatted_summary)

        print("\n[OUTPUT] Generated Output Files:")
        print(f"  - JSON Report  : {os.path.join(REPORTS_DIR, report['export_files']['json_report'])}")
        print(f"  - Summary CSV  : {os.path.join(REPORTS_DIR, report['export_files']['summary_csv'])}")
        print(f"  - K-mers CSV   : {os.path.join(REPORTS_DIR, report['export_files']['kmers_csv'])}")
        print("  - Visual Charts:")
        for chart in report["chart_files"]:
            print(f"    - {os.path.join(CHARTS_DIR, chart)}")

        print("\n[OK] Phase 1 complete. Processed data ready for Phase 3 (AI) and Phase 4 (Quantum) modules!\n")
    except Exception as e:
        print(f"[ERROR] Error processing file: {e}")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Quantum DNA-X Phase 1 DNA Processing Engine")
    parser.add_argument("--file", type=str, help="Path to input DNA FASTA/TXT file")
    parser.add_argument("--server", action="store_true", help="Start FastAPI web server")
    parser.add_argument("--port", type=int, default=8000, help="Port for FastAPI server (default: 8000)")

    args = parser.parse_args()

    if args.server:
        import uvicorn
        print(f"[SERVER] Starting Phase 1 FastAPI server on http://127.0.0.1:{args.port}...")
        uvicorn.run("main:app", host="127.0.0.1", port=args.port, reload=True)
    else:
        run_cli(args.file)
