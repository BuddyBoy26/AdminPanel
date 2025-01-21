// vehicleReportPDF.js

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates a PDF report with data displayed in a tabular format.
 * @param {Array} data - The array of objects containing the data to display.
 * @param {string} [logoUrl=''] - Optional logo URL or Base64 string.
 * @returns {Promise<void>} - A promise that resolves when the PDF is generated and saved.
 */
export default async function wialonAssetReport(data, logoUrl = 'logo_bhavya.png') {
  const doc = new jsPDF();
  let currentY = 40; // Starting Y position

  // 1. Add Logo if provided
  if (logoUrl) {
    try {
      if (logoUrl.startsWith('data:image')) {
        // It's a Base64 string
        doc.addImage(logoUrl, 'PNG', 40, 20, 50, 50);
      } else {
        // It's a URL - Fetch and convert to Base64
        const response = await fetch(logoUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        const dataURL = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        doc.addImage(dataURL, 'PNG', 40, 20, 50, 50);
      }
      currentY += 60; // Adjust Y position after logo
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  // 2. Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  console.log(data)
  doc.text(`${data.numberPlate} Tracking Report`, 40, currentY);
  currentY += 20;

  // 3. Prepare Table Data
  const tableHeaders = ['Date', 'Time', 'X Coordinate', 'Y Coordinate', 'Ignition', 'Fuel Level', 'Mileage', 'Event'];
  console.log(data)
  const tableBody = data.wialonData.map((entry) => [
    entry.date || '',
    entry.time || '',
    entry.x || '',
    entry.y || '',
    entry.ignition || '',
    entry.fuelLevel || '',
    entry.mileage || '',
    entry.event || '',
  ]);

  // 4. Add Table
  doc.autoTable({
    startY: currentY,
    head: [tableHeaders],
    body: tableBody,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 30 }, // Date
      1: { cellWidth: 30 }, // Time
      2: { cellWidth: 30 }, // X Coordinate
      3: { cellWidth: 30 }, // Y Coordinate
      4: { cellWidth: 20 }, // Ignition
      5: { cellWidth: 20 }, // Fuel Level
      6: { cellWidth: 30 }, // Mileage
      7: { cellWidth: 30 }, // Event
    },
    margin: { left: 10, right: 10 },
    headStyles: { fillColor: [22, 160, 133] },
    alternateRowStyles: { fillColor: [233, 236, 239] },
  });

  // 5. Save the PDF
  doc.save(`${data.numberPlate}_Tracking_Report.pdf`);
}
