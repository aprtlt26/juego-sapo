const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const muteBtn = document.getElementById('muteBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const jumpBtn = document.getElementById('jumpBtn');
const tongueBtn = document.getElementById('tongueBtn');
let gameStarted = false;
let audioMuted = false;
let gameAudio;  // Variable para manejar el audio del juego
let collisionAudio = new Audio('take.mp3'); // Cargar el sonido de colisión

const frog = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 20,
    speed: 40,
    jumping: false,
    tongueOut: false,
    tongueLength: 60
};

let pizzas = [];
let clouds = [];
let score = 0;
const pizzaSpeed = 2;
const cloudSpeed = 0.5;
const pizzaFrequency = 60;
let frameCount = 0;

const groundY = frog.y;
const jumpY = groundY - 100;

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    if (!gameStarted) return;

    if (e.key === 'ArrowLeft' && frog.x > 0) {
        frog.x -= frog.speed;
    } else if (e.key === 'ArrowRight' && frog.x < canvas.width - frog.width) {
        frog.x += frog.speed;
    } else if (e.key === 'ArrowUp' && !frog.jumping) {
        frog.jumping = true;
        frog.y = jumpY;
        setTimeout(() => {
            frog.y = groundY;
            frog.jumping = false;
        }, 100);
    } else if (e.key === ' ') {
        frog.tongueOut = true;
        setTimeout(() => {
            frog.tongueOut = false;
        }, 200);
    }
}

function drawFrog() {
    ctx.fillStyle = '#00FF00';
    ctx.font = "15px Arial";
    ctx.fillText(" @..@ ", frog.x - 10, frog.y);
    ctx.fillText("(( ---- ))", frog.x - 10, frog.y + 15);
    ctx.fillText("((           ))", frog.x - 18, frog.y + 35);
    ctx.fillText("^^^^ ~~ ^^^^", frog.x - 25, frog.y + 55);

    if (frog.tongueOut) {
        ctx.fillStyle = 'red';
        ctx.fillRect(frog.x + 11, frog.y - frog.tongueLength, 6, frog.tongueLength);
    }
}

function drawPizza(x, y) {
    ctx.fillStyle = 'yellow';
    ctx.fillText("🍕🍕🍕", x - 25, y + 20);
    ctx.fillText(" 🍕🍕", x - 25, y + 35);
}

function drawCloud(x, y) {
    ctx.fillStyle = 'white';
    ctx.fillText("☁☁☁", x, y);
    ctx.fillText("☁☁☁☁☁☁", x - 20, y + 10);
    ctx.fillText(" ☁☁☁☁ ", x - 10, y + 20);
}

function updatePizzas() {
    if (frameCount % pizzaFrequency === 0) {
        const x = Math.random() * (canvas.width - 30) + 10;
        pizzas.push({ x: x, y: 0 });
    }

    pizzas = pizzas.map(pizza => {
        pizza.y += pizzaSpeed;
        return pizza;
    }).filter(pizza => pizza.y < canvas.height);

    pizzas.forEach(pizza => {
        drawPizza(pizza.x, pizza.y);
        if (gameStarted) {  // Verificar si el juego ha comenzado antes de manejar colisiones
            if (
                (pizza.y + 20 > frog.y && pizza.y < frog.y + frog.height && pizza.x + 50 > frog.x && pizza.x < frog.x + frog.width) ||
                (frog.tongueOut && pizza.y + 20 > frog.y - frog.tongueLength && pizza.x + 50 > frog.x + 20 && pizza.x < frog.x + 25)
            ) {
                score += 1;
                pizzas = pizzas.filter(p => p !== pizza);
                document.getElementById('score').innerText = score;
                if (!audioMuted) {
                    collisionAudio.play();  // Reproducir el sonido de colisión
                }
            }
        }
    });
}

function updateClouds() {
    if (frameCount % 200 === 0) {
        const x = -100;
        const y = Math.random() * 100;
        clouds.push({ x: x, y: y });
    }

    clouds = clouds.map(cloud => {
        cloud.x += cloudSpeed;
        return cloud;
    }).filter(cloud => cloud.x < canvas.width);

    clouds.forEach(cloud => drawCloud(cloud.x, cloud.y));
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateClouds();
    drawFrog();
    updatePizzas();
    frameCount++;
    requestAnimationFrame(gameLoop);
}

startBtn.addEventListener('click', () => {
    gameStarted = true;
    startBtn.style.display = 'none';
    
    gameAudio = new Audio('musicjuego.wav');
    gameAudio.loop = true;
    if (!audioMuted) {
        gameAudio.play();
    }
});

muteBtn.addEventListener('click', () => {
    audioMuted = !audioMuted;
    muteBtn.innerText = audioMuted ? '🔊' : '🔇';
    if (audioMuted) {
        gameAudio.pause();
    } else {
        gameAudio.play();
    }
});

leftBtn.addEventListener('click', () => {
    if (frog.x > 0) {
        frog.x -= frog.speed;
    }
});

rightBtn.addEventListener('click', () => {
    if (frog.x < canvas.width - frog.width) {
        frog.x += frog.speed;
    }
});

jumpBtn.addEventListener('click', () => {
    if (!frog.jumping) {
        frog.jumping = true;
        frog.y = jumpY;
        setTimeout(() => {
            frog.y = groundY;
            frog.jumping = false;
        }, 100);
    }
});

tongueBtn.addEventListener('click', () => {
    frog.tongueOut = true;
    setTimeout(() => {
        frog.tongueOut = false;
    }, 200);
});

gameLoop();

