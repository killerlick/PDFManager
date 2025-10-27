package org.example;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.cos.COSStream;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class PDFileManagerMethode {

    //static String FOLDER = "output";

    public static File createEmptyPdf(String fileName, int nbPage) {
        PDDocument pdDocument = new PDDocument();
        for (int i = 0; i < nbPage; i++) {
            pdDocument.addPage(new PDPage());
        }
        try {
            File file = File.createTempFile("source", ".pdf");
            pdDocument.save(file);
            pdDocument.close();
            return file;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static File[] scinderPdf(File pdDocument, int indexPage) {
        try {

            PDDocument originalFile = Loader.loadPDF(pdDocument);
            int nbPages = originalFile.getNumberOfPages();

            if (nbPages <= indexPage) {
                System.out.println("le nombre de page " + nbPages + " est inferieur ou egal a l'index" + indexPage);
                return null;
            }

            PDDocument premierPdf = new PDDocument();
            PDDocument secondPdf = new PDDocument();

            for (int i = 0; i < nbPages; i++) {
                PDPage page = originalFile.getPage(i);
                if (i <= indexPage) {
                    premierPdf.addPage(page);
                } else {
                    secondPdf.addPage(page);
                }
            }

            File[] files = new File[2];
            files[0] = File.createTempFile("part1_", ".pdf");
            files[1] = File.createTempFile("part2_", ".pdf");

            premierPdf.save(files[0]);
            premierPdf.close();
            secondPdf.save(files[1]);
            secondPdf.close();
            return files;

        } catch (IOException e) {
            System.out.println(e);
        }

        return null;

    }

    public static File mergePdf(File[] pdfiles) {

        File mergedFile;

        try {

            mergedFile = File.createTempFile("merged_", ".pdf");
            PDFMergerUtility pdfMerger = new PDFMergerUtility();
            pdfMerger.setDestinationFileName(mergedFile.getAbsolutePath());

            for (File file : pdfiles) {
                pdfMerger.addSource(file);
            }
            pdfMerger.mergeDocuments(null);
            return mergedFile;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    public static File deletePage(File file, int index) {

        try {

            PDDocument pdDocument = Loader.loadPDF(file);
            int nbPages = pdDocument.getNumberOfPages();
            if (index >= nbPages) {
                System.out.println("l'index est superieur ou egal au nombre de page");
                return null;
            }
            File pdf = File.createTempFile("pdfFile", ".pdf");
            pdDocument.removePage(index);
            pdDocument.save(pdf);
            pdDocument.close();
            return pdf;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static File compressPdf(File file) {

        try {
            PDDocument pdDocument = Loader.loadPDF(file);
            pdDocument.setAllSecurityToBeRemoved(true);
            pdDocument.getDocumentCatalog().setPageMode(null);
            
            File compressedFile = File.createTempFile("compressed_", ".pdf");
            pdDocument.save(compressedFile);
            pdDocument.close();

            return compressedFile;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static File compressPdfToZip(File file) {

        try {
            File tempFile = File.createTempFile("compressed_", ".pdf");

            try(FileOutputStream fos = new FileOutputStream(tempFile);
                 ZipOutputStream zipOut = new ZipOutputStream(fos);
                 FileInputStream fis = new FileInputStream(file)){

                    ZipEntry zipEntry = new ZipEntry(file.getName());
                    zipOut.putNextEntry(zipEntry);

                    byte[] bytes = new byte[1024];
                    int length;
                    while((length = fis.read(bytes)) >= 0) {
                        zipOut.write(bytes, 0, length);
                    }
                    zipOut.closeEntry();

            }

            return tempFile;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static File passwordPdf(File file, String password) {
        try {
            PDDocument pdDocument = Loader.loadPDF(file);
            File temFile = File.createTempFile("protected_", ".pdf");
            AccessPermission ap = new AccessPermission();
            StandardProtectionPolicy spp = new StandardProtectionPolicy(password, password, ap);
            spp.setEncryptionKeyLength(128);
            spp.setPermissions(ap);
            pdDocument.protect(spp);
            
            pdDocument.save(temFile);
            pdDocument.close();

            return temFile;

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
