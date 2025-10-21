import styles from '../pages/Pages.module.css';


export default function DownloadButton({
    downloadUrl
    
}:{
    downloadUrl: string|null ;
}){
        const handleDownload = () => {
        if (!downloadUrl) {
            alert("No merged file available for download.");
            return;
        }
        const a = document.createElement('a');
                   a.href = downloadUrl;
            a.download = 'merged.pdf';
            a.click();
    }

    return (<>
                {downloadUrl && (
                    < button className={styles.btn} onClick={handleDownload}>
                        Download
                    </button>
                )}
                </>
    );
}