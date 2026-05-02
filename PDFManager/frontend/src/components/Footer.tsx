import styles from "./Footer.module.css"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.brand}>PDF Manager</span>

      <div className={styles.links}>
        <Link to="/">Accueil</Link>
        <a href="https://github.com/killerlick" target="_blank" rel="noreferrer">GitHub</a>
      </div>

      <span className={styles.copy}>© 2026 PDF Manager</span>
    </footer>
  )
}