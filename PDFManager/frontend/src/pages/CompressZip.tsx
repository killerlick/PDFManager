import { useState } from 'react';
import styles from './Pages.module.css';
import DownloadButton from '../components/DownloadButton';

export default function CompressZip() {

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";


    const [downloadUrl, setDownloadUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [isloading, setIsloading] = useState<boolean>(false);

  const handleCompressZip = async (e:any) => {

    e.preventDefault();

    if (!file) {
      alert("Please upload a ZIP file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${apiUrl}/compressZip` , {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setDownloadUrl(url);
    setIsloading(false);

  }
  return (

    <div className={styles.page}>
      <h1>CONVERTIR PDF EN ZIP</h1>
      <form onSubmit={handleCompressZip} className={styles.form}>
        <input
          type="file"
          name="file"
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
      <DownloadButton downloadUrl={downloadUrl} ></DownloadButton>
    </div>
  );
}