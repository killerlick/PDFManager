import styles from './Pages.module.css';
import CardPdf from '../components/PdfCard';



export default function create_blank() {

  const card = [
    { link: "/CreateBlank", titre: "Créer un PDF" },
    { link: "/DividePdf", titre: "scinder un PDF" },
    { link: "/MergePdf", titre: "Fusionner des PDFs" },
    { link: "/CompressZip", titre: "Compresser un PDF" },
    { link: "/CompressPdf", titre: "compresser un PDF en Zip" },
    { link: "/Password", titre: "ajouter un mot de passe" }
  ]

  return (
    <div className={styles.page}>
      <h1> ACCUEIL</h1>
      

      <div className={styles.container}>
        
      {
        card.map((card,index)=>(
          <CardPdf key={index} link={card.link} titre={card.titre} />
        ))
      }

      </div>
      </div>
  )
}