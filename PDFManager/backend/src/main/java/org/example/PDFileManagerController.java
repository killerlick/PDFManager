package org.example;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.PDFileManagerMethode;

@RestController
public class PDFileManagerController {

@GetMapping("/create")
public String createPDF(){
    PDFileManagerMethode.createEmptyPdf("source",3);
    return "pdf creer .";
}

}
