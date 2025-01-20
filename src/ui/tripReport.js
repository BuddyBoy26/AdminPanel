// numberPlatePDF.js

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
 * Generates a PDF for a given object, including its details.
 * @param {Object} data - The data object.
 * @param {string} [logoUrl=''] - Optional logo URL or Base64 string.
 * @returns {Promise<void>} - A promise that resolves when the PDF is generated and saved.
 */
export default async function tripReport(data, logoUrl = 'logo_bhavya.png') {
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
  doc.text('Trip Details', 40, currentY);
  currentY += 20;

  // 3. Object Basic Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const objectInfo = [
    { label: 'Number Plate', value: data.NumberPlate || 'N/A' },
    { label: 'From', value: data.from || 'N/A' },
    { label: 'To', value: data.to || 'N/A' },
    { label: 'Start Date', value: formatDate(data.startDate) },
    { label: 'End Date', value: formatDate(data.endDate) },
    { label: 'Created At', value: formatDate(data.createdAt) },
    { label: 'Updated At', value: formatDate(data.updatedAt) },
    { label: '_id', value: data._id || 'N/A' },
    { label: '__v', value: data.__v || 'N/A' },
  ];

  objectInfo.forEach((info) => {
    doc.text(`${info.label}: ${info.value}`, 40, currentY);
    currentY += 15;
  });

  // 4. Save the PDF
  doc.save(`Trip_${data.NumberPlate || 'Unknown'}_${formatDate(data.startDate) || 'Unknown'}.pdf`);
}
