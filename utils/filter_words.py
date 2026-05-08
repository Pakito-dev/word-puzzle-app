import json

INPUT_FILE = "C:\\Users\\pajap\\development\\repos\\dictionary\\serbian-words.txt"
OUTPUT_FILE = "C:\\Users\\pajap\\development\\repos\\word-puzzle-app\\data\\reci_5_slova.json"

filtered = set()

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    for line in f:
        word = line.strip()

        if not word:
            continue

        # skip names (capitalized words)
        if word[0].isupper():
            continue

        # keep only 5-letter words
        if len(word) == 5:
            filtered.add(word.upper())

# convert to sorted list (nice for debugging & consistency)
result = sorted(list(filtered))

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Done! {len(result)} words saved to {OUTPUT_FILE}")