/**
 * Show console if schema is invalid
 * @param {Array} docErrors
 */
export function showConsole(docErrors) {
  console.log(error);
  const node = document.getElementById('modal-card-body');
  console.log(node);
  const consoleElement = document.getElementById('console');
  if (!consoleElement) {
    const textArea= document.createElement('textarea');
    textArea.id = 'console';
    textArea.className = 'console';
    textArea.readOnly = true;
    textArea.style.height = '100px';
    textArea.style.width = '100%';
    textArea.style.marginTop = '5px';
    node.appendChild(textArea);
  }

  document.getElementById('console').innerHTML = JSON.stringify(docErrors);
}

