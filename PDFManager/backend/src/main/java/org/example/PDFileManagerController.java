package org.example;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.example.PDFileManagerMethode;

@RestController
public class PDFileManagerController {

    // Endpoint to create a PDF with 3 empty pages
    @GetMapping("/create")
    public ResponseEntity<FileSystemResource> createPDF() {
        File pdFile = PDFileManagerMethode.createEmptyPdf("source", 3);

        FileSystemResource resource = new FileSystemResource(pdFile);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pdFile.getName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    /**
     * Endpoint to divide a PDF at a specified page index
     * 
     * @param file      the PDF file to be divided
     * @param pageIndex the index of the page to divide at
     * @return a ResponseEntity containing a ZIP file with the divided PDFs
     */
    @PostMapping("/divide")
    public ResponseEntity<byte[]> dividePDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("pageIndex") int pageIndex) {
        try {
            // Convert MultipartFile to File
            File convFile = File.createTempFile("upload_",".pdf");
            file.transferTo(convFile);
            pageIndex = pageIndex-1;


            File[] pdFiles = PDFileManagerMethode.scinderPdf(convFile, pageIndex);
            if (pdFiles == null) {
                return ResponseEntity.badRequest()
                        .body(("PageIndex trop grand. Le PDF contient moins de " + (pageIndex + 1) + " pages.")
                                .getBytes());
            }

            // Create a ZIP file containing the divided PDFs
            File zipfile = File.createTempFile("files_", ".zip");
            try (FileOutputStream fos = new FileOutputStream(zipfile);
                 ZipOutputStream zos = new ZipOutputStream(fos)){

                // Add each PDF file to the ZIP
                for (File pdf : pdFiles) {
                    ZipEntry zipEntry = new ZipEntry(pdf.getName());
                    zos.putNextEntry(zipEntry);
                    byte[] bytes = Files.readAllBytes(pdf.toPath());
                    zos.write(bytes);
                    zos.closeEntry();
                }
            }

            byte[] zipBytes = Files.readAllBytes(zipfile.toPath());
            System.out.println(zipfile.getName());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=files.zip")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipBytes);

        } catch (Exception e) {
            System.out.println("ici2");
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }

    }

    @PostMapping("/merge")
    public ResponseEntity<FileSystemResource> mergePDF(
            @RequestParam("files") MultipartFile files[]
    ){
        if (files.length < 2) {
            return ResponseEntity.badRequest()
                    .body(null);
            
        }

        File[] convFiles = new File[files.length];
       for (int i = 0; i < files.length; i++) {
        try {
            File convFile = File.createTempFile("upload_", ".pdf");
            files[i].transferTo(convFile);
            convFiles[i] = convFile; // ajouter au tableau
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
        File pdFile = PDFileManagerMethode.mergePdf(convFiles);
        
        FileSystemResource resource = new FileSystemResource(pdFile);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pdFile.getName())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @PostMapping("/compressZip")
    public ResponseEntity<FileSystemResource> compressZip(
            @RequestParam("file") MultipartFile file
    ){
        try {
            File convFile = File.createTempFile("upload_", ".pdf");
            file.transferTo(convFile);
            File zipFile = PDFileManagerMethode.compressPdfToZip(convFile);

            FileSystemResource resource = new FileSystemResource(zipFile);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + zipFile.getName())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

        @PostMapping("/compressPdf")
    public ResponseEntity<FileSystemResource> compressPDF(
            @RequestParam("file") MultipartFile file
    ){
        try {
            File convFile = File.createTempFile("upload_", ".pdf");
            file.transferTo(convFile);
            File pdFile = PDFileManagerMethode.compressPdf(convFile);

            FileSystemResource resource = new FileSystemResource(pdFile);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pdFile.getName())
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

        @PostMapping("/password")
    public ResponseEntity<FileSystemResource> passwordPDF(
            @RequestParam("file") MultipartFile file,
            @RequestParam("password") String password){

                try{
                    File convFile = File.createTempFile("upload_", ".pdf");
                    file.transferTo(convFile);
                    File pdFile = PDFileManagerMethode.passwordPdf(convFile, password);

                    FileSystemResource resource = new FileSystemResource(pdFile);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pdFile.getName())
                            .contentType(MediaType.APPLICATION_PDF)
                            .body(resource);
                }catch (Exception e){
                    throw new RuntimeException(e);
                }

            }


}
