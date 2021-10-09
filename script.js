const graphBufferX = 0;
const graphBufferY = 0;
const listBufferX = 800;
const listBufferY = 0;

const vertexOuterRadius = 60;
const vertexInnerRadius = 45;
const vertexDiameter = vertexOuterRadius + vertexInnerRadius;
const vertexEdgeThickness = vertexOuterRadius - vertexInnerRadius;

const edgeThickness = 10;

const adjustmentMagnitude = 0.1;

const itemWidth = 200;
const itemHeight = 30;
const itemNodeR = itemHeight/2;

const itemMargin = 20;
const itemGap = 8;

let vertices = [];
let edges = [];

let listVerts = [];
let listEdges = [];

let headVertexDrawing;
let tailVertexDrawing;

let isDrawing = false;
let isDragging = false;

let draggingVertex;
let dragVertexInd;

let graphBuffer;
let listBuffer;


function setup() {
  //  800 x 400 (double width to make room for each "sub-canvas")
  createCanvas(1600, 640);
  //  Create both of your off-screen graphics buffers
  graphBuffer = createGraphics(780, 640);
  listBuffer = createGraphics(780, 640);
}

function draw() {
  // Draw on your buffers however you like
  drawGraphBuffer();
  drawListBuffer();
  // Paint the off-screen buffers onto the main canvas
  image(graphBuffer, graphBufferX, graphBufferY);
  image(listBuffer, listBufferX, listBufferY);
}


function drawGraphBuffer() {
  graphBuffer.background('rgba(40,250,240,0.4)');
  
  //  adjust posision if overlapping
  vertices.forEach(vertex => adjustForVertexOverlap(graphBuffer, vertex));

  //  draw any edges being connected
  if (isDrawing) {
    drawEdge(
      graphBuffer,
      {
        head: { x: headVertexDrawing.x, y: headVertexDrawing.y},
        tail: { x: mouseX, y: mouseY}
      }, 
      true);
  }

  //  draw the edges and vetices
  edges.forEach(edge => drawEdge(graphBuffer, edge));
  vertices.forEach(vertex => drawVertex(graphBuffer, vertex));
  listVerts.forEach((item,i) => drawItem(listBuffer, item, i));
}

function drawListBuffer() {
  listBuffer.background('rgba(40,220,250,0.4)');


}

function mouseClicked() {
  if (hitBuffer(graphBuffer, mouseX, mouseY, graphBufferX, graphBufferY)) {
    if (isDrawing || isDragging) {
      isDrawing = false;
      isDragging = false;
    } else {
      let name = 'V-' + vertices.length;
      
      vertices.push({
        l: name, 
        x: mouseX, 
        y: mouseY
      });

      listVerts.push({ l: name });
    }
  } else if (hitBuffer(listBuffer, mouseX, mouseY, listBufferX, listBufferY)) {
    let { hitItem, hitInd, hitNode } = checkItemHit();

    if (hitNode) {

    } else if (hitItem !== undefined) {

    }
  }
}

function mousePressed() {
  let { hitVertex, hitInd, hitEdge } = checkVertexHit();
  
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
    let { hitVertex, hitInd, hitEdge } = checkVertexHit();
    
    if (hitVertex !== undefined && hitVertex !== headVertexDrawing) {
      edges.push({head: headVertexDrawing, tail: hitVertex});
    }

    headVertexDrawing = null;
  } else {
    draggingVertex = null;
    dragVertexInd = null;
  }
}

function hitBuffer(buffer, x, y, bufferX, bufferY) {
  return x > bufferX && y > bufferY &&
    x < buffer.width + bufferX &&
    y < buffer.height + bufferY;
}

function getItemCoord(i) {
  return { x: itemMargin, y: i * (itemHeight + itemGap) + itemGap };
}

function drawVertex(buffer, vertex) {
  //  draw circle
  c = color('rgba(100,220,250,0.6)');
  buffer.fill(c);
  buffer.strokeWeight(vertexEdgeThickness);
  buffer.circle(vertex.x, vertex.y, vertexDiameter);

  //  write label
  buffer.textSize(14);
  buffer.fill(0, 102, 153);
  buffer.text(vertex.l, vertex.x-10, vertex.y+5);
}

function drawEdge(buffer, edge, beingDrawn = false) {
  buffer.strokeWeight(edgeThickness);

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

  buffer.line(headEdge.x, headEdge.y, tailEdge.x, tailEdge.y);

  buffer.push();
  buffer.translate((headEdge.x + tailEdge.x) / 2, (headEdge.y + tailEdge.y) / 2);
  buffer.rotate(atan2(tailEdge.y - headEdge.y, tailEdge.x - headEdge.x));
  buffer.pop();
}

function drawItem(buffer, item, i) {
  //  set color
  c = color('rgba(60,240,210,0.6)');
  buffer.fill(c);

  //  get coords for the item
  let { x, y } = getItemCoord(i);

  //  draw circle
  buffer.strokeWeight(2);
  buffer.rect(x, y, itemWidth, itemHeight, itemNodeR);

  //  draw circle
  c = color(0,0,0);
  buffer.fill(c);
  buffer.circle(x+itemWidth-itemNodeR, y+(itemHeight/2), itemNodeR*2);
  
  //  write label
  buffer.textSize(14);
  buffer.fill(0, 160, 120);
  buffer.text(item.l, x+(itemWidth/2)-10, y+(itemHeight/2)+5);
}

function checkVertexHit() {
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

function adjustForVertexOverlap(buffer, parentV) {
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

function checkItemHit() {
  var obj = {};

  listVerts.some((item, i) => {
    //  set mouse coords relative to the buffer
    let mX = mouseX - listBufferX;
    let mY = mouseY - listBufferY;
    //  get coords for the item
    let { x, y } = getItemCoord(i);
    
    let hitNode = mY > y &&
      x + itemWidth - (itemNodeR * 2) < mX &&
      y + itemHeight > mY && x + itemWidth > mX;

    if (hitNode) {
      obj = { hitItem: item, hitInd: i, hitNode: true };
      return true;
    }
    
    let hitBox = mX > x && mY > y &&
      x + itemWidth - (itemNodeR * 2) > mX &&
      y + itemHeight > mY;
       
    if (hitBox) {
      obj = { hitItem: item, hitInd: i, hitEdge: false };
      return true;
    }
  });

  return obj;
}