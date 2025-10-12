import styles from './Pages.module.css';

function createPDF() {
  // Logic to create a blank PDF
  console.log("Creating a blank PDF...");
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