window.toggleMenu = function() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "0px" ? "-200px" : "0px";
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
