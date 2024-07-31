import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfService } from './services/pdf.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private pdfService: PdfService) {}
  generatePdf(){
    console.log("entra");
 }

}
