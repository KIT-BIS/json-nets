/**
 * Upload a file for import.
 * @param {Event} event
 */
export function readFile(event: Event, callback: Function) {
  const input = event.target
  if(!input) return;

  const reader = new FileReader()
  reader.onload = function () {
    const text = reader.result
    callback(text)
  }
  //@ts-ignore
  reader.readAsText(input.files[0])
}

/**
 * Download json file.
 * @param {*} content
 * @param {*} fileName
 * @param {*} contentType
 */
export function download(content: string, fileName: string, contentType: string) {
  const a = document.createElement('a')
  const file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}
