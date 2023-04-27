import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import 'jspdf-autotable';
declare const ExcelJS: any;

import * as YantramanavRegular from './Yantramanav-Regular.js';
@Injectable({
  providedIn: 'root'
})

export class ExcelService {

  constructor() { }


  downLoadPdf(header: any, values: any, objData: any) {

    let doc: any = new jsPDF('l','mm', [297, 210]);
    doc.addFileToVFS("Yantramana.ttf", YantramanavRegular.font);
    doc.addFont("Yantramana.ttf", "Yantramana", "normal");
    doc.setFont("Yantramana");
    doc.autoTable(header, values, {
      startY:18,
      // margin: { horizontal: 7 , verticle: 10},
      margin: [18, 10, 10,10], //top, left, buttom, right,
      headerStyles: {
        font: 'Yantramana'
      },
      columnStyles: {
        font: 'bold',
      },styles: {font: "Yantramana"},


      didDrawPage: function (_data: any) {
        var imgWidth = 33;
        var height = 20;
        doc.addImage('../../../../assets/images/samadhanLogo.jpeg', 'JPEG',12, -3, imgWidth, height);
        doc.setFontSize(13);
        doc.text(objData.topHedingName, 150, 8, "center");

        if (objData?.timePeriod != null) {
          doc.setFontSize(8);
          doc.text(objData.timePeriod, 11, 14, "left");
        }

        doc.setFontSize(8);
        doc.text(objData.createdDate, 280, 14, "right");

        doc.setLineWidth(0.2);
        doc.line(12, 15, 280, 15);

        doc.setLineWidth(0.2);
        doc.line(12, 200, 280, 200);

        doc.setFontSize(8);
        doc.text('Note:This is a system generated file.', 280, 203, "right");

      }
    });

    doc.save(objData.topHedingName);
  }


  async generateExcel(keyData: any, ValueData: any, objData: any) {

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');

    worksheet.addRow([]);
    worksheet.getCell('C4').value = objData.topHedingName
    worksheet.getCell('C4').font = { name: 'Corbel', family: 3, size: 13, bold: true, };

    if (objData?.timePeriod != null) {
      worksheet.getCell('C5').value = objData.timePeriod
      worksheet.getCell('C5').font = { name: 'Corbel', family: 3, size: 13, bold: true, };
    }

    worksheet.getCell('E5').value = objData.createdDate
    worksheet.getCell('E5').font = { name: 'Corbel', family: 3, size: 12, bold: true, };

    const response = await fetch('../../../../assets/images/samadhanLogo.jpeg');
    const buffer = await response.arrayBuffer();
    const imageId1 = workbook.addImage({
      buffer: buffer, extension: 'jpeg',
    });

    worksheet.addImage(imageId1, 'B1:B5');


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
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 30;
    worksheet.addRow([]);

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      FileSaver.saveAs(blob, objData.topHedingName);
    });
  }
}

