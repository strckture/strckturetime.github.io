let sections = [];
let currentCol ;

let hue = 0;
let sat = 100;
let bright = 100;

var loading = true;
let lastAmplitude = 0;
let threshold = 1;

function preload() {
	sound = loadSound('assets/broken.mp3', soundLoaded);
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function soundLoaded(soundloaded){
	sound = soundloaded;
	loading = false;
}

function setup() {
	let cnv = createCanvas(windowWidth,windowHeight);
	colorMode(HSB,100,100,100,1);

	currentCol  = color(random(50), sat, 100,0.8);

	cnv.mouseClicked(togglePlay);

	amplitude = new p5.Amplitude();
}

function draw() {

	background(currentCol);

	let level = amplitude.getLevel();
	let levelsize = map(level, 0, 1, 0, 100);

	if (abs(levelsize - lastAmplitude) > threshold) {
		// Update the last amplitude if the change is significant
		lastAmplitude = levelsize;
		// console.log("New amplitude level:", levelsize); 
		if (levelsize > 52){
				yoink();
		}
	}

	for (let a = sections.length - 1; a >= 0; a--) {
		sections[a].dessine();
	}

	let newsections = [];
	for (let a = 0; a < sections.length; a++) {
		if (!sections[a].tokill) {
		newsections.push(sections[a]);
		}
	}
	sections = newsections;
}


function yoink() {
	let center = [random(windowWidth), random(windowHeight)];
	let p1 = [0, 0];
	let p2 = [width, 0];
	let p3 = [width, height];
	let p4 = [0, height];

	hue = random(100);
	sat = random(50,100);
	bright = random(100);

	cut(10, p1, p2, p3, p4, center, currentCol );
	currentCol  = color(hue, sat, bright,0.8);
}

function cut(fois, a, b, c, d, center, coul) {
	let t1 = random(0.1, 0.9);
	let t2 = random(0.1, 0.9);
	let p1 = [
		a[0] + (b[0] - a[0]) * t1,
		a[1] + (b[1] - a[1]) * t1
	];
	let p2 = [
		d[0] + (c[0] - d[0]) * t2,
		d[1] + (c[1] - d[1]) * t2
	];
	fois--;
	if (fois > 0) {
		cut(fois, p1, p2, d, a, center, coul);
		cut(fois, b, c, p2, p1, center, coul);
	} else {
		sections.push(new Section(a, b, c, d, center, coul));
	}
}

class Section {
	constructor(_a, _b, _c, _d, center, coul) {
		this.vx = 0;
		this.vy = 0;
		this.an = 0;
		this.van = 0;
		this.pos = [0, 0];
		this.tokill = false;
		this.coords = [];
		this.col = coul;

		let ang = random(TWO_PI);
		this.an = 0;
		let vitz = random(1, 20);
		this.pos[0] = (_a[0] + _b[0] + _c[0] + _d[0]) / 4;
		this.pos[1] = (_a[1] + _b[1] + _c[1] + _d[1]) / 4;
		let aaan = atan2(this.pos[1] - center[1], this.pos[0] - center[0]);
		aaan += radians(random(-5, 5));
		this.vx = cos(aaan) * vitz;
		this.vy = sin(aaan) * vitz;
		this.van = radians(random(-10, 10));
		this.coords = [
		new Coord(this.pos[0], this.pos[1], _a[0], _a[1]),
		new Coord(this.pos[0], this.pos[1], _b[0], _b[1]),
		new Coord(this.pos[0], this.pos[1], _c[0], _c[1]),
		new Coord(this.pos[0], this.pos[1], _d[0], _d[1])
		];
	}

	dessine() {
		if (!this.tokill) {
		this.an += this.van;
		this.vx *= 1.035;
		this.vy *= 1.0351;
		this.vy += 0.01;
		this.pos[0] += this.vx;
		this.pos[1] += this.vy;
		fill(this.col);

		 // Calculate the brightness of the fill color
		 let colBrightness = brightness(this.col);
        
		 // Set the stroke color based on the brightness
		 if (colBrightness < 50) {
			 stroke(100); // White stroke
		 } else {
			 stroke(0); // Black stroke
		 }

		beginShape();
		let a = this.coords[0].affiche(this.an);
		vertex(this.pos[0] + a[0], this.pos[1] + a[1]);
		let b = this.coords[1].affiche(this.an);
		vertex(this.pos[0] + b[0], this.pos[1] + b[1]);
		let c = this.coords[2].affiche(this.an);
		vertex(this.pos[0] + c[0], this.pos[1] + c[1]);
		let d = this.coords[3].affiche(this.an);
		vertex(this.pos[0] + d[0], this.pos[1] + d[1]);
		endShape(CLOSE);

		if (this.vy > height + 30 || this.vy < -30 || this.vx < -30 || this.vx > width + 30) {
			this.tokill = true;
		}
		}
	}
}

class Coord {
	constructor(cx, cy, _x, _y) {
		this.an = atan2(_y - cy, _x - cx);
		this.ray = dist(cx, cy, _x, _y);
	}

  affiche(_an) {
		_an += this.an;
		let toreturn = [0, 0];
		toreturn[0] = cos(_an) * this.ray;
		toreturn[1] = sin(_an) * this.ray;
		return toreturn;
	}
}

function togglePlay() {
    if (sound.isPlaying() ){
		document.getElementById('loading-hint').style.display = 'block';
        sound.pause();
    } else {
		document.getElementById('loading-hint').style.display = 'none';
        sound.loop();
        amplitude = new p5.Amplitude();
        amplitude.setInput(sound);
    }
  }