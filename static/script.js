
let currentRow= 0;
let currentTile= 0;
let gameOver = false;
let isSubmitting = false;
const newGameButton = document.getElementById("new-game");


const gameBoard = document.getElementById("game-board");
const keys = document.querySelectorAll(".key");

for (let row = 0; row < 6; row++) {
  for (let col = 0; col < 5; col++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    gameBoard.appendChild(tile);
    tile.id = `tile-${row}-${col}`;
  }
}

function addLetter(letter) {
    if (gameOver || isSubmitting || currentTile >= 5) {
        return;
    }

    const tile = document.getElementById(
        `tile-${currentRow}-${currentTile}`
    );

    tile.textContent = letter;
    currentTile++;
}

function deleteLetter() {
    if (gameOver || isSubmitting || currentTile === 0){
      return;
    }
  
    currentTile--

    const tile = document.getElementById(
        `tile-${currentRow}-${currentTile}`
    );

    tile.textContent = "";
}

function updateKeyColor(letter, color) {
    const key = document.querySelector(`[data-key="${letter}"]`);
    console.log(letter, key);

    if (!key) {
        console.log("Could not find keyboard key:", letter);
        return;
    } 
    if (color==="green") {
      key.classList.remove("yellow", "grey");
        key.classList.add("green");
    }
    else if (color === "yellow" && !key.classList.contains("green")) {
        key.classList.remove("grey");
        key.classList.add("yellow");
    }
    else if (color === "grey" &&
             !key.classList.contains("green") &&
             !key.classList.contains("yellow")) {
        key.classList.add("grey");
    }
}
    

function submitGuess() {
    if (gameOver || isSubmitting || currentTile!==5){
      return;
    }

    let guess = "";

    for(let i=0; i<5; i++) {

          const tile= document.getElementById(`tile-${currentRow}-${i}`);
          guess+= tile.textContent;
        }
  
    isSubmitting = true;

    fetch("/guess", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ guess: guess })
})
        .then(response => response.json())
        .then(data => {
          if (data.error) {
              alert(data.error);
              isSubmitting = false;
              return;
}
            for (let i = 0; i < 5; i++) {
                const tile = document.getElementById(`tile-${currentRow}-${i}`);
                const color = data.feedback[i];

                tile.classList.add(color);
            }

            for (let i = 0; i < 5; i++) {
                updateKeyColor(guess[i], data.feedback[i]);
            }

            const won = data.feedback.every(color => color === "green");

            isSubmitting=false;
            currentTile = 0;

          if (won) {
            gameOver = true;
            setTimeout(() => {
                alert("Congratulations! You won!");
            }, 100);
            return;
          }
          currentRow++;

          if (currentRow >= 6) {
            gameOver = true;
            setTimeout(() => {
                alert("Game over! You lose!");
            }, 100);
          }
        });
}

document.addEventListener("keyup", function(event) {
    console.log(event.key);

    if (gameOver)
      return;
  
    if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        addLetter(event.key.toUpperCase());
    }

    if (event.key === "Backspace") {
        deleteLetter();
    }
    
    if (event.key === "Enter"){
        submitGuess();
    }
});
newGameButton.addEventListener("click", function() {
    newGameButton.blur();
    if (isSubmitting) {
        return;
    }

    fetch("/new_game", {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 5; col++) {
                    const tile = document.getElementById(`tile-${row}-${col}`);

                    tile.textContent = "";
                    tile.classList.remove("green", "yellow", "grey");
                }
            }

            keys.forEach(key => {
                key.classList.remove("green", "yellow", "grey");
            });

            currentRow = 0;
            currentTile = 0;
            gameOver = false;
        }
    })
    .catch(error => {
        console.error("Could not start a new game:", error);
    });
});

function loadGameState() {
    fetch("/game_state")
    .then(response => response.json())
    .then(data => {
        for (let row = 0; row < data.guesses.length; row++) {
          for(let col = 0; col< 5; col++) {
            const tile = document.getElementById(`tile-${row}-${col}`);

            tile.textContent = data.guesses[row][col];
            tile.classList.add(data.feedback[row][col]);

            updateKeyColor(data.guesses[row][col], data.feedback[row][col]);
          }

        }
        currentRow = data.guesses.length;
        currentTile = 0;

        const lastGuess = data.feedback[data.feedback.length - 1];

        if (lastGuess && lastGuess.every(color => color === "green")) {
          gameOver=true;
        }

        if (currentRow>= 6) {
          gameOver= true;
        }
    });
}

loadGameState();


keys.forEach(key => {
    key.addEventListener("click", function() {
        const value = key.dataset.key;

        if (value === "ENTER") {
            submitGuess()
        }
        else if (value === "BACKSPACE") {
            deleteLetter();
        }
        else {
            addLetter(value);
        }
    });
});
