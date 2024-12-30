// investmentPDF.js

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
 * Generates a PDF for a given investment, including its details and associated investor information.
 * @param {Object} investmentData - The investment data object.
 * @param {string} [logoUrl=''] - Optional logo URL or Base64 string.
 * @returns {Promise<void>} - A promise that resolves when the PDF is generated and saved.
 */
export async function investmer(investmentData, logoUrl = '') {
  const doc = new jsPDF();
  let currentY = 40; // Starting Y position

  // Debug: Log the investmentData
  console.log('Generating PDF for investment:', investmentData);

  // 1. Add Logo if provided
  if (logoUrl) {
    try {
      if (logoUrl.startsWith('data:image')) {
        // It's a Base64 string
        doc.addImage(logoUrl, 'PNG', 40, 20, 50, 50);
      } else {
        // It's a URL - Fetch and convert to Base64
        const response = await fetch(logoUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const reader = new FileReader();
        const dataURL = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to convert image to Base64'));
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
  doc.text('Investment Details', 40, currentY);
  currentY += 30;

  // 3. Investment Basic Information as Table
  const investmentTableBody = [
    ['Investment ID', investmentData.investmentId || 'N/A'],
    ['Amount', formatCurrency(investmentData.amount)],
    ['ROI', `${investmentData.ROI || 'N/A'}%`],
    ['Ticket Size', formatCurrency(investmentData.ticketSize)],
    ['Investment Date', formatDate(investmentData.investmentDate)],
    ['Maturity Date', formatDate(investmentData.maturityDate)],
    ['Last Compounded Date', formatDate(investmentData.lastCompoundedDate)],
    ['Current Investment Value', formatCurrency(investmentData.currentInvestmentValue)],
    ['Created At', formatDate(investmentData.createdAt)],
    ['Updated At', formatDate(investmentData.updatedAt)],
  ];

  doc.autoTable({
    startY: currentY,
    body: investmentTableBody,
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 12 },
    columnStyles: {
      0: { cellWidth: 150, fontStyle: 'bold' },
      1: { cellWidth: 250 },
    },
    margin: { left: 40, right: 40 },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.1,
  });

  currentY = doc.autoTable.previous.finalY + 20;

  // 4. Investor Details as Table
  if (investmentData.investor && typeof investmentData.investor === 'object') {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Investor Details', 40, currentY);
    currentY += 20;

    // Prepare table data for investor
    const investorTableBody = [
      ['Name', investmentData.investor.name || 'N/A'],
      ['Email', investmentData.investor.email || 'N/A'],
      ['User ID', investmentData.investor.userId || 'N/A'],
      ['Investor ID', investmentData.investor.id || 'N/A'],
    ];

    doc.autoTable({
      startY: currentY,
      body: investorTableBody,
      theme: 'plain',
      styles: { font: 'helvetica', fontSize: 12 },
      columnStyles: {
        0: { cellWidth: 150, fontStyle: 'bold' },
        1: { cellWidth: 250 },
      },
      margin: { left: 40, right: 40 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });

    currentY = doc.autoTable.previous.finalY + 20;
  } else {
    console.warn('Investor details are missing or not an object.');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Investor Details: N/A', 40, currentY);
    currentY += 15;
  }

  // 5. Save the PDF
  doc.save(`Investment_${investmentData.investmentId || 'Unknown'}.pdf`);
}
