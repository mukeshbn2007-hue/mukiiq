from pathlib import Path

from demucs.api import Separator as DemucsSeparator
from demucs.api import save_audio


MODEL = "htdemucs_6s"


class StemSeparator:
    def __init__(self, output_dir: str = "output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        print(
            f"[MUKIIQ] Initializing Demucs model: {MODEL}"
        )

        self.separator = DemucsSeparator(
            model=MODEL,
            device="cpu",
            progress=True,
        )

        print(
            "[MUKIIQ] Demucs model ready."
        )

    def separate(
        self,
        audio_path: str,
        job_id: str,
    ) -> dict:
        audio = Path(audio_path)

        if not audio.exists():
            raise FileNotFoundError(
                f"Audio file not found: {audio}"
            )

        job_output_dir = (
            self.output_dir
            / job_id
            / MODEL
        )

        job_output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        print(
            f"[MUKIIQ] Separating: {audio.name}"
        )

        _, separated = (
            self.separator.separate_audio_file(
                audio
            )
        )

        stems = {}

        for name, source in separated.items():
            stem_file = (
                job_output_dir
                / f"{name}.wav"
            )

            save_audio(
                source,
                str(stem_file),
                samplerate=self.separator.samplerate,
                bitrate=320,
                clip="rescale",
                as_float=False,
                bits_per_sample=16,
            )

            stems[name] = stem_file

            print(
                f"[MUKIIQ] Created: {stem_file.name}"
            )

        expected_stems = {
            "vocals",
            "drums",
            "bass",
            "guitar",
            "piano",
            "other",
        }

        missing = [
            name
            for name in expected_stems
            if name not in stems
        ]

        if missing:
            raise RuntimeError(
                "Expected stems were not created: "
                f"{missing}"
            )

        missing_files = [
            name
            for name, path in stems.items()
            if not path.exists()
        ]

        if missing_files:
            raise RuntimeError(
                "Stem files are missing after separation: "
                f"{missing_files}"
            )

        print(
            "[MUKIIQ] Separation completed."
        )

        return {
            name: str(
                path.resolve()
            )
            for name, path in stems.items()
        }