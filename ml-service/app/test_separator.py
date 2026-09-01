from pathlib import Path
from separator import StemSeparator


BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "input" / "song.mp3"
OUTPUT_DIR = BASE_DIR / "output"

separator = StemSeparator(str(OUTPUT_DIR))

stems = separator.separate(str(INPUT_FILE))

print("\nMUKIIQ separation complete!\n")

for name, path in stems.items():
    print(f"{name}: {path}")