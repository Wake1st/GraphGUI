const vertexOuterRadius = 60;
const vertexInnerRadius = 45;
const vertexDiameter = vertexOuterRadius + vertexInnerRadius;
const vertexEdgeThickness = vertexOuterRadius - vertexInnerRadius;

const edgeThickness = 10;

const adjustmentMagnitude = 0.1;

let vertices = [];
let edges = [];

let headVertexDrawing;
let tailVertexDrawing;

let isDrawing = false;
let isDragging = false;

let draggingVertex;
let dragVertexInd;


function setup() {
  createCanvas(780, 640);
}

function draw() {
  background('rgba(40,250,240,0.4)');
  
  //  adjust posision if overlapping
  vertices.forEach(vertex => adjustForVertexOverlap(vertex));

  //  draw any edges being connected
  if (isDrawing) {
    drawEdge({
      head: { x: headVertexDrawing.x, y: headVertexDrawing.y},
      tail: { x: mouseX, y: mouseY}
    }, true);
  }

  //  draw the edges and vetices
  edges.forEach(edge => drawEdge(edge));
  vertices.forEach(vertex => drawVertex(vertex));
}

function mouseClicked() {
  if (isDrawing || isDragging) {
    isDrawing = false;
    isDragging = false;
  } else {
    vertices.push({
      l: 'L-' + vertices.length, 
      x: mouseX, 
      y: mouseY
    });
  }
}

function mousePressed() {
  let { hitVertex, hitInd, hitEdge } = checkVertexCollision();
  
  if (hitEdge) {
    headVertexDrawing = hitVertex;
    isDrawing = true;
  } else if (hitVertex !== undefined) {
    draggingVertex = hitVertex;
    dragVertexInd = hitInd;
    isDragging = true;
  }
}

function mouseDragged() {
  if (isDragging) {
    vertices[dragVertexInd].x = mouseX;
    vertices[dragVertexInd].y = mouseY;
  }
}

function mouseReleased() {
  if (isDrawing) {
    let { hitVertex, hitInd, hitEdge } = checkVertexCollision();
    
    if (hitVertex !== undefined && hitVertex !== headVertexDrawing) {
      edges.push({head: headVertexDrawing, tail: hitVertex});
    }

    headVertexDrawing = null;
  } else {
    draggingVertex = null;
    dragVertexInd = null;
  }
}


function drawVertex(vertex) {
  //  draw circle
  c = color('rgba(100,220,250,0.6)');
  fill(c);
  strokeWeight(vertexEdgeThickness);
  circle(vertex.x, vertex.y, vertexDiameter);

  //  write label
  textSize(14);
  fill(0, 102, 153);
  text(vertex.l, vertex.x-10, vertex.y+5);
}

function drawEdge(edge, beingDrawn = false) {
  strokeWeight(edgeThickness);

  let x1 = edge.head.x;
  let y1 = edge.head.y;
  let x2 = edge.tail.x;
  let y2 = edge.tail.y;
  
  //let d = dist(x1, y1, x2, y2);
  let vec = createVector(x2-x1,y2-y1);
  let mag = sqrt(vec.x*vec.x + vec.y*vec.y);
  let unit = createVector(vec.x/mag, vec.y/mag);

  let headEdge = createVector(x1 + vertexOuterRadius*unit.x, y1 + vertexOuterRadius*unit.y);
  let tailEdge = beingDrawn ? createVector(x2,y2) : 
    createVector(x2 - vertexOuterRadius*unit.x, y2 - vertexOuterRadius*unit.y);
  
  line(headEdge.x, headEdge.y, tailEdge.x, tailEdge.y);

  push();
  translate((headEdge.x + tailEdge.x) / 2, (headEdge.y + tailEdge.y) / 2);
  rotate(atan2(tailEdge.y - headEdge.y, tailEdge.x - headEdge.x));
  pop();
}

function checkVertexCollision() {
  var obj = {};

  vertices.some((vertex, i) => {
    let d = dist(mouseX,mouseY,vertex.x,vertex.y);

    if (vertexInnerRadius > d) {
      obj = { hitVertex: vertex, hitInd: i, hitEdge: false };
      return true;
    } else if (vertexOuterRadius > d) {
      obj = { hitVertex: vertex, hitInd: i, hitEdge: true };
      return true;
    }
  });

  return obj;
}

function adjustForVertexOverlap(parentV) {
  vertices.forEach((vertex, i) => {
    let d = dist(parentV.x,parentV.y,vertex.x,vertex.y);

    if (vertexOuterRadius*2 > d) {
      let x1 = parentV.x;
      let y1 = parentV.y;
      let x2 = vertex.x;
      let y2 = vertex.y;
      
      let d = dist(x1, y1, x2, y2);
      let vec = createVector(x2-x1,y2-y1);
      let mag = sqrt(vec.x*vec.x + vec.y*vec.y);
      let unit = createVector(vec.x/mag, vec.y/mag);

      vertex.x += d*unit.x*adjustmentMagnitude;
      vertex.y += d*unit.y*adjustmentMagnitude;
    }
  });
}