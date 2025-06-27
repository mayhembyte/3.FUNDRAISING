///sketch.js - fundraising



/// 3. FUNDRAISING

let t = 0;
const maxCircles = 4;
const baseRadius = 60;
const pulseSpeed = 0.03; // velocidade do pulso da respiração

const totalDuration = 600;   // 10 segundos em frames (~60fps)
const growDuration = 90;     // fase de crescimento (1.5s)
const shrinkDuration = 90;   // fase de retração (1.5s)
const pulseDuration = totalDuration - growDuration - shrinkDuration; // 7s

let orbiters = [];

function setup() {
  createCanvas(500, 500);
  angleMode(RADIANS);
  noFill();
  strokeWeight(1.4);

  // Inicializa partículas orbitantes com propriedades aleatórias
  for (let i = 0; i < 5; i++) {
    orbiters.push({
      angle: random(TWO_PI),
      radius: random(100, 250),
      speed: random(0.003, 0.008),
      progress: 0, // progresso do surgimento (0 a 1)
    });
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  let cycleTime = t % totalDuration;

  // Reinicia progress das partículas a cada novo ciclo
  if (cycleTime === 0) {
    for (let orb of orbiters) {
      orb.progress = 0;
    }
  }

  drawPulsingPoint();

  if (cycleTime < growDuration) {
    let progress = cycleTime / growDuration;
    drawGrowingCircles(progress);
  } else if (cycleTime < growDuration + pulseDuration) {
    drawAnimatedCircles();
    let orbitProgress = (cycleTime - growDuration) / pulseDuration;
    drawOrbiters(true, orbitProgress);
  } else {
    let shrinkProgress = (cycleTime - growDuration - pulseDuration) / shrinkDuration;
    drawGrowingCircles(1 - shrinkProgress);
  }

  t++;
}
// Ponto central pulsante com glow
function drawPulsingPoint() {
  noStroke();
  let syncPulse = sin(t * pulseSpeed);
  let pulse = 100 + 100 * syncPulse;
  fill(255, pulse);
  ellipse(0, 0, 14);

  noFill();
  stroke(255, 40 + 40 * syncPulse);
  ellipse(0, 0, 40 + 10 * syncPulse);
}

// Desenha círculos crescendo/retraindo com opacidade proporcional
function drawGrowingCircles(progress) {
  noFill();
  for (let i = 1; i <= maxCircles; i++) {
    let targetRadius = baseRadius * i;
    let r = targetRadius * progress;
    stroke(255, map(i, 1, maxCircles, 220, 50) * progress);
    ellipse(0, 0, r * 2);
  }
}

// Desenha círculos pulsantes em movimento rotativo leve
function drawAnimatedCircles() {
  noFill();
  push();
  rotate(0.01 * sin(t * 0.01));
  let syncPulse = sin(t * pulseSpeed);
  for (let i = 1; i <= maxCircles; i++) {
    let offset = syncPulse * 8;
    let r = baseRadius * i + offset;
    stroke(255, map(i, 1, maxCircles, 220, 50));
    ellipse(0, 0, r * 2);
  }
  pop();
}

// Desenha partículas orbitantes com progressão de surgimento
function drawOrbiters(active, progress) {
  if (!active) return;
  for (let orb of orbiters) {
    orb.angle += orb.speed;

    // Animação de surgimento progressivo
    if (orb.progress < 1) {
      orb.progress = min(1, orb.progress + 0.01);
    }

    let px = cos(orb.angle) * orb.radius * orb.progress;
    let py = sin(orb.angle) * orb.radius * orb.progress;
    fill(255, 140 * orb.progress);
    noStroke();
    ellipse(px, py, 6);
  }
}

//// TEMPO TOTAL DA ANIMAÇÃO: 10s