import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import { Workbook } from 'exceljs';
import 'jspdf-autotable';
declare const ExcelJS: any;
import { DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root'
})

export class ExcelService {

  constructor(private _datePipe: DatePipe) { }


  downLoadPdf(header: any, key: any, rows: any, formDataObj: any) {
    let result: any = rows.map((obj: any) => {
      let filterObj: any = {};
      for (let i: any = 0; i < key.length; i++) {
        filterObj[key[i]] = obj[key[i]];
      }
      return filterObj;
    });
    let conMulArray: any;
    conMulArray = result.map((o: any) => Object.keys(o).map(k => o[k]));

    let doc: any = new jsPDF();

    // style pdf
    let todayDate: any = new Date();
    let fromDatePipe: any;
    let toDatePipe: any;

    if (formDataObj.pageName == "Speed Range Report") {
      fromDatePipe = this._datePipe.transform(formDataObj.fromDate, 'dd-MM-YYYY hh:mm a')
      toDatePipe = this._datePipe.transform(formDataObj.toDate, 'dd-MM-YYYY hh:mm a')
      todayDate = this._datePipe.transform(todayDate, 'dd-MM-YYYY')
      doc.setFontSize(13);
      doc.text(formDataObj.pageName, 105, 10, "center");
      doc.setFontSize(8);
      doc.text("Date : " + todayDate, 200, 10, "right");
      doc.text(8, 10, "From : " + fromDatePipe, "left");
      doc.text(47, 10, "To : " + toDatePipe, "left");
      // doc.setFontSize(12);
    }
    else {
      fromDatePipe = this._datePipe.transform(formDataObj.fromDate, 'dd-MM-YYYY')
      toDatePipe = this._datePipe.transform(formDataObj.toDate, 'dd-MM-YYYY')
      todayDate = this._datePipe.transform(todayDate, 'dd-MM-YYYY')
      doc.setFontSize(14);
      doc.text(formDataObj.pageName, 105, 10, "center");
      doc.setFontSize(10);
      doc.text("Date : " + todayDate, 200, 10, "right");
      doc.text(8, 10, "From : " + fromDatePipe, "left");
      doc.text(40, 10, "To : " + toDatePipe, "left");
    }
    doc.setLineWidth(0.2);
    doc.line(8, 15, 200, 15);

    if (formDataObj.VehicleNumber) {
      doc.text(8, 20, "Vehicle  : " + formDataObj.VehicleNumber + " (" + formDataObj.vehName + ")")
    }
    if (formDataObj.pageName == "Speed Range Report") {
      doc.text("Speed : " + formDataObj.SpeedfromRange + " Km/h To " + formDataObj.SpeedToRange + " Km/h", 200, 20, "right");
    }
    doc.autoTable(header,conMulArray,{
      // head:header, 
      // body:conMulArray, 
      startY: 25,
      margin: { horizontal: 7 },
      // styles: { columnWidth: 'wrap' },
      // columnStyles: { text: { columnWidth: 'auto' } }
    });
    doc.save(formDataObj.pageName);
  }



  generateExcel(keyData: any, ValueData: any, TopHeadingData: any) {

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');

    // Add Row and formatting

    worksheet.addRow([]);
    worksheet.getCell('E2').value = TopHeadingData.ElectionName
    // worksheet.getRow(1).getCell(5).font = {color: {argb: "004e47cc"}};
    worksheet.getCell('E2').font = {
      name: 'Corbel', family: 4, size: 20, underline: 'double', bold: true, color: { argb: "004e47cc" },
    };

    worksheet.addRow([]);
    worksheet.getCell('D4').value = 'Constituency Name:' + TopHeadingData.ConstituencyName
      + ' ,' + 'Booth Name:' + TopHeadingData.BoothName;

    worksheet.getCell('D4').font = { name: 'Corbel', family: 3, size: 13, bold: true, };

    // worksheet.mergeCells('A1:D2');

    worksheet.addRow([]);// Blank Row

    // Add Header Row
    const headerRow = worksheet.addRow(keyData);

    // Cell Style : Fill and Border

    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' }, bgColor: { argb: 'C0C0C0' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Add Data and Conditional Formatting
    ValueData.forEach((d: any) => {
      let row = worksheet.addRow(d);row
      // let qty = row.getCell(5);
      // let color = 'FF99FF99';
      // qty.fill = {
      //   type: 'pattern', pattern: 'solid', fgColor: { argb: color }
      // };
    });

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
      FileSaver.saveAs(blob, TopHeadingData.PageName);
    });
  }
}

