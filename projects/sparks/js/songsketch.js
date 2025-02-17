let Shader;
const balls=[];
let spawn=[0,0], num=600;

var loading = true;

function windowResized() {
    resizeCanvas(windowWidth,windowHeight);
}

function preload(){
    Shader=getShader(this._renderer);
}

function soundLoaded(soundloaded){
	sound = soundloaded;
	loading = false;
}

function setup() {
    let cnv = createCanvas(windowWidth,windowHeight,WEBGL);
	cnv.position(0,0);
	cnv.style('z-index','-1');

	sound = loadSound('assets/delilah.mp3', soundLoaded);

	if (windowWidth <= 500) {
		num = 600;
	} else {
		num = 200;
	}

	cnv.mouseClicked(togglePlay);
    

	// AMP LOAD
    amplitude = new p5.Amplitude();

    background(25);
    pixelDensity(1);
    noStroke();

	spawn=[width/2,height/2];
}

function draw() {
	let data=[];

	// AMP LOAD
    let level = amplitude.getLevel();
	let levelsize = map(level, 0, 1, 0, 100);

	if (random()>0.8) {
		for (let i=0;i<num/10;i++) {
			if (balls.length<num) {
				let a=random(2*PI);
				let g=random();
				let b={
					x:width/2,
					y:height/2,
					vx:cos(a)*random(3.5,4.5),
					vy:sin(a)*random(3.5,4.5),
					rad:random(2,5)
				}
				balls.push(b);
			}
		}
	}

	//AMP
    if (frameCount%30<25 && levelsize >40) {spawn=[random(150,width-150),random(150,height-150)];}

    else { 
		
		for (let bl=0;bl<balls.length;bl++) {
			if (balls[bl].rad<0.2&&random()>0.8) {
				let a=random(2*PI);
				let g=random();
				let b={
                    x:spawn[0],
					y:spawn[1],
					vx:cos(a)*random(3.5,4.5),
					vy:sin(a)*random(3.5,4.5),

					// AMP LOAD
					rad: 0+ levelsize/15
				}
				balls[bl]=b;
			}
		}
	}
	for (let b of balls) {
		b.rad/=1.04;
		b.vy+=0.05;
		b.x+=b.vx;
		b.y+=b.vy;
		if (b.x<			 b.rad) {b.x=			 b.rad;b.vx*=-1;}
		if (b.x>width -b.rad) {b.x=width -b.rad;b.vx*=-1;}
		if (b.y<			 b.rad) {b.y=			 b.rad;b.vy*=-1;}
		if (b.y>height-b.rad) {b.y=height-b.rad;b.vy*=-1;}
		data.push(b.x,b.y,b.rad);
	}

    shader(Shader);
    Shader.setUniform("balls",data);
    rect(0,0,width,height);
}

function togglePlay() {
    if (sound.isPlaying() ){
        sound.pause();
    } else {
        sound.loop();
        amplitude = new p5.Amplitude();
        amplitude.setInput(sound);
    }
  }