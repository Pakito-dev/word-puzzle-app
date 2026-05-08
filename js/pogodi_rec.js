function normalizeLetter(key) {
    key = key.toUpperCase();

    const map = {
        // Latin keyboard → Cyrillic
        Q: "Љ",
        W: "Њ",
        E: "Е",
        R: "Р",
        T: "Т",
        Z: "З",
        U: "У",
        I: "И",
        O: "О",
        P: "П",
        Š: "Ш",
        Đ: "Ђ",
        Č: "Ч",
        Ć: "Ћ",

        A: "А",
        S: "С",
        D: "Д",
        F: "Ф",
        G: "Г",
        H: "Х",
        J: "Ј",
        K: "К",
        L: "Л",

        Y: "З",
        C: "Ц",
        V: "В",
        B: "Б",
        N: "Н",
        M: "М",
        ["["]: "Ш",
        ["]"]: "Ђ",
        [";"]: "Ч",
        ["'"]: "Ћ",
        ["\\"]: "Ж",
        X: "Џ",

    };

    return map[key] || key;
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
const hiddenInput = document.getElementById("hiddenInput");

/* =========================
   MOBILE LETTER INPUT
========================= */
hiddenInput.addEventListener("input", (e) => {
    if (gameOver) return;

    const value = e.target.value;
    if (!value) return;

    const raw = value.toLowerCase();

    // take last “unit”
    const last = raw.slice(-1);
    const letter = normalizeLetter(last);

    if (letter && currentGuess.length < 5) {
        currentGuess += letter;
        updateRow();
    }

    hiddenInput.value = "";
});

/* =========================
   KEY EVENTS (ENTER + BACKSPACE)
========================= */
hiddenInput.addEventListener("keydown", (e) => {
    if (gameOver) return;

    if (e.key === "Enter") {
        submitGuess();
        return;
    }

    if (e.key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateRow();
        return;
    }
});

/* =========================
   MOBILE FOCUS HELPERS
========================= */
board.addEventListener("click", focusInput);
document.addEventListener("touchstart", focusInput);

function focusInput() {
    hiddenInput.focus();
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


function focusInput() {
    hiddenInput.focus();
}

// try on load
window.addEventListener("load", () => {
    setTimeout(() => {
        focusInput();
    }, 300);
});