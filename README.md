# Five Letter Word Game

A browser-based five-letter word guessing game built with Python, Flask, HTML, CSS, and JavaScript.

## About

This project is a Wordle-inspired word guessing game developed as a personal programming project to practice web development and frontend-backend communication.

Players have six attempts to guess a hidden five-letter word. After each guess, the game provides color-coded feedback indicating which letters are correct and whether they are in the correct position.

## Features

- Random five-letter word selection

- Six attempts per game

- Color-coded feedback (green, yellow, and grey)

- Duplicate-letter-aware feedback algorithm

- Physical keyboard and on-screen keyboard support

- Input validation using a word list

- Game state preservation after page refresh

- New game functionality

## Technologies Used

- Python – Game logic and backend

- Flask – Web application framework

- JavaScript – Frontend interactions and game state

- HTML – Page structure

- CSS – Styling and layout

## Project Structure

```
five-letter-word-game/
├── app.py
├── game.py
├── requirements.txt
├── data/
│   ├── answers.txt
│   └── guesses.txt
├── templates/
│   └── index.html
└── static/
    ├── script.js
    └── style.css
```

## Installation and Setup

Clone the repository:

git clone https://github.com/ardadonmez05/five-letter-word-game.git

Navigate to the project directory:

```cd five-letter-word-game```

Create and activate a virtual environment:

```python -m venv venv```

Windows:

```venv\Scripts\activate```

Install dependencies:

```pip install -r requirements.txt```

Run the application:

```python app.py```

Open your browser and visit:

http://127.0.0.1:5000

## Project Status

In development. More features and UI improvements are planned.

## Acknowledgements

This is an independent educational project and is not affiliated with or endorsed by The New York Times or the original Wordle creator.