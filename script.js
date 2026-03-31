const logs = document.getElementById("logs");
const threatLevel = document.getElementById("threatLevel");
const attackCount = document.getElementById("attackCount");

let count = 0;
let attackData = [];

// SOM DE ALERTA
const alertSound = new Audio("https://www.soundjay.com/button/beep-07.wav");

// CONFIG GRÁFICO
const ctx = document.getElementById('attackChart').getContext('2d');

const attackChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Attacks',
            data: [],
            borderColor: '#00ff00',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { ticks: { color: '#00ff00' } },
            y: { ticks: { color: '#00ff00' } }
        }
    }
});

function generateLog() {
    const ip = `${random(1,255)}.${random(1,255)}.${random(1,255)}.${random(1,255)}`;
    const risks = ["LOW", "MEDIUM", "HIGH"];
    const risk = risks[random(0,2)];

    const logText = `[${new Date().toLocaleTimeString()}] Intrusion detected from ${ip} | Risk: ${risk}`;

    const p = document.createElement("p");
    p.textContent = logText;
    p.classList.add(risk.toLowerCase());

    logs.appendChild(p);
    logs.scrollTop = logs.scrollHeight;

    count++;
    attackCount.textContent = count;

    updateThreat(risk);
    updateChart();
}

function updateThreat(risk) {
    threatLevel.textContent = risk;
    threatLevel.classList.remove("low", "medium", "high", "alert");

    if (risk === "LOW") {
        threatLevel.classList.add("low");
    } else if (risk === "MEDIUM") {
        threatLevel.classList.add("medium");
    } else {
        threatLevel.classList.add("high", "alert");
        alertSound.play(); // 🔊 toca som
    }
}

function updateChart() {
    const time = new Date().toLocaleTimeString();

    attackChart.data.labels.push(time);
    attackChart.data.datasets[0].data.push(count);

    if (attackChart.data.labels.length > 10) {
        attackChart.data.labels.shift();
        attackChart.data.datasets[0].data.shift();
    }

    attackChart.update();
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(generateLog, 800);