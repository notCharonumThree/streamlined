document.addEventListener("DOMContentLoaded", function () {
    var adj = localStorage.getItem("verified").split(' ')[0]
    var noun = localStorage.getItem("verified").split(' ')[1]
    adj = adj.charAt(0).toUpperCase() + adj.slice(1);
    noun = noun.charAt(0).toUpperCase() + noun.slice(1);
    document.getElementById('welcome').innerText = "Welcome, " + adj + " " + noun
})