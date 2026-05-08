renderLayout();

document.getElementById("page-content").innerHTML = `
    <div class="text-center">
        <h2 class="text-xl font-bold mb-4">Погоди реч</h2>
        <div id="board"></div>
        <input id="hiddenInput" class="opacity-0 absolute">
    </div>
`;

function normalizeLetter(key) {
    key = key.toUpperCase();

    const map = {
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

        ";": "Ч",
        "'": "Ћ",
        "[": "Ш",
        "]": "Ђ",
        "\\": "Ж",
        X: "Џ"
    };

    return map[key] || key;
}

/* =========================
   STATE
========================= */

let ANSWERS = [];
let DICTIONARY = [];
let gameReady = false;
let secret = "";

const MAX_TRIES = 7;

let currentTry = 0;
let currentGuess = "";
let gameOver = false;

const board = document.getElementById("board");
const hiddenInput = document.getElementById("hiddenInput");

/* =========================
   LOAD DATA
========================= */

async function loadData() {
    const [a, d] = await Promise.all([
        fetch("/data/resenja.json"),
        fetch("/data/reci_5_slova.json")
    ]);

    ANSWERS = await a.json();
    DICTIONARY = await d.json();

    secret = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    gameReady = true;
}

loadData();

/* =========================
   VALIDATION
========================= */

function isValidWord(word) {
    return DICTIONARY.includes(word);
}

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
   INPUT (MOBILE)
========================= */

hiddenInput.addEventListener("input", (e) => {
    if (!gameReady || gameOver) return;

    const value = e.target.value;
    if (!value) return;

    const letter = normalizeLetter(value.slice(-1).toLowerCase());

    if (letter && currentGuess.length < 5) {
        currentGuess += letter;
        updateRow();
    }

    hiddenInput.value = "";
});

/* =========================
   KEYBOARD EVENTS
========================= */

hiddenInput.addEventListener("keydown", (e) => {
    if (!gameReady || gameOver) return;

    if (e.key === "Enter") {
        submitGuess();
    }

    if (e.key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateRow();
    }
});

/* =========================
   TOUCH FOCUS
========================= */

board.addEventListener("click", focusInput);
document.addEventListener("touchstart", focusInput);

function focusInput() {
    hiddenInput.focus();
}

/* =========================
   RENDER ROW
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
   SUBMIT
========================= */

function submitGuess() {
    if (!gameReady || gameOver) return;
    if (currentGuess.length !== 5) return;

    const guess = currentGuess;

    // VALIDATION FIRST
    if (!isValidWord(guess)) {
        showToast("Реч није у речнику!");
        return;
    }

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

        const index = secretArr.indexOf(guess[i]);

        if (index !== -1) {
            result[i] = "yellow";
            secretArr[index] = null;
        }
    }

    // APPLY UI
    for (let i = 0; i < 5; i++) {
        cells[i].innerText = guess[i];
        cells[i].className += " text-white font-bold";

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
        setTimeout(() => showToast("🎉 Победа!"), 4000);
        return;
    }

    // LOSE
    if (currentTry === MAX_TRIES) {
        gameOver = true;
        setTimeout(() => showToast("❌ Реч је била: " + secret), 4000);
    }
}

/* =========================
   INIT
========================= */

createBoard();

window.addEventListener("load", () => {
    setTimeout(focusInput, 300);
});