function sayHello() {
    alert("It works!");
}

function getTodayWord() {
    const words = ["apple", "grape", "melon"];
    const day = new Date().getDate();
    return words[day % words.length];
}

function check() {
    const input = document.getElementById("guess").value;
    const answer = getTodayWord();

    if (input === answer) {
        document.getElementById("result").innerText = "Success!";
    } else {
        document.getElementById("result").innerText = "Try again!";
    }
}