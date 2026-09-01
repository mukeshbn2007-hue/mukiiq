from pathlib import Path
import subprocess
import sys


MODEL = "htdemucs_6s"


class StemSeparator:
    def __init__(self, output_dir: str = "output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def separate(self, audio_path: str, job_id: str) -> dict:
        audio = Path(audio_path)

        if not audio.exists():
            raise FileNotFoundError(
                f"Audio file not found: {audio}"
            )

        job_output_dir = self.output_dir / job_id
        job_output_dir.mkdir(parents=True, exist_ok=True)

        command = [
            sys.executable,
            "-m",
            "demucs",
            "-n",
            MODEL,
            "-d",
            "cpu",
            "-o",
            str(job_output_dir),
            str(audio),
        ]

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            raise RuntimeError(
                f"Demucs failed:\n{result.stderr}"
            )

        # Demucs creates:
        #
        # output/job_id/
        #   htdemucs_6s/
        #     <audio-name>/
        #
        # Find the actual track directory safely.
        model_dir = job_output_dir / MODEL

        if not model_dir.exists():
            raise RuntimeError(
                "Demucs completed but the model output directory "
                "was not created."
            )

        track_directories = [
            directory
            for directory in model_dir.iterdir()
            if directory.is_dir()
        ]

        if not track_directories:
            raise RuntimeError(
                "Demucs completed but no track output was found."
            )

        stem_dir = track_directories[0]

        stems = {
            "vocals": stem_dir / "vocals.wav",
            "drums": stem_dir / "drums.wav",
            "bass": stem_dir / "bass.wav",
            "guitar": stem_dir / "guitar.wav",
            "piano": stem_dir / "piano.wav",
            "other": stem_dir / "other.wav",
        }

        missing = [
            name
            for name, path in stems.items()
            if not path.exists()
        ]

        if missing:
            raise RuntimeError(
                f"Expected stems were not created: {missing}"
            )

        return {
            name: str(path.resolve())
            for name, path in stems.items()
        }