from flask import Flask, render_template, request, jsonify, session
from game import get_random_word, check_guess, VALID_GUESSES
import secrets

app = Flask(__name__)

app.secret_key = "dev-secret-key-change-later"

games = {}

def start_new_game():
    old_game_id = session.get("game_id")
    old_word = games.get(old_game_id, {}).get("target")

    if old_game_id in games:
        del games[old_game_id]

    new_word = get_random_word()

    while new_word == old_word:
        new_word = get_random_word()

    game_id = secrets.token_urlsafe(16)
    session["game_id"] = game_id
    games[game_id] = {
        "target": new_word,
        "guesses": [],
        "feedback": []
    }


@app.route("/")
def home():
    if "game_id" not in session or session["game_id"] not in games:
        game_id = secrets.token_urlsafe(16)
        session["game_id"] = game_id
        games[game_id] = {
                "target": get_random_word(),
                "guesses": [],
                "feedback": []
        }

    return render_template("index.html")

@app.route("/guess", methods=["POST"])
def submit_guess():
    data = request.get_json()
    guess = data["guess"].upper()
    print(repr(guess), guess in VALID_GUESSES)
    
    if guess not in VALID_GUESSES:
        return jsonify({"error": "Not a valid word"}), 400
        
    game_id = session["game_id"]
    target_word = games[game_id]["target"]
    
    feedback = check_guess(guess, target_word)
    
    games[game_id]["guesses"].append(guess)
    games[game_id]["feedback"].append(feedback)

    return jsonify({"feedback": feedback})

@app.route("/game_state")
def game_state():
    game_id = session["game_id"]
    game = games[game_id]

    return jsonify({
        "guesses": game["guesses"],
        "feedback": game["feedback"]
    })

@app.route("/new_game", methods=["POST"])
def new_game():
    start_new_game()
    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(debug=True)
    
