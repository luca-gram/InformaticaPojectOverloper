var aantalLagen = 12;
var breedte = 90;
var hoogte;

class Raster {
  constructor(r,k) {
    this.aantalRijen = 12;
    this.aantalKolommen = 18;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }

achtergrondVeranderen() {
  let kolom = floor(mouseX / this.celGrootte);
  let rij = floor(mouseY / this.celGrootte);

  if (
    mouseX >= 0 &&
    mouseX < canvas.width &&
    mouseY >= 0 &&
    mouseY < canvas.height
  ) {
    push();
    noStroke();
    fill('lightblue');
    rect(
      kolom * this.celGrootte,
      rij * this.celGrootte,
      this.celGrootte,
      this.celGrootte
    );
    pop();
  }
}
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
    this.levens = 3
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

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);

  raster = new Raster(6,9);

  raster.berekenCelGrootte();

  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  cindy = new Vijand(500,300);
  cindy.stapGrootte = 1*eve.stapGrootte;
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
  fill('lightslategray');
  stroke('darkslategray');

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
    text("Je hebt gewonnen!",30,300);
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
  background(brug);
  tekenPiramideAchtergrond();
  raster.achtergrondVeranderen();
  raster.teken();
  push();
  noFill();
  stroke('blue');
  strokeWeight(4);
  rect(2, 2, width - 4, height - 4);
  pop();
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();
  AantalLevens();

  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy)) {
    eve.verliesLevens();
  }

  if (eve.gehaald) {
    eindScherm(true, false);
  } else if (eve.levens <= 0) {
    eindScherm(false, true);
  }
}