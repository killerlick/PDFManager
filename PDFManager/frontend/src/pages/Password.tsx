import { useState } from "react";
import DownloadButton from "../components/DownloadButton";
import styles from "./Pages.module.css";

export default function PasswordPdf() {

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const [file , setFile] = useState<File|null>(null);
    const [password, setPassword] = useState<string>("");
    const [canPrint , setCanPrint] = useState<boolean>(true);
    const [canModify , setCanModify] = useState<boolean>(true);
    const [canCopy , setCanCopy] = useState<boolean>(true);


    const [isloading, setIsloading] = useState<boolean>(false);
    const [downloadUrl, setDownloadUrl] = useState<string|null>(null);


    const handlePasswordProtect = async (e: any) => {
        e.preventDefault();

        if (!file) {
            alert("Please select files to protect.");
            return;
        }

        try {
            setIsloading(true);
            setDownloadUrl(null);
            
            const formData = new FormData();

            formData.append("password", password);
            formData.append("file", file);
            formData.append("canPrint", String(canPrint));
            formData.append("canModify", String(canModify));
            formData.append("canCopy", String(canCopy));

            const res = await fetch(`${apiUrl}/security`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);


    }catch (err) {
            console.error("Error during password protection:", err);
            alert("An error occurred while protecting the files.");
        }
        finally{
            setIsloading(false);

        }
}


    return (
        <div className={styles.page}>
            <h1>AJOUTER UN MOT DE PASSE A VOTRE FICHIER</h1>
            <form onSubmit={handlePasswordProtect} method="post">
                <input
                required
                    type="file"
                    name="file"
                    onChange={
                        (e) =>{
                            if(!e.target.files) return;
                            setFile(e.target.files[0]);
                        }
                        
                    }
                    ></input>
                    <input 
                    type="password"
                    name="password" 
                    placeholder="Enter Password"
                    onChange={
                        (e) => {
                            setPassword(e.target.value);
                        }
                    }></input>

                    <label>bloquer l'impression du pdf<input 
                    type="checkbox"
                    name="canPrint"
                    onChange={
                        (e) => {
                            setCanPrint(!e.target.checked);
                        }
                    }
                    ></input></label>

                    <label>bloquer la modification du pdf <input 
                    type="checkbox"
                    name="canModify"
                    onChange={
                        (e) => {
                            setCanModify(!e.target.checked);
                        }
                    }
                    ></input></label>
                    <label>bloquer la copie du pdf<input 
                    type="checkbox"
                    name="canCopy"
                    onChange={
                        (e) => {
                            setCanCopy(!e.target.checked);
                        }
                    }
                    ></input></label>

                    <button className={styles.btn} type="submit"
                    disabled={isloading}>
                        {isloading ? "Generation..." : "securiser le pdf"}
                        </button>
            </form>
            
            <DownloadButton downloadUrl={downloadUrl}></DownloadButton>
        </div> );
}