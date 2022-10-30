export default function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'Kib',
    'Mib',
    'Gib',
    'Tib',
    'Pib',
    'Eib',
    'Zib',
    'Yib',
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))}  ${sizes[i]}`;
}
