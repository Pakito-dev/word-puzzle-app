const WORDS = ["dabar","kobra", "mango", "papir", "sokak", "taksi", "vagon", "zebra"];
const MAX_TRIES = 7;

let secret = WORDS[Math.floor(Math.random() * WORDS.length)];
let currentTry = 0;

const board = document.getElementById("board");

// Create empty board
for (let i = 0; i < MAX_TRIES; i++) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < 5; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        row.appendChild(cell);
    }

    board.appendChild(row);
}

function submitGuess() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toLowerCase();

    if (guess.length !== 5) {
        alert("Enter a 5-letter word");
        return;
    }

    if (currentTry >= MAX_TRIES) return;

    const row = board.children[currentTry];
    const cells = row.children;

    // Convert secret to array for tracking used letters
    let secretArr = secret.split("");
    let result = Array(5).fill("gray");

    // First pass (greens)
    for (let i = 0; i < 5; i++) {
        if (guess[i] === secret[i]) {
            result[i] = "green";
            secretArr[i] = null;
        }
    }

    // Second pass (yellows)
    for (let i = 0; i < 5; i++) {
        if (result[i] === "green") continue;

        let index = secretArr.indexOf(guess[i]);
        if (index !== -1) {
            result[i] = "yellow";
            secretArr[index] = null;
        }
    }

    // Display result
    for (let i = 0; i < 5; i++) {
        cells[i].innerText = guess[i].toUpperCase();
        cells[i].classList.add(result[i]);
    }

    currentTry++;
    input.value = "";

    // Check win
    if (guess === secret) {
        setTimeout(() => alert("🎉 Success!"), 100);
        return;
    }

    // Check lose
    if (currentTry === MAX_TRIES) {
        setTimeout(() => alert("❌ Failed! Word was: " + secret), 100);
    }
}