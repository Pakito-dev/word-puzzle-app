function normalizeLetter(key) {
    const map = {
        a: "А", b: "Б", c: "Ц", d: "Д", e: "Е", f: "Ф", g: "Г",
        h: "Х", i: "И", j: "Ј", k: "К", l: "Л", m: "М", n: "Н",
        o: "О", p: "П", r: "Р", s: "С", t: "Т", u: "У", v: "В",
        z: "З",

        č: "Ч", ć: "Ћ", š: "Ш", ž: "Ж", đ: "Ђ",

        // already Cyrillic (lowercase)
        а: "А", б: "Б", ц: "Ц", д: "Д", е: "Е", ф: "Ф", г: "Г",
        х: "Х", и: "И", ј: "Ј", к: "К", л: "Л", м: "М", н: "Н",
        о: "О", п: "П", р: "Р", с: "С", т: "Т", у: "У", в: "В",
        з: "З",

        ч: "Ч", ћ: "Ћ", ш: "Ш", ж: "Ж", ђ: "Ђ"
    };

    return map[key] || null;
}

const WORDS = ["ДУЋАН", "ВОДИЧ", "ШКОЛА", "КЊИГА", "СУНЦЕ"];
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

let currentGuess = "";
let gameOver = false;
document.addEventListener("keydown", handleKey);
function handleKey(e) {
    if (currentTry >= MAX_TRIES) return;
    if (gameOver) return;
    const key = e.key.toLowerCase();
    const letter = normalizeLetter(key);

    if (letter) {
        if (currentGuess.length < 5) {
            currentGuess += letter;
            updateRow();
        }
    }

    // ENTER → submit
    if (key === "enter") {
        submitGuess();
        return;
    }

    // BACKSPACE → delete
    if (key === "backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateRow();
        return;
    }

}

function updateRow() {
    const row = board.children[currentTry];
    const cells = row.children;

    for (let i = 0; i < 5; i++) {
        cells[i].innerText = currentGuess[i] ? currentGuess[i].toUpperCase() : "";
    }
}

function submitGuess() {
    if (currentGuess.length !== 5) {
        return;
    }

    const guess = currentGuess;

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

    // Check win
    if (guess === secret) {
        gameOver = true;
        setTimeout(() => alert("🎉 Success!"), 100);
    }

    if (currentTry === MAX_TRIES) {
        gameOver = true;
        setTimeout(() => alert("❌ Failed! Word was: " + secret), 100);
    }
    currentGuess = "";
}