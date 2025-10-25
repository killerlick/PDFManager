import { useState } from 'react';
import DownloadButton from '../components/DownloadButton';
import styles from './Pages.module.css';

export default function CompressPdf() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleCompress = async (e: any) => {

    e.preventDefault();

    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${apiUrl}/compressPdf`, {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    setDownloadUrl(url);


  }

  return (
    <div>
      <p>create pdf lol</p>


      <form onSubmit={handleCompress} className={styles.form}>
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
        <button type="submit" className={styles.btn}>compress</button>

      </form>
      <DownloadButton downloadUrl={downloadUrl} ></DownloadButton>
    </div>
  )
}