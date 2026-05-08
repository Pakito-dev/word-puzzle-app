function renderLayout(onReady) {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="min-h-screen flex flex-col">

            <!-- TOPBAR -->
            <div class="flex justify-between items-center px-4 py-3 bg-zinc-900 text-white">

                <button id="menuBtn" class="text-2xl">☰</button>

                <a href="/index.html" class="text-xl font-bold">
                    Енигматика
                </a>

                <a href="/onama.html" class="text-sm opacity-80 hover:opacity-100">
                    О нама
                </a>

            </div>

            <!-- SIDEBAR (NOW ALWAYS EXISTS) -->
            <aside
                id="sidebar"
                class="
                    fixed top-0 left-0 h-full w-64 bg-zinc-800 p-4 z-50
                    transform -translate-x-full
                    transition-transform duration-300
                "
            >
                <h2 class="text-lg font-bold mb-4">Игре</h2>

                <nav class="flex flex-col gap-2">

                    <a href="/games/pogodi_rec.html" class="p-2 rounded hover:bg-zinc-700">
                        Погоди реч
                    </a>

                    <a href="/games/pogodi_grad.html" class="p-2 rounded hover:bg-zinc-700">
                        Погоди град
                    </a>

                </nav>
            </aside>

            <!-- PAGE CONTENT -->
            <div class="flex-1 p-4">
                <div id="page-content"></div>
            </div>

        </div>
    `;

    setupMenu();

    if (onReady) onReady();
}

/* =========================
   MENU FIX (WORKS EVERYWHERE)
========================= */

function setupMenu() {
    const btn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");

    if (!btn || !sidebar) return;

    btn.addEventListener("click", () => {
        sidebar.classList.toggle("-translate-x-full");
    });

    // optional: click outside closes menu
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
            sidebar.classList.add("-translate-x-full");
        }
    });
}

/* =========================
   TOAST
========================= */

function showToast(message, duration = 2000) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.className = `
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        bg-black/90 text-white px-6 py-4 rounded-2xl
        text-lg font-semibold text-center
        max-w-[80vw]
        transition-all duration-300
        opacity-0 scale-95
        z-50
    `;

    toast.innerText = message;

    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "scale-95");
        toast.classList.add("opacity-100", "scale-100");
    });

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {
        toast.classList.add("opacity-0", "scale-95");
        toast.classList.remove("opacity-100", "scale-100");
    }, duration);
}