// ELEMENTOS
const logs = document.getElementById("logs");
const threatLevel = document.getElementById("threatLevel");
const attackCount = document.getElementById("attackCount");
const alertScreen = document.getElementById("criticalAlert");
const canvas = document.getElementById("particles");
const ctx2 = canvas.getContext("2d");

// ESTADO
let count = 0;
let currentFilter = "ALL";
let lastAlertTime = 0;

// MAPA
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

// GRÁFICO
const ctx = document.getElementById('attackChart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: '#00ff9f',
            borderWidth: 2,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { ticks: { color: '#00ff9f' } },
            y: { ticks: { color: '#00ff9f' } }
        }
    }
});

// CONTROLES
function setFilter(f) {
    currentFilter = f;
}

function simulateAttack() {
    for (let i = 0; i < 20; i++) {
        setTimeout(generateLog, i * 100);
    }
}

// ALERTA CRÍTICO
function triggerCritical() {
    const now = Date.now();

    if (now - lastAlertTime < 3000) return;

    lastAlertTime = now;

    alertScreen.textContent = "⚠ SYSTEM UNDER ATTACK ⚠";
    alertScreen.style.opacity = 1;

    setTimeout(() => {
        alertScreen.style.opacity = 0;
    }, 1000);
}

// GERAR LOG
function generateLog() {

    const ip = `${r(1,255)}.${r(1,255)}.${r(1,255)}.${r(1,255)}`;

    const risks = ["LOW", "LOW", "MEDIUM", "HIGH"];
    const risk = risks[r(0, risks.length - 1)];

    // FILTRO
    if (currentFilter !== "ALL" && currentFilter !== risk) return;

    const msg = `[${new Date().toLocaleTimeString()}] Attack from ${ip} | ${risk}`;

    const p = document.createElement("p");
    p.textContent = msg;
    p.classList.add(risk.toLowerCase());

    logs.appendChild(p);
    logs.scrollTop = logs.scrollHeight;

    count++;
    attackCount.textContent = count;

    threatLevel.textContent = risk;

    if (risk === "HIGH") {
        triggerCritical();
    }

    // MAPA
    const lat = Math.random() * 140 - 70;
    const lng = Math.random() * 360 - 180;

    const circle = L.circle([lat, lng], {
        color: risk === "HIGH" ? "red" : risk === "MEDIUM" ? "yellow" : "green",
        radius: 300000
    }).addTo(map);

    setTimeout(() => {
        map.removeLayer(circle);
    }, 4000);

    // GRÁFICO
    chart.data.labels.push("");
    chart.data.datasets[0].data.push(count);

    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update();
}

// RANDOM
function r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// PARTÍCULAS
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 1
    });
}

function animateParticles() {
    ctx2.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0;

        ctx2.fillStyle = "#00ff9f";
        ctx2.fillRect(p.x, p.y, 2, 2);
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// LOOP PRINCIPAL
setInterval(generateLog, 1000);