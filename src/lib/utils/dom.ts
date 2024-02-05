// write a function that that takes boolean, and based on it add the class of .dark to the document.documentElement
export function setDomClass(shouldSetValue: boolean, className: string) {
  if (shouldSetValue) {
    document.documentElement.classList.add(className);
  } else {
    document.documentElement.classList.remove(className);
  }
}
