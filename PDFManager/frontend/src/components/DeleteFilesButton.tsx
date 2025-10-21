import styles from '../pages/Pages.module.css';


export default function DeleFilesButton({
    files,
    setFiles
}:{
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}){

    const handleDeleteAllFile = () => {
        setFiles([]);
    };

    return (<>
    {files.length > 0 &&
        <button
        className={styles.btn}
        onClick={handleDeleteAllFile}>Delete All Files</button>
    }
    </>);
}