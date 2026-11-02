import { useState } from 'react';
import DownloadButton from '../components/DownloadButton';
import styles from './Pages.module.css';

export default function CreateBlank() {

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const createPDF = async () => {

    try {
      const res = await fetch(`${apiUrl}/create`, {
        method: 'GET',
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.blob();
      const url = URL.createObjectURL(data);
      setDownloadUrl(url);
    } catch (err) {
      alert("Une erreur est survenue lors de la création du PDF. " + err);
    }


  }

  return (
    <div className={styles.page}>
      <h1>CREER UN PDF</h1>

      <p>Créer un PDF vide 👇</p>
      <button className={styles.btn} onClick={createPDF}>
        Créer
      </button>
      <DownloadButton downloadUrl={downloadUrl} fileName="blank.pdf"></DownloadButton>
    </div>

  )
}