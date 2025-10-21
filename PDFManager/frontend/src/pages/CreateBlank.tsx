import styles from './Pages.module.css';

async function createPDF() {
  // Logic to create a blank PDF
  const res = fetch("http://localhost:8080/create");
  const blob = await (await res).blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'blank.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function CreateBlank() {
  return (
    <div>
      <p>create pdf lol</p>
      <button 
      className={styles.btn}
      onClick={() => createPDF()}>
        creer
      </button>
    </div>
  )
}