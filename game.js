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
    if (frog.colliding) {
        ctx.fillStyle = '#FFD700'; // Color dorado para la colisión
        setTimeout(() => {
            frog.colliding = false;
        }, 100); // El resplandor dura 100ms
    } else {
        ctx.fillStyle = '#00FF00';
    }
    ctx.font = "15px Arial";
    ctx.fillText(" @..@ ", frog.x - 10, frog.y - 15);
    ctx.fillText("(( ---- ))", frog.x - 10, frog.y + 5);
    ctx.fillText("((           ))", frog.x - 18, frog.y + 25);
    ctx.fillText("^^^^ ~~ ^^^^", frog.x - 25, frog.y + 45);

    if (frog.tongueOut) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(frog.x + 13, frog.y);
        ctx.lineTo(frog.x + 13, frog.y - frog.tongueLength);
        ctx.arc(frog.x + 16, frog.y - frog.tongueLength, 3, Math.PI, 0, true);
        ctx.closePath();
        ctx.fill();
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
        if (gameStarted) {  
            if (
                (pizza.y + 20 > frog.y && pizza.y < frog.y + frog.height && pizza.x + 50 > frog.x && pizza.x < frog.x + frog.width) ||
                (frog.tongueOut && pizza.y + 20 > frog.y - frog.tongueLength && pizza.x + 50 > frog.x + 20 && pizza.x < frog.x + 25)
            ) {
                score += 1;
                frog.colliding = true;
                pizzas = pizzas.filter(p => p !== pizza);
                document.getElementById('score').innerText = score;
                if (!audioMuted) {
                    collisionAudio.play();
                }
                if (score >= 1000) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#000';
                    ctx.font = '30px Arial';
                    ctx.fillText("¡Felicidades! Tienes 10% de descuento.", canvas.width / 2 - 200, canvas.height / 2 - 20);
                    ctx.font = '20px Arial';
                    ctx.fillText("Presiona 'Acomular' o 'Reclamar'", canvas.width / 2 - 150, canvas.height / 2 + 20);
                    gameStarted = false;
                    showDiscountOptions();
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

function showDiscountOptions() {
    const accumulateBtn = document.createElement('button');
    const claimBtn = document.createElement('button');

    accumulateBtn.innerText = 'Acomular';
    claimBtn.innerText = 'Reclamar';

    accumulateBtn.style.position = 'absolute';
    claimBtn.style.position = 'absolute';

    accumulateBtn.style.top = '70%';
    claimBtn.style.top = '70%';

    accumulateBtn.style.left = '35%';
    claimBtn.style.left = '55%';

    accumulateBtn.style.padding = '10px 20px';
    claimBtn.style.padding = '10px 20px';

    document.body.appendChild(accumulateBtn);
    document.body.appendChild(claimBtn);

    accumulateBtn.addEventListener('click', () => {
        saveHighScore(score);
        document.body.removeChild(accumulateBtn);
        document.body.removeChild(claimBtn);
        alert('Puntuación guardada para futuros descuentos.');
        resetGame();
    });

    claimBtn.addEventListener('click', () => {
        saveHighScore(score);
        document.body.removeChild(accumulateBtn);
        document.body.removeChild(claimBtn);
        alert('¡Descuento reclamado! Verifica tu correo.');
        resetGame();
    });
}




