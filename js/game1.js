renderLayout();
const KEYBOARD_LAYOUT = [
    ["Љ", "Њ", "Е", "Р", "Т", "З", "У", "И", "О", "П", "Ш", "Ђ"],
    ["А", "С", "Д", "Ф", "Г", "Х", "Ј", "К", "Л", "Ч", "Ћ", "Ж"],
    ["ENTER", "З", "Џ", "Ц", "В", "Б", "Н", "М", "BACK"]
];
const KEY_MAP = {
    ";": "Ч",
    "'": "Ћ",
    "[": "Ш",
    "]": "Ђ",
    "\\": "Ж",

    q: "Љ", w: "Њ",
    y: "З",

    c: "Ц", v: "В", b: "Б",
    n: "Н", m: "М"
};

let keyState = {};

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
function createKeyboard() {
    const keyboard = document.getElementById("keyboard");

    KEYBOARD_LAYOUT.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("key-row");

        row.forEach(key => {
            const keyDiv = document.createElement("div");
            keyDiv.classList.add("key");
            keyDiv.innerText = key;

            if (key === "ENTER" || key === "BACK") {
                keyDiv.classList.add("special");
            }

            keyDiv.addEventListener("click", () => handleVirtualKey(key));

            rowDiv.appendChild(keyDiv);
        });

        keyboard.appendChild(rowDiv);
    });
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
function handleVirtualKey(key) {
    if (gameOver) return;

    if (key === "ENTER") {
        submitGuess();
        return;
    }

    if (key === "BACK") {
        currentGuess = currentGuess.slice(0, -1);
        updateRow();
        return;
    }

    if (currentGuess.length < 5) {
        currentGuess += key;
        updateRow();
    }
}
function handleKey(e) {
    if (currentTry >= MAX_TRIES) return;
    if (gameOver) return;
    const key = e.key.toLowerCase();
    let letter = KEY_MAP[key] || normalizeLetter(key);

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

    for (let i = 0; i < 5; i++) {
    const letter = guess[i];

    if (result[i] === "green") {
        keyState[letter] = "green";
    }
    else if (result[i] === "yellow") {
        if (keyState[letter] !== "green") {
            keyState[letter] = "yellow";
        }
    }
    else {
        if (!keyState[letter]) {
            keyState[letter] = "gray";
        }
    }
}

    currentTry++;

    // Check win
    if (guess === secret) {
        gameOver = true;
        setTimeout(() => showToast("🎉 Свака част јуначе-јунакињо!"), 100);
        return;
    }

    if (currentTry === MAX_TRIES) {
        gameOver = true;
        setTimeout(() => showToast("❌ Нисте успели, реч је била: " + secret), 100);
        return;
    }
    currentGuess = "";
    updateKeyboard();
}
createKeyboard();
function updateKeyboard() {
    const keys = document.querySelectorAll(".key");

    keys.forEach(k => {
        const letter = k.innerText;

        if (keyState[letter]) {
            k.classList.remove("green", "yellow", "gray");
            k.classList.add(keyState[letter]);
        }
    });
}