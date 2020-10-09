const container = {x: 0, y: 0, width: window.innerWidth, height: window.innerHeight};
let touching = [];
let changedTouches = [];
let start = 0;

/*
  INIT
*/
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

let type = 'WebGL';
if(!PIXI.utils.isWebGLSupported()){
  type = 'canvas';
}

PIXI.utils.sayHello(type);

let app = new PIXI.Application({
    width: 256,
    height: 256,
    antialias: true,
    transparent: true,
    resolution: 1,
  },
);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

/*
EVENTS
 */
window.addEventListener('touchstart', handleStart, false);
window.addEventListener('touchmove', handleMove, false);
window.addEventListener('touchend', handleEnd, false);
window.addEventListener('touchcancel', handleCancel, false);

const logEl = document.getElementById('log');
function handleStart(event) {
  event.preventDefault();
  console.log('handleStart', event.touches);
  touching = event.touches;
  changedTouches = event.changedTouches;
  logEl.innerHTML = event.touches.length === 17 ? 'WOW 17 \\o/' : `${event.touches.length}`;
}

function handleMove(event) {
  event.preventDefault();
  touching = event.touches;
  changedTouches = event.changedTouches;
}

function handleEnd(event) {
  event.preventDefault();
  console.log('handleEnd', event.touches);
  touching = event.touches;
  changedTouches = event.changedTouches;
  logEl.innerHTML = `${event.touches.length}`;
}

function handleCancel(event) {
  event.preventDefault();
  console.log('handleCancel', event.touches);
  touching = event.touches;
  changedTouches = event.changedTouches;
  logEl.innerHTML = `${event.touches.length}`;
}

/*
  GRAPHICS
*/
function randomNumber() {
  if (Math.random() > 0.5) return 1;
  return -1;
}

const circles = [];

for (let i = 0; i < 12; i++) {
  const circle = new PIXI.Graphics();
  circle.beginFill(0x9966FF);
  circle.drawRect(0, 0, 64, 64);
  circle.endFill();
  circle.x = window.innerWidth * (((i%3)+1)/4);
  circle.y = window.innerHeight * (((i%2)+1)/3);
  circle.pivot.set(32, 32);
  app.stage.addChild(circle);
  circles.push({ xmov: randomNumber(), ymov: randomNumber(), item: circle });
}

/*
  SETUP
*/
function setup() {
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  let frameX = touching.length === 2 ? -window.innerWidth * (1/4) : 100;
  let frameY = touching.length === 2 ? -window.innerHeight * (1/3) : 100;

  for (let i = 0; i < circles.length; i++) {
    if (circles[i].item.x + frameX < container.x) { circles[i].xmov = 1; } // Left
    if (circles[i].item.y + frameY < container.y) { circles[i].ymov = 1; } // Top
    if (circles[i].item.x - frameX > container.width) { circles[i].xmov = -1; } // Right
    if (circles[i].item.y - frameY > container.height) { circles[i].ymov = -1; } // Bottom

    if (touching.length === 0) {
      // Base position
      circles[i].item.x += circles[i].xmov * (i/2) + 1;
      circles[i].item.y += circles[i].ymov * (i/3) + 1;
    }

    if (touching.length === 1) {
      // Rotating position
      gsap.to(circles[i].item, { pixi: {
          x: changedTouches[0].clientX + Math.sin(start) * window.innerWidth / 4,
          y: changedTouches[0].clientY - Math.cos(start) * window.innerHeight / 4,
        }, duration: 2});
      circles[i].xmov = randomNumber();
      circles[i].ymov = randomNumber();
    }

    if (touching.length === 2) {
      // Contained position
      circles[i].item.x += circles[i].xmov * (i/2) + 1;
      circles[i].item.y += circles[i].ymov * (i/3) + 1;
    }

    if (touching.length >= 3) {
      // Fixed position
      gsap.to(circles[i].item, { pixi: {
        x: (window.innerWidth + i * 10) * (((i%6)+1)/8) + Math.sin(start) * 5 * i * randomNumber(),
        y: window.innerHeight * (((i%4)+1)/6) + Math.cos(start) * 5 * i * randomNumber(),
      }, duration: 2});
      circles[i].xmov = randomNumber();
      circles[i].ymov = randomNumber();
      // circles[i].item.rotation = start;
    }
  }

  start += 0.05;
}

setup();