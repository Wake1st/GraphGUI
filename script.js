let vertices = [];
let edges = [];

let vertexOuterRadius = 80;
let vertexInnerRadius = 60;
let vertexDiameter = vertexOuterRadius + vertexInnerRadius;
let vertexEdgeThickness = vertexOuterRadius - vertexInnerRadius;
let edgeThickness = 10;

let headNodeDrawing;
let tailNodeDrawing;

let isDrawing = false;
let isDragging = false;

let draggingNode;
let dragNodeInd;

function setup() {
  createCanvas(780, 780);
}

function draw() {
  background('rgba(40,250,240,0.4)');
  
  if (isDrawing) {
    strokeWeight(edgeThickness);

    let x1 = headNodeDrawing.x;
    let y1 = headNodeDrawing.y;
    let x2 = mouseX;
    let y2 = mouseY;
    
    line(x1, y1, x2, y2);

    let d = dist(x1, y1, x2, y2);

    // Let's write d along the line we are drawing!
    push();
    translate((x1 + x2) / 2, (y1 + y2) / 2);
    rotate(atan2(y2 - y1, x2 - x1));
    pop();
  }

  edges.forEach(edge => drawEdge(edge));
  vertices.forEach(node => drawNode(node));
}

function mouseClicked() {
  console.log(isDrawing);

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
  let { hitNode, hitInd, hitEdge } = firstNodeHit();
  
  if (hitEdge) {
    headNodeDrawing = hitNode;
    isDrawing = true;
  } else if (hitNode !== undefined) {
    console.log(hitInd);
    draggingNode = hitNode;
    dragNodeInd = hitInd;
    isDragging = true;
  }
}

function mouseReleased() {
  if (isDrawing) {
    let { hitNode, hitInd, hitEdge } = firstNodeHit();
    
    if (hitNode !== undefined) {
      edges.push({head: headNodeDrawing, tail: hitNode});
      headNodeDrawing = null;
    }
  } else {
    draggingNode = null;
    dragNodeInd = null;
  }
}

function mouseDragged() {
  if (isDragging) {
    vertices[dragNodeInd].x = mouseX;
    vertices[dragNodeInd].y = mouseY;
  }
}


function drawNode(node) {
  //  draw circle
  c = color('rgba(100,220,250,0.6)');
  fill(c);
  strokeWeight(vertexEdgeThickness);
  circle(node.x, node.y, vertexDiameter);

  //  write label
  textSize(14);
  fill(0, 102, 153);
  text(node.l, node.x-10, node.y+5);
}

function drawEdge(edge) {
  strokeWeight(edgeThickness);

  let x1 = edge.head.x;
  let y1 = edge.head.y;
  let x2 = edge.tail.x;
  let y2 = edge.tail.y;
  
  line(x1, y1, x2, y2);

  let d = dist(x1, y1, x2, y2);

  push();
  translate((x1 + x2) / 2, (y1 + y2) / 2);
  rotate(atan2(y2 - y1, x2 - x1));
  pop();
}

function firstNodeHit() {
  var obj = {};

  vertices.some((node, i) => {
    let d = dist(mouseX,mouseY,node.x,node.y);

    if (vertexInnerRadius > d) {
      obj = { hitNode: node, hitInd: i, hitEdge: false };
      return true;
    } else if (vertexOuterRadius > d) {
      obj = { hitNode: node, hitInd: i, hitEdge: true };
      return true;
    }
  });

  return obj;
}