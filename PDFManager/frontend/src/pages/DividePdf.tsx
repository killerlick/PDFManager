import { useState } from 'react';
import styles from './Pages.module.css';
import DownloadButton from '../components/DownloadButton';




export default function DividePdf() {

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const [file, setFile] = useState<File | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleDivide = async (e: any) => {
    e.preventDefault();


    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }
    if (file.type !== "application/pdf") {
      alert("Le fichier doit être un PDF.");
      return;
    }
    if (!Number.isInteger(pageIndex) || pageIndex < 1) {
      alert("L'index de page doit être un entier supérieur ou égal à 1.");
      return;
    }

    setIsloading(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageIndex", pageIndex.toString());

      const res = await fetch(`${apiUrl}/divide`, {
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
      alert("An error occurred while dividing the PDF." + err);
      setIsloading(false);
      return;
    } finally {
      setIsloading(false);

    }




  }


  let pageIndexValue: number | string = pageIndex;
  if (Number.isNaN(pageIndex)) {
    pageIndexValue = "";
  }

  return (
    <div className={styles.page}>
      <h1>DIVISER UN PDF EN 2</h1>
      <form onSubmit={handleDivide} method="post">

        <input
          type="file"
          name="file"
          accept='application/pdf,.pdf'
          onChange={(e) => {
            if (!e.target.files) return;
            setFile(e.target.files[0]);
          }

          }
          required />

        <input
          type="number"
          name="pageIndex"
          min={1}
          step={1}
          placeholder='Page Index'
          value={pageIndexValue}
          onChange={(e) => setPageIndex(parseInt(e.target.value, 10))}
          required />

        <button className={styles.btn} type="submit"
          disabled={isloading}
        >
          {isloading ? "Dividing..." : "diviser le PDF"}
        </button>
      </form>
      <DownloadButton downloadUrl={downloadUrl} fileName="divide.zip"></DownloadButton>
    </div>
  )
}