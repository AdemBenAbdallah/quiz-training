import json
import sys
import re



def clean_answers(answers):
    """Extract clean unique answer letters (A–Z) from messy text list."""
    cleaned = []
    for ans in answers:
        match = re.search(r"Selected Answer:\s*([A-Z])", ans)
        if match:
            letter = match.group(1)
            if letter not in cleaned:  # keep only unique
                cleaned.append(letter)
    return cleaned

def main():
    # Check for command-line arguments
    if len(sys.argv) == 3:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
    else:
        # Use default file names if no arguments provided and print usage
        input_file = "results1.json"
        output_file = "cleaned.json"
        print("Usage: python clean.py <input_file.json> <output_file.json>")
        print(f"Using default files: {input_file} -> {output_file}")

    # Load original JSON
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Clean each question’s answers
    for item in data:
        if "answers" in item and isinstance(item["answers"], list):
            item["answers"] = clean_answers(item["answers"])

    # Save cleaned JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Cleaned answers saved to {output_file}")

if __name__ == "__main__":
    main()
