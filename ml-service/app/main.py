from pathlib import Path
import os
import shutil
import uuid

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .separator import StemSeparator


MODEL_NAME = "htdemucs_6s"


# ============================================================
# MUKIIQ RUNTIME DIRECTORIES
# ============================================================
#
# IMPORTANT:
# These directories must NOT live inside src-tauri.
# Tauri watches src-tauri during development.
#
# Windows:
# %LOCALAPPDATA%\MUKIIQ\
#
# Example:
# C:\Users\mukes\AppData\Local\MUKIIQ\
#

if os.name == "nt":
    LOCAL_APP_DATA = Path(
        os.environ.get(
            "LOCALAPPDATA",
            Path.home() / "AppData" / "Local",
        )
    )

    RUNTIME_DIR = LOCAL_APP_DATA / "MUKIIQ"

else:
    RUNTIME_DIR = Path.home() / ".mukiiq"


INPUT_DIR = RUNTIME_DIR / "input"
OUTPUT_DIR = RUNTIME_DIR / "output"


INPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="MUKIIQ AI Stem Separator",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# AI ENGINE
# ============================================================

separator = StemSeparator(str(OUTPUT_DIR))


# ============================================================
# BASIC ROUTES
# ============================================================

@app.get("/")
def root():
    return {
        "name": "MUKIIQ AI Stem Separator",
        "status": "online",
        "model": MODEL_NAME,
        "runtime_dir": str(RUNTIME_DIR),
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": MODEL_NAME,
    }


# ============================================================
# STEM SEPARATION
# ============================================================

@app.post("/separate")
async def separate(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided",
        )


    allowed_extensions = {
        ".mp3",
        ".wav",
        ".flac",
        ".m4a",
        ".ogg",
    }


    extension = Path(
        file.filename
    ).suffix.lower()


    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {extension}",
        )


    job_id = uuid.uuid4().hex


    input_file = (
        INPUT_DIR
        / f"{job_id}{extension}"
    )


    try:

        # ----------------------------------------------------
        # Save uploaded audio
        # ----------------------------------------------------

        with input_file.open("wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )


        # ----------------------------------------------------
        # Run AI separation
        # ----------------------------------------------------

        stems = separator.separate(
            str(input_file),
            job_id,
        )


        # ----------------------------------------------------
        # Build frontend URLs
        # ----------------------------------------------------

        stem_urls = {
            name: f"/stems/{job_id}/{name}"
            for name in stems
        }


        return {
            "job_id": job_id,
            "status": "completed",
            "filename": file.filename,
            "stems": stem_urls,
        }


    except Exception as exc:

        # Keep the complete error visible during development.
        print(
            "\n[MUKIIQ AI ENGINE ERROR]"
        )

        print(
            repr(exc)
        )

        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


    finally:

        # Uploaded source file is temporary.
        if input_file.exists():

            try:
                input_file.unlink()

            except Exception:
                pass


# ============================================================
# STEM DOWNLOAD
# ============================================================

@app.get(
    "/stems/{job_id}/{stem_name}"
)
def get_stem(
    job_id: str,
    stem_name: str,
):

    allowed_stems = {
        "vocals",
        "drums",
        "bass",
        "guitar",
        "piano",
        "other",
    }


    if stem_name not in allowed_stems:

        raise HTTPException(
            status_code=404,
            detail="Stem not found",
        )


    job_output_dir = (
        OUTPUT_DIR
        / job_id
        / MODEL_NAME
    )


    if not job_output_dir.exists():

        raise HTTPException(
            status_code=404,
            detail="Job output not found",
        )


    track_directories = [
        directory
        for directory in job_output_dir.iterdir()
        if directory.is_dir()
    ]


    if not track_directories:

        raise HTTPException(
            status_code=404,
            detail="Track output not found",
        )


    stem_file = (
        track_directories[0]
        / f"{stem_name}.wav"
    )


    if not stem_file.exists():

        raise HTTPException(
            status_code=404,
            detail="Stem file does not exist",
        )


    return FileResponse(
        path=stem_file,
        media_type="audio/wav",
        filename=f"{stem_name}.wav",
    )