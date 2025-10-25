import { useState } from 'react';
import styles from './Pages.module.css';
import DownloadButton from '../components/DownloadButton';

export default function CompressZip() {

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";


    const [downloadUrl, setDownloadUrl] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

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

  }
  return (

    <div>
      <p>compress zip</p>
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
        <button type="submit" className={styles.btn}>compress</button>

      </form>
      <DownloadButton downloadUrl={downloadUrl} ></DownloadButton>
    </div>
  );
}