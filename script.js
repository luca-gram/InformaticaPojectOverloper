var aantalLagen = 10;
var breedte = 90;
var hoogte;

class Raster {
  constructor(r, k) {
    this.aantalRijen = 12;
    this.aantalKolommen = 18;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  muisOpRand() {
    let kolom = floor(mouseX / this.celGrootte);
    let rij = floor(mouseY / this.celGrootte);

    let binnenCanvas = mouseX >= 0 && mouseX < canvas.width &&
                       mouseY >= 0 && mouseY < canvas.height;

    return binnenCanvas && (rij == 0 || rij == this.aantalRijen - 1 ||
                            kolom == 0 || kolom == this.aantalKolommen - 1);
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }

  achtergrondVeranderen() {
    let kolom = floor(mouseX / this.celGrootte);
    let rij = floor(mouseY / this.celGrootte);

    if (mouseX >= 0 && mouseX < canvas.width &&
        mouseY >= 0 && mouseY < canvas.height) {
      push();
      noStroke();
      fill('lightblue');
      rect(kolom * this.celGrootte, rij * this.celGrootte,
           this.celGrootte, this.celGrootte);
      pop();
    }
  }

  tekenRand() {
    push();
    noStroke();
    fill('blue');
    for (var rij = 0; rij < this.aantalRijen; rij++) {
      for (var kolom = 0; kolom < this.aantalKolommen; kolom++) {
        var isRand = rij == 0 || rij == this.aantalRijen - 1 ||
                     kolom == 0 || kolom == this.aantalKolommen - 1;
        if (isRand) {
          rect(kolom * this.celGrootte, rij * this.celGrootte,
               this.celGrootte, this.celGrootte);
        }
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.levens = 3;
  }

  verliesLevens() {
    this.levens--;
    this.x = 400;
    this.y = 300;
  }

  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    return this.x == vijand.x && this.y == vijand.y;
  }

  wordtGeraaktDoorRaket(raket) {
    var zelfdeKolom = this.x == raket.x;
    var overlaptHoogte = abs(this.y - raket.y) < raster.celGrootte;
    return zelfdeKolom && overlaptHoogte;
  }

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Raket {
  constructor(x, startSnelheid) {
    this.x = x;
    this.y = canvas.height - raster.celGrootte;
    this.snelheid = -startSnelheid;
    this.startSnelheid = startSnelheid;
    this.valversnelling = 15;
    this.sprite = null;
  }

  beweeg() {
    this.snelheid += this.valversnelling;
    this.y += this.snelheid;

    if (this.y < 0) {
      this.y = 0;
      this.snelheid = 0;
    }

    var onder = canvas.height - raster.celGrootte;
    if (this.y > onder) {
      this.y = onder;
      this.snelheid = -this.startSnelheid;
    }
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class PingPongBal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = raster.celGrootte;
    this.dy = raster.celGrootte;
    this.opgegeten = false;
    if (frameCount % 2 != 0) {
      return;
    }
  }

  beweeg() {
    if (this.opgegeten) {
      return;
    }

    var maxX = canvas.width - raster.celGrootte;
    var maxY = canvas.height - raster.celGrootte;

    if (this.x + this.dx < 0 || this.x + this.dx > maxX) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy < 0 || this.y + this.dy > maxY) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  toon() {
    if (this.opgegeten) {
      return;
    }
    push();
    stroke('grey');
    strokeWeight(2);
    fill('white');
    ellipse(this.x + raster.celGrootte / 2,
            this.y + raster.celGrootte / 2,
            raster.celGrootte * 0.6);
    pop();
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900, 600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(6, 9);
  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  // raketten: willekeurige kolom rechts van Eve (kolom 9 t/m 17)
  raket1 = new Raket(floor(random(9, 18)) * raster.celGrootte, 110);
  raket1.sprite = loadImage("images/sprites/raket.png");

  raket2 = new Raket(floor(random(9, 18)) * raster.celGrootte, 125);
  raket2.sprite = loadImage("images/sprites/raket.png");

  raket3 = new Raket(floor(random(9, 18)) * raster.celGrootte, 100);
  raket3.sprite = loadImage("images/sprites/raket.png");

  bal = new PingPongBal(5 * raster.celGrootte, 2 * raster.celGrootte);

  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600, 400);
  bob.stapGrootte = 1 * eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");

  cindy = new Vijand(500, 300);
  cindy.stapGrootte = 1 * eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Bob100px/Bob.png");
}

function AantalLevens() {
  push();
  fill('white');
  stroke('black');
  strokeWeight(3);
  textSize(30);
  textAlign(LEFT, TOP);
  text("levens: " + eve.levens, 10, 30);
  pop();
}

function tekenPiramide(n, x, y) {
  if (n > 0) {
    for (var nr = 0; nr < n; nr++) {
      rect(x + nr * breedte, y, breedte, hoogte);
    }

    tekenPiramide(
      n - 1,
      x + breedte / 2,
      y + hoogte
    );
  }
}

function tekenPiramideAchtergrond() {
  push();

  hoogte = breedte / 2;
  fill(255, 220, 0, 120);      // geel, doorzichtig
  stroke(200, 160, 0, 180);    // donkergele rand

  var x = (canvas.width - aantalLagen * breedte) / 2;
  var y = (canvas.height - aantalLagen * hoogte) / 2;

  translate(0, y);
  tekenPiramide(aantalLagen, x, 0);

  pop();
}

function eindScherm(gewonnen, verloren) {
  if (gewonnen) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!", 30, 300);
    noLoop();
  } else if (verloren) {
    background('red');
    fill('black');
    textAlign(CENTER, CENTER);
    text("Je hebt verloren!", width / 2, height / 2);
    noLoop();
  }
}

function draw() {
  if (raster.muisOpRand()) {
    background('orange');   // cursor op de blauwe rand: andere achtergrond
  } else {
    background(brug);
  }

  tekenPiramideAchtergrond();
  raster.achtergrondVeranderen();
  raster.teken();
  raster.tekenRand();

  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  raket1.beweeg();
  raket2.beweeg();
  raket3.beweeg();
  bal.beweeg();

  bal.toon();
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();
  raket1.toon();
  raket2.toon();
  raket3.toon();
  AantalLevens();

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy) ||
      eve.wordtGeraaktDoorRaket(raket1) || eve.wordtGeraaktDoorRaket(raket2) || eve.wordtGeraaktDoorRaket(raket3)) {
    eve.verliesLevens();
  }

  if (!bal.opgegeten && eve.wordtGeraakt(bal)) {
    bal.opgegeten = true;
    eve.levens++;
  }

  if (eve.gehaald) {
    eindScherm(true, false);
  } else if (eve.levens <= 0) {
    eindScherm(false, true);
  }
}