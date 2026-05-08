function toggleMenu() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-260px";
    } else {
        sidebar.style.left = "0px";
    }
}

function showToast(message, duration = 2000) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;

    // show
    toast.classList.remove("opacity-0", "translate-y-4");
    toast.classList.add("opacity-100", "translate-y-0");

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-4");
        toast.classList.remove("opacity-100", "translate-y-0");
    }, duration);
}