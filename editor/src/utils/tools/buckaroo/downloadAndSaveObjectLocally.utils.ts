interface DownloadAndSaveObjectLocallyArgs {
  url: string;
  objectName: string;
}

export default async function downloadAndSaveObjectLocally(
  args: DownloadAndSaveObjectLocallyArgs
) {
  try {
    const targetUrl = new URL(args.url);

    const res = await fetch(targetUrl.toString());

    const blob = await res.blob();
    const dlUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.download = args.objectName;
    link.href = dlUrl;
    link.click();
    return;
  } catch (e) {
    throw e;
  }
}
