// assetPDF.js

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Formats a date string into a more readable format.
 * @param {string} dateString - The ISO date string.
 * @returns {string} - Formatted date string.
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  return date.toLocaleDateString(undefined, options);
}

/**
 * Formats a number into currency format.
 * @param {number} amount - The amount to format.
 * @returns {string} - Formatted currency string.
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number') return 'N/A';
  return `$${amount.toLocaleString()}`;
}

/**
 * Generates a PDF for a given asset, including its details and associated trips.
 * @param {Object} assetData - The asset data object.
 * @param {string} [logoUrl=''] - Optional logo URL or Base64 string.
 * @returns {Promise<void>} - A promise that resolves when the PDF is generated and saved.
 */
export async function assetReport(assetData, logoUrl = 'logo_bhavya.png') {
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
  doc.text('Asset Details', 40, currentY);
  currentY += 20;

  // 3. Asset Basic Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const assetInfo = [
    { label: 'Number Plate', value: assetData.NumberPlate || 'N/A' },
    { label: 'Type', value: assetData.Type || 'N/A' },
    { label: 'Brand', value: assetData.Brand || 'N/A' },
    { label: 'Model', value: assetData.Model || 'N/A' },
    { label: 'Wialon', value: assetData.Wialon || 'N/A' },
    { label: 'Created At', value: formatDate(assetData.createdAt) },
    { label: 'Updated At', value: formatDate(assetData.updatedAt) },
  ];

  assetInfo.forEach((info) => {
    doc.text(`${info.label}: ${info.value}`, 40, currentY);
    currentY += 15;
  });

  // 4. Associated Trips
  if (assetData.trips && assetData.trips.length > 0) {
    currentY += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Associated Trips', 40, currentY);
    currentY += 20;

    // Prepare table data for trips
    const tripsTableBody = assetData.trips.map((trip) => [
      trip.to || 'N/A',
      trip.from || 'N/A',
      formatDate(trip.startDate),
      formatDate(trip.endDate),
    ]);

    doc.autoTable({
      startY: currentY,
      head: [['To', 'From', 'Start Date', 'End Date']],
      body: tripsTableBody,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
      margin: { left: 40, right: 40 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });

    currentY = doc.autoTable.previous.finalY + 20;
  } else {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('No trips associated with this asset.', 40, currentY);
    currentY += 15;
  }

  // 5. Save the PDF
  doc.save(`Asset_${assetData.NumberPlate || 'Unknown'}.pdf`);
}
