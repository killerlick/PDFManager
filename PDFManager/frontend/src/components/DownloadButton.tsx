import styles from './DownloadBtn.module.css';


export default function DownloadButton({
    downloadUrl,
    fileName ="downloaded_file"

}: {
    downloadUrl: string | null;
    fileName?: string;
}) {


    const handleDownload = async () => {

        if (!downloadUrl) {
            alert("No file available for download.");
            return;
        }

        let name = fileName;

        // on devine l'extension seulement si la page n'en a pas donné ("merged.pdf" en a une, "downloaded_file" non)
        const hasExtension = name.includes('.');
        if (!hasExtension) {
            const blob = await (await fetch(downloadUrl)).blob();
            if (blob.type === 'application/pdf') {
                name += '.pdf';
            } else {
                name += '.zip';
            }
        }

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = name;
        a.click();
    }

    return (<>
        {downloadUrl && (
            < button className={styles.downloadBtn} onClick={handleDownload}>
                Download
            </button>
        )}
    </>
    );
}