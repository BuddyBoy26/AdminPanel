// src/utils/pdfUtils.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import axios from "../api/axios.js";
import { AdminContext } from "../contexts/AdminContext.jsx"; // Ensure this path is correct

/**
 * Generates a PDF with multiple tables.
 *
 * @param {Array} tables - An array of table objects, each containing title, columns, and data.
 * @param {String} fileName - The name of the generated PDF file.
 */


export const generatePdf = (tables, fileName = 'document.pdf', startDate = "", endDate = "") => {
  const doc = new jsPDF();

  /*

  Overview/Logbook:
    AssetsReportType :
    End Date: "2024-12-27"
    Report Type: "Overview"
    Start Date: "2024-11-27"
    UnitName :
    UnitType :

  Unitwise:
    Users/Trips/Investments:
        AssetsReportType : ""
        End Date: "2024-12-27"
        Report Type: "Unitwise"
        Start Date: "2024-11-27"
        UnitName: ""
        UnitType: "Users"   
    Assets
        AssetsReportType : "Cumulative"
        End Date: "2024-12-27"
        Report Type: "Unitwise"
        Start Date: "2024-11-27"
        UnitName: ""
        UnitType: "Assets"

  Unit Report:
        AssetsReportType : ""
        End Date: "2024-12-27"
        Report Type: "Unitwise"
        Start Date: "2024-11-27"
        UnitName: "Asset1"
        UnitType: "Assets"
   */

  // Optional: Add a logo or image at the top
  const logo = 'logo_bhavya.png'; // Ensure the image path is correct
  doc.addImage(logo, 'PNG', 14, 10, 30, 30); // (image, format, x, y, width, height)


  // Initial vertical position

  let currentY = 45;

  doc.setFontSize(12);
  doc.text(`Start Date: ${startDate}`, 14, currentY);
  currentY += 5;
  doc.text(`End Date: ${endDate}`, 14, currentY);
  currentY += 15;


  // Function to add a title
  const addTitle = (title) => {
    doc.setFontSize(16);
    doc.text(title, 14, currentY);
    currentY += 8;
  };

  // Function to add a table
  const addTable = (columns, rows, title) => {
    if (title) {
      addTitle(title);
    }

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: currentY,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255 },
      alternateRowStyles: { fillColor: [238, 238, 238] },
      theme: 'striped',
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Update currentY after table is drawn
        currentY = data.cursor.y + 12;
      },
    });
  };

  // Iterate over each table and add it to the PDF
  tables.forEach((table) => {
    addTable(table.columns, table.rows, table.title);
  });

  // Optional: Add footers with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  doc.save(fileName);
};