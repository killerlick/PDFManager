import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css"

export default function Header() {
  const [open, setOpen] = useState(false)

  const outils = [
    { link: "/CreateBlank", titre: "Créer un PDF" },
    { link: "/DividePdf",   titre: "Scinder un PDF" },
    { link: "/MergePdf",    titre: "Fusionner des PDFs" },
    { link: "/CompressPdf", titre: "Compresser un PDF" },
    { link: "/CompressZip", titre: "Compresser en Zip" },
    { link: "/Password",    titre: "Mot de passe" },
  ]

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>PDF Manager</Link>

      <nav className={styles.nav}>
        <Link to="/">Accueil</Link>

        <div
          className={styles.dropdown}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span className={styles.dropbtn}>Outils ▾</span>
          {open && (
            <div className={styles.dropMenu}>
              {outils.map(o => (
                <Link key={o.link} to={o.link} onClick={() => setOpen(false)}>
                  {o.titre}
                </Link>
              ))}
            </div>
          )}
        </div>

        <a href="https://github.com/killerlick" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
  )
}