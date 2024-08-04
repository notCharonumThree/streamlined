
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('v');
var cycle = null;

if (myParam == null) {
    window.location.href = "/google_hooking.html";
}

const adjectives = [
    "large", "small", "big", "tiny", "fast", "slow", 
    "colorful", "bright", "dark", "furry", "scaly", 
    "feathery", "strong", "noisy", "quiet"
];

const animals = [
    "zebra", "lion", "elephant", "giraffe", 
    "tiger", "bear", "wolf", "eagle", "shark", 
    "dolphin", "penguin", "kangaroo", "horse", "frog", 
    "rabbit", "snake", "turtle", "owl", "parrot"
];

function isKeyInJSON(key, jsonObject) {
    // Check if the current object has the key
    if (jsonObject.hasOwnProperty(key)) {
        return true;
    }

    // Iterate through the keys in the current object
    for (const k in jsonObject) {
        // If the value is an object, recursively check its keys
        if (typeof jsonObject[k] === 'object' && jsonObject[k] !== null) {
            if (isKeyInJSON(key, jsonObject[k])) {
                return true;
            }
        }
    }

    // If the key was not found in this object or its children, return false
    return false;
}

async function generateCode() {
    var tree = {}
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': '$2a$10$6BysE.FjRL4.6NTAj0f/NeEo/rgbrxRsG0nimym.HRclykKDcDwm.'
        }
    };

    try {
        const response = await fetch('https://api.jsonbin.io/v3/b/666356cead19ca34f875bc4d', options);
        const data = await response.json();
        tree = data['record']['tree'];
    } catch (err) {
        console.error(err);
    }

    var randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    var randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    while (isKeyInJSON(`${randomAdjective} ${randomAnimal}`, tree)) {
        var randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        var randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    }
    return `${randomAdjective} ${randomAnimal}`;
}

async function pushIdentifier() {
    clearInterval(cycle);
    var modifiedJSON = {};
        var options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': '$2a$10$6BysE.FjRL4.6NTAj0f/NeEo/rgbrxRsG0nimym.HRclykKDcDwm.'
            }
        };

        try {
            const response = await fetch('https://api.jsonbin.io/v3/b/666356cead19ca34f875bc4d', options);
            const data = await response.json();
            modifiedJSON = data['record'];
        } catch (err) {
            console.error(err);
        }

        modifiedJSON['identifiers'][document.getElementById("code").innerText] = myParam;
        console.log(modifiedJSON);
        var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': '$2a$10$6BysE.FjRL4.6NTAj0f/NeEo/rgbrxRsG0nimym.HRclykKDcDwm.'
        },
        body: JSON.stringify(modifiedJSON)
        };
        fetch('https://api.jsonbin.io/v3/b/666356cead19ca34f875bc4d', options)
        window.location.href = '/ob';
}

async function statusReturn() {
    var returned;
    res = await fetch("/verify", {
        method: "POST",
        body: JSON.stringify({"name": document.getElementById("code").innerText}),
        headers: {
            "Content-type": "application/json"
        }
    })
    returned = await res.json()
    if (returned.status == 'verified') {
        window.localStorage.setItem('verified', document.getElementById("code").innerText);
        document.querySelector('#mismatch').innerText = 'Finalizing...';
        pushIdentifier();
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    if (localStorage.getItem('verified') !== null) {
        document.querySelector('#mismatch').innerText = 'You are seeing this page because you either have been unverified or incorrectly verified';
    }
    const code = await generateCode();
    document.getElementById("code").innerText = code;
    fetch("/verify", {
        method: "POST",
        body: JSON.stringify({"name": code, "first": true}),
        headers: {
            "Content-type": "application/json"
        }
    })
    cycle = setInterval(statusReturn, 1000);
})

window.addEventListener("beforeunload", function(e){
    fetch("/verify-user", {
        method: "POST",
        body: JSON.stringify({"name": code}),
        headers: {
            "Content-type": "application/json"
        }
        });
 });