// Simulation: Wattschnecken kriechen mit Spuren, Eiablage und Limitierung auf max. 50 Schnecken

let snails = [];
let eggs = [];
let trailPoints = [];
let eggTime = 10000; // 10 Sekunden für Ei-Entwicklung
let maxSnails = 50;

function setup() {
  createCanvas(500, 500);
  for (let i = 0; i < 20; i++) {
    snails.push(new Snail(
      random(5, width - 5), 
      random(5, height - 5)
    ));
  }
  background(240);
}

function draw() {
  background(240);

  // Bewegung und neue Spuren speichern
  for (let snail of snails) {
    snail.move();
    // snail display
    trailPoints.push({ 
      x: snail.x, 
      y: snail.y
    });
  }

  // Optimierte Kollisionserkennung (nur alle 10 Frames)
  if (frameCount % 10 === 0 && snails.length < maxSnails) {
    for (let i = 0; i < snails.length; i++) {
      for (let j = i + 1; j < snails.length; j++) {
        if (i === j) {
          //same snail
        } else {
          // all others
        }
        let d = dist(snails[i].x, snails[i].y, snails[j].x, snails[j].y);
        if (d < 5) {
          let newEggX = (snails[i].x + snails[j].x) / 2;
          let newEggY = (snails[i].y + snails[j].y) / 2;

          let canLayEgg = true;
          for (let egg of eggs) {
            let eggDist = dist(egg.x, egg.y, newEggX, newEggY);
            if (eggDist < 10) {
              canLayEgg = false;
              break;
            }
          }

          if (canLayEgg) {
            eggs.push({
              x: newEggX,
              y: newEggY,
              timestamp: millis()
            });
          }
        }
      }
    }
  }

  // Eier prüfen und ggf. Schnecken erzeugen
  for (let i = eggs.length - 1; i >= 0; i--) {
    let egg = eggs[i];
    if (millis() - egg.timestamp > eggTime) {
      if (snails.length < maxSnails) {
        snails.push(new Snail(egg.x, egg.y));
      }
      eggs.splice(i, 1);
    } else {
      fill(200, 150, 150);
      noStroke();
      ellipse(egg.x, egg.y, 4, 4);
    }
  }

  // Spuren zeichnen
  for (let p of trailPoints) {
    stroke(0, 50);
    strokeWeight(0.5);
    point(p.x, p.y);
  }

  // Schnecken zeichnen
  for (let snail of snails) {
    snail.display();
  }
}

class Snail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI);
    this.canLayEgg = true;
  }

  move() {
    this.angle += random(-0.1, 0.1);
    let stepSize = 0.2;
    this.x += cos(this.angle) * stepSize;
    this.y += sin(this.angle) * stepSize;

    if (this.x < 5) {
      this.x = 5;
      this.angle = random(-HALF_PI, HALF_PI);
    } else if (this.x > width - 5) {
      this.x = width - 5;
      this.angle = random(HALF_PI, PI + HALF_PI);
    }

    if (this.y < 5) {
      this.y = 5;
      this.angle = random(0, PI);
    } else if (this.y > height - 5) {
      this.y = height - 5;
      this.angle = random(PI, TWO_PI);
    }
  }

  display() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, 5, 5);
  }
}
