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
  let h = document.createElement('p');
  h.classList.add('col-1', 'focus-edge-vert');
  h.textContent = e.head.l + ' -- ' + e.tail.l;
  focusedElement.edges.appendChild(h);
}

focusedElement.title.addEventListener('change', e => {
  if (item !== undefined) {
    item.l = focusedElement.title.value;
  }
});