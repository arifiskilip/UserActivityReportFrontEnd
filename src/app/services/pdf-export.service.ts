import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  exportToPdf(data: any[], headers: string[], fileName: string) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    const tableData = data.map(obj => Object.values(obj));
    autoTable(doc,{
      head:[headers],
      body:tableData,
      startY:30
    });

    doc.save(`${fileName}.pdf`);
  }
}
