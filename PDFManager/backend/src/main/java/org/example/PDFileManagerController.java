package org.example;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/*
 * Comment on gère les fichiers temporaires :
 * - les fichiers d'entrée (uploads, fichiers intermédiaires) sont supprimés dans le finally de chaque méthode ;
 * - le fichier résultat, c'est streamFile() qui l'envoie, puis qui le supprime une fois l'envoi fini.
 *   Du coup, juste après l'appel à streamFile(), on met la variable du résultat à null (ou on la retire
 *   de la liste) : à partir de là, c'est le flux qui s'en occupe, pas le finally.
 *   Si ça plante avant, le finally supprime aussi le résultat, donc rien ne traîne sur le disque.
 */
@RestController
public class PDFileManagerController {

    // Endpoint to create a PDF with 3 empty pages
    @GetMapping("/create")
    public ResponseEntity<StreamingResponseBody> createPDF() {
        File pdFile = PDFileManagerMethode.createEmptyPdf("source", 3);
        return streamFile(pdFile, "blank.pdf", MediaType.APPLICATION_PDF);
    }

    /**
     * Endpoint to divide a PDF at a specified page index
     *
     * @param file      the PDF file to be divided
     * @param pageIndex the number of pages in the first part (1 <= pageIndex < nbPages)
     * @return a ResponseEntity containing a ZIP file with the divided PDFs
     */
    @PostMapping("/divide")
    public ResponseEntity<StreamingResponseBody> dividePDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("pageIndex") int pageIndex) {
        if (pageIndex < 1) {
            return badRequest("L'index de page doit être supérieur ou égal à 1.");
        }

        List<File> tempFiles = new ArrayList<>();
        try {
            // Convert MultipartFile to File
            File convFile = File.createTempFile("upload_", ".pdf");
            tempFiles.add(convFile);
            file.transferTo(convFile);

            File[] pdFiles = PDFileManagerMethode.scinderPdf(convFile, pageIndex - 1);
            if (pdFiles == null) {
                return badRequest("L'index de page doit être inférieur au nombre de pages du PDF.");
            }
            tempFiles.addAll(List.of(pdFiles));

            // Create a ZIP file containing the divided PDFs
            File zipfile = File.createTempFile("files_", ".zip");
            tempFiles.add(zipfile);
            try (FileOutputStream fos = new FileOutputStream(zipfile);
                    ZipOutputStream zos = new ZipOutputStream(fos)) {

                // Add each PDF file to the ZIP
                for (int i = 0; i < pdFiles.length; i++) {
                    zos.putNextEntry(new ZipEntry("part" + (i + 1) + ".pdf"));
                    Files.copy(pdFiles[i].toPath(), zos);
                    zos.closeEntry();
                }
            }

            ResponseEntity<StreamingResponseBody> response = streamFile(zipfile, "files.zip", MediaType.APPLICATION_OCTET_STREAM);
            tempFiles.remove(zipfile); // c'est streamFile qui le supprime après l'envoi
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        } finally {
            deleteQuietly(tempFiles.toArray(new File[0]));
        }

    }

    @PostMapping("/merge")
    public ResponseEntity<StreamingResponseBody> mergePDF(
            @RequestParam("files") MultipartFile files[]) {
        if (files.length < 2) {
            return badRequest("Il faut au moins deux fichiers à fusionner.");
        }

        List<File> tempFiles = new ArrayList<>();
        try {
            File[] convFiles = new File[files.length];
            for (int i = 0; i < files.length; i++) {
                File convFile = File.createTempFile("upload_", ".pdf");
                tempFiles.add(convFile);
                files[i].transferTo(convFile);
                convFiles[i] = convFile; // ajouter au tableau
            }
            File pdFile = PDFileManagerMethode.mergePdf(convFiles);
            tempFiles.add(pdFile);

            ResponseEntity<StreamingResponseBody> response = streamFile(pdFile, "merged.pdf", MediaType.APPLICATION_PDF);
            tempFiles.remove(pdFile); // c'est streamFile qui le supprime après l'envoi
            return response;
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            deleteQuietly(tempFiles.toArray(new File[0]));
        }
    }

    @PostMapping("/compressZip")
    public ResponseEntity<StreamingResponseBody> compressZip(
            @RequestParam("file") MultipartFile file) {
        File convFile = null;
        File zipFile = null;
        try {
            convFile = File.createTempFile("upload_", ".pdf");
            file.transferTo(convFile);
            zipFile = PDFileManagerMethode.compressPdfToZip(convFile);

            ResponseEntity<StreamingResponseBody> response = streamFile(zipFile, "compressed.zip", MediaType.APPLICATION_OCTET_STREAM);
            zipFile = null; // c'est streamFile qui le supprime après l'envoi
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            deleteQuietly(convFile, zipFile);
        }
    }

    @PostMapping("/compressPdf")
    public ResponseEntity<StreamingResponseBody> compressPDF(
            @RequestParam("file") MultipartFile file) {
        File convFile = null;
        File pdFile = null;
        try {
            convFile = File.createTempFile("upload_", ".pdf");
            file.transferTo(convFile);
            pdFile = PDFileManagerMethode.compressPdf(convFile);

            ResponseEntity<StreamingResponseBody> response = streamFile(pdFile, "compressed.pdf", MediaType.APPLICATION_PDF);
            pdFile = null; // c'est streamFile qui le supprime après l'envoi
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            deleteQuietly(convFile, pdFile);
        }
    }

    @PostMapping("/security")
    public ResponseEntity<StreamingResponseBody> passwordPDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "password" , defaultValue = "") String password,
            @RequestParam(value = "canPrint", defaultValue = "true") boolean canPrint,
            @RequestParam(value = "canModify", defaultValue = "true") boolean canModify,
            @RequestParam(value = "canCopy", defaultValue = "true") boolean canCopy) {

        if (password.isBlank()) {
            return badRequest("Le mot de passe ne peut pas être vide.");
        }

        File convFile = null;
        File pdFile = null;
        try {
            convFile = File.createTempFile("upload_", ".pdf");
            file.transferTo(convFile);
            pdFile = PDFileManagerMethode.securityPdf(convFile, password, canPrint, canModify, canCopy);

            ResponseEntity<StreamingResponseBody> response = streamFile(pdFile, "secured.pdf", MediaType.APPLICATION_PDF);
            pdFile = null; // c'est streamFile qui le supprime après l'envoi
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            deleteQuietly(convFile, pdFile);
        }

    }

    /*
     * Envoie le fichier morceau par morceau, puis le supprime.
     * Attention, le lambda ne tourne pas ici : Spring le lance plus tard, sur un autre thread, pour écrire la réponse.
     * Files.copy est bloquant, donc le finally du lambda passe seulement une fois tout le fichier envoyé
     * (ou si l'envoi plante, par exemple quand l'utilisateur ferme l'onglet).
     */
    private static ResponseEntity<StreamingResponseBody> streamFile(File file, String fileName, MediaType type) {
        StreamingResponseBody body = outputStream -> {
            try {
                Files.copy(file.toPath(), outputStream);
            } finally {
                deleteQuietly(file);
            }
        };

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(type)
                .contentLength(file.length())
                .body(body);
    }

    private static ResponseEntity<StreamingResponseBody> badRequest(String message) {
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        StreamingResponseBody body = outputStream -> outputStream.write(bytes);

        return ResponseEntity.badRequest()
                .contentType(new MediaType("text", "plain", StandardCharsets.UTF_8))
                .body(body);
    }

    private static void deleteQuietly(File... files) {
        for (File f : files) {
            if (f == null) continue;
            try {
                Files.deleteIfExists(f.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

}
