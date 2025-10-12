package org.example;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;

import java.io.File;
import java.io.IOException;


public class PDFileManagerMethode {
    static String FOLDER = "output";
    public static void createEmptyPdf(String fileName , int nbPage){
        PDDocument pdDocument = new PDDocument();
        for (int i = 0 ;i<nbPage;i++){
            pdDocument.addPage(new PDPage());
        }
        try {
            pdDocument.save(FOLDER + "/" + fileName + ".pdf");
            pdDocument.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void scinderPdf(){}

    public static void mergePdf(){}

    public static void pdfToRar(){}

    public static void deletePage(){}







}
