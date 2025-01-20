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
export default async function investmentReport(investmentData, logoUrl = 'logo_bhavya.png') {
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
  doc.text('Investment Details', 40, currentY);
  currentY += 20;

  // 3. Investment Basic Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const investmentInfo = [
    { label: 'Investment ID', value: investmentData.investmentId || 'N/A' },
    { label: 'Amount', value: formatCurrency(investmentData.amount) },
    { label: 'ROI', value: `${investmentData.ROI || 'N/A'}%` },
    { label: 'Ticket Size', value: formatCurrency(investmentData.ticketSize) },
    { label: 'Investment Date', value: formatDate(investmentData.investmentDate) },
    { label: 'Maturity Date', value: formatDate(investmentData.maturityDate) },
    { label: 'Last Compounded Date', value: formatDate(investmentData.lastCompoundedDate) },
    { label: 'Current Investment Value', value: formatCurrency(investmentData.currentInvestmentValue) },
    { label: 'Created At', value: formatDate(investmentData.createdAt) },
    { label: 'Updated At', value: formatDate(investmentData.updatedAt) },
  ];

  investmentInfo.forEach((info) => {
    doc.text(`${info.label}: ${info.value}`, 40, currentY);
    currentY += 15;
  });

  // 4. Investor Details
  console.log("ins", investmentData.investor)
  if (investmentData.investor && typeof investmentData.investor === 'object') {
    currentY += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Investor Details', 40, currentY);
    currentY += 20;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const investorInfo = [
      { label: 'Name', value: investmentData.investor.name || 'N/A' },
      { label: 'Email', value: investmentData.investor.email || 'N/A' },
      { label: 'User ID', value: investmentData.investor.userId || 'N/A' },
      { label: 'Investor ID', value: investmentData.investor.id || 'N/A' },
    ];

    // investorInfo.forEach((info) => {
    //   doc.text(`${info.label}: ${info.value}`, 40, currentY);
    //   console.log(`${info.label}: ${info.value}`)
    //   currentY += 15;
    // });

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
          0: { cellWidth: 70, fontStyle: 'bold' },
          1: { cellWidth: 250 },
        },
        margin: { left: 40, right: 40 },
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.1,
      });

    investorInfo.forEach((info) => {
      doc.text(`${info.label}: ${info.value}`, 40, currentY);
      console.log(`${info.label}: ${info.value}`)
      currentY += 15;
    });



  }

  // 5. Save the PDF
  doc.save(`Investment_${investmentData.investmentId || 'Unknown'}.pdf`);
}



