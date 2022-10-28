let y = 300;
let w = 0;
const birds = [];
const found = [];
let height = 900;
let weidth = 900;
let aligns, cohesions, separations, speedslide, maxforces;
function setup() {
  createCanvas(weidth, height);
  background(102);
  aligns = createSlider(0, 5, 1, 0.1);
  cohesions = createSlider(0, 5, 1, 0.1);
  separations = createSlider(0, 5, 1, 0.1);
  speedslide = createSlider(0, 15, 5, 1);
  maxforces = createSlider(0, 0.6, 0.2, 0.01);

  for (let i = 0; i < y; i++) {
    let x = new Bird();
    birds.push(x);
  }
}

function draw() {
  background(102);

  let boundary = new Rectangle(450, 450, 900, 900);
  qt = new Quadtree(boundary, 4);
  for (let i = 0; i < y; i++) {
    let p = new Point(birds[i].position.x, birds[i].position.y, birds[i]);
    qt.insert(p);
  }

  for (let i = 0; i < y; i++) {
    //let range = new Rectangle(birds[i].x, 450, 900, 900);
    let range = new Circle(birds[i].position.x, birds[i].position.y, 20);
    //range.show();
    let found = [];
    qt.query(range, found);
    //console.log(i, " ", found);
    birds[i].edges();
    birds[i].flock(found);
    birds[i].update();
    birds[i].show();
  }
}
