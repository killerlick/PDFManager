import styles from './Pages.module.css';

export default function CompressZip() {

  const handleCompressZip = async () => {
    const res = await fetch("http://localhost:8080/compressZip", {
      method: "POST", 
    });
  }
  return(

    <div>
      <p>compress zip lol</p>
      <button 
      className={styles.btn}
      onClick={() => handleCompressZip()}>
        creer
      </button>
    </div>
  );}