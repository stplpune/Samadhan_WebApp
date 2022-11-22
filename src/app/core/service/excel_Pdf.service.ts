import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import 'jspdf-autotable';
declare const ExcelJS: any;



@Injectable({
  providedIn: 'root'
})

export class ExcelService {

  constructor() { }


  downLoadPdf(header: any, values: any, objData: any) {
    let doc: any = new jsPDF();
    var imgWidth = 33; 
    var height = 25;
    doc.addImage('../../../../assets/images/samadhanLogo.jpeg', 'JPEG',0, -3, imgWidth,height);

    doc.setFontSize(13);
    doc.text(objData.topHedingName, 105, 10, "center");

    doc.setFontSize(10);
    doc.text(objData.createdDate, 200, 10, "right");
  
    doc.setLineWidth(0.2);
    doc.line(8, 15, 200, 15);

    doc.autoTable(header, values, {
      startY: 25,
      margin: { horizontal: 7 },
    });
    doc.save(objData.topHedingName);
  }

  generateExcel(keyData: any, ValueData: any, TopHeadingData: any) {

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');

    worksheet.addRow([]);
    worksheet.getCell('C2').value = TopHeadingData
    worksheet.getCell('C2').font = { name: 'Corbel', family: 3, size: 13, bold: true, };

    // worksheet.mergeCells('A1:D2');

    worksheet.addRow([]);// Blank Row
    const headerRow = worksheet.addRow(keyData); // Add Header Row

    headerRow.eachCell((cell) => { // Cell Style : Fill and Border
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' }, bgColor: { argb: 'C0C0C0' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Add Data and Conditional Formatting
    ValueData.forEach((d: any) => {
      let row = worksheet.addRow(d); row
    });

    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 25;
    worksheet.getColumn(10).width = 15;
    worksheet.addRow([]);

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, TopHeadingData);
    });
  }
}

