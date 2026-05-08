function normalizeLetter(key) {
    const map = {
        a: "А", b: "Б", c: "Ц", d: "Д", e: "Е", f: "Ф", g: "Г",
        h: "Х", i: "И", j: "Ј", k: "К", l: "Л", m: "М", n: "Н",
        o: "О", p: "П", r: "Р", s: "С", t: "Т", u: "У", v: "В",
        z: "З",

        č: "Ч", ć: "Ћ", š: "Ш", ž: "Ж", đ: "Ђ",

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

let currentGuess = "";
let gameOver = false;

/* =========================
   BOARD
========================= */
function createBoard() {
    for (let i = 0; i < MAX_TRIES; i++) {
        const row = document.createElement("div");

        row.className = "grid grid-cols-5 gap-2 w-full max-w-xs mx-auto";

        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");

            cell.className =
                "aspect-square border border-zinc-600 flex items-center justify-center text-xl font-bold uppercase";

            row.appendChild(cell);
        }

        board.appendChild(row);
    }
}

/* =========================
   INPUT
========================= */
document.addEventListener("keydown", handleKey);

function handleKey(e) {
    if (gameOver) return;
    if (currentTry >= MAX_TRIES) return;

    const key = e.key.toLowerCase();

    if (key === "enter") {
        submitGuess();
        return;
    }

    if (key === "backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateRow();
        return;
    }

    const letter = normalizeLetter(key);

    if (letter && currentGuess.length < 5) {
        currentGuess += letter;
        updateRow();
    }
}

/* =========================
   RENDER
========================= */
function updateRow() {
    const row = board.children[currentTry];
    if (!row) return;

    const cells = row.children;

    for (let i = 0; i < 5; i++) {
        cells[i].innerText = currentGuess[i] || "";
    }
}

/* =========================
   GAME LOGIC
========================= */
function submitGuess() {
    if (currentGuess.length !== 5) return;

    const guess = currentGuess;

    const row = board.children[currentTry];
    const cells = row.children;

    let secretArr = secret.split("");
    let result = Array(5).fill("gray");

    // GREEN
    for (let i = 0; i < 5; i++) {
        if (guess[i] === secret[i]) {
            result[i] = "green";
            secretArr[i] = null;
        }
    }

    // YELLOW
    for (let i = 0; i < 5; i++) {
        if (result[i] === "green") continue;

        let index = secretArr.indexOf(guess[i]);

        if (index !== -1) {
            result[i] = "yellow";
            secretArr[index] = null;
        }
    }

    // APPLY UI
    for (let i = 0; i < 5; i++) {
        cells[i].innerText = guess[i];

        cells[i].classList.add("text-white", "font-bold");

        if (result[i] === "green") {
            cells[i].classList.add("bg-green-600");
        } else if (result[i] === "yellow") {
            cells[i].classList.add("bg-yellow-500");
        } else {
            cells[i].classList.add("bg-zinc-700");
        }
    }

    currentTry++;
    currentGuess = "";

    // WIN
    if (guess === secret) {
        gameOver = true;
        setTimeout(() => showToast("🎉 Победа!"), 300);
        return;
    }

    // LOSE
    if (currentTry === MAX_TRIES) {
        gameOver = true;
        setTimeout(() => showToast("❌ Реч је била: " + secret), 300);
    }
}

/* =========================
   INIT
========================= */
createBoard();