import { useState } from 'react';
import DownloadButton from '../components/DownloadButton';
import styles from './Pages.module.css';

export default function CreateBlank() {

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const createPDF = async () => {

    const res = await fetch(`${apiUrl}/create`, {
      method: 'GET',
    });
    const data = await res.blob();
    const url = URL.createObjectURL(data);
    setDownloadUrl(url);


  }

  return (
    <div className={styles.page}>
      <h1>CREER UN PDF</h1>

      <p>Créer un PDF vide 👇</p>
      <button className={styles.btn} onClick={createPDF}>
        Créer
      </button>
      <DownloadButton downloadUrl={downloadUrl}></DownloadButton>
    </div>

  )
}