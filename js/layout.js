function renderLayout() {
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="min-h-screen flex flex-col bg-zinc-900 text-white">

            <!-- TOPBAR -->
            <header class="h-14 bg-black flex items-center justify-between px-4 shadow-lg">

                <button onclick="toggleMenu()" class="text-2xl">
                    ☰
                </button>

                <a href="/index.html" class="text-xl font-bold">
                    Енигматика
                </a>

                <a href="/onama.html" class="text-sm opacity-80 hover:opacity-100">
                    О мени
                </a>

            </header>

            <!-- SIDEBAR -->
            <aside
                id="sidebar"
                class="fixed top-0 left-[-260px] w-64 h-full bg-zinc-800 p-4 transition-all duration-300 z-50"
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

            <!-- MAIN -->
            <main class="flex-1 p-4">
                <div id="page-content"></div>
            </main>

            <!-- TOAST -->
            <div
                id="toast"
                class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       bg-black/85 text-white px-6 py-4 rounded-2xl
                       text-lg font-semibold
                       opacity-0 scale-95
                       transition-all duration-300
                       pointer-events-none z-50
                       text-center max-w-[80vw]"
            ></div>

        </div>
    `;
}

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains("left-0");

    if (isOpen) {
        sidebar.classList.remove("left-0");
        sidebar.classList.add("-left-[260px]");
    } else {
        sidebar.classList.add("left-0");
        sidebar.classList.remove("-left-[260px]");
    }
}

function showToast(message, duration = 2000) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;

    // show
    toast.classList.remove("opacity-0", "scale-95");
    toast.classList.add("opacity-100", "scale-100");

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {
        toast.classList.add("opacity-0", "scale-95");
        toast.classList.remove("opacity-100", "scale-100");
    }, duration);
}