renderLayout(initGame);

/* =========================
   STATE
========================= */

let ANSWERS = [];
let DICTIONARY = [];
let secret = "";

let gameReady = false;
let gameOver = false;

const MAX_TRIES = 7;

let currentTry = 0;
let currentGuess = "";

/* =========================
   NORMALIZE LETTERS
========================= */

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
        Ѕ: "З",
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
   INIT GAME
========================= */

async function initGame() {
    const page = document.getElementById("page-content");

    page.innerHTML = `
        <div class="text-center flex flex-col items-center">

            <h2 class="text-xl font-bold mb-4">Погоди реч</h2>

            <div id="board" class="flex flex-col gap-2 w-full max-w-xs"></div>

            <input
                id="hiddenInput"
                type="text"
                inputmode="text"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="characters"
                class="opacity-0 absolute pointer-events-none"
            />

        </div>
    `;

    await loadData();

    const board = document.getElementById("board");
    const hiddenInput = document.getElementById("hiddenInput");

    createBoard(board);
    attachInputHandlers(hiddenInput, board);

    gameReady = true;

    focusInput(hiddenInput);
}

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
}

/* =========================
   BOARD
========================= */

function createBoard(board) {
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
   INPUT HANDLERS
========================= */

function attachInputHandlers(input, board) {

    // LETTER INPUT
    input.addEventListener("input", (e) => {
        if (!gameReady || gameOver) return;

        const value = e.target.value;
        if (!value) return;

        const letter = normalizeLetter(value.slice(-1));

        if (letter && currentGuess.length < 5) {
            currentGuess += letter;
            updateRow(board);
        }

        input.value = "";
    });

    // ENTER / BACKSPACE
    input.addEventListener("keydown", (e) => {
        if (!gameReady || gameOver) return;

        if (e.key === "Enter") {
            submitGuess(board);
            return;
        }

        if (e.key === "Backspace") {
            currentGuess = currentGuess.slice(0, -1);
            updateRow(board);
        }
    });

    // IMPORTANT: ONLY THIS (NO touchstart)
    const activate = () => focusInput(input);

    board.addEventListener("pointerdown", activate);
    document.addEventListener("pointerdown", activate);
}

/* =========================
   UPDATE ROW
========================= */

function updateRow(board) {
    const row = board.children[currentTry];
    if (!row) return;

    const cells = row.children;

    for (let i = 0; i < 5; i++) {
        cells[i].innerText = currentGuess[i] || "";
    }
}

/* =========================
   VALIDATION
========================= */

function isValidWord(word) {
    return DICTIONARY.includes(word);
}

/* =========================
   SUBMIT
========================= */

function submitGuess(board) {
    if (!gameReady || gameOver) return;
    if (currentGuess.length !== 5) return;

    const guess = currentGuess;

    if (!isValidWord(guess)) {
        showToast("Реч није у речнику!");
        currentGuess = "";
        updateRow(board);
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

        const idx = secretArr.indexOf(guess[i]);

        if (idx !== -1) {
            result[i] = "yellow";
            secretArr[idx] = null;
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
        showToast("🎉 Победа!");
        return;
    }

    // LOSE
    if (currentTry === MAX_TRIES) {
        gameOver = true;
        showToast("❌ Реч је била: " + secret);
    }

    setTimeout(() => {
        const board = document.getElementById("board");
        const rows = board.children;

        const targetRow = rows[currentTry];

        if (!targetRow) return;

        const rect = targetRow.getBoundingClientRect();
        const absoluteY = window.scrollY + rect.top;

        // center row slightly ABOVE middle of screen
        const offset = window.innerHeight * 0.35;

        window.scrollTo({
            top: absoluteY - offset,
            behavior: "smooth"
        });

    }, 120);
}

/* =========================
   FOCUS (FIXED MOBILE)
========================= */

function focusInput(input) {
    if (!input) return;

    setTimeout(() => {
        input.focus(); // ❌ no preventScroll
    }, 50);
}