let mic;
let rings = [];
let maxOffset = 10;
let frameDelay = 10;
let ringShrink = 0.998;

function setup() {
  createCanvas(600, 600);
  angleMode(RADIANS);
  mic = new p5.AudioIn();
  mic.start();
  background(0);
}

function draw() {
  background(0);

  // Ursprung der Zeichnung
  translate(width / 2, height / 2);

  // Lautstärke = Störfaktor
  let level = mic.getLevel();
  console.log(level);
let noiseFactor = map(level, 0, 0.05, 0, maxOffset);

  if (frameCount % frameDelay === 0) {
    let newRing = [];
    let baseRadius = 100;

    // Leichter Versatz des Mittelpunktes (pro Ring)
    let offsetX = random(-10, 10);
    let offsetY = random(-10, 10);

    for (let a = 0; a < TWO_PI; a += 0.1) {
      // Leichte Grundunregelmäßigkeit + noise bei Stille
      let baseWiggle = sin(a * 3 + frameCount * 0.01) * 3;
      let offset = noise(a * 2, frameCount * 0.005) * noiseFactor;
      let r = baseRadius + baseWiggle + offset;

      let x = r * cos(a) + offsetX;
      let y = r * sin(a) + offsetY;
      newRing.push({ x: x, y: y });
    }

    rings.push({ points: newRing, scale: 1 });
  }

  // Alle Ringe zeichnen und schrumpfen
  noFill();
  stroke(255);
  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    beginShape();
    for (let pt of ring.points) {
      vertex(pt.x * ring.scale, pt.y * ring.scale);
    }
    endShape(CLOSE);
    ring.scale *= ringShrink;
  }

  // Kleine Ringe entfernen
  rings = rings.filter(r => r.scale > 0.01);
}
