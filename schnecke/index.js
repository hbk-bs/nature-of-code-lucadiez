// Globale Variablen für die Simulation
let snails = [];          // Array für alle Schnecken
let eggs = [];            // Array für gelegte Eier
let trailPoints = [];     // Array für die Bewegungsspuren
let eggTime = 10000;      // Entwicklungszeit der Eier in Millisekunden
let maxSnails = 50;       // Maximale Anzahl von Schnecken

// Initialisierung der Simulation
function setup() {
  createCanvas(500, 500);
  
  // Erstelle Startpopulation von 20 Schnecken
  for (let i = 0; i < 20; i++) {
    snails.push(new Snail(
      random(5, width - 5), 
      random(5, height - 5)
    ));
  }
  background(240);
}

function draw() {
  background(230, 200, 170);

  // 1. Schneckenbewegung und Spurengenerierung
  for (let snail of snails) {
    snail.move();
    trailPoints.push({ 
      x: snail.x, 
      y: snail.y,
      timestamp: millis()
    });
  }

  // 2. Kollisionserkennung und Eiablage (nur alle 10 Frames)
  if (frameCount % 10 === 0 && snails.length < maxSnails) {
    checkSnailCollisions();
  }

  // 3. Ei-Management: Entwicklung und Schlüpfen
  updateEggs();

  // 4. Spuren-Management: Zeichnen und Alterung
  updateTrails();

  // 5. Schnecken zeichnen
  for (let snail of snails) {
    snail.display();
  }
}

// Prüft Kollisionen zwischen Schnecken und erzeugt ggf. Eier
function checkSnailCollisions() {
  for (let i = 0; i < snails.length; i++) {
    for (let j = i + 1; j < snails.length; j++) {
      let d = dist(snails[i].x, snails[i].y, snails[j].x, snails[j].y);
      if (d < 5) {
        tryLayEgg((snails[i].x + snails[j].x) / 2, 
                  (snails[i].y + snails[j].y) / 2);
      }
    }
  }
}

// Versucht ein Ei an gegebener Position zu legen
function tryLayEgg(x, y) {
  // Prüfe ob bereits ein Ei in der Nähe ist
  for (let egg of eggs) {
    if (dist(egg.x, egg.y, x, y) < 10) {
      return false;
    }
  }
  
  // Lege neues Ei
  eggs.push({
    x: x,
    y: y,
    timestamp: millis()
  });
  return true;
}

// Aktualisiert Status der Eier
function updateEggs() {
  for (let i = eggs.length - 1; i >= 0; i--) {
    let egg = eggs[i];
    if (millis() - egg.timestamp > eggTime) {
      if (snails.length < maxSnails) {
        snails.push(new Snail(egg.x, egg.y));
      }
      eggs.splice(i, 1);
    } else {
      // Ei zeichnen
      fill(200, 150, 150);
      noStroke();
      ellipse(egg.x, egg.y, 4, 4);
    }
  }
}

// Aktualisiert und zeichnet Bewegungsspuren
function updateTrails() {
  for (let i = trailPoints.length - 1; i >= 0; i--) {
    let p = trailPoints[i];
    if (millis() - p.timestamp > 20000) {
      trailPoints.splice(i, 1);  // Entferne alte Spuren
    } else {
      stroke(0, 50);
      strokeWeight(0.5);
      point(p.x, p.y);
    }
  }
}

// Schneckenklasse: Verwaltet Verhalten und Darstellung einer einzelnen Schnecke
class Snail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI);
  }

  // Bewegt die Schnecke und prüft Kollision mit Rändern
  move() {
    // Zufällige Richtungsänderung
    this.angle += random(-0.1, 0.1);
    
    // Bewegung in aktuelle Richtung
    let stepSize = 0.2;
    this.x += cos(this.angle) * stepSize;
    this.y += sin(this.angle) * stepSize;

    // Randkollision: Halte 5px Abstand und ändere Richtung
    if (this.x < 5) {
      this.x = 5;
      this.angle = random(-HALF_PI, HALF_PI);     // Nach rechts
    } else if (this.x > width - 5) {
      this.x = width - 5;
      this.angle = random(HALF_PI, PI + HALF_PI); // Nach links
    }

    if (this.y < 5) {
      this.y = 5;
      this.angle = random(0, PI);                 // Nach unten
    } else if (this.y > height - 5) {
      this.y = height - 5;
      this.angle = random(PI, TWO_PI);           // Nach oben
    }
  }

  // Zeichnet die Schnecke
  display() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, 5, 5);
  }
}
