import { useState } from 'react';
import DownloadButton from '../components/DownloadButton';
import styles from './Pages.module.css';

export default function CompressPdf() {

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [isloading, setIsloading] = useState<boolean>(false);

  const handleCompress = async (e: any) => {

    e.preventDefault();

    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }


    setIsloading(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${apiUrl}/compressPdf`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error(await res.text() || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);

    } catch (err) {
      alert("An error occurred while compressing the PDF." + err);
      setIsloading(false);
      return;
    } finally {
      setIsloading(false);
    }







  }

  return (
    <div className={styles.page}>
      <h1>COMPRESSER TAILLE DE PDF</h1>


      <form onSubmit={handleCompress} className={styles.form}>
        <input
          type="file"
          name="file"
          accept='application/pdf'
          onChange={
            (e) => {
              if (!e.target.files) return;
              setFile(e.target.files[0]);
            }
          }
          required />
        <button type="submit" className={styles.btn} disabled={isloading}>
          {isloading ? "Compression..." : "Compresser le PDF"}
        </button>

      </form>
      <DownloadButton downloadUrl={downloadUrl} fileName="compressed.pdf"></DownloadButton>
    </div>
  )
}