const Point2D = function(x, y) {
  this.x = x
  this.y = y
}
const Point3D = function(x, y, z) {
  this.x = x
  this.y = y
  this.z = z
}

const Cube = function(x, y, z, size) {
  
  Point3D.call(this, x, y, z);

  size *= 0.5;

  this.vertices = [
    new Point3D(x - size, y - size, z - size),
    new Point3D(x + size, y - size, z - size),
    new Point3D(x + size, y + size, z - size),
    new Point3D(x - size, y + size, z - size),
    new Point3D(x - size, y - size, z + size),
    new Point3D(x + size, y - size, z + size),
    new Point3D(x + size, y + size, z + size),
    new Point3D(x - size, y + size, z + size)
  ];

  this.faces = [
    [0, 1, 2, 3],
    [0, 4, 5, 1],
    [1, 5, 6, 2],
    [3, 2, 6, 7],
    [0, 3, 7, 4],
    [4, 7, 6, 5]
  ]
}

Cube.prototype = {
  rotateX: function(radian) {
    const cosine = Math.cos(radian);
    const sine = Math.sin(radian);

    for (let i = this.vertices.length - 1; i > -1; i--) {
      let p = this.vertices[i];

      let y = (p.y - this.y) * cosine - (p.z - this.z) * sine;
      let z = (p.y - this.y) * sine + (p.z - this.z) * cosine;

      p.y = y + this.y;
      p.z = z + this.z;
    }
  },
  rotateY: function(radian) {
    const cosine = Math.cos(radian);
    const sine = Math.sin(radian);

    for (let i = this.vertices.length - 1; i > -1; i--) {
      let p = this.vertices[i];

      let x = (p.z - this.z) * sine + (p.x - this.x) * cosine;
      let z = (p.z - this.z) * cosine - (p.x - this.x) * sine;

      p.x = x + this.x;
      p.z = z + this.z;
    }
  }
}

const ctx = document.querySelector('canvas').getContext('2d');
const pointer = new Point2D(0, 0)
const cube = new Cube(0, 0, 400, 200);

let height = document.documentElement.clientHeight;
let width = document.documentElement.clientWidth;

const project = (points3d, width, height) => {

  const points2d = new Array(points3d.length);

  const focal_length = 200;

  for (let i = points3d.length - 1; i > -1; i--) {
    let p = points3d[i];

    let x = p.x * (focal_length / p.z) + width * 0.5;
    let y = p.y * (focal_length / p.z) + height * 0.5;

    points2d[i] = new Point2D(x, y);
  }

  return points2d;
}

const loop = () => {

  window.requestAnimationFrame(loop);

  height = document.documentElement.clientHeight;
  width = document.documentElement.clientWidth;

  ctx.canvas.height = height;
  ctx.canvas.width = width;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#008';

  cube.rotateX(pointer.y * .0001);
  cube.rotateY(-pointer.x * .0001);

  ctx.fillStyle = '#08f';
  img = new Image();
  img.src = './concrete.jpeg';
  ctx.fillStyle = img;

  const vertices = project(cube.vertices, width, height);

  for (let i = cube.faces.length - 1; i > -1; i--) {
    
    let face = cube.faces[i];

    let p1 = cube.vertices[face[0]];
    let p2 = cube.vertices[face[1]];
    let p3 = cube.vertices[face[2]];

    let v1 = new Point3D(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
    let v2 = new Point3D(p3.x - p1.x, p3.y - p1.y, p3.z - p1.z);

    let n = new Point3D(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);

    if (-p1.x * n.x + -p1.y * n.y + -p1.z * n.z <= 0) {
      ctx.beginPath();
      ctx.moveTo(vertices[face[0]].x, vertices[face[0]].y);
      ctx.lineTo(vertices[face[1]].x, vertices[face[1]].y);
      ctx.lineTo(vertices[face[2]].x, vertices[face[2]].y);
      ctx.lineTo(vertices[face[3]].x, vertices[face[3]].y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }
}

loop();
console.log(ctx)

window.addEventListener('click', e => {
  pointer.x = e.pageX - width * 0.5;
  pointer.y = e.pageY - height * 0.5;
})