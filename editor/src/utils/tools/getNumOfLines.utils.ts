export function getNumOfLines(str: string) {
  if (str && typeof str === 'string') {
    return (str.match(/\n/g) || '').length + 1;
  }
}
