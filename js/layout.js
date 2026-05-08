function renderLayout(onReady) {
    const app = document.getElementById("app");

    setupViewportHandling();

    app.innerHTML = `
        <div class="min-h-screen flex flex-col">

            <!-- TOPBAR -->
            <header class="flex justify-between items-center px-4 py-3 bg-black text-white shadow-lg">

                <button id="menuBtn" class="text-2xl">
                    ☰
                </button>

                <a href="/index.html" class="text-xl font-bold">
                    Енигматика
                </a>

                <a href="/onama.html" class="text-sm opacity-80 hover:opacity-100">
                    О нама
                </a>

            </header>

            <!-- SIDEBAR -->
            <aside
                id="sidebar"
                class="
                    fixed
                    top-0
                    left-0
                    h-full
                    w-64
                    bg-zinc-800
                    p-4
                    z-50
                    transform
                    -translate-x-full
                    transition-transform
                    duration-300
                "
            >

                <h2 class="text-lg font-bold mb-4">
                    Игре
                </h2>

                <nav class="flex flex-col gap-2">

                    <a
                        href="/games/pogodi_rec.html"
                        class="p-2 rounded hover:bg-zinc-700"
                    >
                        Погоди реч
                    </a>

                    <a
                        href="/games/pogodi_grad.html"
                        class="p-2 rounded hover:bg-zinc-700"
                    >
                        Погоди град
                    </a>

                </nav>

            </aside>

            <!-- PAGE -->
            <main class="flex-1 p-4 overflow-y-auto">
                <div id="page-content"></div>
            </main>

        </div>
    `;

    setupMenu();

    if (onReady) onReady();
}

/* =========================
   MOBILE VIEWPORT FIX
========================= */

function setupViewportHandling() {
    function updateVH() {
        const vh = window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;

        document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);
    }

    updateVH();

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", updateVH);
    }

    window.addEventListener("resize", updateVH);
}

/* =========================
   MENU
========================= */

function setupMenu() {
    const btn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");

    if (!btn || !sidebar) return;

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("-translate-x-full");
    });

    document.addEventListener("click", (e) => {
        if (
            !sidebar.contains(e.target) &&
            !btn.contains(e.target)
        ) {
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
        fixed
        top-1/2
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        bg-black/90
        text-white
        px-6
        py-4
        rounded-2xl
        text-lg
        font-semibold
        text-center
        max-w-[80vw]
        transition-all
        duration-300
        opacity-0
        scale-95
        z-50
        pointer-events-none
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