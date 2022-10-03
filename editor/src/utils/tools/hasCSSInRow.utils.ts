export default function hasCSSInRow(row: string[]) {
  const regex =
    /((?:^\s*)([\w#.@*,:\-.:>,*\s]+)\s*{(?:[\s]*)((?:[A-Za-z\- \s]+[:]\s*['"0-9\w .,/()\-!%]+;?)*)*\s*}(?:\s*))/gim;
  return regex.test(row[5]) || regex.test(row[6]);
}
