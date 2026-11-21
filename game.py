import random
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

def load_words(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return {line.strip().upper() for line in file}

ANSWERS = load_words("answers.txt")
VALID_GUESSES = load_words("guesses.txt")

def get_random_word():
    return random.choice(tuple(ANSWERS))


def check_guess(guess, target):
        result = ["grey"] * 5
        remaining = {}

        # Count target letters
        for letter in target:
            if letter in remaining:
                remaining[letter] +=1
            else:
                remaining[letter] = 1
                

        # Identify green letters
        for i in range(5):
            if guess[i] == target[i]:
                result[i] = "green"
                remaining[guess[i]] -=1


        # Identify yellow letters
        for i in range(5):
            if result[i] != "green":
                if remaining.get(guess[i], 0) > 0:
                    result[i] = "yellow"
                    remaining[guess[i]] -= 1
        
        return result
