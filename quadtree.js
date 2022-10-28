class Point {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
  }
}
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }
  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
  show() {
    stroke(0, 200, 0);
    rectMode(CENTER);
    rect(this.x, this.y, this.h / 2, this.w / 2);
  }
}
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }

  contains(point) {
    // check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return d <= this.rSquared;
  }

  intersects(range) {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    // radius of the circle
    let r = this.r;

    let w = range.w / 2;
    let h = range.h / 2;

    let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

    // no intersection
    if (xDist > r + w || yDist > r + h) return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h) return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}
class Quadtree {
  constructor(boundery, n) {
    this.boundery = boundery;
    this.capacity = n;
    this.points = [];
    this.divided = false;
  }
  insert(point) {
    if (!this.boundery.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }
  }
  subdivide() {
    let x = this.boundery.x;
    let y = this.boundery.y;
    let w = this.boundery.w;
    let h = this.boundery.h;

    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new Quadtree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new Quadtree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new Quadtree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new Quadtree(sw, this.capacity);
    this.divided = true;
  }
  show() {
    stroke(200);
    noFill();
    rectMode(CENTER);
    rect(
      this.boundery.x,
      this.boundery.y,
      this.boundery.w * 2,
      this.boundery.h * 2
    );

    if (this.divided) {
      this.northwest.show();
      this.northeast.show();
      this.southwest.show();
      this.southeast.show();
    }
    for (let p of this.points) {
      strokeWeight(4);
      point(p.x, p.y);
    }
  }

  query(range, found) {
    if (!this.boundery.intersects(range)) {
      return;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
    }
  }
}
