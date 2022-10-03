export default function getFileExtension(fileName: string): string {
  return /(?:\.([^./]+))?$/.exec(fileName)![1] || '';
}
