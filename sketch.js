
let xspacing = 10; // Distance between each horizontal location
const waveLenPx = 300; // wave len in pixels 

let w = waveLenPx; // Width of entire wave
let amplitude = 150.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let periods = 2;

let noiseVal;
let angularSpeed = 0.1; // speed of wave

let modFreq1;
let modFreq2;
let amp1;
let amp2;

const vals = [];


const oscImg = 'osc2.png'
let img;
const mapImgPath = 'map.png'
let imgMap;
const planeImgPath = 'plane.png'
let imgPlane;

function preload() {
  img = loadImage(oscImg);
  imgMap = loadImage(mapImgPath);
  imgPlane = loadImage(planeImgPath);
}

function setup() {
  createCanvas(800, 800);
  
  imgMap.loadPixels();
}

const renderOscilloscope = () => {
  image(img, -45, -262);
  fill(30);
  rect(20, 40, 505, 300);
}

const renderScreen = () => {
  let modFreq = map(mouseY, height, 0, 0, 1);
  let modFreq2 = map(mouseX, height, 0, 0, 1);
  // console.log(modFreq);

  const vals = calcWave(sin, modFreq, amp1);
  const valsCos = calcWave(cos, modFreq2, amp2);
  renderWave(vals, 8);
  renderWave(valsCos, 8);
  push()
  translate(-300,0)
  renderWaveParametric(vals, valsCos, 8);  
  pop()
  // renderWaveParametric(vals, valsCos);  
}


const renderTarget = () => {
  let x = map(
    noise(frameCount * 0.0005), 0, 1, 100, 1000
  );
  let y = map(
    noise(frameCount * 0.0004), 0, 1, 100, 600
  );
  
  
//   let modFreq = map(mouseY, height, 0, 0, 1);
//   let modFreq2 = map(mouseX, height, 0, 0, 1);
//   // console.log(modFreq);

//   const vals = calcWave(sin, modFreq, amp1);
//   const valsCos = calcWave(cos, modFreq2, amp2);

//   push()
//   translate(x - width / 8, y - height / 8)
//   scale(0.25)  
//   pop()
  
  fill(255)
  noStroke()
  
  
  
  imgPlane.resize(50, 0);
  image(imgPlane, x -25, y - 25);

  // ellipse(x, y, 10, 10);
  return [round(x),y]
}

function draw() {
  noiseVal = map(noise(frameCount / 100),0, 1, -50, 50);
  
  background(0)
  push()
  scale(0.70)
  image(imgMap, 90, 90);
  pop()
  
  let tarVals = renderTarget();
  // console.log(tarVals[0])
  // console.log(imgMap.pixels[4 * tarVals[0]])
  let resVal = imgMap.pixels[4 * tarVals[0]];
  let resVal2 = imgMap.pixels[2 * tarVals[0]];  
  amp1 = map(resVal, 0, 255, 10, 300);
  amp2 = resVal2;
  // amp2 = map(resVal2, 0, 255, 10, 300);
  // console.log(amp1, amp2)
  // angularSpeed = map(resVal2, 0, 255, 0.001, 0.1)
  
  push()
  translate(width * 0.665, 60 )
  scale(0.5)
  renderOscilloscope()
  pop()

  push()
  translate(width * 0.7, 70 )
  scale(0.2)
  renderScreen()
  pop()
  

  
  // makie it blink  
  if(noise(round(frameCount / 5)) < 0.2) {
    return
  }
    


}

function calcWave(func, freq, amplitude) {
  // Increment theta (try different values for
  // 'angular velocity' here)
  theta = frameCount * angularSpeed;
  const dx = (periods * PI / period) * xspacing; // Value for incrementing x
  const vals = new Array(floor(w * 3 / xspacing));

  // For every x value, calculate a y value with sine function
  let x = theta;
  for (let i = 0; i < vals.length; i++) {
    vals[i] = 
      func(freq * x) * amplitude +
      map(noise(frameCount/1000, i), 0,1,-noiseVal,noiseVal) ;
    x += dx;
  }
  
  return vals;
}

function renderWave(values, size=4) {
  noStroke();
  fill(255);
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 0; x < values.length; x++) {
    ellipse(x * xspacing, height / 2 + values[x], size, size);
  }
}


const renderWaveParametric = (x, y, dotSize=6) => {
  noStroke();
  fill('#01AFA6');
  // A simple way to draw the wave with an ellipse at each location
  for (let i = 0; i < x.length; i++) {
    ellipse(width / 2 + x[i], height / 2 + y[i], dotSize, dotSize);
  }
}
