import { Link } from "react-router-dom";
import styles from "./Header.module.css"

export default function Header() {
  return (
    <header className={styles.header}>
      <h1>PDF Manager</h1>
            <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav> 
    </header>
  );
}