const focusedElement = {
  title: document.getElementById('focus-title'),
  props: document.getElementById('focus-props'),
  edges: document.getElementById('focus-edges')
}

let item;

function focusOnSelection(v, edges = null) {
  item = v;
  focusedElement.title.value = v.l;

  focusedElement.edges.textContent = '';

  if (edges !== null){
    edges.forEach(e => addEdgeToFocus(e));
  }
}

function addEdgeToFocus(e) {
  let edge = document.createElement('div');
  edge.classList.add('focus-edge-container');
  
  let h = document.createElement('span');
  h.classList.add('focus-edge-item','focus-edge-vert');
  h.textContent = e.head.l;
  
  let t = document.createElement('span');
  t.classList.add('focus-edge-item','focus-edge-vert');
  t.textContent = e.tail.l;

  let b = document.createElement('button');
  b.classList.add('focus-edge-item','btn-cancel');
  b.textContent = 'x';

  edge.appendChild(h);
  edge.appendChild(t);
  edge.appendChild(b);
  focusedElement.edges.appendChild(edge);
}

focusedElement.title.addEventListener('change', e => {
  if (item !== undefined) {
    item.l = focusedElement.title.value;
  }
});

focusedElement.edges.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-cancel')) {
    console.log('cancelled')
  }
});