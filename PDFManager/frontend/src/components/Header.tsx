import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Header.module.css"

export default function Header() {
  const [open, setOpen] = useState(false)

  const outils = [
    { link: "/create-blank", titre: "Créer un PDF" },
    { link: "/divide-pdf",   titre: "Scinder un PDF" },
    { link: "/merge-pdf",    titre: "Fusionner des PDFs" },
    { link: "/compress-pdf", titre: "Compresser un PDF" },
    { link: "/compress-zip", titre: "Compresser en Zip" },
    { link: "/password",     titre: "Mot de passe" },
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