import { useState } from 'react';
import styles from './Pages.module.css';




export default function DividePdf() {

  const [file, setFile] = useState<File | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const handleDivide = async (e:any) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }


    const formData = new FormData();
    formData.append("file", file);
    formData.append("pageIndex", pageIndex.toString());

    const res = await fetch("http://localhost:8080/divide", {
      method: "POST",
      body: formData
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'split_files.zip';
    a.click();
    window.URL.revokeObjectURL(url);

  }



  return (<>
    <div>divide_pdf</div>
    <form onSubmit={handleDivide} method="post">

      <input 
      type="file" 
      name="file" 
      onChange={(e) => 
      {
        if(!e.target.files) return;
        setFile(e.target.files[0]);
      }

      } />

      <input 
      type="number" 
      name="pageIndex" 
      onChange={(e) => {
        if(!e.target.value) return;
        setPageIndex(parseInt(e.target.value));
      }
      } />

      <button className={styles.btn} type="submit">Divide</button>

    </form>
    </>
  )
}