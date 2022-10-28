class Bird {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector(0, 0);
    this.minspeed = speedslide.value();
    this.maxforce = maxforces.value();
  }
  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.minspeed);
    this.acceleration.mult(0);
    this.minspeed = speedslide.value();
    this.maxforce = maxforces.value();
  }

  flock(birds) {
    let allignment = this.align(birds);
    let cohesion = this.cohesion(birds);
    let separation = this.separation(birds);

    separation.mult(separations.value());
    cohesion.mult(cohesions.value());
    allignment.mult(aligns.value());
    this.acceleration.add(separation);
    this.acceleration.add(allignment);
    this.acceleration.add(cohesion);
  }

  align(birds) {
    let rad = 100;
    let tot = 0;
    let desired = createVector();
    for (let other of birds) {
      let bdist = dist(
        this.position.x,
        this.position.y,
        other.data.position.x,
        other.data.position.y
      );
      if (this != other.data && bdist < rad) {
        desired.add(other.data.velocity);
        tot++;
      }
    }
    if (tot > 0) {
      desired.div(tot);
      desired.setMag(this.minspeed);
      desired.sub(this.velocity);
      desired.limit(this.maxforce);
    }
    return desired;
  }

  cohesion(birds) {
    let rad = 100;
    let tot = 0;
    let desired = createVector();
    for (let other of birds) {
      let bdist = dist(
        this.position.x,
        this.position.y,
        other.data.position.x,
        other.data.position.y
      );
      if (this != other.data && bdist < rad) {
        desired.add(other.data.position);
        tot++;
      }
    }
    if (tot > 0) {
      desired.div(tot);
      desired.sub(this.position);
      desired.setMag(this.minspeed);
      desired.sub(this.velocity);
      desired.limit(this.maxforce);
    }
    return desired;
  }

  separation(birds) {
    let rad = 100;
    let tot = 0;
    let difference = createVector();
    let desired = createVector();
    for (let other of birds) {
      let bdist = dist(
        this.position.x,
        this.position.y,
        other.data.position.x,
        other.data.position.y
      );
      if (this != other.data && bdist < rad) {
        difference = p5.Vector.sub(this.position, other.data.position);

        difference.div(bdist);
        desired.add(difference);
        tot++;
      }
    }
    if (tot > 0) {
      desired.div(tot);
      desired.setMag(this.minspeed);
      desired.sub(this.velocity);
      desired.limit(this.maxforce);
    }
    return desired;
  }
  show() {
    circle(this.position.x, this.position.y, 10);
    stroke(0);
    fill(0, 250);
  }
}
