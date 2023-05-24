function walk(node) {
  let child, next;
  switch (node.nodeType) {
    case 1:  // Element
    case 9:  // Document
    case 11: // Document fragment
      if (node.tagName && ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'OPTION'].includes(node.tagName.toUpperCase())) {
        return;
      }
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;
    case 3: // Text node
      handleText(node);
      break;
  }
}

function handleText(textNode) {
  let v = textNode.nodeValue;
  
  // Insert zero-width spaces around the first three letters of each word
  v = v.replace(/(\b\w{1,3})/g, '\u200B$1\u200B');

  // Split the text at the zero-width spaces, wrap the words in <b> tags,
  // and recombine the text
  v = v.split('\u200B').map((part, i) => {
    if (i % 2 === 1) {
      return '<b>' + part + '</b>';
    }
    return part;
  }).join('');

  // Create a new element to contain the modified text
  const newNode = document.createElement('span');
  newNode.innerHTML = v;
  
  // Replace the original text node with the new element
  textNode.parentNode.replaceChild(newNode, textNode);
}

walk(document.body);
