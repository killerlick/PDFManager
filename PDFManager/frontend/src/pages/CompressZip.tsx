import { useState } from 'react';
import styles from './Pages.module.css';
import DownloadButton from '../components/DownloadButton';

export default function CompressZip() {

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";


  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isloading, setIsloading] = useState<boolean>(false);

  const handleCompressZip = async (e: any) => {

    e.preventDefault();

    if (!file) {
      alert("Please upload a pdf file.");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload a valid pdf file.");
      return;
    }

    setIsloading(true);
    setDownloadUrl(null);

    try{
      
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${apiUrl}/compressZip`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      throw new Error(await res.text() || `HTTP ${res.status}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setDownloadUrl(url);
    setIsloading(false);

    }catch(err){
      alert("An error occurred while converting the file. Please try again."+err);
      setIsloading(false);
      return;
    }finally{
      setIsloading(false);
    }


  }
  return (

    <div className={styles.page}>
      <h1>CONVERTIR PDF EN ZIP</h1>
      <form onSubmit={handleCompressZip} className={styles.form}>
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
          {isloading ? "Conversion..." : "Convertir en ZIP"}
        </button>

      </form>
      <DownloadButton downloadUrl={downloadUrl} fileName="compressed.zip"></DownloadButton>
    </div>
  );
}