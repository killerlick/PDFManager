import { Link } from 'react-router-dom';
import styles from './PdfCard.module.css';

export default function CardPdf({
    link,
    titre
}: {
    link :string;
    titre :string;
}) {
  return (
    <Link to={link} className={styles.card} >
        
                  <h2>{titre}</h2>
        

    </Link>
  );
}