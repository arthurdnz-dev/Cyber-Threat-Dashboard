const logs = document.getElementById("logs");
const threatLevel = document.getElementById("threatLevel");
const attackCount = document.getElementById("attackCount");

let count = 0;

function generateLog() {
    const ip = `${random(1,255)}.${random(1,255)}.${random(1,255)}.${random(1,255)}`;
    const risk = ["LOW", "MEDIUM", "HIGH"][random(0,2)];

    const log = `[${new Date().toLocaleTimeString()}] Attack detected from IP ${ip} | Risk: ${risk}`;

    const p = document.createElement("p");
    p.textContent = log;

    logs.appendChild(p);
    logs.scrollTop = logs.scrollHeight;

    count++;
    attackCount.textContent = count;

    threatLevel.textContent = risk;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(generateLog, 1000);