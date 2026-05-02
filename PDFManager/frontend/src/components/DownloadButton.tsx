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

        const res = await fetch(downloadUrl);
        const blob = await res.blob();

        let ext = 'file';

        if(blob.type === 'application/pdf'){
            ext = 'pdf';
        }else{
            ext = 'zip'
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
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