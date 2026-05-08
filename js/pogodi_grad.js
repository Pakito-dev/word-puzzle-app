renderLayout(initGame);

/* =========================
   STATE
========================= */

let cities = [];
let cityMap = new Map();

let targetCity = null;

let currentTry = 0;
const MAX_TRIES = 5;

let gameOver = false;

/* =========================
   INIT
========================= */

async function initGame() {
    const page = document.getElementById("page-content");

    page.innerHTML = `
        <div class="flex flex-col items-center text-center">

            <h1 class="text-3xl font-bold mb-6">
                Погоди град
            </h1>

            <!-- IMAGE -->
            <div class="w-full max-w-md rounded-2xl overflow-hidden shadow-lg mb-6">
                <img
                    id="cityImage"
                    class="w-full object-cover"
                    src=""
                    alt="Град"
                >
            </div>

            <!-- INPUT -->
            <input
                id="guessInput"
                type="text"
                placeholder="Унеси град..."
                autocomplete="off"
                class="
                    w-full
                    max-w-md
                    p-3
                    rounded-xl
                    text-black
                    text-center
                    text-lg
                    mb-4
                    outline-none
                "
            >

            <!-- RESULTS -->
            <div
                id="results"
                class="w-full max-w-md flex flex-col gap-3"
            ></div>

        </div>
    `;

    await loadCities();

    pickRandomCity();

    setupInput();
}

/* =========================
   LOAD JSON
========================= */

async function loadCities() {
    const response = await fetch("/data/gradovi.json");

    cities = await response.json();

    cityMap.clear();

    cities.forEach(city => {
        cityMap.set(
            normalizeText(city.name),
            city
        );
    });
}

/* =========================
   RANDOM CITY
========================= */

function pickRandomCity() {
    targetCity =
        cities[Math.floor(Math.random() * cities.length)];

    const img = document.getElementById("cityImage");

    img.src = targetCity.image;
}

/* =========================
   INPUT
========================= */

function setupInput() {
    const input = document.getElementById("guessInput");

    input.focus();

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            submitGuess();
        }
    });
}

/* =========================
   SUBMIT
========================= */

function submitGuess() {
    if (gameOver) return;

    const input = document.getElementById("guessInput");

    const rawGuess = input.value.trim();

    if (!rawGuess) return;

    const guessKey = normalizeText(rawGuess);

    const guessedCity = cityMap.get(guessKey);

    /* INVALID CITY */

    if (!guessedCity) {
        showToast("Град није пронађен!");
        return;
    }

    currentTry++;

    /* CORRECT */

    if (
        normalizeText(guessedCity.name) ===
        normalizeText(targetCity.name)
    ) {
        addResultRow(
            guessedCity.name,
            "🎉 Погодак!"
        );

        showToast("Браво!");

        gameOver = true;

        input.disabled = true;

        return;
    }

    /* DISTANCE */

    const distance = calculateDistance(
        guessedCity.lat,
        guessedCity.lng,
        targetCity.lat,
        targetCity.lng
    );

    const hint = getTemperatureHint(distance);

    addResultRow(
        guessedCity.name,
        `${hint} (${Math.round(distance)} km)`
    );

    input.value = "";

    /* LOSE */

    if (currentTry >= MAX_TRIES) {
        gameOver = true;

        input.disabled = true;

        showToast(
            `❌ Тачан одговор: ${targetCity.name}`,
            4000
        );
    }
}

/* =========================
   RESULT ROW
========================= */

function addResultRow(cityName, resultText) {
    const results = document.getElementById("results");

    const row = document.createElement("div");

    row.className = `
        bg-zinc-800
        rounded-xl
        p-4
        flex
        justify-between
        items-center
        text-left
    `;

    row.innerHTML = `
        <div class="font-semibold">
            ${cityName}
        </div>

        <div class="text-zinc-300">
            ${resultText}
        </div>
    `;

    results.prepend(row);
}

/* =========================
   DISTANCE
========================= */

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

/* =========================
   HOT/WARM/COLD
========================= */

function getTemperatureHint(distance) {
    if (distance < 30)
        return "🔥 Врело";

    if (distance < 80)
        return "🌡️ Топло";

    if (distance < 120)
        return "🙂 Млако";

    return "❄️ Хладно";
}

/* =========================
   NORMALIZATION
========================= */

function normalizeText(text) {
    text = text.trim().toLowerCase();

    // multi-letter combinations first
    text = text.replaceAll("dž", "џ");
    text = text.replaceAll("lj", "љ");
    text = text.replaceAll("nj", "њ");
    text = text.replaceAll("dj", "ђ");

    const map = {
        a: "А",
        b: "Б",
        v: "В",
        g: "Г",
        d: "Д",
        đ: "Ђ",
        e: "Е",
        ž: "Ж",
        z: "З",
        i: "И",
        j: "Ј",
        k: "К",
        l: "Л",
        љ: "Љ",
        m: "М",
        n: "Н",
        њ: "Њ",
        o: "О",
        p: "П",
        r: "Р",
        s: "С",
        t: "Т",
        ć: "Ћ",
        u: "У",
        f: "Ф",
        h: "Х",
        c: "Ц",
        č: "Ч",
        ш: "Ш",
        š: "Ш",
        џ: "Џ"
    };

    let result = "";

    for (const ch of text) {
        result += map[ch] || ch.toUpperCase();
    }

    return result;
}