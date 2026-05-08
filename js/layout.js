function toggleMenu() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-260px";
    } else {
        sidebar.style.left = "0px";
    }
}

window.showToast = function(message) {
    const toast = document.getElementById("toast");

    if (!toast) return; // safety

    toast.innerText = message;
    toast.style.opacity = 1;

    setTimeout(() => {
        toast.style.opacity = 0;
    }, 2000);
};
