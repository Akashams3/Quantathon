import os
import shutil
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.analysis import Analysis
from app.schemas.analysis_schema import UploadResponse


router = APIRouter(tags=["File Upload"])

# Upload directory configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)


@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
@router.post("/api/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_dna_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Receives DNA file (.fasta/.fa/.txt), saves to uploads folder,
    creates entry in MySQL 'analysis' table with status 'Uploaded', and returns analysis_id.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty")

    filename = os.path.basename(file.filename)
    dest_path = os.path.join(UPLOADS_DIR, filename)

    try:
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Store entry in MySQL analysis table
    analysis_record = Analysis(
        filename=filename,
        file_path=dest_path,
        status="Uploaded"
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    return UploadResponse(
        analysis_id=analysis_record.id,
        filename=analysis_record.filename,
        status=analysis_record.status,
        uploaded_at=analysis_record.uploaded_at
    )
