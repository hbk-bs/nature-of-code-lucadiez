// Simulation: Wattschnecken kriechen mit Spuren, die nach 10 Sekunden komplett verschwinden

let snails = [];
let eggs = [];
let trailPoints = [];
let maxAge = 60000; // 10 Sekunden in Millisekunden
let eggTime = 10000; // 10 Sekunden für Ei-Entwicklung

function setup() {
  createCanvas(500, 500);
  for (let i = 0; i < 100; i++) {
    snails.push(new Snail(random(width), random(height)));
  }
  background(240);
}

function draw() {
  background(240);

  // Überprüfe Kollisionen zwischen Schnecken
  for (let i = 0; i < snails.length; i++) {
    for (let j = i + 1; j < snails.length; j++) {
      let d = dist(snails[i].x, snails[i].y, snails[j].x, snails[j].y);
      if (d < 5) { // Wenn zwei Schnecken sich nahe genug sind
        let newEggX = (snails[i].x + snails[j].x) / 2;
        let newEggY = (snails[i].y + snails[j].y) / 2;
        
        // Prüfe ob bereits ein Ei in der Nähe ist
        let canLayEgg = true;
        for (let egg of eggs) {
          let eggDist = dist(egg.x, egg.y, newEggX, newEggY);
          if (eggDist < 10) { // Mindestabstand zwischen Eiern
            canLayEgg = false;
            break;
          }
        }
        
        // Nur wenn kein Ei in der Nähe ist, lege ein neues
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

  // Überprüfe Eier und lasse neue Schnecken schlüpfen
  for (let i = eggs.length - 1; i >= 0; i--) {
    let egg = eggs[i];
    if (millis() - egg.timestamp > eggTime) {
      snails.push(new Snail(egg.x, egg.y));
      eggs.splice(i, 1);
    } else {
      // Zeichne das Ei
      fill(200, 150, 150);
      noStroke();
      ellipse(egg.x, egg.y, 4, 4);
    }
  }

  // Bewegung und neue Spuren speichern
  for (let snail of snails) {
    snail.move();
    trailPoints.push({ 
      x: snail.x, 
      y: snail.y, 
      age: 0,
      timestamp: millis() // Aktuelle Zeit speichern
    });
  }

  // Spuren aktualisieren und zeichnen
  for (let i = trailPoints.length - 1; i >= 0; i--) {
    let p = trailPoints[i];
    let currentAge = millis() - p.timestamp;
    
    if (currentAge > maxAge) {
      trailPoints.splice(i, 1);
    } else {
      let alpha = map(currentAge, 0, maxAge, 255, 0);
      stroke(0, alpha);
      strokeWeight(1);
      point(p.x, p.y);
    }
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
  }

  move() {
    this.angle += random(-0.1, 0.1);
    let stepSize = 0.2;
    this.x += cos(this.angle) * stepSize;
    this.y += sin(this.angle) * stepSize;
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, 3, 3);
  }
}
