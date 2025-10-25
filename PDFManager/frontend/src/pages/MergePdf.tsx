import { useState } from 'react';
import styles from './Pages.module.css';
import PdfView from '../components/PdfView';
import DownloadButton from '../components/DownloadButton';




export default function DividePdf() {

      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";



    const [files, setFiles] = useState<File[]>([]);
    const [isloading, setIsloading] = useState<boolean>(false);
    const [downloadUrl, setDownloadUrl] = useState<string|null>(null);

    const handleMerge = async (e: any) => {
        e.preventDefault();

        if (files.length === 0) {
            alert("Please select files to merge.");
            return;
        }

        try {
            setIsloading(true);
            setDownloadUrl(null);

            const formData = new FormData();
            for (const element of files) {
                formData.append("files", element);
            }

            const res = await fetch(`${apiUrl}/merge`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url); 

        } catch (err) {
            console.error("Error during merge:", err);
            alert("Une erreur est survenue lors de la fusion des fichiers.");
        } finally {
            setIsloading(false);
        }

    };



    return (<>
        <div>merge_pdf</div>
        <form onSubmit={handleMerge} method="post">

            <input
                type="file"
                name="files"
                id='inputPdf'
                hidden
                onChange={(e) => {
                    if (!e.target.files) return;
                    setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                }
                }
                multiple />
            <button
                type='button'
                onClick={() => { document.getElementById('inputPdf')?.click(); }}

            >ajouter des fichiers</button>



                <button className={styles.btn} type="submit"
                disabled={isloading}>
                    {isloading ? 'Merging...' : 'Merge PDFs'}
                    </button>

        </form>


        <PdfView files={files} setFiles={setFiles} />
        <DownloadButton downloadUrl={downloadUrl} ></DownloadButton>





    </>
    )
}